import { createHash } from 'node:crypto';

export const BRAND_YELLOW = 0xffd746;
export const CHANNEL_KEYS = Object.freeze(['media', 'mushdash_updates', 'mushhero_updates']);
export const WEBHOOK_ENV_BY_CHANNEL = new Map([
  ['media', 'DISCORD_MEDIA_WEBHOOK_URL'],
  ['mushdash_updates', 'DISCORD_MUSHDASH_UPDATES_WEBHOOK_URL'],
  ['mushhero_updates', 'DISCORD_MUSHHERO_UPDATES_WEBHOOK_URL']
]);

export const OG_IMAGES = Object.freeze({
  lvb: 'https://lvb.kr/og/lvb-og-primary.png',
  mushhero: 'https://lvb.kr/og/mushhero-og-primary.jpg',
  mushdash: 'https://lvb.kr/og/mushdash-og-primary.jpg'
});

export const DISCORD_LIMITS = Object.freeze({
  title: 240,
  description: 2000,
  fieldName: 64,
  fieldValue: 512,
  footer: 128
});

const MEDIA_KINDS = new Set(['interview', 'press-coverage', 'feature', 'blog-review']);
const CATEGORY_LABELS = new Map([
  ['interview', 'Interview'],
  ['press-coverage', 'Article'],
  ['feature', 'Feature'],
  ['blog-review', 'Play Review']
]);
const ENGLISH_SOURCE_NAMES = new Map([
  ['게임메카', 'GameMeca'],
  ['게임포커스', 'GameFocus'],
  ['부산글로벌게임센터', 'Busan Global Game Center'],
  ['부산일보', 'Busan Ilbo']
]);

function normalizeText(value) {
  return String(value ?? '').replace(/\r\n?/g, '\n').trim().normalize('NFC');
}

export function truncateText(value, maximum) {
  const text = normalizeText(value);
  if (text.length <= maximum) {
    return text;
  }
  const truncated = text.slice(0, Math.max(0, maximum - 1)).trimEnd();
  return `${truncated}…`;
}

export function formatDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid publication date: ${date}`);
  }
  const [year, month, day] = date.split('-').map(Number);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[month - 1]} ${day}, ${year}`;
}

export function isExternalMediaItem(item) {
  return item.type === 'external' && MEDIA_KINDS.has(item.kind) && Boolean(item.sourceUrl);
}

export function sortOldestFirst(items) {
  return [...items].sort((left, right) => {
    const byDate = left.publishedAt.localeCompare(right.publishedAt);
    return byDate || left.slug.localeCompare(right.slug);
  });
}

export function getCategoryLabel(kind) {
  const label = CATEGORY_LABELS.get(kind);
  if (!label) {
    throw new Error(`Unsupported media category: ${kind}`);
  }
  return label;
}

function inferGame(item) {
  if (item.game === 'mushhero' || item.game === 'mushdash') {
    return item.game;
  }
  const search = `${item.slug} ${Object.values(item.localizedTitle).join(' ')} ${Object.values(item.localizedSummary).join(' ')}`.toLowerCase();
  const hasHero = search.includes('mushhero');
  const hasDash = search.includes('mushdash');
  if (hasHero !== hasDash) {
    return hasHero ? 'mushhero' : 'mushdash';
  }
  return 'lvb';
}

export function buildMediaPublication(item) {
  if (!isExternalMediaItem(item)) {
    throw new Error(`News item ${item.slug} is not eligible for the media channel.`);
  }
  return {
    contentId: `news:${item.slug}`,
    channel: 'media',
    title: item.localizedTitle.en,
    summary: item.localizedSummary.en,
    url: item.sourceUrl,
    date: item.publishedAt,
    source: item.publisher === 'note' && item.author ? item.author : ENGLISH_SOURCE_NAMES.get(item.publisher) ?? item.publisher,
    category: getCategoryLabel(item.kind),
    thumbnail: OG_IMAGES[inferGame(item)],
    footer: 'Lv.B Media Archive',
    historical: true
  };
}

export function buildUpdatePublication(item) {
  if (item.type !== 'internal' || !['mushhero_updates', 'mushdash_updates'].includes(item.discordChannel)) {
    throw new Error(`News item ${item.slug} does not have an approved update channel.`);
  }
  const game = item.discordChannel === 'mushhero_updates' ? 'mushhero' : 'mushdash';
  const expectedGame = game === 'mushhero' ? 'mushhero' : 'mushdash';
  if (item.game !== expectedGame) {
    throw new Error(`News item ${item.slug} does not match its approved Discord channel.`);
  }

  return {
    contentId: `news:${item.slug}`,
    channel: item.discordChannel,
    title: item.localizedTitle.en,
    summary: item.localizedSummary.en,
    url: `https://lvb.kr/news/${item.slug}/`,
    date: item.publishedAt,
    source: 'Lv.B',
    category: 'Update',
    thumbnail: OG_IMAGES[game],
    footer: game === 'mushhero' ? 'MushHero Updates' : 'MushDash Updates',
    version: item.version,
    platform: item.platform
  };
}

export function buildUpdateSample(item, channel) {
  return buildUpdatePublication({ ...item, discordChannel: channel });
}

export function createDiscordPayload(publication) {
  const fields = [
    { name: 'Source', value: publication.source, inline: true },
    { name: 'Published', value: formatDate(publication.date), inline: true },
    { name: 'Type', value: publication.category, inline: true }
  ];
  if (publication.version) {
    fields.push({ name: 'Version', value: publication.version, inline: true });
  }
  if (publication.platform) {
    fields.push({ name: 'Platform', value: publication.platform, inline: true });
  }

  return {
    embeds: [
      {
        title: truncateText(publication.title, DISCORD_LIMITS.title),
        url: publication.url,
        description: truncateText(publication.summary, DISCORD_LIMITS.description),
        color: BRAND_YELLOW,
        fields: fields.map((field) => ({
          name: truncateText(field.name, DISCORD_LIMITS.fieldName),
          value: truncateText(field.value, DISCORD_LIMITS.fieldValue),
          inline: field.inline
        })),
        thumbnail: { url: publication.thumbnail },
        footer: { text: truncateText(publication.footer, DISCORD_LIMITS.footer) }
      }
    ],
    allowed_mentions: { parse: [] }
  };
}

export function contentHash(publication) {
  const payload = createDiscordPayload(publication);
  const canonicalExpression = JSON.stringify({
    contentId: publication.contentId,
    channel: publication.channel,
    title: payload.embeds[0].title,
    summary: payload.embeds[0].description,
    url: payload.embeds[0].url,
    date: publication.date,
    source: publication.source,
    category: publication.category,
    version: publication.version ?? null,
    platform: publication.platform ?? null
  });
  return createHash('sha256').update(canonicalExpression, 'utf8').digest('hex');
}

export function classifyPublication(publication, state) {
  const hash = contentHash(publication);
  const existing = state.publications.find(
    (entry) => entry.contentId === publication.contentId && entry.channel === publication.channel
  );
  if (!existing) {
    return { status: 'NEW', hash };
  }
  if (existing.contentHash === hash) {
    return { status: 'SKIP', hash, existing };
  }
  return { status: 'UPDATE CANDIDATE', hash, existing };
}

export function maskWebhookSecrets(value) {
  return String(value)
    .replace(/https:\/\/(?:discord\.com|discordapp\.com)\/api(?:\/v\d+)?\/webhooks\/\d+\/[^\s/?#]+/giu, '[DISCORD_WEBHOOK_REDACTED]')
    .replace(/(DISCORD_(?:MEDIA|MUSHDASH_UPDATES|MUSHHERO_UPDATES)_WEBHOOK_URL\s*[=:]\s*)[^\s]+/giu, '$1[REDACTED]');
}

export function validateWebhookUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('The selected Discord webhook environment variable is not a valid URL.');
  }
  if (
    url.protocol !== 'https:' ||
    !['discord.com', 'discordapp.com'].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.port ||
    url.hash ||
    url.search ||
    !/^\/api(?:\/v\d+)?\/webhooks\/\d+\/[^/]+$/.test(url.pathname)
  ) {
    throw new Error('The selected environment variable is not an approved Discord Incoming Webhook URL.');
  }
  return url;
}

export function webhookRequestUrl(webhookUrl, { messageId } = {}) {
  const url = validateWebhookUrl(webhookUrl);
  if (messageId) {
    if (!/^\d+$/.test(messageId)) {
      throw new Error('Discord message ID must contain digits only.');
    }
    url.pathname = `${url.pathname}/messages/${messageId}`;
  } else {
    url.searchParams.set('wait', 'true');
  }
  return url;
}
