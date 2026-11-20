import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BRAND_YELLOW,
  DISCORD_LIMITS,
  buildMediaPublication,
  buildUpdatePublication,
  classifyPublication,
  contentHash,
  createDiscordPayload,
  isExternalMediaItem,
  maskWebhookSecrets,
  sortOldestFirst,
  truncateText,
  validateWebhookUrl
} from './discord-format.mjs';

const external = {
  type: 'external',
  slug: 'external-story',
  kind: 'interview',
  localizedTitle: { en: 'External interview', ko: '외부 인터뷰', ja: '外部インタビュー', 'zh-cn': '外部采访' },
  localizedSummary: { en: 'External source summary', ko: '외부 자료 요약', ja: '外部資料の要約', 'zh-cn': '外部资料摘要' },
  publisher: '검증 매체',
  publishedAt: '2026-01-02',
  sourceUrl: 'https://example.com/story'
};

const internal = {
  type: 'internal',
  slug: 'internal-story',
  kind: 'development-update',
  localizedTitle: { en: 'MushHero development story', ko: 'MushHero 개발 이야기', ja: 'MushHero開発記録', 'zh-cn': 'MushHero开发记录' },
  localizedSummary: { en: 'Internal development update', ko: '내부 개발 기록', ja: '内部開発記録', 'zh-cn': '内部开发记录' },
  publisher: 'Lv.B',
  publishedAt: '2026-01-03',
  game: 'mushhero'
};

test('external filter includes supported sources and excludes internal articles', () => {
  assert.equal(isExternalMediaItem(external), true);
  assert.equal(isExternalMediaItem(internal), false);
  assert.equal(isExternalMediaItem({ ...external, kind: 'announcement' }), false);
});

test('oldest-first sorting is stable by slug for the same date', () => {
  const sorted = sortOldestFirst([
    { ...external, slug: 'z', publishedAt: '2026-02-01' },
    { ...external, slug: 'b', publishedAt: '2026-01-01' },
    { ...external, slug: 'a', publishedAt: '2026-01-01' }
  ]);
  assert.deepEqual(sorted.map((item) => item.slug), ['a', 'b', 'z']);
});

test('media embed uses English archive fields, brand color, and disabled mentions', () => {
  const payload = createDiscordPayload(buildMediaPublication(external));
  assert.equal(payload.embeds.length, 1);
  assert.equal(payload.embeds[0].color, BRAND_YELLOW);
  assert.equal(payload.embeds[0].title, external.localizedTitle.en);
  assert.equal(payload.embeds[0].url, external.sourceUrl);
  assert.deepEqual(payload.allowed_mentions, { parse: [] });
  assert.deepEqual(payload.embeds[0].fields.map((field) => field.name), ['Source', 'Published', 'Type']);
});

test('content hash is stable and changes with the final expression', () => {
  const publication = buildMediaPublication(external);
  assert.equal(contentHash(publication), contentHash({ ...publication }));
  assert.notEqual(contentHash(publication), contentHash({ ...publication, summary: '바뀐 요약' }));
});

test('publication classification returns NEW, SKIP, and UPDATE CANDIDATE', () => {
  const publication = buildMediaPublication(external);
  const hash = contentHash(publication);
  assert.equal(classifyPublication(publication, { publications: [] }).status, 'NEW');
  const state = {
    publications: [
      {
        contentId: publication.contentId,
        channel: publication.channel,
        messageId: '123456789',
        contentHash: hash,
        publishedAt: '2026-01-04T00:00:00.000Z'
      }
    ]
  };
  assert.equal(classifyPublication(publication, state).status, 'SKIP');
  assert.equal(classifyPublication({ ...publication, title: 'Revised title' }, state).status, 'UPDATE CANDIDATE');
});

test('secret masking removes webhook tokens and environment assignments', () => {
  const webhook = ['https:/', 'discord.com', 'api', 'webhooks', '123456789', 'secret-token-value'].join('/');
  assert.equal(maskWebhookSecrets(webhook), '[DISCORD_WEBHOOK_REDACTED]');
  assert.doesNotMatch(maskWebhookSecrets(`DISCORD_MEDIA_WEBHOOK_URL=${webhook}`), /secret-token-value/);
});

test('Discord limits preserve NFC CJK and append an ellipsis', () => {
  const longText = '가'.repeat(DISCORD_LIMITS.title + 20);
  const truncated = truncateText(longText, DISCORD_LIMITS.title);
  assert.equal(truncated.length, DISCORD_LIMITS.title);
  assert.equal(truncated.endsWith('…'), true);
  assert.equal(truncated, truncated.normalize('NFC'));
});

test('update mapping requires explicit channel and matching game', () => {
  assert.throws(() => buildUpdatePublication(internal), /approved update channel/);
  const publication = buildUpdatePublication({ ...internal, discordChannel: 'mushhero_updates' });
  assert.equal(publication.channel, 'mushhero_updates');
  assert.equal(publication.thumbnail.endsWith('mushhero-og-primary.jpg'), true);
  assert.throws(
    () => buildUpdatePublication({ ...internal, discordChannel: 'mushdash_updates' }),
    /does not match/
  );
});

test('only fixed Discord Incoming Webhook destinations are accepted', () => {
  const valid = ['https:/', 'discord.com', 'api', 'webhooks', '123456789', 'token-value'].join('/');
  assert.equal(validateWebhookUrl(valid).hostname, 'discord.com');
  assert.throws(() => validateWebhookUrl('https://example.com/hook'), /approved Discord Incoming Webhook/);
  assert.throws(() => validateWebhookUrl(`${valid}?redirect=https://example.com`), /approved Discord Incoming Webhook/);
});
