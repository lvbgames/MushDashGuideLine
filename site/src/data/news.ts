import type { NewsItem } from '../types/news';

export const newsItems: readonly NewsItem[] = [
  {
    slug: 'bic-2026-field-review-velog',
    kind: 'blog-review',
    originalTitle: '부산 인디게임 커넥트 페스티벌 2026 후기',
    localizedTitle: {
      en: 'A Visit to Busan Indie Connect Festival 2026',
      ko: '부산 인디게임 커넥트 페스티벌 2026 후기',
      ja: 'Busan Indie Connect Festival 2026参加レポート',
      'zh-cn': '2026 釜山独立游戏节现场体验'
    },
    localizedSummary: {
      en: 'FinalForever visited BIC 2026 and played MushHero, recording impressions of its roguelite defense structure and keyboard-and-mouse controls.',
      ko: 'BIC 2026 현장을 방문한 FinalForever가 MushHero를 직접 플레이하고, 로그라이트 디펜스 구조와 키보드·마우스 기반 조작에 대한 체험을 기록했습니다.',
      ja: 'BIC 2026を訪れたFinalForever氏がMushHeroを試遊し、ローグライト・ディフェンスの構成とキーボード・マウス操作の感触を記録しています。',
      'zh-cn': 'FinalForever 到访 BIC 2026 并试玩 MushHero，记录了对 Roguelite 防守玩法结构以及键盘与鼠标操作体验的感受。'
    },
    publisher: 'Velog',
    author: 'FinalForever',
    publishedAt: '2026-08-19',
    sourceUrl: 'https://velog.io/@apollo/%EB%B6%80%EC%82%B0-%EC%9D%B8%EB%94%94%EA%B2%8C%EC%9E%84-%EC%BB%A4%EB%84%A5%ED%8A%B8-%ED%8E%98%EC%8A%A4%ED%8B%B0%EB%B2%8C-2026-%ED%9B%84%EA%B8%B0',
    lastVerifiedAt: '2026-08-21'
  },
  {
    slug: 'bic-2026-busan-global-game-center-gamefocus',
    kind: 'press-coverage',
    originalTitle: '상향 평준화된 인디게임 퀄리티, 다양한 플랫폼, 장르 담은 BIC 부산글로벌게임센터 부스',
    localizedTitle: {
      en: 'BIC Busan Global Game Center Booth Showcases Strong Indie Quality Across Platforms and Genres',
      ko: '상향 평준화된 인디게임 퀄리티, 다양한 플랫폼, 장르 담은 BIC 부산글로벌게임센터 부스',
      ja: 'クオリティが底上げされたインディーゲーム、多彩なプラットフォームとジャンルが集うBIC釜山グローバルゲームセンターブース',
      'zh-cn': '独立游戏品质全面提升，BIC 釜山全球游戏中心展位汇聚多平台、多类型作品'
    },
    localizedSummary: {
      en: 'GameFocus covered the Busan Global Game Center pavilion at BIC 2026 and included cooperative roguelite defense game MushHero among its varied lineup.',
      ko: '게임포커스가 BIC 2026 부산글로벌게임센터 공동관을 취재하며, 다양한 출품작 가운데 협동 로그라이트 디펜스 게임 MushHero를 소개했습니다.',
      ja: 'GameFocusがBIC 2026の釜山グローバルゲームセンター共同館を取材し、多彩な出展作の一つとして協力型ローグライト・ディフェンスゲームMushHeroを紹介しました。',
      'zh-cn': 'GameFocus 报道了 BIC 2026 釜山全球游戏中心联合展区，并在多款参展作品中介绍了合作 Roguelite 防守游戏 MushHero。'
    },
    publisher: '게임포커스',
    author: '이혁진',
    publishedAt: '2026-08-15',
    sourceUrl: 'https://www.gamefocus.co.kr/detail.php?number=178276',
    lastVerifiedAt: '2026-08-21'
  },
  {
    slug: 'bic-2026-participating-studios-busan-global-game-center',
    kind: 'feature',
    originalTitle: 'BIC 2026에서 만나는 부산 인디게임! 참가기업 소개',
    localizedTitle: {
      en: 'Meet Busan Indie Games at BIC 2026: Participating Studios',
      ko: 'BIC 2026에서 만나는 부산 인디게임! 참가기업 소개',
      ja: 'BIC 2026で出会う釜山インディーゲーム：出展企業紹介',
      'zh-cn': '相约 BIC 2026：釜山独立游戏参展团队介绍'
    },
    localizedSummary: {
      en: 'The Busan Global Game Center officially featured BIC 2026 participants, including Lv.B and its PC cooperative roguelite defense game MushHero.',
      ko: '부산글로벌게임센터가 BIC 2026 참가기업 소개 콘텐츠를 통해 Lv.B와 PC 협동 로그라이트 디펜스 게임 MushHero를 공식 소개했습니다.',
      ja: '釜山グローバルゲームセンターがBIC 2026の出展企業紹介で、Lv.BとPC向け協力型ローグライト・ディフェンスゲームMushHeroを公式に紹介しました。',
      'zh-cn': '釜山全球游戏中心在 BIC 2026 参展团队专题中，正式介绍了 Lv.B 及其 PC 合作 Roguelite 防守游戏 MushHero。'
    },
    publisher: '부산글로벌게임센터',
    publishedAt: '2026-08-12',
    sourceUrl: 'https://blog.naver.com/busangamecenter/224374095843',
    lastVerifiedAt: '2026-08-21'
  },
  {
    slug: 'bic-2026-new-steam-games-masa-kei',
    kind: 'feature',
    originalTitle: '初めて知った！BICで出会える新作Steamゲーム30作品',
    localizedTitle: {
      en: '30 New Steam Games to Discover at BIC',
      ko: 'BIC에서 처음 만나는 신작 Steam 게임 30선',
      ja: '初めて知った！BICで出会える新作Steamゲーム30作品',
      'zh-cn': '初次认识：BIC 值得关注的 30 款 Steam 新作'
    },
    localizedSummary: {
      en: 'Masa Kei featured MushHero among 30 Korean indie games headed to BIC 2026, listing it in the Public Indie section and noting planned Japanese support.',
      ko: 'Masa Kei가 BIC 2026 참가 예정작을 소개한 글에서 Public Indie 출품작 MushHero와 일본어 지원 예정 정보를 소개했습니다.',
      ja: 'Masa Kei氏がBIC 2026への出展予定作30本を紹介し、パブリックインディー部門のMushHeroと日本語対応予定について取り上げました。',
      'zh-cn': 'Masa Kei 在介绍 30 款 BIC 2026 参展游戏的文章中，将 MushHero 列入 Public Indie 单元，并提到游戏计划支持日语。'
    },
    publisher: 'note',
    author: 'Masa Kei',
    publishedAt: '2026-07-22',
    sourceUrl: 'https://note.com/masa_kei/n/n09cdb07cd058',
    lastVerifiedAt: '2026-08-21'
  },
  {
    slug: 'lvb-mushdash-mushhero-interview',
    kind: 'interview',
    originalTitle: '부산 인디 개발팀 Lv.B, 《MushDash》와 《MushHero》 게임 인터뷰',
    localizedTitle: {
      en: 'Interview with Busan Indie Team Lv.B on MushDash and MushHero',
      ko: '부산 인디 개발팀 Lv.B, 《MushDash》와 《MushHero》 게임 인터뷰',
      ja: '釜山のインディー開発チームLv.B、『MushDash』と『MushHero』を語る',
      'zh-cn': '釜山独立游戏团队 Lv.B：MushDash 与 MushHero 访谈'
    },
    localizedSummary: {
      en: 'An interview with Busan-based indie development team Lv.B about its games MushDash and MushHero.',
      ko: '부산 인디 개발팀 Lv.B가 MushDash와 MushHero를 소개하는 인터뷰입니다.',
      ja: '釜山を拠点とするインディー開発チームLv.Bが、MushDashとMushHeroについて紹介するインタビューです。',
      'zh-cn': '这篇访谈介绍了釜山独立游戏开发团队 Lv.B，以及旗下游戏 MushDash 与 MushHero。'
    },
    publisher: 'hashiruka48',
    publishedAt: '2026-05-21',
    sourceUrl: 'https://buymeacoffee.com/hashiruka48/lv-b-mushdash-mushhero',
    lastVerifiedAt: '2026-07-31'
  },
  {
    slug: 'busan-indie-studios-bic-2024-gamemeca',
    kind: 'press-coverage',
    originalTitle: '부산 인디 게임사 23곳, BIC에서 신작 알린다',
    localizedTitle: {
      en: '23 Busan Indie Game Studios Present New Titles at BIC',
      ko: '부산 인디 게임사 23곳, BIC에서 신작 알린다',
      ja: '釜山のインディーゲーム会社23社、BICで新作を紹介',
      'zh-cn': '23 家釜山独立游戏公司在 BIC 展示新作'
    },
    localizedSummary: {
      en: 'GameMeca reported that 23 Busan game companies joined BIC 2024. Lv.B presented MushDash at the Busan Global Game Center public booth.',
      ko: '부산 게임기업 23개 사의 BIC 2024 참가 소식입니다. Lv.B는 부산글로벌게임센터 퍼블릭 부스에서 MushDash를 선보였습니다.',
      ja: '釜山のゲーム企業23社がBIC 2024に参加したことを伝える記事です。Lv.Bは釜山グローバルゲームセンターのパブリックブースでMushDashを出展しました。',
      'zh-cn': '报道介绍了 23 家釜山游戏企业参加 BIC 2024。Lv.B 在釜山全球游戏中心公共展位展出了 MushDash。'
    },
    publisher: '게임메카',
    publishedAt: '2024-08-16',
    sourceUrl: 'https://www.gamemeca.com/view.php?gid=1752170',
    lastVerifiedAt: '2026-07-31'
  },
  {
    slug: 'busan-game-companies-bic-2024-busan-ilbo',
    kind: 'press-coverage',
    originalTitle: '부산 우수 게임기업 23개 사, 부산인디커넥트페스티벌 2024 참가',
    localizedTitle: {
      en: '23 Busan Game Companies Join Busan Indie Connect Festival 2024',
      ko: '부산 우수 게임기업 23개 사, 부산인디커넥트페스티벌 2024 참가',
      ja: '釜山の優秀ゲーム企業23社、Busan Indie Connect Festival 2024に参加',
      'zh-cn': '23 家釜山优秀游戏企业参加 Busan Indie Connect Festival 2024'
    },
    localizedSummary: {
      en: 'Busan Ilbo covered 23 Busan game companies taking part in BIC 2024. Its report lists Lv.B and MushDash among the teams and games at the Busan Global Game Center public booth.',
      ko: '부산 게임기업 23개 사의 BIC 2024 참가를 다룬 기사입니다. 부산글로벌게임센터 퍼블릭 부스 참가팀과 작품으로 Lv.B와 MushDash가 소개됐습니다.',
      ja: '釜山のゲーム企業23社によるBIC 2024参加を取り上げた記事です。釜山グローバルゲームセンターのパブリックブース出展チームと作品として、Lv.BとMushDashが紹介されています。',
      'zh-cn': '报道介绍了 23 家釜山游戏企业参加 BIC 2024，并将 Lv.B 与 MushDash 列为釜山全球游戏中心公共展位的参展团队和作品。'
    },
    publisher: '부산일보',
    publishedAt: '2024-08-16',
    sourceUrl: 'https://www.busan.com/view/busan/view.php?code=2024081614265005318',
    lastVerifiedAt: '2026-07-31'
  }
];
