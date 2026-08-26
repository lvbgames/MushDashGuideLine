import type { Locale } from '../i18n/config';

export type GameStatus = 'unknown';
export type GamePriority = 'primary' | 'secondary';
export type GameSlug = 'mushhero' | 'mushdash';
export type ReleaseStatus = 'upcoming' | 'early-access' | 'available';
export type MediaPurpose = 'hero' | 'capsule' | 'screenshot' | 'gallery';

export interface GameImage {
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  altKey: string;
  purpose: MediaPurpose;
  sourcePage: string;
  lastVerifiedAt: string;
}

export interface GameVideo {
  id: string;
  sourceUrl: string;
  embedUrl: string;
  poster: GameImage;
  title: Readonly<Record<Locale, string>>;
  description: Readonly<Record<Locale, string>>;
}

export interface Game {
  slug: GameSlug;
  title: string;
  status: GameStatus;
  priority: GamePriority;
  releaseStatus: ReleaseStatus;
  releaseDisplay: string;
  releaseDate: string | null;
  developer: string;
  publisher: string;
  genres: readonly string[];
  detailTags: Partial<Record<Locale, readonly string[]>>;
  steamAppId: number | null;
  steamStoreUrl: string | null;
  epicStoreUrl: string | null;
  videos: readonly GameVideo[];
  logo: GameImage | null;
  heroImage: GameImage | null;
  screenshots: readonly GameImage[];
  sourceText: string;
  homepageDescription: string | null;
  localizedDescription: Partial<Record<Locale, string>>;
  platforms: readonly string[];
}
