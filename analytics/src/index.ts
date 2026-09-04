import {
  buildDateRange,
  constantTimeEqual,
  deriveAdminPasswordHash,
  deriveRateLimitKey,
  deriveVisitorHash,
  downloadAssetKeys,
  getDownloadTarget,
  getKstDate,
  isCrawler,
  parseBasicAuthorization,
  shiftDate
} from './core.ts';
import type { DownloadAssetKey } from './core.ts';

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

interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  DB: D1Database;
  HIT_RATE_LIMITER: RateLimit;
  ADMIN_RATE_LIMITER: RateLimit;
  DOWNLOAD_RATE_LIMITER: RateLimit;
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

interface DailyDownloadRow {
  download_date: string;
  count: number;
}

interface AssetDownloadRow {
  asset_key: DownloadAssetKey;
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
  downloads: number;
}

interface DownloadStats {
  today: number;
  week: number;
  total: number;
  byAsset: Record<DownloadAssetKey, number>;
}

interface Stats {
  today: number;
  week: number;
  total: number;
  recent30: DailyStat[];
  trackingSince: string | null;
  downloads: DownloadStats;
}

const strictTransportSecurity = 'max-age=31536000';

const adminHeaders = {
  'Cache-Control': 'private, no-store',
  'Strict-Transport-Security': strictTransportSecurity,
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
};

function isSecureTransport(url: URL, env: Env): boolean {
  if (url.protocol === 'https:') {
    return true;
  }

  return isDevelopmentTestMode(env)
    && (url.hostname === '127.0.0.1' || url.hostname === 'localhost' || url.hostname === '[::1]');
}

function httpsRequired(): Response {
  return new Response('HTTPS required.', {
    status: 426,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=UTF-8',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

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
    'Strict-Transport-Security': strictTransportSecurity,
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff'
  });
}

function emptyHitResponse(origin: string, status = 204): Response {
  return new Response(null, { status, headers: hitHeaders(origin) });
}

async function recordVisit(env: Env, visitDate: string, visitorHash: string): Promise<void> {
  await env.DB.batch([
    env.DB.prepare(
      'INSERT OR IGNORE INTO daily_visitors (visit_date, visitor_hash, created_at) VALUES (?1, ?2, ?3)'
    ).bind(visitDate, visitorHash, new Date().toISOString())
  ]);
}

async function recordDownload(
  env: Env,
  downloadDate: string,
  assetKey: DownloadAssetKey,
  simulateFailure = false
): Promise<void> {
  const table = simulateFailure ? 'download_stats_missing_for_failure_test' : 'download_stats';
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO ${table} (download_date, asset_key, downloads, updated_at)
       VALUES (?1, ?2, 1, ?3)
       ON CONFLICT(download_date, asset_key) DO UPDATE SET
         downloads = downloads + 1,
         updated_at = excluded.updated_at`
    ).bind(downloadDate, assetKey, new Date().toISOString())
  ]);
}

async function rateLimitStatus(limiter: RateLimit, key: string): Promise<'allowed' | 'limited' | 'unavailable'> {
  try {
    return (await limiter.limit({ key })).success ? 'allowed' : 'limited';
  } catch {
    return 'unavailable';
  }
}

function hitRateLimitResponse(origin: string, unavailable = false): Response {
  const headers = hitHeaders(origin);
  if (!unavailable) {
    headers.set('Retry-After', '60');
  }
  return new Response(null, { status: unavailable ? 503 : 429, headers });
}

function adminRateLimitResponse(unavailable = false): Response {
  return new Response(unavailable ? 'Analytics security service is temporarily unavailable.' : 'Too many requests.', {
    status: unavailable ? 503 : 429,
    headers: {
      ...adminHeaders,
      'Content-Type': 'text/plain; charset=UTF-8',
      ...(!unavailable ? { 'Retry-After': '60' } : {})
    }
  });
}

function downloadHeaders(): Headers {
  return new Headers({
    'Cache-Control': 'private, no-store',
    'Strict-Transport-Security': strictTransportSecurity,
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow'
  });
}

function downloadRedirect(location: string): Response {
  const headers = downloadHeaders();
  headers.set('Location', location);
  return new Response(null, { status: 302, headers });
}

function downloadRateLimitResponse(): Response {
  const headers = downloadHeaders();
  headers.set('Content-Type', 'text/plain; charset=UTF-8');
  headers.set('Retry-After', '60');
  return new Response('Too many download requests. Please try again shortly.', { status: 429, headers });
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
  const [
    todayResult,
    weekResult,
    totalResult,
    recentResult,
    trackingResult,
    downloadTodayResult,
    downloadWeekResult,
    downloadTotalResult,
    downloadByAssetResult,
    downloadRecentResult
  ] = await env.DB.batch([
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
    ),
    env.DB.prepare(
      'SELECT COALESCE(SUM(downloads), 0) AS count FROM download_stats WHERE download_date = ?1'
    ).bind(today),
    env.DB.prepare(
      'SELECT COALESCE(SUM(downloads), 0) AS count FROM download_stats WHERE download_date BETWEEN ?1 AND ?2'
    ).bind(weekStart, today),
    env.DB.prepare('SELECT COALESCE(SUM(downloads), 0) AS count FROM download_stats'),
    env.DB.prepare(
      'SELECT asset_key, COALESCE(SUM(downloads), 0) AS count FROM download_stats GROUP BY asset_key'
    ),
    env.DB.prepare(
      `SELECT download_date, SUM(downloads) AS count
       FROM download_stats
       WHERE download_date BETWEEN ?1 AND ?2
       GROUP BY download_date
       ORDER BY download_date ASC`
    ).bind(recentStart, today)
  ]);

  const visitorCounts = new Map(
    ((recentResult.results ?? []) as unknown as DailyCountRow[]).map((row) => [row.visit_date, Number(row.count)])
  );
  const downloadCounts = new Map(
    ((downloadRecentResult.results ?? []) as unknown as DailyDownloadRow[])
      .map((row) => [row.download_date, Number(row.count)])
  );
  const recent30 = buildDateRange(today, 30)
    .map((date) => ({
      date,
      visitors: visitorCounts.get(date) ?? 0,
      downloads: downloadCounts.get(date) ?? 0
    }))
    .reverse();
  const trackingSince = ((trackingResult.results?.[0] as TrackingRow | undefined)?.tracking_since) ?? null;
  const byAsset = Object.fromEntries(downloadAssetKeys.map((assetKey) => [assetKey, 0])) as Record<DownloadAssetKey, number>;
  for (const row of (downloadByAssetResult.results ?? []) as unknown as AssetDownloadRow[]) {
    if (downloadAssetKeys.includes(row.asset_key)) {
      byAsset[row.asset_key] = Number(row.count);
    }
  }

  return {
    today: countFrom(todayResult),
    week: countFrom(weekResult),
    total: countFrom(totalResult),
    recent30,
    trackingSince,
    downloads: {
      today: countFrom(downloadTodayResult),
      week: countFrom(downloadWeekResult),
      total: countFrom(downloadTotalResult),
      byAsset
    }
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
  const visitorMaximum = Math.max(1, ...stats.recent30.map((day) => day.visitors));
  const downloadMaximum = Math.max(1, ...stats.recent30.map((day) => day.downloads));
  const rows = stats.recent30.map((day) => {
    const visitorWidth = day.visitors === 0 ? 0 : Math.max(3, Math.round((day.visitors / visitorMaximum) * 100));
    const downloadWidth = day.downloads === 0 ? 0 : Math.max(3, Math.round((day.downloads / downloadMaximum) * 100));
    return `<tr><th scope="row">${day.date}</th><td><span class="bar bar--visitors"><span style="width:${visitorWidth}%"></span></span><b>${day.visitors.toLocaleString('en-US')}</b></td><td><span class="bar bar--downloads"><span style="width:${downloadWidth}%"></span></span><b>${day.downloads.toLocaleString('en-US')}</b></td></tr>`;
  }).join('');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lv.B Analytics</title>
  <style>
    :root{color-scheme:dark;--page:#1a1714;--surface:#29241e;--ink:#f7f1e5;--muted:#bdb2a2;--yellow:#ffd746;--blue:#80c7d6;--border:#51483d;font-family:Inter,ui-sans-serif,system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink)}main{width:min(72rem,calc(100% - 2rem));margin:0 auto;padding:clamp(2rem,6vw,5rem) 0}header{display:flex;align-items:end;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem}h1{margin:0;font-size:clamp(2rem,6vw,4rem);letter-spacing:-.04em}p{margin:.4rem 0 0;color:var(--muted)}.dashboard-section{margin-top:2rem}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.card,.panel{padding:1.4rem;border:1px solid var(--border);border-radius:1rem;background:var(--surface)}.card span,.section-label{display:block;color:var(--yellow);font-size:.75rem;font-weight:800;letter-spacing:.12em}.card strong{display:block;margin-top:.45rem;font-size:clamp(2rem,5vw,3.4rem)}h2{margin:0 0 1rem;font-size:1.35rem}.asset-totals{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1rem 0 0}.asset-totals div{display:flex;justify-content:space-between;gap:1rem;padding:1rem;border-radius:.75rem;background:#211d19}.asset-totals dt{color:var(--muted)}.asset-totals dd{margin:0;font-weight:800;font-variant-numeric:tabular-nums}table{width:100%;border-collapse:collapse}th,td{padding:.75rem .5rem;border-top:1px solid var(--border);text-align:left}thead th{color:var(--muted);font-size:.78rem;text-transform:uppercase;letter-spacing:.08em}tbody th{width:7.5rem;font-weight:600}td{min-width:10rem}.bar{display:inline-block;width:calc(100% - 3.5rem);height:.5rem;margin-right:.6rem;border-radius:1rem;background:#1f1b17;overflow:hidden;vertical-align:middle}.bar span{display:block;height:100%;border-radius:inherit;background:var(--yellow)}.bar--downloads span{background:var(--blue)}td b{display:inline-block;min-width:2.5rem;text-align:right;font-variant-numeric:tabular-nums}@media(max-width:40rem){header{display:block}.summary,.asset-totals{grid-template-columns:1fr}.panel{overflow-x:auto}.bar{min-width:5rem}}
  </style>
</head>
<body>
  <main>
    <header><div><p>PRIVATE DASHBOARD</p><h1>Lv.B Analytics</h1></div><p>Visitor tracking since ${stats.trackingSince ?? 'Not started'}</p></header>
    <section class="dashboard-section" aria-labelledby="visitors-title"><p class="section-label">VISITORS</p><h2 id="visitors-title">Visitor totals</h2><div class="summary">
      <article class="card"><span>TODAY</span><strong>${stats.today.toLocaleString('en-US')}</strong></article>
      <article class="card"><span>WEEK</span><strong>${stats.week.toLocaleString('en-US')}</strong></article>
      <article class="card"><span>TOTAL</span><strong>${stats.total.toLocaleString('en-US')}</strong></article>
    </div></section>
    <section class="dashboard-section" aria-labelledby="downloads-title"><p class="section-label">PRESS KIT DOWNLOADS</p><h2 id="downloads-title">Download starts</h2><div class="summary">
      <article class="card"><span>TODAY</span><strong>${stats.downloads.today.toLocaleString('en-US')}</strong></article>
      <article class="card"><span>WEEK</span><strong>${stats.downloads.week.toLocaleString('en-US')}</strong></article>
      <article class="card"><span>TOTAL</span><strong>${stats.downloads.total.toLocaleString('en-US')}</strong></article>
    </div><dl class="asset-totals">
      <div><dt>Lv.B Brand</dt><dd>${stats.downloads.byAsset.brand.toLocaleString('en-US')}</dd></div>
      <div><dt>MushHero</dt><dd>${stats.downloads.byAsset.mushhero.toLocaleString('en-US')}</dd></div>
      <div><dt>MushDash</dt><dd>${stats.downloads.byAsset.mushdash.toLocaleString('en-US')}</dd></div>
    </dl></section>
    <section class="dashboard-section panel"><p class="section-label">RECENT 30 DAYS</p><h2>Visitors and downloads</h2><table><thead><tr><th>Date</th><th>Visitors</th><th>Downloads</th></tr></thead><tbody>${rows}</tbody></table></section>
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

    if (!isSecureTransport(url, env)) {
      return httpsRequired();
    }

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

    if (url.pathname === '/download' || url.pathname.startsWith('/download/')) {
      const target = getDownloadTarget(url.pathname);
      if (!target || url.search) {
        const headers = downloadHeaders();
        headers.set('Content-Type', 'text/plain; charset=UTF-8');
        return new Response('Download not found.', {
          status: 404,
          headers
        });
      }

      if (request.method !== 'GET') {
        const headers = downloadHeaders();
        headers.set('Allow', 'GET');
        headers.set('Content-Type', 'text/plain; charset=UTF-8');
        return new Response('Method not allowed.', { status: 405, headers });
      }

      if (isCrawler(request.headers.get('User-Agent'))) {
        return downloadRedirect(target.url);
      }

      const downloadDate = getRequestDate(request, env);
      const clientIp = getClientIp(request, env);
      if (!clientIp || !env.ANALYTICS_HASH_SECRET) {
        return downloadRedirect(target.url);
      }

      const rateLimitKey = await deriveRateLimitKey('download', downloadDate, clientIp, env.ANALYTICS_HASH_SECRET);
      const limitStatus = await rateLimitStatus(env.DOWNLOAD_RATE_LIMITER, rateLimitKey);
      if (limitStatus === 'limited') {
        return downloadRateLimitResponse();
      }
      if (limitStatus === 'unavailable') {
        console.error('Download rate limiter is unavailable; redirecting without counting.');
        return downloadRedirect(target.url);
      }

      try {
        await recordDownload(
          env,
          downloadDate,
          target.assetKey,
          isDevelopmentTestMode(env) && request.headers.get('X-LvB-Analytics-Test-Fail-Download') === 'true'
        );
      } catch {
        console.error('Download counter increment failed; redirecting without counting.');
      }

      return downloadRedirect(target.url);
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

      const visitDate = getRequestDate(request, env);
      const clientIp = getClientIp(request, env);
      if (!clientIp || !env.ANALYTICS_HASH_SECRET) {
        return emptyHitResponse(origin);
      }

      const visitorHash = await deriveVisitorHash(visitDate, clientIp, env.ANALYTICS_HASH_SECRET);
      const limitStatus = await rateLimitStatus(env.HIT_RATE_LIMITER, `hit:${visitorHash}`);
      if (limitStatus !== 'allowed') {
        return hitRateLimitResponse(origin, limitStatus === 'unavailable');
      }

      context.waitUntil(recordVisit(env, visitDate, visitorHash).catch(() => undefined));
      return emptyHitResponse(origin);
    }

    if ((url.pathname === '/admin' || url.pathname === '/admin/') && request.method === 'GET') {
      const clientIp = getClientIp(request, env);
      if (!clientIp || !env.ANALYTICS_HASH_SECRET) {
        return adminRateLimitResponse(true);
      }
      const key = await deriveRateLimitKey('admin', getRequestDate(request, env), clientIp, env.ANALYTICS_HASH_SECRET);
      const limitStatus = await rateLimitStatus(env.ADMIN_RATE_LIMITER, key);
      if (limitStatus !== 'allowed') {
        return adminRateLimitResponse(limitStatus === 'unavailable');
      }
      return handleAdmin(request, env, false);
    }

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      const clientIp = getClientIp(request, env);
      if (!clientIp || !env.ANALYTICS_HASH_SECRET) {
        return adminRateLimitResponse(true);
      }
      const key = await deriveRateLimitKey('admin', getRequestDate(request, env), clientIp, env.ANALYTICS_HASH_SECRET);
      const limitStatus = await rateLimitStatus(env.ADMIN_RATE_LIMITER, key);
      if (limitStatus !== 'allowed') {
        return adminRateLimitResponse(limitStatus === 'unavailable');
      }
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
