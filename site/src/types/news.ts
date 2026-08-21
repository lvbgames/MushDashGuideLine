import type { Locale } from '../i18n/config';

export type NewsKind = 'interview' | 'press-coverage' | 'blog-review' | 'feature';

export interface NewsItem {
  slug: string;
  kind: NewsKind;
  originalTitle: string;
  localizedTitle: Readonly<Record<Locale, string>>;
  publisher: string;
  author?: string;
  publishedAt: string;
  sourceUrl: string;
  localizedSummary: Readonly<Record<Locale, string>>;
  lastVerifiedAt: string;
}
