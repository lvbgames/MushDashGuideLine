import {
  buildDateRange,
  constantTimeEqual,
  deriveAdminPasswordHash,
  deriveVisitorHash,
  getKstDate,
  isCrawler,
  parseBasicAuthorization,
  shiftDate
} from './core';

interface D1Result<T = Record<string, unknown>> {
  results?: T[];
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

interface ScheduledController {
  scheduledTime: number;
  cron: string;
}

interface Env {
  DB: D1Database;
  ANALYTICS_ENV: string;
  ALLOWED_ORIGIN: string;
  DEV_ALLOWED_ORIGINS?: string;
  ANALYTICS_ALLOW_TEST_HEADERS?: string;
  ANALYTICS_HASH_SECRET: string;
  ANALYTICS_ADMIN_USER: string;
  ANALYTICS_ADMIN_PASSWORD_HASH: string;
  ANALYTICS_ADMIN_PASSWORD_SALT: string;
}

interface CountRow {
  count: number;
}

interface DailyCountRow {
  visit_date: string;
  count: number;
}

interface VisitDateRow {
  visit_date: string;
}

interface TrackingRow {
  tracking_since: string | null;
}

interface DailyStat {
  date: string;
  visitors: number;
}

interface Stats {
  today: number;
  week: number;
  total: number;
  recent30: DailyStat[];
  trackingSince: string | null;
}

const adminHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
};

function isDevelopmentTestMode(env: Env): boolean {
  return env.ANALYTICS_ENV === 'development' && env.ANALYTICS_ALLOW_TEST_HEADERS === 'true';
}

function getRequestDate(request: Request, env: Env): string {
  if (isDevelopmentTestMode(env)) {
    const testDate = request.headers.get('X-LvB-Analytics-Test-Date');
    if (testDate && /^\d{4}-\d{2}-\d{2}$/.test(testDate)) {
      return testDate;
    }
  }

  return getKstDate();
}

function getClientIp(request: Request, env: Env): string | null {
  if (isDevelopmentTestMode(env)) {
    const testIp = request.headers.get('X-LvB-Analytics-Test-IP');
    if (testIp) {
      return testIp;
    }
  }

  return request.headers.get('CF-Connecting-IP');
}

function getAllowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get('Origin');
  if (!origin) {
    return null;
  }

  const allowed = new Set([env.ALLOWED_ORIGIN]);
  if (env.ANALYTICS_ENV === 'development') {
    for (const value of (env.DEV_ALLOWED_ORIGINS ?? '').split(',')) {
      if (value.trim()) {
        allowed.add(value.trim());
      }
    }
  }

  return allowed.has(origin) ? origin : null;
}

function hitHeaders(origin: string): Headers {
  return new Headers({
    'Access-Control-Allow-Origin': origin,
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff'
  });
}

function emptyHitResponse(origin: string, status = 204): Response {
  return new Response(null, { status, headers: hitHeaders(origin) });
}

async function recordVisit(request: Request, env: Env, visitDate: string): Promise<void> {
  const clientIp = getClientIp(request, env);
  if (!clientIp || !env.ANALYTICS_HASH_SECRET) {
    return;
  }

  const visitorHash = await deriveVisitorHash(visitDate, clientIp, env.ANALYTICS_HASH_SECRET);
  await env.DB.batch([
    env.DB.prepare(
      'INSERT OR IGNORE INTO daily_visitors (visit_date, visitor_hash, created_at) VALUES (?1, ?2, ?3)'
    ).bind(visitDate, visitorHash, new Date().toISOString())
  ]);
}

async function finalizePastDates(
  env: Env,
  today: string,
  finalizedAt: string,
  simulateDeleteFailure = false
): Promise<number> {
  const [datesResult] = await env.DB.batch([
    env.DB.prepare(
      'SELECT DISTINCT visit_date FROM daily_visitors WHERE visit_date < ?1 ORDER BY visit_date ASC'
    ).bind(today)
  ]);
  const dates = ((datesResult.results ?? []) as unknown as VisitDateRow[])
    .map((row) => row.visit_date);

  for (const date of dates) {
    const deleteStatement = simulateDeleteFailure
      ? env.DB.prepare('DELETE FROM daily_visitors_missing_for_failure_test WHERE visit_date = ?1').bind(date)
      : env.DB.prepare('DELETE FROM daily_visitors WHERE visit_date = ?1').bind(date);

    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO daily_stats (visit_date, unique_visitors, finalized_at)
         SELECT ?1, COUNT(*), ?2 FROM daily_visitors WHERE visit_date = ?1
         ON CONFLICT(visit_date) DO UPDATE SET
           unique_visitors = daily_stats.unique_visitors + excluded.unique_visitors,
           finalized_at = excluded.finalized_at`
      ).bind(date, finalizedAt),
      deleteStatement
    ]);
  }

  return dates.length;
}

function countFrom(result: D1Result): number {
  return Number((result.results?.[0] as CountRow | undefined)?.count ?? 0);
}

async function loadStats(env: Env, today: string): Promise<Stats> {
  const weekStart = shiftDate(today, -6);
  const yesterday = shiftDate(today, -1);
  const recentStart = shiftDate(today, -29);
  const [todayResult, weekResult, totalResult, recentResult, trackingResult] = await env.DB.batch([
    env.DB.prepare('SELECT COUNT(*) AS count FROM daily_visitors WHERE visit_date = ?1').bind(today),
    env.DB.prepare(
      `SELECT
         COALESCE((SELECT SUM(unique_visitors) FROM daily_stats WHERE visit_date BETWEEN ?1 AND ?2), 0)
         + (SELECT COUNT(*) FROM daily_visitors WHERE visit_date BETWEEN ?1 AND ?3) AS count`
    ).bind(weekStart, yesterday, today),
    env.DB.prepare(
      `SELECT
         COALESCE((SELECT SUM(unique_visitors) FROM daily_stats), 0)
         + (SELECT COUNT(*) FROM daily_visitors) AS count`
    ),
    env.DB.prepare(
      `SELECT visit_date, SUM(count) AS count
       FROM (
         SELECT visit_date, unique_visitors AS count
         FROM daily_stats
         WHERE visit_date BETWEEN ?1 AND ?2
         UNION ALL
         SELECT visit_date, COUNT(*) AS count
         FROM daily_visitors
         WHERE visit_date BETWEEN ?1 AND ?3
         GROUP BY visit_date
       )
       GROUP BY visit_date
       ORDER BY visit_date ASC`
    ).bind(recentStart, yesterday, today),
    env.DB.prepare(
      `SELECT MIN(visit_date) AS tracking_since
       FROM (
         SELECT visit_date FROM daily_stats
         UNION ALL
         SELECT visit_date FROM daily_visitors
       )`
    )
  ]);

  const counts = new Map(
    ((recentResult.results ?? []) as unknown as DailyCountRow[]).map((row) => [row.visit_date, Number(row.count)])
  );
  const recent30 = buildDateRange(today, 30)
    .map((date) => ({ date, visitors: counts.get(date) ?? 0 }))
    .reverse();
  const trackingSince = ((trackingResult.results?.[0] as TrackingRow | undefined)?.tracking_since) ?? null;

  return {
    today: countFrom(todayResult),
    week: countFrom(weekResult),
    total: countFrom(totalResult),
    recent30,
    trackingSince
  };
}

async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  const credentials = parseBasicAuthorization(request.headers.get('Authorization'));
  if (!credentials || !env.ANALYTICS_ADMIN_USER || !env.ANALYTICS_ADMIN_PASSWORD_HASH || !env.ANALYTICS_ADMIN_PASSWORD_SALT) {
    return false;
  }

  const passwordHash = await deriveAdminPasswordHash(credentials.password, env.ANALYTICS_ADMIN_PASSWORD_SALT);
  return constantTimeEqual(credentials.username, env.ANALYTICS_ADMIN_USER)
    && constantTimeEqual(passwordHash, env.ANALYTICS_ADMIN_PASSWORD_HASH.toLowerCase());
}

function unauthorized(): Response {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      ...adminHeaders,
      'Content-Type': 'text/plain; charset=UTF-8',
      'WWW-Authenticate': 'Basic realm="Lv.B Analytics", charset="UTF-8"'
    }
  });
}

function statsJson(stats: Stats): Response {
  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: {
      ...adminHeaders,
      'Content-Type': 'application/json; charset=UTF-8'
    }
  });
}

function adminHtml(stats: Stats): Response {
  const maximum = Math.max(1, ...stats.recent30.map((day) => day.visitors));
  const rows = stats.recent30.map((day) => {
    const width = day.visitors === 0 ? 0 : Math.max(3, Math.round((day.visitors / maximum) * 100));
    return `<tr><th scope="row">${day.date}</th><td><span class="bar"><span style="width:${width}%"></span></span></td><td>${day.visitors.toLocaleString('en-US')}</td></tr>`;
  }).join('');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lv.B Analytics</title>
  <style>
    :root{color-scheme:dark;--page:#1a1714;--surface:#29241e;--ink:#f7f1e5;--muted:#bdb2a2;--yellow:#ffd746;--border:#51483d;font-family:Inter,ui-sans-serif,system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink)}main{width:min(70rem,calc(100% - 2rem));margin:0 auto;padding:clamp(2rem,6vw,5rem) 0}header{display:flex;align-items:end;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem}h1{margin:0;font-size:clamp(2rem,6vw,4rem);letter-spacing:-.04em}p{margin:.4rem 0 0;color:var(--muted)}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:2rem 0}.card{padding:1.4rem;border:1px solid var(--border);border-radius:1rem;background:var(--surface)}.card span{display:block;color:var(--yellow);font-size:.75rem;font-weight:800;letter-spacing:.12em}.card strong{display:block;margin-top:.45rem;font-size:clamp(2rem,5vw,3.4rem)}section{padding:1.4rem;border:1px solid var(--border);border-radius:1rem;background:var(--surface)}h2{margin:0 0 1rem;font-size:1.35rem}table{width:100%;border-collapse:collapse}th,td{padding:.7rem .5rem;border-top:1px solid var(--border);text-align:left}th{width:7.5rem;font-weight:600}.bar{display:block;width:100%;height:.55rem;border-radius:1rem;background:#1f1b17;overflow:hidden}.bar span{display:block;height:100%;border-radius:inherit;background:var(--yellow)}td:last-child{width:4rem;text-align:right;font-variant-numeric:tabular-nums}@media(max-width:40rem){header{display:block}.summary{grid-template-columns:1fr}.bar{min-width:5rem}}
  </style>
</head>
<body>
  <main>
    <header><div><p>PRIVATE DASHBOARD</p><h1>Lv.B Analytics</h1></div><p>Tracking since ${stats.trackingSince ?? 'Not started'}</p></header>
    <div class="summary">
      <article class="card"><span>TODAY</span><strong>${stats.today.toLocaleString('en-US')}</strong></article>
      <article class="card"><span>WEEK</span><strong>${stats.week.toLocaleString('en-US')}</strong></article>
      <article class="card"><span>TOTAL</span><strong>${stats.total.toLocaleString('en-US')}</strong></article>
    </div>
    <section><h2>RECENT 30 DAYS</h2><table><thead><tr><th>Date</th><th>Relative volume</th><th>Visitors</th></tr></thead><tbody>${rows}</tbody></table></section>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      ...adminHeaders,
      'Content-Type': 'text/html; charset=UTF-8'
    }
  });
}

async function handleAdmin(request: Request, env: Env, asJson: boolean): Promise<Response> {
  if (!(await isAuthorized(request, env))) {
    return unauthorized();
  }

  try {
    const stats = await loadStats(env, getRequestDate(request, env));
    return asJson ? statsJson(stats) : adminHtml(stats);
  } catch {
    return new Response('Analytics data is temporarily unavailable.', {
      status: 503,
      headers: { ...adminHeaders, 'Content-Type': 'text/plain; charset=UTF-8' }
    });
  }
}

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/__test/finalize' && isDevelopmentTestMode(env)) {
      if (request.method !== 'POST') {
        return new Response(null, { status: 405, headers: { Allow: 'POST' } });
      }

      try {
        await finalizePastDates(
          env,
          getRequestDate(request, env),
          new Date().toISOString(),
          request.headers.get('X-LvB-Analytics-Test-Fail-Delete') === 'true'
        );
        return new Response(null, { status: 204 });
      } catch {
        return new Response(null, { status: 500 });
      }
    }

    if (url.pathname === '/hit') {
      const origin = getAllowedOrigin(request, env);
      if (!origin) {
        return new Response(null, { status: 403, headers: { 'Cache-Control': 'no-store', 'Vary': 'Origin' } });
      }

      if (request.method === 'OPTIONS') {
        const headers = hitHeaders(origin);
        headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        headers.set('Access-Control-Max-Age', '600');
        return new Response(null, { status: 204, headers });
      }

      if (request.method !== 'POST') {
        const headers = hitHeaders(origin);
        headers.set('Allow', 'POST, OPTIONS');
        return new Response(null, { status: 405, headers });
      }

      if (isCrawler(request.headers.get('User-Agent'))) {
        return emptyHitResponse(origin);
      }

      context.waitUntil(recordVisit(request, env, getRequestDate(request, env)).catch(() => undefined));
      return emptyHitResponse(origin);
    }

    if ((url.pathname === '/admin' || url.pathname === '/admin/') && request.method === 'GET') {
      return handleAdmin(request, env, false);
    }

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      return handleAdmin(request, env, true);
    }

    return new Response('Not found.', {
      status: 404,
      headers: { ...adminHeaders, 'Content-Type': 'text/plain; charset=UTF-8' }
    });
  },

  async scheduled(controller: ScheduledController, env: Env, _context: ExecutionContext): Promise<void> {
    const scheduledAt = new Date(controller.scheduledTime);
    await finalizePastDates(env, getKstDate(scheduledAt), scheduledAt.toISOString());
  }
};
