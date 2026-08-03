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

export type SiteRoute = 'home' | 'games' | 'about' | 'contact' | 'news' | 'privacy' | 'mushhero' | 'mushdash';

export function getLocalePath(locale: Locale, route: SiteRoute = 'home'): string {
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
    return `${prefix}/news/`;
  }

  if (route === 'privacy') {
    return `${prefix}/privacy/`;
  }

  if (route === 'games') {
    return `${prefix}/games/`;
  }

  return `${prefix}/games/${route}/`;
}
