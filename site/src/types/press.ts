import type { Locale } from '../i18n/config';
import type { GameSlug } from './game';

export interface PressAsset {
  id: 'full-logo' | 'symbol';
  path: string;
  width: number;
  height: number;
  downloadName: string;
}

export interface PressScreenshot {
  game: GameSlug;
  path: string;
  sourceUrl: string;
  width: number;
  height: number;
  sha256: string;
}

export type PressDownloadId = 'brand' | 'mushhero' | 'mushdash';

export interface PressDownload {
  id: PressDownloadId;
  path: string;
  fileName: string;
  bytes: number;
  sha256: string;
  contents: string;
}

export interface PressTranslation {
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  aboutEyebrow: string;
  aboutTitle: string;
  copyBoilerplate: string;
  copiedBoilerplate: string;
  copyFailed: string;
  gamesEyebrow: string;
  gamesTitle: string;
  gameGenres: Readonly<Record<'mushhero' | 'mushdash', string>>;
  brandEyebrow: string;
  brandTitle: string;
  brandDescription: string;
  assetLabels: Readonly<Record<PressAsset['id'], string>>;
  openOriginal: string;
  downloadPng: string;
  downloadOriginal: string;
  downloadsEyebrow: string;
  downloadsTitle: string;
  downloadZip: string;
  downloadLabels: Readonly<Record<PressDownloadId, string>>;
  downloadDescriptions: Readonly<Record<PressDownloadId, string>>;
  screenshotsEyebrow: string;
  screenshotsTitle: string;
  factsEyebrow: string;
  factsTitle: string;
  factLabels: {
    studio: string;
    basedIn: string;
    currentGames: string;
    website: string;
    contact: string;
  };
  basedInValue: string;
  recentEyebrow: string;
  recentTitle: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  contactCta: string;
  pressKitCta: string;
}

export type PressTranslations = Readonly<Record<Locale, PressTranslation>>;
