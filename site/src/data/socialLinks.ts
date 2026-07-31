import type { SocialLink } from '../types/social';

export const socialLinks: readonly SocialLink[] = [
  {
    id: 'x',
    label: 'X',
    url: 'https://x.com/Lv_B_Games',
    enabled: true,
    source: 'User-verified official link',
    lastVerifiedAt: '2026-07-31'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/lv.b_games/',
    enabled: true,
    source: 'User-verified official link',
    lastVerifiedAt: '2026-07-31'
  },
  {
    id: 'discord',
    label: 'Discord',
    url: 'https://discord.gg/yuphyAWWUr',
    enabled: true,
    source: 'User-verified official link',
    lastVerifiedAt: '2026-07-31'
  },
  {
    id: 'steam-developer',
    label: 'Steam Developer Page',
    url: 'https://store.steampowered.com/search/?developer=Lv.B',
    enabled: true,
    source: 'User-verified official link',
    lastVerifiedAt: '2026-07-31'
  }
];
