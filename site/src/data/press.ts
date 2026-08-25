import type { PressAsset, PressDownload, PressMedia, PressTranslations } from '../types/press';

export const pressAssets: readonly PressAsset[] = [
  { id: 'horizontal-logo', path: '/press/assets/brand/lvb-logo-horizontal-transparent.png', width: 1876, height: 769, downloadName: 'lvb-logo-horizontal-transparent.png' },
  { id: 'stacked-logo', path: '/press/assets/brand/lvb-logo-stacked-transparent.png', width: 1052, height: 1213, downloadName: 'lvb-logo-stacked-transparent.png' },
  { id: 'symbol', path: '/press/assets/brand/lvb-symbol-transparent.png', width: 1024, height: 1024, downloadName: 'lvb-symbol-transparent.png' }
];

export const pressMedia: readonly PressMedia[] = [
  {
    id: 'mushhero-keyart-primary', game: 'mushhero', path: '/press/assets/mushhero/mushhero-keyart-primary.jpg', width: 1920, height: 1080,
    sha256: '028EC8FFA2FFE42682D8D1AD3C7684BFB4EC675DB63FE62A6D02266CF4D81376',
    alt: { en: 'MushHero key art', ko: 'MushHero 대표 키아트', ja: 'MushHero キーアート', 'zh-cn': 'MushHero 主视觉图' }
  },
  {
    id: 'mushhero-press-wide', game: 'mushhero', path: '/press/assets/mushhero/mushhero-press-wide-1920.jpg', width: 1920, height: 620,
    sha256: 'F1DC15B8AA03B9B56E54D32011B2F64292FD809515883C3AA4FA33DBB0DD395E',
    alt: { en: 'MushHero town panorama', ko: 'MushHero 마을 전경', ja: 'MushHero の街のパノラマ', 'zh-cn': 'MushHero 城镇全景' }
  },
  {
    id: 'mushhero-screenshot-01', game: 'mushhero', path: '/press/assets/mushhero/mushhero-screenshot-01.jpg', width: 1920, height: 1080,
    sha256: '88A96824E6769553EE9C74EE2EBB0F64B0D52A95807A6213AB849DD7B2CF2DAD',
    alt: { en: 'MushHero boss battle screenshot', ko: 'MushHero 보스 전투 스크린샷', ja: 'MushHero ボス戦のスクリーンショット', 'zh-cn': 'MushHero 首领战游戏截图' }
  },
  {
    id: 'mushhero-screenshot-02', game: 'mushhero', path: '/press/assets/mushhero/mushhero-screenshot-02.jpg', width: 1920, height: 1080,
    sha256: 'B126E858CBE7FC025311C756138C1C344937441D9DA65DE52C901C3852BF26EB',
    alt: { en: 'MushHero town screenshot', ko: 'MushHero 마을 스크린샷', ja: 'MushHero の街のスクリーンショット', 'zh-cn': 'MushHero 城镇游戏截图' }
  },
  {
    id: 'mushhero-screenshot-03', game: 'mushhero', path: '/press/assets/mushhero/mushhero-screenshot-03.jpg', width: 1920, height: 1080,
    sha256: '86ABE54FAE0BD873492426CB03D5D7F686C37E23F3C0127DF0B4151EC6416190',
    alt: { en: 'MushHero wave battle screenshot', ko: 'MushHero 웨이브 전투 스크린샷', ja: 'MushHero ウェーブ戦のスクリーンショット', 'zh-cn': 'MushHero 波次战斗游戏截图' }
  },
  {
    id: 'mushdash-keyart-primary', game: 'mushdash', path: '/press/assets/mushdash/mushdash-keyart-primary.jpg', width: 1920, height: 1080,
    sha256: '82C2529AE443F29BC1CDD8F9EB6A65BBFD8B49012D686195933D2C9177FBDD65',
    alt: { en: 'MushDash key art', ko: 'MushDash 대표 키아트', ja: 'MushDash キーアート', 'zh-cn': 'MushDash 主视觉图' }
  },
  {
    id: 'mushdash-press-wide', game: 'mushdash', path: '/press/assets/mushdash/mushdash-press-wide-1920.jpg', width: 1920, height: 620,
    sha256: 'BB07BC36DA6412C7F728AF8D08B8A2E6DFB0CFA7DAC33BCB878FEFC3CC21B3A9',
    alt: { en: 'MushDash character panorama', ko: 'MushDash 캐릭터 전경', ja: 'MushDash キャラクターのパノラマ', 'zh-cn': 'MushDash 角色全景图' }
  },
  {
    id: 'mushdash-promo-01', game: 'mushdash', path: '/press/assets/mushdash/mushdash-promo-01.jpg', width: 800, height: 450,
    sha256: '2A57A43FBCDA4B194B984E894812CC6E2DEF51465942B3AB6E82C5EB7B9F6B39',
    alt: { en: 'MushDash promotional image 1', ko: 'MushDash 프로모션 이미지 1', ja: 'MushDash プロモーション画像 1', 'zh-cn': 'MushDash 宣传图片 1' }
  },
  {
    id: 'mushdash-promo-02', game: 'mushdash', path: '/press/assets/mushdash/mushdash-promo-02.jpg', width: 800, height: 450,
    sha256: '066C37C5FEFC6D866DAA0CF98533CEEB5EB544C7B2B221F798AAD580A37F6D30',
    alt: { en: 'MushDash promotional image 2', ko: 'MushDash 프로모션 이미지 2', ja: 'MushDash プロモーション画像 2', 'zh-cn': 'MushDash 宣传图片 2' }
  },
  {
    id: 'mushdash-promo-03', game: 'mushdash', path: '/press/assets/mushdash/mushdash-promo-03.jpg', width: 800, height: 450,
    sha256: '2418780B7F0A04005553803190F1FD228C7325F0E73CF0602C54D1BD7318F7DB',
    alt: { en: 'MushDash promotional image 3', ko: 'MushDash 프로모션 이미지 3', ja: 'MushDash プロモーション画像 3', 'zh-cn': 'MushDash 宣传图片 3' }
  }
];

export const pressDownloads: readonly PressDownload[] = [
  { id: 'brand', path: '/press/downloads/lvb-brand-assets.zip', fileName: 'lvb-brand-assets.zip', bytes: 255565, sha256: '035DEF47F8B06BF19ABC5855475FC4EC44D12DAC0C78584C711E2C1E19A6367F', contents: '5 PNG' },
  { id: 'mushhero', path: '/press/downloads/mushhero-press-kit.zip', fileName: 'mushhero-press-kit.zip', bytes: 2300078, sha256: 'CC05D7A934288FF39BC5902AAA4AB35A346C9AF817AF1ABCD3E3BEBA973CCE2C', contents: '6 JPG + 1 PNG' },
  { id: 'mushdash', path: '/press/downloads/mushdash-press-kit.zip', fileName: 'mushdash-press-kit.zip', bytes: 914628, sha256: 'FA846A03159BCE14DA55BA9604A5AD509AED49DA7394E36EAFE3555C82093890', contents: '5 JPG + 1 PNG' }
];

export const pressTranslations: PressTranslations = {
  en: {
    navLabel: 'Press Kit',
    metaTitle: 'Press Kit — Lv.B',
    metaDescription: 'Official Lv.B studio information, game facts, brand assets, screenshots and press contact.',
    heroEyebrow: 'Press Kit',
    heroTitle: 'Lv.B Press Kit',
    heroDescription: 'Official studio information, game facts, brand assets, screenshots and media contact details for coverage of Lv.B and its games.',
    aboutEyebrow: 'About the studio',
    aboutTitle: 'About Lv.B',
    copyBoilerplate: 'Copy boilerplate',
    copiedBoilerplate: 'Copied',
    copyFailed: 'Copy failed',
    gamesEyebrow: 'Current games',
    gamesTitle: 'MushHero and MushDash',
    gameGenres: { mushhero: 'Cooperative Roguelite Defense', mushdash: 'Online Party Racing' },
    brandEyebrow: 'Brand assets',
    brandTitle: 'Lv.B logos',
    brandDescription: 'For editorial and press coverage of Lv.B and its games.',
    assetLabels: { 'horizontal-logo': 'Lv.B horizontal logo', 'stacked-logo': 'Lv.B stacked logo', symbol: 'Lv.B symbol' },
    openOriginal: 'Open original',
    downloadPng: 'Download PNG',
    downloadOriginal: 'Download original',
    downloadsEyebrow: 'Media downloads',
    downloadsTitle: 'Download press materials',
    downloadZip: 'Download ZIP',
    downloadLabels: { brand: 'Lv.B Brand Assets', mushhero: 'MushHero Press Kit', mushdash: 'MushDash Press Kit' },
    downloadDescriptions: { brand: 'Official transparent Lv.B logos, symbol and brand preview images.', mushhero: 'Official key art, logo, press image and gameplay screenshots.', mushdash: 'Official key art, logo, press image and promotional images.' },
    screenshotsEyebrow: 'Official media',
    screenshotsTitle: 'Game images',
    factsEyebrow: 'At a glance',
    factsTitle: 'Key facts',
    factLabels: { studio: 'Studio', basedIn: 'Based in', currentGames: 'Current games', website: 'Website', contact: 'Business / Press contact' },
    basedInValue: 'Busan, South Korea',
    contactEyebrow: 'Press contact',
    contactTitle: 'Press & Interviews',
    contactDescription: 'For articles, reporting and interviews concerning Lv.B or its games, contact the studio directly by email.',
    contactCta: 'Email Lv.B',
    pressKitCta: 'View Press Kit'
  },
  ko: {
    navLabel: '프레스 키트',
    metaTitle: '프레스 키트 — Lv.B',
    metaDescription: 'Lv.B 스튜디오와 게임의 공식 정보, 브랜드 자료, 스크린샷과 언론 문의처를 확인하세요.',
    heroEyebrow: 'Press Kit',
    heroTitle: 'Lv.B 프레스 키트',
    heroDescription: 'Lv.B와 게임을 소개하는 데 필요한 공식 스튜디오 정보, 게임 자료, 브랜드 자산, 스크린샷과 미디어 연락처를 제공합니다.',
    aboutEyebrow: '스튜디오 소개',
    aboutTitle: 'Lv.B 소개',
    copyBoilerplate: '소개문 복사',
    copiedBoilerplate: '복사됨',
    copyFailed: '복사하지 못했습니다',
    gamesEyebrow: '현재 게임',
    gamesTitle: 'MushHero와 MushDash',
    gameGenres: { mushhero: '협동 로그라이트 디펜스', mushdash: '온라인 파티 레이스' },
    brandEyebrow: '브랜드 자료',
    brandTitle: 'Lv.B 로고',
    brandDescription: 'Lv.B와 게임에 관한 기사 및 보도 목적으로 사용할 수 있습니다.',
    assetLabels: { 'horizontal-logo': 'Lv.B 가로 로고', 'stacked-logo': 'Lv.B 세로 로고', symbol: 'Lv.B 심볼' },
    openOriginal: '원본 열기',
    downloadPng: 'PNG 다운로드',
    downloadOriginal: '원본 다운로드',
    downloadsEyebrow: '미디어 다운로드',
    downloadsTitle: '보도 자료 다운로드',
    downloadZip: 'ZIP 다운로드',
    downloadLabels: { brand: 'Lv.B 브랜드 자산', mushhero: 'MushHero 프레스 키트', mushdash: 'MushDash 프레스 키트' },
    downloadDescriptions: { brand: 'Lv.B 투명 로고, 심볼과 브랜드 미리보기 이미지입니다.', mushhero: '공식 키아트, 로고, 언론용 이미지와 게임플레이 스크린샷입니다.', mushdash: '공식 키아트, 로고, 언론용 이미지와 프로모션 이미지입니다.' },
    screenshotsEyebrow: '공식 미디어',
    screenshotsTitle: '게임 이미지',
    factsEyebrow: '한눈에 보기',
    factsTitle: '주요 정보',
    factLabels: { studio: '스튜디오', basedIn: '소재지', currentGames: '현재 게임', website: '웹사이트', contact: '비즈니스·언론 문의' },
    basedInValue: '대한민국 부산',
    contactEyebrow: '언론 문의',
    contactTitle: '언론·기사·인터뷰',
    contactDescription: 'Lv.B와 게임에 관한 기사, 취재, 인터뷰 문의는 스튜디오 이메일로 직접 보내 주세요.',
    contactCta: 'Lv.B에 이메일 보내기',
    pressKitCta: '프레스 키트 보기'
  },
  ja: {
    navLabel: 'プレスキット',
    metaTitle: 'プレスキット — Lv.B',
    metaDescription: 'Lv.Bとゲームの公式情報、ブランド素材、スクリーンショット、メディア向け連絡先をご案内します。',
    heroEyebrow: 'Press Kit',
    heroTitle: 'Lv.Bプレスキット',
    heroDescription: 'Lv.Bとゲームをご紹介いただく際に必要なスタジオ情報、ゲーム資料、ブランド素材、スクリーンショット、メディア向け連絡先をまとめています。',
    aboutEyebrow: 'スタジオ紹介',
    aboutTitle: 'Lv.Bについて',
    copyBoilerplate: '紹介文をコピー',
    copiedBoilerplate: 'コピーしました',
    copyFailed: 'コピーできませんでした',
    gamesEyebrow: '開発中・配信中のゲーム',
    gamesTitle: 'MushHeroとMushDash',
    gameGenres: { mushhero: '協力型ローグライトディフェンス', mushdash: 'オンラインパーティーレース' },
    brandEyebrow: 'ブランド素材',
    brandTitle: 'Lv.Bロゴ',
    brandDescription: 'Lv.Bおよびゲームに関する記事・報道でご利用いただけます。',
    assetLabels: { 'horizontal-logo': 'Lv.B横組みロゴ', 'stacked-logo': 'Lv.B縦組みロゴ', symbol: 'Lv.Bシンボル' },
    openOriginal: '原寸画像を開く',
    downloadPng: 'PNGをダウンロード',
    downloadOriginal: '原寸画像をダウンロード',
    downloadsEyebrow: 'メディア素材',
    downloadsTitle: 'プレス素材をダウンロード',
    downloadZip: 'ZIPをダウンロード',
    downloadLabels: { brand: 'Lv.Bブランド素材', mushhero: 'MushHeroプレスキット', mushdash: 'MushDashプレスキット' },
    downloadDescriptions: { brand: 'Lv.Bの透過ロゴ、シンボル、ブランドプレビュー画像です。', mushhero: '公式キーアート、ロゴ、プレス画像、ゲームプレイ画像です。', mushdash: '公式キーアート、ロゴ、プレス画像、プロモーション画像です。' },
    screenshotsEyebrow: '公式メディア',
    screenshotsTitle: 'ゲーム画像',
    factsEyebrow: '基本情報',
    factsTitle: 'Key Facts',
    factLabels: { studio: 'スタジオ', basedIn: '拠点', currentGames: '現在のゲーム', website: 'ウェブサイト', contact: 'ビジネス・メディア窓口' },
    basedInValue: '韓国・釜山',
    contactEyebrow: 'メディア窓口',
    contactTitle: '記事・取材・インタビュー',
    contactDescription: 'Lv.Bやゲームに関する記事、取材、インタビューについては、スタジオまでメールでお問い合わせください。',
    contactCta: 'Lv.Bへメールする',
    pressKitCta: 'プレスキットを見る'
  },
  'zh-cn': {
    navLabel: '媒体资料包',
    metaTitle: '媒体资料包 — Lv.B',
    metaDescription: '查看 Lv.B 与旗下游戏的官方信息、品牌素材、游戏截图及媒体联系方式。',
    heroEyebrow: 'Press Kit',
    heroTitle: 'Lv.B 媒体资料包',
    heroDescription: '为介绍 Lv.B 及旗下游戏的记者、媒体、内容创作者与活动相关人士提供官方工作室信息、游戏资料、品牌素材、截图和联系方式。',
    aboutEyebrow: '工作室介绍',
    aboutTitle: '关于 Lv.B',
    copyBoilerplate: '复制工作室简介',
    copiedBoilerplate: '已复制',
    copyFailed: '复制失败',
    gamesEyebrow: '当前游戏',
    gamesTitle: 'MushHero 与 MushDash',
    gameGenres: { mushhero: '合作 Roguelite 防守游戏', mushdash: '在线派对竞速' },
    brandEyebrow: '品牌素材',
    brandTitle: 'Lv.B 标志',
    brandDescription: '可用于 Lv.B 及旗下游戏的编辑与媒体报道。',
    assetLabels: { 'horizontal-logo': 'Lv.B 横版标志', 'stacked-logo': 'Lv.B 竖版标志', symbol: 'Lv.B 图形标志' },
    openOriginal: '打开原图',
    downloadPng: '下载 PNG',
    downloadOriginal: '下载原图',
    downloadsEyebrow: '媒体素材下载',
    downloadsTitle: '下载媒体资料',
    downloadZip: '下载 ZIP',
    downloadLabels: { brand: 'Lv.B 品牌素材', mushhero: 'MushHero 媒体资料包', mushdash: 'MushDash 媒体资料包' },
    downloadDescriptions: { brand: '包含 Lv.B 透明背景标志、图形标志和品牌预览图片。', mushhero: '包含官方主视觉图、标志、媒体图片和游戏截图。', mushdash: '包含官方主视觉图、标志、媒体图片和宣传图片。' },
    screenshotsEyebrow: '官方媒体素材',
    screenshotsTitle: '游戏图片',
    factsEyebrow: '基本信息',
    factsTitle: '关键信息',
    factLabels: { studio: '工作室', basedIn: '所在地', currentGames: '当前游戏', website: '网站', contact: '商务与媒体联系' },
    basedInValue: '韩国釜山',
    contactEyebrow: '媒体联系',
    contactTitle: '媒体报道与采访',
    contactDescription: '如需就 Lv.B 或旗下游戏进行报道、采访或撰写文章，请通过电子邮件直接联系工作室。',
    contactCta: '发送邮件给 Lv.B',
    pressKitCta: '查看媒体资料包'
  }
};
