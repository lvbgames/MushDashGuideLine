import type { NewsItem } from '../types/news';
import { games } from './games';

const mushHeroArticleImage = games.find((game) => game.slug === 'mushhero')?.screenshots[0];

if (!mushHeroArticleImage) {
  throw new Error('The MushHero studio update requires a verified hero image.');
}

export const newsItems: readonly NewsItem[] = [
  {
    type: 'internal',
    slug: 'bic-2026-mushhero-first-public-playtest',
    kind: 'studio-update',
    localizedTitle: {
      en: 'MushHero’s First Public Playtest at BIC 2026',
      ko: 'BIC 2026에서 진행한 MushHero 첫 공개 플레이 테스트',
      ja: 'BIC 2026で実施したMushHero初の公開プレイテスト',
      'zh-cn': 'MushHero 在 BIC 2026 的首次公开试玩'
    },
    localizedSummary: {
      en: 'Lv.B brought MushHero, a PC cooperative roguelite defense game and Public Indie selection, to BIC 2026 for its first public gameplay test.',
      ko: 'Lv.B는 Public Indie 출품작이자 PC 협동 로그라이트 디펜스 게임인 MushHero의 첫 공개 플레이 테스트를 BIC 2026에서 진행했습니다.',
      ja: 'Lv.Bは、パブリックインディー出展作であるPC向け協力型ローグライトディフェンスゲームMushHeroの初公開プレイテストをBIC 2026で実施しました。',
      'zh-cn': 'Lv.B 在 BIC 2026 现场首次公开试玩了入选 Public Indie 单元的 PC 合作 Roguelite 防守游戏 MushHero。'
    },
    publisher: 'Lv.B',
    author: 'Lv.B',
    publishedAt: '2026-08-21',
    updatedAt: '2026-08-21',
    heroImage: mushHeroArticleImage,
    localizedBody: {
      en: {
        intro: 'Lv.B joined BIC 2026 with MushHero and opened the game’s first public gameplay test to visitors at the event.',
        sections: [
          { id: 'at-bic', title: 'MushHero at BIC 2026', paragraphs: ['MushHero appeared as a Public Indie title in the Busan Global Game Center exhibition. The PC game introduces cooperative roguelite defense built around facing incoming monster waves together.'] },
          { id: 'first-playtest', title: 'First Public Playtest', paragraphs: ['The exhibition gave visitors an opportunity to play MushHero in public for the first time. This was the first time the game’s current gameplay was available for hands-on play at a public event.'] },
          { id: 'about-mushhero', title: 'About MushHero', paragraphs: ['MushHero is a cooperative roguelite defense game where players hold the line against waves of monsters and powerful bosses. Randomized weapons, evolving skills and branching progression support a different build and strategy in each run.'] },
          { id: 'thank-you', title: 'Thank You', paragraphs: ['Thank you to everyone who visited the exhibition and played MushHero. We’ll continue developing MushHero and share more updates on the official Lv.B website and channels.'] }
        ]
      },
      ko: {
        intro: 'Lv.B는 BIC 2026에 MushHero로 참가해 현장을 찾은 분들께 게임의 첫 공개 플레이 테스트를 선보였습니다.',
        sections: [
          { id: 'at-bic', title: 'BIC 2026의 MushHero', paragraphs: ['MushHero는 부산글로벌게임센터 전시의 Public Indie 출품작으로 참가했습니다. 몰려오는 적에 함께 맞서는 협동 로그라이트 디펜스 방식의 PC 게임입니다.'] },
          { id: 'first-playtest', title: '첫 공개 플레이 테스트', paragraphs: ['이번 전시에서는 방문객이 MushHero를 직접 플레이할 수 있었습니다. 현재 게임 플레이를 공개 행사에서 직접 선보인 첫 자리였습니다.'] },
          { id: 'about-mushhero', title: 'MushHero 소개', paragraphs: ['MushHero는 동료와 함께 몰려오는 몬스터와 강력한 보스에 맞서 전선을 지키는 협동 로그라이트 디펜스 게임입니다. 무작위 무기, 성장하는 스킬, 갈래가 나뉘는 진행을 통해 매번 다른 빌드와 전략을 만들어 갑니다.'] },
          { id: 'thank-you', title: '감사합니다', paragraphs: ['전시를 찾아 MushHero를 플레이해 주신 모든 분께 감사드립니다. 앞으로도 MushHero 개발을 이어가며 Lv.B 공식 홈페이지와 채널을 통해 새로운 소식을 전하겠습니다.'] }
        ]
      },
      ja: {
        intro: 'Lv.BはMushHeroとともにBIC 2026へ出展し、会場で本作初の公開プレイテストを実施しました。',
        sections: [
          { id: 'at-bic', title: 'BIC 2026でのMushHero', paragraphs: ['MushHeroは釜山グローバルゲームセンター展示のパブリックインディー作品として出展しました。迫り来る敵に仲間と立ち向かう、PC向け協力型ローグライトディフェンスゲームです。'] },
          { id: 'first-playtest', title: '初の公開プレイテスト', paragraphs: ['会場では来場者の皆さまにMushHeroを実際にプレイしていただきました。現在のゲームプレイを一般公開イベントで体験いただく初めての機会となりました。'] },
          { id: 'about-mushhero', title: 'MushHeroについて', paragraphs: ['MushHeroは仲間とともにモンスターの群れや強力なボスを迎え撃つ協力型ローグライトディフェンスゲームです。ランダムな武器、成長するスキル、分岐する進行によって、プレイするたびに異なるビルドと戦略を組み立てます。'] },
          { id: 'thank-you', title: 'ありがとうございました', paragraphs: ['会場へ足を運び、MushHeroをプレイしてくださった皆さまに感謝いたします。今後も開発を進め、Lv.B公式サイトと各チャンネルで新しい情報をお届けします。'] }
        ]
      },
      'zh-cn': {
        intro: 'Lv.B 携 MushHero 参加 BIC 2026，并在活动现场首次面向公众开放游戏试玩。',
        sections: [
          { id: 'at-bic', title: 'MushHero 亮相 BIC 2026', paragraphs: ['MushHero 作为釜山全球游戏中心展区的 Public Indie 作品参展。这是一款 PC 合作 Roguelite 防守游戏，玩家将共同抵御不断来袭的敌人。'] },
          { id: 'first-playtest', title: '首次公开试玩', paragraphs: ['展会期间，现场访客可以亲自体验 MushHero。这是游戏当前玩法首次在公开活动中提供试玩。'] },
          { id: 'about-mushhero', title: '关于 MushHero', paragraphs: ['MushHero 是一款合作 Roguelite 防守游戏，玩家需要携手抵御成群怪物与强大首领。随机武器、持续成长的技能和分支式成长路线，让每次挑战都能形成不同的配置与策略。'] },
          { id: 'thank-you', title: '感谢大家', paragraphs: ['感谢每一位来到展区并体验 MushHero 的访客。我们会继续开发 MushHero，并通过 Lv.B 官方网站与官方频道分享后续动态。'] }
        ]
      }
    }
  },
  {
    type: 'external',
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
    type: 'external',
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
    type: 'external',
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
    type: 'external',
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
    type: 'external',
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
    type: 'external',
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
    type: 'external',
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
