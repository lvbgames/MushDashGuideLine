import type { Locale } from '../i18n/config';

export const privacySectionIds = [
  'scope',
  'controller',
  'purposes',
  'data-categories',
  'email-inquiries',
  'games-platforms',
  'retention',
  'deletion',
  'third-party-disclosure',
  'processors',
  'external-services',
  'international-processing',
  'automatic-data',
  'children',
  'rights',
  'security',
  'contact',
  'remedies',
  'changes'
] as const;

export type PrivacySectionId = (typeof privacySectionIds)[number];

export interface PrivacyLink {
  label: string;
  href: string;
}

export interface PrivacySection {
  id: PrivacySectionId;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  links?: readonly PrivacyLink[];
}

export interface PrivacyDocumentContent {
  locale: Locale;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  summary: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  lastUpdatedDisplay: string;
  effectiveDateLabel: string;
  effectiveDate: string;
  effectiveDateDisplay: string;
  tableOfContentsLabel: string;
  externalLinkLabel: string;
  controllerCardTitle: string;
  controllerLabels: {
    name: string;
    location: string;
    website: string;
    email: string;
  };
  sections: readonly PrivacySection[];
}
