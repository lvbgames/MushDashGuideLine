import { siteConfig } from '../config/site';
import { company } from './company';
import { contactPolicy } from './contact';
import { socialLinks } from './socialLinks';

const rootUrl = `${siteConfig.url}/`;
const websiteId = `${siteConfig.url}/#website`;
const organizationId = `${siteConfig.url}/#organization`;

export const rootStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: rootUrl,
      name: company.name,
      alternateName: company.alternateName,
      publisher: {
        '@id': organizationId
      },
      inLanguage: siteConfig.defaultLocale
    },
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: company.name,
      alternateName: company.alternateName,
      url: rootUrl,
      logo: `${siteConfig.url}/brand/lvb-logo.png`,
      email: contactPolicy.businessEmail,
      address: {
        '@type': 'PostalAddress',
        ...company.postalAddress
      },
      sameAs: socialLinks.filter((link) => link.enabled).map((link) => link.url)
    }
  ]
} as const;

export const rootStructuredDataJson = JSON.stringify(rootStructuredData).replace(/</g, '\\u003c');
