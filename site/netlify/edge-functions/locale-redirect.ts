import {
  localePreferenceCookie,
  localeRootPaths,
  resolveRootLocale
} from '../../src/i18n/localePreference.ts';

interface LocaleRedirectContext {
  cookies: {
    get(name: string): string | undefined;
  };
  geo?: {
    country?: {
      code?: string | null;
    } | null;
  } | null;
}

const crawlerUserAgent = /\b(?:Googlebot|bingbot|Yeti|DuckDuckBot|Applebot|facebookexternalhit|Twitterbot|Discordbot|Slackbot)\b/i;

export function isCrawlerRequest(userAgent: string | null): boolean {
  return crawlerUserAgent.test(userAgent ?? '');
}

export default function localeRedirect(request: Request, context: LocaleRedirectContext): Response | undefined {
  const requestUrl = new URL(request.url);

  if (requestUrl.pathname !== '/' || !['GET', 'HEAD'].includes(request.method) || isCrawlerRequest(request.headers.get('user-agent'))) {
    return undefined;
  }

  const selectedLocale = resolveRootLocale(
    context.cookies.get(localePreferenceCookie.name),
    context.geo?.country?.code
  );

  if (selectedLocale === 'en') {
    return undefined;
  }

  const redirectUrl = new URL(localeRootPaths[selectedLocale], requestUrl);
  redirectUrl.search = requestUrl.search;

  return new Response(null, {
    status: 307,
    headers: {
      'Cache-Control': 'private, no-store',
      Location: redirectUrl.href,
      Vary: 'Cookie, User-Agent'
    }
  });
}
