export type SocialPlatform = 'x' | 'reddit' | 'instagram' | 'discord' | 'steam-developer' | 'youtube';

export interface SocialLink {
  id: SocialPlatform;
  label: string;
  url: string | null;
  enabled: boolean;
  source: string | null;
  lastVerifiedAt: string | null;
}
