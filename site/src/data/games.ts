import type { Game } from '../types/game';
import siteFacts from './siteFacts.json';

const { mushhero, mushdash } = siteFacts.games;

export const games: readonly Game[] = [
  {
    slug: 'mushhero',
    title: mushhero.name,
    status: 'unknown',
    priority: 'primary',
    releaseStatus: mushhero.releaseStatus as Game['releaseStatus'],
    releaseDisplay: mushhero.releaseDisplay,
    releaseDate: mushhero.releaseDate,
    developer: mushhero.developer,
    publisher: mushhero.publisher,
    genres: mushhero.storeGenres,
    detailTags: {},
    steamAppId: mushhero.steamAppId,
    steamStoreUrl: mushhero.steamStoreUrl,
    epicStoreUrl: mushhero.epicStoreUrl,
    youtubeTrailerUrl: null,
    videoTitleKey: null,
    videoPoster: null,
    logo: {
      src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/591835025e8ee5097871491ff79afd28ed89910e/capsule_231x87.jpg?t=1782291404',
      width: 231,
      height: 87,
      aspectRatio: 2.6552,
      altKey: 'MushHero Steam capsule',
      purpose: 'capsule',
      sourcePage: 'https://store.steampowered.com/app/4711200/MushHero/',
      lastVerifiedAt: '2026-07-30'
    },
    heroImage: {
      src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/1570c7c45f8e71140483f1391452bcee3fe87a7d/header.jpg?t=1782291404',
      width: 460,
      height: 215,
      aspectRatio: 2.1395,
      altKey: 'MushHero Steam header',
      purpose: 'hero',
      sourcePage: 'https://store.steampowered.com/app/4711200/MushHero/',
      lastVerifiedAt: '2026-07-30'
    },
    screenshots: [
      {
        src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/2bd506a8530d829461a9dd09474bf75dbbe9d8f2/ss_2bd506a8530d829461a9dd09474bf75dbbe9d8f2.1920x1080.jpg?t=1782291404',
        width: 1920,
        height: 1080,
        aspectRatio: 1.7778,
        altKey: 'MushHero Steam screenshot 1',
        purpose: 'screenshot',
        sourcePage: 'https://store.steampowered.com/app/4711200/MushHero/',
        lastVerifiedAt: '2026-07-30'
      },
      {
        src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/f96a767c38c8d9b7baf269e049acd6f20744b8f2/ss_f96a767c38c8d9b7baf269e049acd6f20744b8f2.1920x1080.jpg?t=1782291404',
        width: 1920,
        height: 1080,
        aspectRatio: 1.7778,
        altKey: 'MushHero Steam screenshot 2',
        purpose: 'screenshot',
        sourcePage: 'https://store.steampowered.com/app/4711200/MushHero/',
        lastVerifiedAt: '2026-07-30'
      },
      {
        src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/da2fffa5e4c7162cb00c418bb963e1865329ee95/ss_da2fffa5e4c7162cb00c418bb963e1865329ee95.1920x1080.jpg?t=1782291404',
        width: 1920,
        height: 1080,
        aspectRatio: 1.7778,
        altKey: 'MushHero Steam screenshot 3',
        purpose: 'screenshot',
        sourcePage: 'https://store.steampowered.com/app/4711200/MushHero/',
        lastVerifiedAt: '2026-07-30'
      }
    ],
    sourceText: 'MushHero is a cooperative roguelite defense game where players fight together against waves of monsters and powerful bosses. Build unique strategies through randomized weapons, evolving skills, and a node-based progression system that creates a different combat experience every run.',
    homepageDescription: null,
    localizedDescription: {},
    platforms: mushhero.platforms
  },
  {
    slug: 'mushdash',
    title: mushdash.name,
    status: 'unknown',
    priority: 'secondary',
    releaseStatus: mushdash.releaseStatus as Game['releaseStatus'],
    releaseDisplay: mushdash.releaseDisplay,
    releaseDate: mushdash.releaseDate,
    developer: mushdash.developer,
    publisher: mushdash.publisher,
    genres: mushdash.storeGenres,
    detailTags: {
      en: ['Online Party Race', 'Platformer', 'Up to 7 Players', 'Obstacle Courses'],
      ko: ['온라인 파티 레이스', '플랫포머', '최대 7인', '장애물 코스'],
      ja: ['オンラインパーティーレース', 'プラットフォーマー', '最大7人', '障害物コース'],
      'zh-cn': ['在线派对竞速', '平台跳跃', '最多7人', '障碍赛道']
    },
    steamAppId: mushdash.steamAppId,
    steamStoreUrl: mushdash.steamStoreUrl,
    epicStoreUrl: mushdash.epicStoreUrl,
    youtubeTrailerUrl: null,
    videoTitleKey: null,
    videoPoster: null,
    logo: {
      src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/5b4046ddd502d7dc2abec101c77944b59768fef9/capsule_231x87.jpg?t=1781498090',
      width: 231,
      height: 87,
      aspectRatio: 2.6552,
      altKey: 'MushDash Steam capsule',
      purpose: 'capsule',
      sourcePage: 'https://store.steampowered.com/app/3153140/Mush_Dash/',
      lastVerifiedAt: '2026-07-30'
    },
    heroImage: {
      src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/59a9e6e12de116d0e616c4d2b8cb37e8d40b65c3/header.jpg?t=1781498090',
      width: 460,
      height: 215,
      aspectRatio: 2.1395,
      altKey: 'MushDash Steam header',
      purpose: 'hero',
      sourcePage: 'https://store.steampowered.com/app/3153140/Mush_Dash/',
      lastVerifiedAt: '2026-07-30'
    },
    screenshots: [
      {
        src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/7966ab2fd72923decd51e216d4924880e9e1382e/ss_7966ab2fd72923decd51e216d4924880e9e1382e.1920x1080.jpg?t=1781498090',
        width: 1920,
        height: 1080,
        aspectRatio: 1.7778,
        altKey: 'MushDash Steam screenshot 1',
        purpose: 'screenshot',
        sourcePage: 'https://store.steampowered.com/app/3153140/Mush_Dash/',
        lastVerifiedAt: '2026-07-30'
      },
      {
        src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/512f8f3be28f4ee7832a47d06460d8eb9e1e3ea0/ss_512f8f3be28f4ee7832a47d06460d8eb9e1e3ea0.1920x1080.jpg?t=1781498090',
        width: 1920,
        height: 1080,
        aspectRatio: 1.7778,
        altKey: 'MushDash Steam screenshot 2',
        purpose: 'screenshot',
        sourcePage: 'https://store.steampowered.com/app/3153140/Mush_Dash/',
        lastVerifiedAt: '2026-07-30'
      },
      {
        src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/92c6b9367ee79a2b56ed98a67df94c1b3043207d/ss_92c6b9367ee79a2b56ed98a67df94c1b3043207d.1920x1080.jpg?t=1781498090',
        width: 1920,
        height: 1080,
        aspectRatio: 1.7778,
        altKey: 'MushDash Steam screenshot 3',
        purpose: 'screenshot',
        sourcePage: 'https://store.steampowered.com/app/3153140/Mush_Dash/',
        lastVerifiedAt: '2026-07-30'
      }
    ],
    sourceText: 'Cute mushrooms are running for their lives in a chaotic online party race! Dash, jump and dodge deadly traps with up to 7 players, read tricky bomb patterns, collect Mushroom Coins and claim the final crown before you end up as an ingredient.',
    homepageDescription: null,
    localizedDescription: {},
    platforms: mushdash.platforms
  }
];
