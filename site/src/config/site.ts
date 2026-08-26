import siteFacts from '../data/siteFacts.json';

export const siteConfig = {
  name: siteFacts.studio.name,
  url: siteFacts.studio.website.replace(/\/$/, ''),
  naverSiteVerification: 'f821633783a66dd8edb7025cb1d83caee98641aa',
  defaultLocale: 'en',
  supportedLocales: ['en', 'ko', 'ja', 'zh-cn']
} as const;
