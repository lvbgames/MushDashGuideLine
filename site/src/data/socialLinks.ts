import type { SocialLink, SocialPlatform } from '../types/social';
import siteFacts from './siteFacts.json';

export const socialLinks: readonly SocialLink[] = siteFacts.studio.socialLinks.map((link) => ({
  ...link,
  id: link.id as SocialPlatform
}));
