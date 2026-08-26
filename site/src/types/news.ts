import type { Locale } from '../i18n/config';
import type { GameImage, GameSlug } from './game';

export type NewsKind = 'studio-update' | 'development-update' | 'announcement' | 'interview' | 'press-coverage' | 'blog-review' | 'feature';

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
  links?: readonly NewsArticleLink[];
}

export interface NewsArticleLink {
  label: string;
  href: string;
  external?: boolean;
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
  game: GameSlug;
  socialImage: GameSlug;
  sourceUrls?: readonly string[];
  localizedBody: Readonly<Record<Locale, NewsArticleBody>>;
}

export type NewsItem = ExternalNewsItem | InternalNewsItem;
