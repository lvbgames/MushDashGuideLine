export const locales = ['en', 'ko', 'ja', 'zh-cn'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  'zh-cn': '简体中文'
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export type SiteRoute =
  | 'home'
  | 'games'
  | 'about'
  | 'contact'
  | 'news'
  | 'news-article'
  | 'press'
  | 'privacy'
  | 'terms'
  | 'mushhero'
  | 'mushdash';

export function getLocalePath(locale: Locale, route: SiteRoute = 'home', routeParam?: string): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;

  if (route === 'home') {
    return `${prefix}/`;
  }

  if (route === 'contact') {
    return `${prefix}/contact/`;
  }

  if (route === 'about') {
    return `${prefix}/about/`;
  }

  if (route === 'news') {
    if (routeParam && routeParam !== '1') {
      return `${prefix}/news/page/${routeParam}/`;
    }

    return `${prefix}/news/`;
  }

  if (route === 'news-article') {
    if (!routeParam) {
      throw new Error('News article routes require a slug.');
    }
    return `${prefix}/news/${routeParam}/`;
  }

  if (route === 'press') {
    return `${prefix}/press/`;
  }

  if (route === 'privacy') {
    return `${prefix}/privacy/`;
  }

  if (route === 'terms') {
    return `${prefix}/terms/`;
  }

  if (route === 'games') {
    return `${prefix}/games/`;
  }

  return `${prefix}/games/${route}/`;
}
