import type { NewsItem } from '../types/news';
import { games } from './games';

const mushHeroGame = games.find((game) => game.slug === 'mushhero');
const mushDashGame = games.find((game) => game.slug === 'mushdash');
const mushHeroArticleImage = mushHeroGame?.screenshots[0];
const mushDashArticleImage = mushDashGame?.screenshots[0];

if (!mushHeroArticleImage || !mushDashArticleImage || !mushHeroGame?.steamStoreUrl || !mushDashGame?.steamStoreUrl || !mushDashGame.epicStoreUrl) {
  throw new Error('News articles require verified game images and store URLs.');
}

export const newsItems: readonly NewsItem[] = [
  {
    type: 'internal',
    slug: 'mushhero-warrior-vfx-rework',
    kind: 'development-update',
    localizedTitle: {
      en: 'Rebuilding MushHero’s Warrior Skill VFX',
      ko: 'MushHero 전사 스킬 VFX를 다시 만드는 과정',
      ja: 'MushHeroの戦士スキルVFXを作り直すまで',
      'zh-cn': '重制MushHero战士技能VFX的过程'
    },
    localizedSummary: {
      en: 'A five-part development update on rebuilding the Warrior skill effects, from aura and ground cracks to sword trails and lightning. The work remains in progress.',
      ko: '오라와 지면 균열부터 검 궤적과 번개까지, Warrior 스킬 이펙트를 다시 만드는 5일간의 개발 과정을 정리했습니다. 현재 작업은 계속 진행 중입니다.',
      ja: 'オーラと地面のひび割れから剣の軌跡、雷まで、Warriorスキルエフェクトを作り直す5日間の開発過程をまとめました。現在も調整を続けています。',
      'zh-cn': '记录了从光环、地面裂纹到剑刃轨迹与雷电效果的五天重制过程。目前相关效果仍在持续调整中。'
    },
    publisher: 'Lv.B',
    author: 'Lv.B',
    publishedAt: '2026-08-26',
    updatedAt: '2026-08-26',
    heroImage: mushHeroArticleImage,
    game: 'mushhero',
    socialImage: 'mushhero',
    sourceUrls: [
      'https://www.instagram.com/reel/DY4kaMzhD7R/',
      'https://www.instagram.com/p/DY9pSqohPZK/',
      'https://www.instagram.com/reel/DZAT_iSB1XN/',
      'https://www.instagram.com/reel/DZFk-3TB9lN/',
      'https://www.instagram.com/reel/DZKuybUhBqF/'
    ],
    localizedBody: {
      en: {
        intro: 'We revisited the Warrior skill effects in MushHero and documented five steps of the ongoing VFX rebuild on our official Instagram channels.',
        sections: [
          { id: 'day-1', title: 'Day 1 — Rebuilding the foundation', paragraphs: ['The previous effect no longer matched the direction of the game, so we rebuilt the skill from the ground up with a new aura, ground cracks and flying rock elements.'] },
          { id: 'day-2', title: 'Day 2 — Revising the ground cracks', paragraphs: ['The first ground-crack pass was not clear enough, so we replaced it rather than treating the initial result as final.'] },
          { id: 'day-3', title: 'Day 3 — Clarifying the sword effect', paragraphs: ['The sword effect was simplified to read more clearly and fit the visual language of MushHero more naturally.'] },
          { id: 'day-4', title: 'Day 4 — Adding the sword trail', paragraphs: ['We added a first sword-trail pass that follows the weapon path while staying visually connected to the aura beneath the character.'] },
          { id: 'day-5', title: 'Day 5 — Building the lightning effect', paragraphs: ['The fifth step introduced a lightning effect. These effects are still being learned from, tested and refined rather than presented as final assets.'] },
          { id: 'related-posts', title: 'Related development posts', paragraphs: ['View the five original development posts on Lv.B’s official Instagram accounts. We will continue sharing the work in progress through our official channels.'], links: [
            { label: 'Day 1', href: 'https://www.instagram.com/reel/DY4kaMzhD7R/', external: true },
            { label: 'Day 2', href: 'https://www.instagram.com/p/DY9pSqohPZK/', external: true },
            { label: 'Day 3', href: 'https://www.instagram.com/reel/DZAT_iSB1XN/', external: true },
            { label: 'Day 4', href: 'https://www.instagram.com/reel/DZFk-3TB9lN/', external: true },
            { label: 'Day 5', href: 'https://www.instagram.com/reel/DZKuybUhBqF/', external: true },
            { label: 'Wishlist MushHero on Steam', href: mushHeroGame.steamStoreUrl, external: true }
          ] }
        ]
      },
      ko: {
        intro: 'MushHero의 Warrior 스킬 이펙트를 다시 살펴보고, 진행 중인 VFX 보정 과정을 공식 Instagram에 다섯 차례 기록했습니다.',
        sections: [
          { id: 'day-1', title: '1일 차 — 기초부터 다시 만들기', paragraphs: ['기존 이펙트가 현재 게임 방향과 맞지 않아 오라, 지면 균열, 날아오르는 바위 요소를 포함해 처음부터 다시 구성했습니다.'] },
          { id: 'day-2', title: '2일 차 — 지면 균열 보정', paragraphs: ['첫 지면 균열 표현이 충분히 명확하지 않아 초기 결과에 머무르지 않고 새로 만들었습니다.'] },
          { id: 'day-3', title: '3일 차 — 검 이펙트 정리', paragraphs: ['검 이펙트를 더 단순하고 선명하게 다듬어 MushHero의 시각 방향에 자연스럽게 어울리도록 했습니다.'] },
          { id: 'day-4', title: '4일 차 — 검 궤적 추가', paragraphs: ['캐릭터 아래 오라와 연결감을 유지하면서 검의 움직임이 또렷하게 보이도록 첫 검 궤적을 만들었습니다.'] },
          { id: 'day-5', title: '5일 차 — 번개 이펙트 제작', paragraphs: ['다섯 번째 단계에서는 번개 이펙트를 제작했습니다. 공개한 결과는 최종본이 아니라 계속 테스트하고 다듬는 작업 과정입니다.'] },
          { id: 'related-posts', title: '관련 개발 게시물', paragraphs: ['Lv.B 공식 Instagram에서 다섯 편의 원문 게시물을 확인할 수 있습니다. 앞으로도 제작 과정을 공식 채널을 통해 공유하겠습니다.'], links: [
            { label: '1일 차', href: 'https://www.instagram.com/reel/DY4kaMzhD7R/', external: true }, { label: '2일 차', href: 'https://www.instagram.com/p/DY9pSqohPZK/', external: true }, { label: '3일 차', href: 'https://www.instagram.com/reel/DZAT_iSB1XN/', external: true }, { label: '4일 차', href: 'https://www.instagram.com/reel/DZFk-3TB9lN/', external: true }, { label: '5일 차', href: 'https://www.instagram.com/reel/DZKuybUhBqF/', external: true }, { label: 'Steam에서 MushHero 찜하기', href: mushHeroGame.steamStoreUrl, external: true }
          ] }
        ]
      },
      ja: {
        intro: 'MushHeroのWarriorスキルエフェクトを見直し、進行中のVFX再制作を公式Instagramで5回にわたって記録しました。',
        sections: [
          { id: 'day-1', title: '1日目 — 基礎から再構築', paragraphs: ['従来のエフェクトが現在のゲームの方向性に合わなくなったため、オーラ、地面のひび割れ、舞い上がる岩を含めて一から作り直しました。'] },
          { id: 'day-2', title: '2日目 — 地面のひび割れを再調整', paragraphs: ['最初の表現では十分に伝わらなかったため、初期案を完成形とせず新しく作り直しました。'] },
          { id: 'day-3', title: '3日目 — 剣のエフェクトを整理', paragraphs: ['剣のエフェクトをよりシンプルで見やすくし、MushHeroのビジュアルに自然になじむよう調整しました。'] },
          { id: 'day-4', title: '4日目 — 剣の軌跡を追加', paragraphs: ['キャラクターの足元のオーラとつながりを保ちつつ、剣の動きが明確に見える最初の軌跡を制作しました。'] },
          { id: 'day-5', title: '5日目 — 雷のエフェクトを制作', paragraphs: ['5段階目では雷のエフェクトを制作しました。公開した内容は完成版ではなく、現在もテストと調整を続けています。'] },
          { id: 'related-posts', title: '関連する開発投稿', paragraphs: ['Lv.B公式Instagramで5件の元投稿をご覧いただけます。今後も制作過程を公式チャンネルでお届けします。'], links: [
            { label: '1日目', href: 'https://www.instagram.com/reel/DY4kaMzhD7R/', external: true }, { label: '2日目', href: 'https://www.instagram.com/p/DY9pSqohPZK/', external: true }, { label: '3日目', href: 'https://www.instagram.com/reel/DZAT_iSB1XN/', external: true }, { label: '4日目', href: 'https://www.instagram.com/reel/DZFk-3TB9lN/', external: true }, { label: '5日目', href: 'https://www.instagram.com/reel/DZKuybUhBqF/', external: true }, { label: 'SteamでMushHeroをウィッシュリストに追加', href: mushHeroGame.steamStoreUrl, external: true }
          ] }
        ]
      },
      'zh-cn': {
        intro: '我们重新审视了 MushHero 的 Warrior 技能特效，并通过官方 Instagram 分五次记录了仍在进行中的 VFX 重制过程。',
        sections: [
          { id: 'day-1', title: '第 1 天 — 从基础开始重制', paragraphs: ['旧版特效已不再符合当前游戏方向，因此我们从头制作了光环、地面裂纹与飞石等元素。'] },
          { id: 'day-2', title: '第 2 天 — 重做地面裂纹', paragraphs: ['第一版地面裂纹不够清晰，因此没有把初稿当作成品，而是重新制作。'] },
          { id: 'day-3', title: '第 3 天 — 梳理剑刃特效', paragraphs: ['我们简化了剑刃特效，让动作更清晰，也更贴合 MushHero 的视觉风格。'] },
          { id: 'day-4', title: '第 4 天 — 加入剑刃轨迹', paragraphs: ['第一版剑刃轨迹既保留了与角色脚下光环的联系，也让挥剑路径更加醒目。'] },
          { id: 'day-5', title: '第 5 天 — 制作雷电特效', paragraphs: ['第五步加入了雷电特效。这些内容仍处于测试与调整阶段，并非最终版本。'] },
          { id: 'related-posts', title: '相关开发动态', paragraphs: ['可前往 Lv.B 官方 Instagram 查看五篇原始动态。今后我们也会继续通过官方渠道分享制作过程。'], links: [
            { label: '第 1 天', href: 'https://www.instagram.com/reel/DY4kaMzhD7R/', external: true }, { label: '第 2 天', href: 'https://www.instagram.com/p/DY9pSqohPZK/', external: true }, { label: '第 3 天', href: 'https://www.instagram.com/reel/DZAT_iSB1XN/', external: true }, { label: '第 4 天', href: 'https://www.instagram.com/reel/DZFk-3TB9lN/', external: true }, { label: '第 5 天', href: 'https://www.instagram.com/reel/DZKuybUhBqF/', external: true }, { label: '在 Steam 将 MushHero 加入愿望单', href: mushHeroGame.steamStoreUrl, external: true }
          ] }
        ]
      }
    }
  },
  {
    type: 'external',
    slug: 'bgc-lvb-studio-interview-2025',
    kind: 'interview',
    originalTitle: 'BGC입주 게임기업 인터뷰 - 함께하면 더 즐거운 귀여움! 레벨비',
    localizedTitle: {
      en: 'BGC Studio Interview: Cute Games That Are More Fun Together — Lv.B',
      ko: 'BGC 입주 게임기업 인터뷰: 함께하면 더 즐거운 귀여움, Lv.B',
      ja: 'BGC入居ゲーム企業インタビュー：一緒ならもっと楽しい、かわいいゲームを作るLv.B',
      'zh-cn': 'BGC 入驻游戏企业采访：一起玩更有趣的可爱游戏，Lv.B'
    },
    localizedSummary: {
      en: 'The Busan Global Game Center interviewed Lv.B about its small Busan-based team, low-poly 3D multiplayer focus and the development and Early Access operation of MushDash.',
      ko: '부산글로벌게임센터가 부산 기반 소규모 팀 Lv.B를 만나 로우 폴리 3D 멀티플레이 게임을 만드는 방향과 MushDash 개발·앞서 해보기 운영 이야기를 소개했습니다.',
      ja: '釜山グローバルゲームセンターがLv.Bにインタビューし、釜山を拠点とする小規模チーム、ローポリ3Dマルチプレイへの取り組み、MushDashの開発と早期アクセス運営について紹介しました。',
      'zh-cn': '釜山全球游戏中心采访了 Lv.B，介绍了这支釜山小型团队对低多边形 3D 多人游戏的专注，以及 MushDash 的开发与抢先体验运营。'
    },
    publisher: '부산글로벌게임센터',
    publishedAt: '2025-11-14',
    sourceUrl: 'https://blog.naver.com/busangamecenter/224075915782',
    lastVerifiedAt: '2026-08-26'
  },
  {
    type: 'internal',
    slug: 'mushdash-early-access-launch',
    kind: 'announcement',
    localizedTitle: {
      en: 'MushDash Launches in Early Access on Steam and Epic Games Store',
      ko: 'MushDash, Steam과 Epic Games Store에서 앞서 해보기 출시',
      ja: 'MushDash、SteamとEpic Games Storeで早期アクセス開始',
      'zh-cn': 'MushDash在Steam和Epic Games Store开启抢先体验'
    },
    localizedSummary: {
      en: 'MushDash is now available in Early Access on Steam and Epic Games Store. Race online with up to seven players through obstacle-filled courses.',
      ko: 'MushDash가 Steam과 Epic Games Store에 앞서 해보기로 출시됐습니다. 최대 7명이 온라인으로 장애물 가득한 코스를 달릴 수 있습니다.',
      ja: 'MushDashがSteamとEpic Games Storeで早期アクセスを開始しました。最大7人で障害物コースを駆け抜けるオンラインレースを楽しめます。',
      'zh-cn': 'MushDash 已在 Steam 与 Epic Games Store 开启抢先体验。最多 7 名玩家可在线挑战充满障碍的赛道。'
    },
    publisher: 'Lv.B',
    author: 'Lv.B',
    publishedAt: '2025-08-26',
    updatedAt: '2025-08-26',
    heroImage: mushDashArticleImage,
    game: 'mushdash',
    socialImage: 'mushdash',
    sourceUrls: ['https://www.instagram.com/p/DN16Q4l5uch/'],
    localizedBody: {
      en: {
        intro: 'MushDash entered Early Access on Steam and Epic Games Store on August 26, 2025.',
        sections: [
          { id: 'early-access', title: 'Early Access is now available', paragraphs: ['MushDash is an online party racing game where up to seven players dash, jump and dodge deadly traps on the way to the finish.'] },
          { id: 'play-together', title: 'Race together online', paragraphs: ['Read obstacle patterns, collect Mushroom Coins and compete for the final crown. The Early Access release is available through the two verified store pages below.'] },
          { id: 'store-links', title: 'Official links', paragraphs: ['Choose your preferred store or visit the official MushDash page on the Lv.B website.'], links: [
            { label: 'View MushDash on Steam', href: mushDashGame.steamStoreUrl, external: true },
            { label: 'View MushDash on Epic Games Store', href: mushDashGame.epicStoreUrl, external: true },
            { label: 'Visit the official MushDash page', href: '/games/mushdash/' }
          ] }
        ]
      },
      ko: {
        intro: 'MushDash가 2025년 8월 26일 Steam과 Epic Games Store에 앞서 해보기로 출시됐습니다.',
        sections: [
          { id: 'early-access', title: '앞서 해보기 출시', paragraphs: ['MushDash는 최대 7명의 플레이어가 결승점을 향해 달리고, 점프하고, 치명적인 함정을 피하는 온라인 파티 레이싱 게임입니다.'] },
          { id: 'play-together', title: '온라인에서 함께 달리기', paragraphs: ['장애물 패턴을 읽고 Mushroom Coin을 모으며 마지막 왕관을 차지해 보세요. 아래의 검증된 두 스토어 페이지에서 앞서 해보기 버전을 만날 수 있습니다.'] },
          { id: 'store-links', title: '공식 링크', paragraphs: ['원하는 스토어를 선택하거나 Lv.B 공식 MushDash 페이지를 확인하세요.'], links: [
            { label: 'Steam에서 MushDash 보기', href: mushDashGame.steamStoreUrl, external: true }, { label: 'Epic Games Store에서 MushDash 보기', href: mushDashGame.epicStoreUrl, external: true }, { label: 'MushDash 공식 페이지', href: '/ko/games/mushdash/' }
          ] }
        ]
      },
      ja: {
        intro: 'MushDashは2025年8月26日、SteamとEpic Games Storeで早期アクセスを開始しました。',
        sections: [
          { id: 'early-access', title: '早期アクセス開始', paragraphs: ['MushDashは最大7人のプレイヤーがゴールを目指して走り、ジャンプし、危険なトラップをかわすオンラインパーティーレースゲームです。'] },
          { id: 'play-together', title: 'オンラインで一緒にレース', paragraphs: ['障害物のパターンを読み、Mushroom Coinを集め、最後の王冠を目指します。以下の確認済みストアページから早期アクセス版をご利用いただけます。'] },
          { id: 'store-links', title: '公式リンク', paragraphs: ['利用するストアを選ぶか、Lv.B公式サイトのMushDashページをご覧ください。'], links: [
            { label: 'SteamでMushDashを見る', href: mushDashGame.steamStoreUrl, external: true }, { label: 'Epic Games StoreでMushDashを見る', href: mushDashGame.epicStoreUrl, external: true }, { label: 'MushDash公式ページ', href: '/ja/games/mushdash/' }
          ] }
        ]
      },
      'zh-cn': {
        intro: 'MushDash 已于 2025 年 8 月 26 日在 Steam 与 Epic Games Store 开启抢先体验。',
        sections: [
          { id: 'early-access', title: '抢先体验现已开放', paragraphs: ['MushDash 是一款在线派对竞速游戏，最多 7 名玩家将奔跑、跳跃并避开致命陷阱，向终点发起冲刺。'] },
          { id: 'play-together', title: '在线一起竞速', paragraphs: ['观察障碍规律，收集 Mushroom Coin，并争夺最终王冠。可通过下方两个已验证的商店页面体验抢先体验版本。'] },
          { id: 'store-links', title: '官方链接', paragraphs: ['选择常用商店，或访问 Lv.B 官方 MushDash 页面。'], links: [
            { label: '在 Steam 查看 MushDash', href: mushDashGame.steamStoreUrl, external: true }, { label: '在 Epic Games Store 查看 MushDash', href: mushDashGame.epicStoreUrl, external: true }, { label: 'MushDash 官方页面', href: '/zh-cn/games/mushdash/' }
          ] }
        ]
      }
    }
  },
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
    game: 'mushhero',
    socialImage: 'mushhero',
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
    slug: 'bic-2025-mushdash-repeat-play-djaakek00',
    kind: 'blog-review',
    originalTitle: '[BGC 서포터즈] 2025 BIC 부산인디커넥트페스티벌 방문 후기',
    localizedTitle: {
      en: '[BGC Supporters] A Visit to Busan Indie Connect Festival 2025',
      ko: '[BGC 서포터즈] 2025 BIC 부산인디커넥트페스티벌 방문 후기',
      ja: '【BGCサポーターズ】2025 BIC釜山インディーコネクトフェスティバル参加レポート',
      'zh-cn': '【BGC 支持者】2025 BIC 釜山独立游戏节体验记录'
    },
    localizedSummary: {
      en: 'The author returned to MushDash at BIC and highlighted its character customization and cute mushroom design after playing it at an earlier event.',
      ko: '작성자는 이전 행사에 이어 BIC에서도 MushDash를 플레이하며, 캐릭터 커스터마이징과 귀여운 버섯 디자인을 긍정적으로 소개했습니다.',
      ja: '筆者は以前のイベントに続いてBICでもMushDashを試遊し、キャラクターカスタマイズとかわいらしいキノコのデザインを好意的に紹介しています。',
      'zh-cn': '作者继此前的活动体验后，又在 BIC 试玩了 MushDash，并肯定了角色自定义功能和可爱的蘑菇造型。'
    },
    publisher: '美 池 :',
    author: 'djaakek00',
    publishedAt: '2025-08-21',
    sourceUrl: 'https://blog.naver.com/djaakek00/223978126463',
    lastVerifiedAt: '2026-08-25'
  },
  {
    type: 'external',
    slug: 'bgc-2025-mushdash-memorable-game-ko-castle',
    kind: 'blog-review',
    originalTitle: '[BGC 서포터즈 9기] 발대식 후기',
    localizedTitle: {
      en: '[BGC Supporters 9] Orientation Day Recap',
      ko: '[BGC 서포터즈 9기] 발대식 후기',
      ja: '【BGCサポーターズ9期】発足式レポート',
      'zh-cn': '【BGC 支持者第 9 期】启动仪式体验记录'
    },
    localizedSummary: {
      en: 'After trying the games at the event, the author introduced MushDash as one of the titles that remained especially memorable.',
      ko: '작성자는 행사에서 여러 게임을 체험한 뒤, MushDash를 특히 기억에 남았던 작품으로 소개했습니다.',
      ja: '筆者はイベントで複数のゲームを試遊し、その中でもMushDashを特に印象に残った作品として紹介しています。',
      'zh-cn': '作者在活动中体验了多款游戏，并将 MushDash 介绍为尤其令人印象深刻的作品。'
    },
    publisher: "GAME'R' DESIGNER",
    author: 'ko_castle',
    publishedAt: '2025-08-13',
    sourceUrl: 'https://blog.naver.com/ko_castle/223969678143',
    lastVerifiedAt: '2026-08-25'
  },
  {
    type: 'external',
    slug: 'bic-2024-mushdash-play-review-kuromi01',
    kind: 'blog-review',
    originalTitle: '[BIC] 부산인디커넥트페스티벌 후기 !',
    localizedTitle: {
      en: '[BIC] Busan Indie Connect Festival Recap',
      ko: '[BIC] 부산인디커넥트페스티벌 후기 !',
      ja: '【BIC】釜山インディーコネクトフェスティバル参加レポート',
      'zh-cn': '【BIC】釜山独立游戏节体验记录'
    },
    localizedSummary: {
      en: 'The author played MushDash at BIC and described it as the game they enjoyed most, while highlighting its demanding and competitive play.',
      ko: '작성자는 BIC 현장에서 MushDash를 직접 플레이하고 가장 즐긴 게임으로 꼽으며, 높은 난도와 승부욕을 자극하는 플레이를 함께 소개했습니다.',
      ja: '筆者はBIC会場でMushDashを試遊し、最も楽しんだゲームとして挙げながら、歯ごたえのある難度と競争心を刺激するプレイを紹介しています。',
      'zh-cn': '作者在 BIC 现场试玩了 MushDash，将其列为自己最享受的游戏，并提到较高难度和富有竞争感的玩法。'
    },
    publisher: '˙ᵕ˙',
    author: 'kuromi01',
    publishedAt: '2024-08-31',
    sourceUrl: 'https://blog.naver.com/kuromi01/223567525541',
    lastVerifiedAt: '2026-08-25'
  },
  {
    type: 'external',
    slug: 'bic-2024-mushdash-friends-and-difficulty-tunacanzorim',
    kind: 'blog-review',
    originalTitle: '[BGC 서포터즈] 부산인디커넥트페스티벌 2024 후기',
    localizedTitle: {
      en: '[BGC Supporters] Busan Indie Connect Festival 2024 Recap',
      ko: '[BGC 서포터즈] 부산인디커넥트페스티벌 2024 후기',
      ja: '【BGCサポーターズ】釜山インディーコネクトフェスティバル2024参加レポート',
      'zh-cn': '【BGC 支持者】2024 釜山独立游戏节体验记录'
    },
    localizedSummary: {
      en: 'The author found MushDash’s obstacles and traps challenging, while noting that the multiplayer race looked especially fun to enjoy with friends.',
      ko: '작성자는 MushDash의 장애물과 함정이 어렵다고 느낀 한편, 친구들과 함께 즐기면 특히 재미있을 것이라는 인상을 전했습니다.',
      ja: '筆者はMushDashの障害物やトラップに難しさを感じる一方、友達と一緒に遊べば特に楽しめそうだという印象を伝えています。',
      'zh-cn': '作者认为 MushDash 的障碍与陷阱颇具难度，同时也表示这款多人竞速游戏和朋友一起玩会更有乐趣。'
    },
    publisher: '산들바람 스텝',
    author: 'tunacanzorim',
    publishedAt: '2024-08-29',
    sourceUrl: 'https://blog.naver.com/tunacanzorim/223565100540',
    lastVerifiedAt: '2026-08-25'
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
