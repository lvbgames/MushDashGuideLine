import type { ContactPolicy } from '../types/contact';
import siteFacts from './siteFacts.json';

const discordUrl = siteFacts.studio.socialLinks.find((link) => link.id === 'discord')?.url ?? null;

export const contactPolicy: ContactPolicy = {
  businessEmail: siteFacts.studio.pressEmail,
  businessCategories: ['business', 'partnership', 'events', 'creators', 'press', 'general'],
  discordUrl
};
