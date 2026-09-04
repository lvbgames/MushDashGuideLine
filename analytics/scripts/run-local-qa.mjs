import assert from 'node:assert/strict';
import { mkdir, readFile, rm, rmdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

import { deriveAdminPasswordHash } from '../src/core.ts';

const analyticsRoot = path.resolve(import.meta.dirname, '..');
const qaRoot = path.resolve(analyticsRoot, '.wrangler', `qa-${process.pid}`);
const envPath = path.resolve(qaRoot, '.qa.env');
const port = 8791 + (process.pid % 100);
const baseUrl = `http://127.0.0.1:${port}`;
const wranglerEntry = path.resolve(analyticsRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const configPath = path.resolve(analyticsRoot, 'wrangler.jsonc');
const qaConfigPath = path.resolve(analyticsRoot, `.wrangler-qa-${process.pid}.jsonc`);
const adminUser = 'local-owner';
const adminPassword = 'local-password-not-for-production';
const adminSalt = 'local-qa-salt';
const browserUa = 'Mozilla/5.0 Chrome/140.0 Safari/537.36';
const allowedOrigin = 'http://localhost:4321';
const basic = `Basic ${Buffer.from(`${adminUser}:${adminPassword}`).toString('base64')}`;
let statsRequestId = 0;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: analyticsRoot,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => { stdout += chunk; });
    child.stderr?.on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} exited ${code}\n${stdout}\n${stderr}`));
    });
  });
}

async function waitForWorker(child) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`wrangler dev exited early with ${child.exitCode}`);
    try {
      const response = await fetch(`${baseUrl}/missing`);
      if (response.status === 404) return;
    } catch {
      // Wrangler is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('Timed out waiting for the local Worker.');
}

async function hit({ date, ip, userAgent = browserUa, origin = allowedOrigin, method = 'POST' }) {
  return fetch(`${baseUrl}/hit`, {
    method,
    headers: {
      Origin: origin,
      'User-Agent': userAgent,
      'X-LvB-Analytics-Test-Date': date,
      'X-LvB-Analytics-Test-IP': ip
    }
  });
}

async function download({
  path,
  date,
  ip,
  userAgent = browserUa,
  method = 'GET',
  failIncrement = false
}) {
  return fetch(`${baseUrl}${path}`, {
    method,
    redirect: 'manual',
    headers: {
      'User-Agent': userAgent,
      'X-LvB-Analytics-Test-Date': date,
      'X-LvB-Analytics-Test-IP': ip,
      ...(failIncrement ? { 'X-LvB-Analytics-Test-Fail-Download': 'true' } : {})
    }
  });
}

async function stats(date, authorization = basic, ip = `198.18.0.${++statsRequestId}`) {
  return fetch(`${baseUrl}/api/stats`, {
    headers: {
      Authorization: authorization,
      'X-LvB-Analytics-Test-Date': date,
      'X-LvB-Analytics-Test-IP': ip
    }
  });
}

async function finalize(date, simulateDeleteFailure = false) {
  return fetch(`${baseUrl}/__test/finalize`, {
    method: 'POST',
    headers: {
      'X-LvB-Analytics-Test-Date': date,
      ...(simulateDeleteFailure ? { 'X-LvB-Analytics-Test-Fail-Delete': 'true' } : {})
    }
  });
}

async function waitForTotal(date, expectedTotal) {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const response = await stats(date);
    if (response.status === 200) {
      const payload = await response.json();
      if (payload.total === expectedTotal) return payload;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for analytics total ${expectedTotal}.`);
}

function assertFixtureStats(payload) {
  assert.equal(payload.today, 2);
  assert.equal(payload.week, 10);
  assert.equal(payload.total, 10);
  assert.equal(payload.trackingSince, '2026-08-27');
  assert.deepEqual(
    payload.recent30.filter((entry) => entry.visitors > 0).map(({ date, visitors }) => ({ date, visitors })),
    [
      { date: '2026-08-29', visitors: 2 },
      { date: '2026-08-28', visitors: 5 },
      { date: '2026-08-27', visitors: 3 }
    ]
  );
  assert.deepEqual(payload.downloads, {
    today: 6,
    week: 6,
    total: 6,
    byAsset: { brand: 2, mushhero: 3, mushdash: 1 }
  });
  assert.deepEqual(
    payload.recent30.filter((entry) => entry.downloads > 0).map(({ date, downloads }) => ({ date, downloads })),
    [{ date: '2026-08-29', downloads: 6 }]
  );
}

async function executeLocalSql(command) {
  const { stdout } = await run(process.execPath, [wranglerEntry,
    'd1', 'execute', 'DB', '--local', '--persist-to', qaRoot,
    '--config', configPath, '--command', command, '--json'
  ]);
  return JSON.parse(stdout)[0].results;
}

let worker;
try {
  await mkdir(qaRoot, { recursive: true });
  const schema = await readFile(path.resolve(analyticsRoot, 'migrations', '0001_initial.sql'), 'utf8');
  const statsSchema = await readFile(path.resolve(analyticsRoot, 'migrations', '0002_daily_stats.sql'), 'utf8');
  const downloadSchema = await readFile(path.resolve(analyticsRoot, 'migrations', '0003_download_stats.sql'), 'utf8');
  assert.deepEqual(
    [...schema.matchAll(/^\s*([a-z_]+)\s+(?:TEXT|PRIMARY KEY)/gmi)].map((match) => match[1]),
    ['visit_date', 'visitor_hash', 'created_at']
  );
  assert.equal(/\b(?:ip|user_agent|url|referrer|country|session)\b/i.test(schema), false);
  assert.match(statsSchema, /CREATE TABLE IF NOT EXISTS daily_stats/);
  assert.match(statsSchema, /visit_date TEXT PRIMARY KEY NOT NULL/);
  assert.match(statsSchema, /unique_visitors INTEGER NOT NULL/);
  assert.match(statsSchema, /finalized_at TEXT NOT NULL/);
  assert.equal(/visitor_hash|\bip\b|user_agent|url|referrer|country|session/i.test(statsSchema), false);
  assert.match(downloadSchema, /CREATE TABLE IF NOT EXISTS download_stats/);
  assert.match(downloadSchema, /asset_key TEXT NOT NULL CHECK \(asset_key IN \('brand', 'mushhero', 'mushdash'\)\)/);
  assert.match(downloadSchema, /downloads INTEGER NOT NULL CHECK \(downloads >= 0\)/);
  assert.equal(/visitor_hash|\bip\b|user_agent|url|referrer|country|session/i.test(downloadSchema), false);
  const adminHash = await deriveAdminPasswordHash(adminPassword, adminSalt);
  const qaConfig = JSON.parse(await readFile(configPath, 'utf8'));
  qaConfig.ratelimits = qaConfig.ratelimits.map((binding) => ({
    ...binding,
    simple: {
      limit: binding.name === 'HIT_RATE_LIMITER' ? 3 : binding.name === 'DOWNLOAD_RATE_LIMITER' ? 3 : 2,
      period: 10
    }
  }));
  await writeFile(qaConfigPath, `${JSON.stringify(qaConfig, null, 2)}\n`, 'utf8');
  await writeFile(envPath, [
    'ANALYTICS_ENV=development',
    'ALLOWED_ORIGIN=https://lvb.kr',
    'DEV_ALLOWED_ORIGINS=http://localhost:4321',
    'ANALYTICS_ALLOW_TEST_HEADERS=true',
    'ANALYTICS_HASH_SECRET=local-qa-hash-secret',
    `ANALYTICS_ADMIN_USER=${adminUser}`,
    `ANALYTICS_ADMIN_PASSWORD_HASH=${adminHash}`,
    `ANALYTICS_ADMIN_PASSWORD_SALT=${adminSalt}`,
    ''
  ].join('\n'), { encoding: 'utf8', mode: 0o600 });

  await run(process.execPath, [wranglerEntry,
    'd1', 'migrations', 'apply', 'DB', '--local', '--persist-to', qaRoot,
    '--config', configPath
  ]);

  worker = spawn(process.execPath, [wranglerEntry,
    'dev', '--local', '--ip', '127.0.0.1', '--port', String(port),
    '--persist-to', qaRoot, '--env-file', envPath, '--config', qaConfigPath,
    '--var', 'ANALYTICS_ENV:development',
    '--var', 'ALLOWED_ORIGIN:https://lvb.kr',
    '--var', 'DEV_ALLOWED_ORIGINS:http://localhost:4321',
    '--var', 'ANALYTICS_ALLOW_TEST_HEADERS:true'
  ], {
    cwd: analyticsRoot,
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  worker.stdout.on('data', () => undefined);
  worker.stderr.on('data', () => undefined);
  await waitForWorker(worker);

  const emptyStatsResponse = await stats('2026-08-29');
  assert.equal(emptyStatsResponse.status, 200);
  const emptyStats = await emptyStatsResponse.json();
  assert.equal(emptyStats.trackingSince, null);
  assert.deepEqual(emptyStats.downloads, {
    today: 0,
    week: 0,
    total: 0,
    byAsset: { brand: 0, mushhero: 0, mushdash: 0 }
  });

  for (const ip of ['203.0.113.11', '203.0.113.12', '203.0.113.13']) {
    assert.equal((await hit({ date: '2026-08-27', ip })).status, 204);
  }
  assert.equal((await hit({ date: '2026-08-27', ip: '203.0.113.11' })).status, 204);

  for (const ip of ['203.0.113.21', '203.0.113.22', '203.0.113.23', '203.0.113.24', '203.0.113.25']) {
    assert.equal((await hit({ date: '2026-08-28', ip })).status, 204);
  }

  assert.equal((await hit({ date: '2026-08-29', ip: '203.0.113.11' })).status, 204);
  assert.equal((await hit({ date: '2026-08-29', ip: '203.0.113.31' })).status, 204);

  for (const userAgent of ['Googlebot/2.1', 'Yeti/1.1', 'Discordbot/2.0']) {
    assert.equal((await hit({ date: '2026-08-28', ip: `198.51.100.${userAgent.length}`, userAgent })).status, 204);
  }

  assert.equal((await hit({ date: '2026-08-29', ip: '203.0.113.40', origin: 'https://example.com' })).status, 403);
  assert.equal((await hit({ date: '2026-08-29', ip: '203.0.113.40', method: 'GET' })).status, 405);

  const downloadFixtures = [
    ['brand', '198.51.100.11'],
    ['brand', '198.51.100.11'],
    ['mushhero', '198.51.100.21'],
    ['mushhero', '198.51.100.22'],
    ['mushhero', '198.51.100.23'],
    ['mushdash', '198.51.100.31']
  ];
  const downloadLocations = {
    brand: 'https://lvb.kr/press/downloads/lvb-brand-assets.zip',
    mushhero: 'https://lvb.kr/press/downloads/mushhero-press-kit.zip',
    mushdash: 'https://lvb.kr/press/downloads/mushdash-press-kit.zip'
  };
  for (const [assetKey, ip] of downloadFixtures) {
    const response = await download({ path: `/download/${assetKey}`, date: '2026-08-29', ip });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), downloadLocations[assetKey]);
  }

  const botDownload = await download({
    path: '/download/brand',
    date: '2026-08-29',
    ip: '198.51.100.41',
    userAgent: 'Googlebot/2.1'
  });
  assert.equal(botDownload.status, 302);
  assert.equal(botDownload.headers.get('location'), downloadLocations.brand);

  const failedIncrement = await download({
    path: '/download/mushdash',
    date: '2026-08-29',
    ip: '198.51.100.42',
    failIncrement: true
  });
  assert.equal(failedIncrement.status, 302);
  assert.equal(failedIncrement.headers.get('location'), downloadLocations.mushdash);

  for (const path of [
    '/download',
    '/download/unknown',
    '/download?url=https%3A%2F%2Fevil.example',
    '/download/http%3A%2F%2Fevil.example',
    '/download/brand%2F..%2Fadmin'
  ]) {
    const response = await download({ path, date: '2026-08-29', ip: '198.51.100.43' });
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.has('location'), false, path);
  }
  const normalizedTraversal = await download({
    path: '/download/../admin/',
    date: '2026-08-29',
    ip: '198.51.100.44'
  });
  assert.equal(normalizedTraversal.status, 401);
  assert.equal(normalizedTraversal.headers.has('location'), false);
  const wrongDownloadMethod = await download({
    path: '/download/brand',
    date: '2026-08-29',
    ip: '198.51.100.45',
    method: 'POST'
  });
  assert.equal(wrongDownloadMethod.status, 405);
  assert.equal(wrongDownloadMethod.headers.get('allow'), 'GET');

  const anonymous = await stats('2026-08-29', '');
  assert.equal(anonymous.status, 401);
  assert.equal((await anonymous.text()).includes('today'), false);
  assert.equal((await stats('2026-08-29', 'Basic d3Jvbmc6d3Jvbmc=')).status, 401);

  const beforeFinalize = await waitForTotal('2026-08-29', 10);
  assertFixtureStats(beforeFinalize);

  assert.equal((await finalize('2026-08-29', true)).status, 500);
  const afterFailedFinalize = await waitForTotal('2026-08-29', 10);
  assertFixtureStats(afterFailedFinalize);

  assert.equal((await finalize('2026-08-29')).status, 204);
  const afterFinalize = await waitForTotal('2026-08-29', 10);
  assertFixtureStats(afterFinalize);

  assert.equal((await finalize('2026-08-29')).status, 204);
  const afterSecondFinalize = await waitForTotal('2026-08-29', 10);
  assertFixtureStats(afterSecondFinalize);

  const response = await stats('2026-08-29');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  const payload = await response.json();
  assertFixtureStats(payload);
  const serialized = JSON.stringify(payload);
  assert.equal(serialized.includes('visitor_hash'), false);
  assert.equal(serialized.includes('203.0.113.'), false);

  const dashboard = await fetch(`${baseUrl}/admin/`, {
    headers: {
      Authorization: basic,
      'X-LvB-Analytics-Test-Date': '2026-08-29',
      'X-LvB-Analytics-Test-IP': '198.18.1.1'
    }
  });
  assert.equal(dashboard.status, 200);
  assert.match(dashboard.headers.get('content-type') ?? '', /^text\/html/);
  assert.equal(dashboard.headers.get('x-robots-tag'), 'noindex, nofollow');
  const dashboardBody = await dashboard.text();
  assert.match(dashboardBody, /Lv\.B Analytics/);
  assert.match(dashboardBody, /PRESS KIT DOWNLOADS/);
  assert.match(dashboardBody, /Lv\.B Brand/);
  assert.match(dashboardBody, /MushHero/);
  assert.match(dashboardBody, /MushDash/);
  assert.equal(dashboardBody.includes('visitor_hash'), false);
  assert.equal(dashboardBody.includes('203.0.113.'), false);

  for (let requestIndex = 0; requestIndex < 2; requestIndex += 1) {
    assert.equal((await hit({ date: '2026-08-29', ip: '203.0.113.31' })).status, 204);
  }
  const limitedHit = await hit({ date: '2026-08-29', ip: '203.0.113.31' });
  assert.equal(limitedHit.status, 429);
  assert.equal(limitedHit.headers.get('access-control-allow-origin'), allowedOrigin);
  assert.equal(await limitedHit.text(), '');

  for (let requestIndex = 0; requestIndex < 3; requestIndex += 1) {
    assert.equal((await download({
      path: '/download/brand',
      date: '2026-08-29',
      ip: '198.51.100.210'
    })).status, 302);
  }
  const limitedDownload = await download({
    path: '/download/brand',
    date: '2026-08-29',
    ip: '198.51.100.210'
  });
  assert.equal(limitedDownload.status, 429);
  assert.equal(limitedDownload.headers.get('retry-after'), '60');
  assert.equal(limitedDownload.headers.has('location'), false);

  const sharedAdminLimit = await fetch(`${baseUrl}/admin/`, {
    headers: {
      Authorization: basic,
      'X-LvB-Analytics-Test-Date': '2026-08-29',
      'X-LvB-Analytics-Test-IP': '198.51.100.200'
    }
  });
  assert.equal(sharedAdminLimit.status, 200);
  assert.equal((await stats('2026-08-29', 'Basic d3Jvbmc6d3Jvbmc=', '198.51.100.200')).status, 401);
  const limitedAdmin = await stats('2026-08-29', basic, '198.51.100.200');
  assert.equal(limitedAdmin.status, 429);
  assert.equal(limitedAdmin.headers.has('www-authenticate'), false);
  assert.equal((await limitedAdmin.text()).includes('visitor'), false);

  await new Promise((resolve) => setTimeout(resolve, 10_500));
  assert.equal((await hit({ date: '2026-08-29', ip: '203.0.113.31' })).status, 204);
  assert.equal((await download({
    path: '/download/brand',
    date: '2026-08-29',
    ip: '198.51.100.210'
  })).status, 302);
  assert.equal((await stats('2026-08-29', basic, '198.51.100.200')).status, 200);

  worker.kill('SIGINT');
  await new Promise((resolve) => worker.once('exit', resolve));
  worker = undefined;

  assert.deepEqual(
    await executeLocalSql(
      'SELECT visit_date, COUNT(*) AS count FROM daily_visitors GROUP BY visit_date ORDER BY visit_date ASC'
    ),
    [{ visit_date: '2026-08-29', count: 2 }]
  );
  assert.deepEqual(
    await executeLocalSql(
      'SELECT visit_date, unique_visitors FROM daily_stats ORDER BY visit_date ASC'
    ),
    [
      { visit_date: '2026-08-27', unique_visitors: 3 },
      { visit_date: '2026-08-28', unique_visitors: 5 }
    ]
  );
  assert.deepEqual(
    await executeLocalSql(
      'SELECT download_date, asset_key, downloads FROM download_stats ORDER BY download_date ASC, asset_key ASC'
    ),
    [
      { download_date: '2026-08-29', asset_key: 'brand', downloads: 6 },
      { download_date: '2026-08-29', asset_key: 'mushdash', downloads: 1 },
      { download_date: '2026-08-29', asset_key: 'mushhero', downloads: 3 }
    ]
  );

  console.log('Local Worker/D1 QA passed: visitor aggregation, Press Kit download starts, fixed redirects, rate limits, fail-open download counting, rollback safety, KST dates, bots, auth, CORS, and raw-IP non-disclosure.');
} finally {
  if (worker && worker.exitCode === null) {
    worker.kill('SIGINT');
    await new Promise((resolve) => worker.once('exit', resolve));
  }
  const safeParent = path.resolve(analyticsRoot, '.wrangler');
  if (qaRoot.startsWith(`${safeParent}${path.sep}`)) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await rm(qaRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    await rm(path.resolve(safeParent, 'tmp'), {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 200
    });
    await rmdir(safeParent).catch(() => undefined);
  }
  await rm(qaConfigPath, { force: true });
}
