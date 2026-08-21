import type { Locale } from '../i18n/config';
import type { GameImage } from './game';

export type NewsKind = 'studio-update' | 'interview' | 'press-coverage' | 'blog-review' | 'feature';

interface NewsItemBase {
  slug: string;
  kind: NewsKind;
  localizedTitle: Readonly<Record<Locale, string>>;
  publisher: string;
  author?: string;
  publishedAt: string;
  localizedSummary: Readonly<Record<Locale, string>>;
}

export interface ExternalNewsItem extends NewsItemBase {
  type: 'external';
  originalTitle: string;
  sourceUrl: string;
  lastVerifiedAt: string;
}

export interface NewsArticleSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
}

export interface NewsArticleBody {
  intro: string;
  sections: readonly NewsArticleSection[];
}

export interface InternalNewsItem extends NewsItemBase {
  type: 'internal';
  author: 'Lv.B';
  updatedAt: string;
  heroImage: GameImage;
  localizedBody: Readonly<Record<Locale, NewsArticleBody>>;
}

export type NewsItem = ExternalNewsItem | InternalNewsItem;
