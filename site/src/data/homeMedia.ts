import type { GameSlug } from '../types/game';

interface HomeSourceScreenshot {
  game: GameSlug;
  path: string;
  sourceUrl: string;
  width: number;
  height: number;
  sha256: string;
}

export const homeSourceScreenshots: readonly HomeSourceScreenshot[] = [
  { game: 'mushhero', path: '/press/assets/mushhero/mushhero-01.jpg', sourceUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/2bd506a8530d829461a9dd09474bf75dbbe9d8f2/ss_2bd506a8530d829461a9dd09474bf75dbbe9d8f2.1920x1080.jpg?t=1782291404', width: 1920, height: 1080, sha256: '484B07E40D88556C53425222C1FCE4A9953DAA8A21AEA83CE33964060E106077' },
  { game: 'mushhero', path: '/press/assets/mushhero/mushhero-02.jpg', sourceUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/f96a767c38c8d9b7baf269e049acd6f20744b8f2/ss_f96a767c38c8d9b7baf269e049acd6f20744b8f2.1920x1080.jpg?t=1782291404', width: 1920, height: 1080, sha256: '13741FE3995FBC4FB8D84453BAB191B700AAF0823C4DA3D44E62CD3ED7CD37AF' },
  { game: 'mushhero', path: '/press/assets/mushhero/mushhero-03.jpg', sourceUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/da2fffa5e4c7162cb00c418bb963e1865329ee95/ss_da2fffa5e4c7162cb00c418bb963e1865329ee95.1920x1080.jpg?t=1782291404', width: 1920, height: 1080, sha256: '3CE54AC177C4A2D4CC7578B39904E97CB5C62CD995532DA8B4BDBBE193C50E90' },
  { game: 'mushdash', path: '/press/assets/mushdash/mushdash-01.jpg', sourceUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/7966ab2fd72923decd51e216d4924880e9e1382e/ss_7966ab2fd72923decd51e216d4924880e9e1382e.1920x1080.jpg?t=1781498090', width: 1920, height: 1080, sha256: '6B22EE5A5218B4EFA03ED05F86ABC5D5104995CD84CCE53B8877F7511165C4E4' },
  { game: 'mushdash', path: '/press/assets/mushdash/mushdash-02.jpg', sourceUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/512f8f3be28f4ee7832a47d06460d8eb9e1e3ea0/ss_512f8f3be28f4ee7832a47d06460d8eb9e1e3ea0.1920x1080.jpg?t=1781498090', width: 1920, height: 1080, sha256: '3F7E7C093C0430F7E87DB2ECF9E3C64E88D8DE081C2A6843F15774EC434D55F9' },
  { game: 'mushdash', path: '/press/assets/mushdash/mushdash-03.jpg', sourceUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/92c6b9367ee79a2b56ed98a67df94c1b3043207d/ss_92c6b9367ee79a2b56ed98a67df94c1b3043207d.1920x1080.jpg?t=1781498090', width: 1920, height: 1080, sha256: '10D6AD2513F92DE008B61BA969B4FD8D7C293D90199E151383E6B01FB698BADB' }
];

const homeResponsiveImages = {
  '/press/assets/mushhero/mushhero-01.jpg': '/home/assets/mushhero-01',
  '/press/assets/mushhero/mushhero-02.jpg': '/home/assets/mushhero-02',
  '/press/assets/mushhero/mushhero-03.jpg': '/home/assets/mushhero-03',
  '/press/assets/mushdash/mushdash-01.jpg': '/home/assets/mushdash-01',
  '/press/assets/mushdash/mushdash-02.jpg': '/home/assets/mushdash-02'
} as const;

export const getHomeImageSrcSet = (source: string): string | undefined => {
  const basePath = homeResponsiveImages[source as keyof typeof homeResponsiveImages];
  return basePath
    ? `${basePath}-640.webp 640w, ${basePath}-1280.webp 1280w`
    : undefined;
};
