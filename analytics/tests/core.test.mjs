import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildDateRange,
  constantTimeEqual,
  deriveAdminPasswordHash,
  deriveVisitorHash,
  getKstDate,
  isCrawler,
  parseBasicAuthorization,
  shiftDate
} from '../src/core.ts';

test('KST date changes at 00:00 Asia/Seoul', () => {
  assert.equal(getKstDate(new Date('2026-08-28T14:59:59.999Z')), '2026-08-28');
  assert.equal(getKstDate(new Date('2026-08-28T15:00:00.000Z')), '2026-08-29');
});

test('date helpers produce inclusive ranges', () => {
  assert.equal(shiftDate('2026-08-29', -6), '2026-08-23');
  assert.deepEqual(buildDateRange('2026-08-29', 3), ['2026-08-27', '2026-08-28', '2026-08-29']);
});

test('daily visitor HMAC is stable only for the same date, IP and secret', async () => {
  const first = await deriveVisitorHash('2026-08-28', '203.0.113.10', 'test-secret');
  assert.equal(first, await deriveVisitorHash('2026-08-28', '203.0.113.10', 'test-secret'));
  assert.notEqual(first, await deriveVisitorHash('2026-08-29', '203.0.113.10', 'test-secret'));
  assert.notEqual(first, await deriveVisitorHash('2026-08-28', '203.0.113.11', 'test-secret'));
  assert.match(first, /^[a-f0-9]{64}$/);
});

test('known and generic crawler user agents are excluded without rejecting browsers', () => {
  for (const userAgent of [
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0)',
    'Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)',
    'DuckDuckBot/1.1',
    'Applebot/0.1',
    'facebookexternalhit/1.1',
    'Twitterbot/1.0',
    'Discordbot/2.0',
    'Slackbot-LinkExpanding 1.0',
    'ExampleCrawler/1.0',
    'Friendly Spider'
  ]) {
    assert.equal(isCrawler(userAgent), true, userAgent);
  }

  assert.equal(isCrawler('Mozilla/5.0 Chrome/140.0 Safari/537.36'), false);
  assert.equal(isCrawler('Mozilla/5.0 Version/18.0 Safari/605.1.15'), false);
});

test('Basic credentials and password hashes are parsed and compared safely', async () => {
  const authorization = `Basic ${Buffer.from('owner:pass:with:colon').toString('base64')}`;
  assert.deepEqual(parseBasicAuthorization(authorization), {
    username: 'owner',
    password: 'pass:with:colon'
  });
  assert.equal(parseBasicAuthorization('Bearer token'), null);

  const hash = await deriveAdminPasswordHash('password', 'salt');
  assert.equal(constantTimeEqual(hash, await deriveAdminPasswordHash('password', 'salt')), true);
  assert.equal(constantTimeEqual(hash, await deriveAdminPasswordHash('wrong', 'salt')), false);
  assert.equal(constantTimeEqual('short', 'longer'), false);
});
