export type ContactCategory =
  | 'business'
  | 'partnership'
  | 'events'
  | 'creators'
  | 'press'
  | 'general';

export interface ContactPolicy {
  businessEmail: string;
  businessCategories: readonly ContactCategory[];
  discordUrl: string | null;
}
