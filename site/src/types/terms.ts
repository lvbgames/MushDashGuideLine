import type { Locale } from '../i18n/config';

export const termsSectionIds = [
  'scope',
  'definitions',
  'notice-changes',
  'platform-terms',
  'license-ip',
  'accounts-online',
  'user-obligations',
  'service-changes',
  'online-termination',
  'game-data',
  'purchases-refunds',
  'external-services',
  'privacy',
  'restrictions-liability',
  'law-disputes',
  'contact-dates'
] as const;

export type TermsSectionId = (typeof termsSectionIds)[number];

export interface TermsLink {
  label: string;
  href: string;
}

export interface TermsSection {
  id: TermsSectionId;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  links?: readonly TermsLink[];
}

export interface TermsDocumentContent {
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
  contactCardTitle: string;
  contactLabels: {
    name: string;
    website: string;
    email: string;
    privacy: string;
  };
  privacyLabel: string;
  sections: readonly TermsSection[];
}
