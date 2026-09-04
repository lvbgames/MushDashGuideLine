const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const knownCrawlerPattern = /\b(?:Googlebot|bingbot|Yeti|DuckDuckBot|Applebot|facebookexternalhit|Twitterbot|Discordbot|Slackbot)\b/i;
const genericCrawlerPattern = /(?:bot|crawler|spider)(?:[/;\s]|$)/i;

export const downloadAssetKeys = ['brand', 'mushhero', 'mushdash'] as const;
export type DownloadAssetKey = (typeof downloadAssetKeys)[number];

export interface DownloadTarget {
  assetKey: DownloadAssetKey;
  url: string;
}

const downloadTargets: Readonly<Record<DownloadAssetKey, string>> = {
  brand: 'https://lvb.kr/press/downloads/lvb-brand-assets.zip',
  mushhero: 'https://lvb.kr/press/downloads/mushhero-press-kit.zip',
  mushdash: 'https://lvb.kr/press/downloads/mushdash-press-kit.zip'
};

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function getKstDate(now = new Date()): string {
  return new Date(now.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export function shiftDate(date: string, days: number): string {
  const midnightUtc = Date.parse(`${date}T00:00:00.000Z`);
  return new Date(midnightUtc + days * 86_400_000).toISOString().slice(0, 10);
}

export function buildDateRange(endDate: string, days: number): string[] {
  return Array.from({ length: days }, (_, index) => shiftDate(endDate, index - days + 1));
}

export function isCrawler(userAgent: string | null): boolean {
  const value = userAgent ?? '';
  return knownCrawlerPattern.test(value) || genericCrawlerPattern.test(value);
}

export function getDownloadTarget(pathname: string): DownloadTarget | null {
  const match = /^\/download\/(brand|mushhero|mushdash)$/.exec(pathname);
  if (!match) {
    return null;
  }

  const assetKey = match[1] as DownloadAssetKey;
  return { assetKey, url: downloadTargets[assetKey] };
}

export async function hmacSha256Hex(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return bytesToHex(signature);
}

export function deriveVisitorHash(date: string, clientIp: string, secret: string): Promise<string> {
  return hmacSha256Hex(secret, `${date}\n${clientIp}`);
}

export function deriveRateLimitKey(scope: string, date: string, clientIp: string, secret: string): Promise<string> {
  return hmacSha256Hex(secret, `rate-limit:${scope}\n${date}\n${clientIp}`);
}

export function deriveAdminPasswordHash(password: string, salt: string): Promise<string> {
  return hmacSha256Hex(salt, password);
}

export function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  const maxLength = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < maxLength; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

export interface BasicCredentials {
  username: string;
  password: string;
}

export function parseBasicAuthorization(header: string | null): BasicCredentials | null {
  if (!header?.startsWith('Basic ')) {
    return null;
  }

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(':');
    if (separator < 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1)
    };
  } catch {
    return null;
  }
}
