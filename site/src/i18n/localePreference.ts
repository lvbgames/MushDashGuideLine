import { defaultLocale, locales, type Locale } from './config.ts';

export const localePreferenceCookie = {
  name: 'lvb_locale',
  maxAgeSeconds: 31_536_000,
  sameSite: 'Lax'
} as const;

export const validPreferenceLocales = locales;

export const countryLocaleMap: Readonly<Record<string, Locale>> = {
  KR: 'ko',
  JP: 'ja',
  CN: 'zh-cn'
};

export const localeRootPaths: Record<Locale, string> = {
  en: '/',
  ko: '/ko/',
  ja: '/ja/',
  'zh-cn': '/zh-cn/'
};

export function getValidLocalePreference(value: string | null | undefined): Locale | null {
  return (locales as readonly string[]).includes(value ?? '') ? (value as Locale) : null;
}

export function resolveRootLocale(preference: string | null | undefined, countryCode: string | null | undefined): Locale {
  const selectedLocale = getValidLocalePreference(preference);
  if (selectedLocale) {
    return selectedLocale;
  }

  const normalizedCountry = countryCode?.trim().toUpperCase();
  return normalizedCountry ? countryLocaleMap[normalizedCountry] ?? defaultLocale : defaultLocale;
}
