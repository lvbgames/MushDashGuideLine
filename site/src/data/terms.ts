import { contactPolicy } from './contact';
import { getLocalePath, type Locale } from '../i18n/config';
import {
  termsSectionIds,
  type TermsDocumentContent,
  type TermsLink,
  type TermsSection
} from '../types/terms';

const lastUpdated = '2026-08-12';
const effectiveDate = '2026-08-12';

const platformTerms = {
  steam: 'https://store.steampowered.com/subscriber_agreement/',
  epic: 'https://legal.epicgames.com/store/eula?lang=en-US'
} as const;

function section(
  id: TermsSection['id'],
  title: string,
  paragraphs: readonly string[],
  bullets?: readonly string[],
  links?: readonly TermsLink[]
): TermsSection {
  return { id, title, paragraphs, bullets, links };
}

const koSections: readonly TermsSection[] = [
  section('scope', '목적 및 적용 범위', [
    '이 게임 이용약관은 Lv.B가 제공하는 게임과 그에 연결된 온라인 기능의 이용 조건, Lv.B와 이용자의 권리·의무 및 책임에 관한 기본 사항을 정합니다.',
    '이 약관은 Steam 또는 Epic Games Store 등 외부 플랫폼 자체의 계정·스토어·결제 서비스에는 직접 적용되지 않습니다. 해당 서비스에는 각 사업자의 약관과 정책이 별도로 적용됩니다.'
  ]),
  section('definitions', '용어 정의', [
    '“게임”은 Lv.B가 제공하는 MushDash, MushHero 및 향후 이 약관을 적용한다고 명시한 게임을 말합니다. “온라인 기능”은 게임에서 제공되는 로그인, Lobby, Session, P2P 연결, 클라우드 저장 등 네트워크 기반 기능을 말합니다.',
    '“플랫폼”은 Steam과 Epic Games Store처럼 게임의 구매·다운로드·실행 또는 계정 기능을 제공하는 외부 서비스를 말합니다. “이용자”는 적용 법령과 플랫폼 절차에 따라 게임을 이용하는 사람을 말합니다.'
  ]),
  section('notice-changes', '약관의 적용·고지·변경', [
    '이 약관은 공식 웹사이트, 게임 화면 또는 플랫폼이 제공하는 적절한 위치에서 이용자에게 제시되고, 적용 법령상 필요한 동의나 고지 절차를 거친 범위에서 적용됩니다. 단순히 게임을 구매하거나 실행했다는 사실만으로 별도의 고지 없이 모든 조항에 동의한 것으로 단정하지 않습니다.',
    'Lv.B는 법령, 플랫폼 정책, 서비스 내용 또는 운영상 필요가 바뀌는 경우 관련 법령에 따라 약관을 변경할 수 있습니다. 이용자에게 중요한 변경은 적용 전에 합리적인 방법과 기간으로 알리고, 개별 동의가 필요한 변경은 해당 절차를 따릅니다. 변경 전 이미 발생한 이용관계에 관한 법령상 권리를 부당하게 소급하여 제한하지 않습니다.'
  ]),
  section(
    'platform-terms',
    '플랫폼 약관과의 관계',
    [
      '플랫폼 계정, 구매, 결제, 다운로드와 플랫폼이 직접 제공하는 기능에는 해당 플랫폼의 최신 약관과 정책이 적용됩니다. 이 약관과 플랫폼 정책은 각각 관리하는 서비스 범위에서 함께 적용됩니다.',
      '내용이 충돌하는 경우 적용 법령과 강행규정상 이용자 권리를 우선하며, 플랫폼 정책이 법률상 권리를 일률적으로 제한하는 것으로 해석하지 않습니다.'
    ],
    undefined,
    [
      { label: 'Steam 이용약관', href: platformTerms.steam },
      { label: 'Epic Games Store 최종 사용자 라이선스 계약', href: platformTerms.epic }
    ]
  ),
  section('license-ip', '게임 이용 라이선스와 지식재산권', [
    '이용자가 정당하게 게임을 취득하면 Lv.B는 플랫폼의 이용 조건과 이 약관에 따라 게임을 개인적·비상업적으로 이용할 수 있는 제한적이고 비독점적인 권리를 부여합니다. 이 권리는 게임 또는 지식재산권의 소유권을 이전하는 것이 아닙니다.',
    '게임의 코드, 그래픽, 음악, 캐릭터, 명칭과 기타 콘텐츠에 관한 권리는 Lv.B 또는 정당한 권리자에게 있습니다. 적용 법령이 허용하는 경우를 제외하고 무단 복제·배포·판매·대여 또는 상업적 이용을 해서는 안 됩니다.'
  ]),
  section('accounts-online', '플랫폼 계정과 온라인 기능', [
    'Lv.B는 현재 별도의 Lv.B 회원계정을 운영하지 않습니다. MushDash의 온라인 기능은 Steam 또는 Epic 계정 연동과 Epic Online Services(EOS)를 이용하며, 플랫폼 또는 EOS의 로그인 상태와 서비스 이용 가능 여부가 필요할 수 있습니다.',
    'Lobby, Session 및 P2P 연결에서는 이용자 기기 사이의 네트워크 연결이 사용될 수 있습니다. 이용자는 자신의 플랫폼 계정과 인증수단을 안전하게 관리하고, 계정 문제는 해당 플랫폼이 제공하는 절차도 함께 이용해야 합니다.'
  ]),
  section('user-obligations', '이용자의 의무 및 금지행위', [
    '이용자는 게임과 온라인 기능을 관련 법령, 이 약관 및 적용되는 플랫폼 정책에 따라 이용해야 합니다.',
    '다음 행위는 금지됩니다.'
  ], [
    '치트·핵 등 비인가 프로그램을 사용하거나 배포하는 행위',
    '게임 데이터나 통신을 부정한 목적으로 변조하는 행위',
    '버그 또는 취약점을 악의적으로 이용하거나 확산하는 행위',
    '서비스 또는 다른 이용자의 정상적인 게임 이용을 고의로 방해하는 행위',
    '관련 법령, 제3자의 권리 또는 적용되는 플랫폼 정책을 위반하는 행위'
  ]),
  section('service-changes', '게임 서비스·업데이트·기능 변경', [
    'Lv.B는 보안, 오류 수정, 품질 개선, 밸런스 조정, 법령 또는 플랫폼 요구에 대응하기 위해 업데이트나 패치를 제공하고 게임의 일부 기능·규칙·콘텐츠를 변경할 수 있습니다.',
    'Lv.B는 모든 게임에 대한 업데이트나 특정 기능을 영구적으로 제공한다고 보장하지 않습니다. 이용자에게 중대한 불이익이 예상되는 변경은 합리적으로 가능한 범위와 관련 법령이 요구하는 방식으로 안내합니다.'
  ]),
  section('online-termination', '온라인 기능 및 서비스 종료', [
    '온라인 기능은 EOS, 플랫폼, 네트워크 환경과 기타 외부 서비스에 의존할 수 있습니다. 기술·보안·법령·플랫폼 정책 또는 합리적인 운영상 사유가 있는 경우 온라인 기능의 전부 또는 일부가 일시 중단되거나 종료될 수 있습니다.',
    '계획된 종료나 이용자에게 중요한 장기 중단은 합리적으로 가능한 범위에서 사전에 안내합니다. 환불이나 기타 조치가 필요한 경우 구매 플랫폼의 절차와 적용 법령을 따릅니다.'
  ]),
  section('game-data', '게임 데이터·로컬 저장·EOS UserCloud', [
    '게임 데이터는 이용자 기기의 로컬 저장소와, 지원되는 경우 EOS UserCloud에 나뉘어 저장될 수 있습니다. 저장되는 정보의 범주와 처리 방식은 개인정보 처리방침에서 확인할 수 있습니다.',
    'Lv.B는 저장 기능의 안정성을 위해 합리적인 노력을 기울이지만 기기 고장, 파일 손상, 동기화 충돌, 플랫폼 또는 외부 서비스 장애 등 모든 경우에 데이터가 손실 없이 보존된다고 보장할 수는 없습니다. 다만 Lv.B의 고의 또는 중대한 과실로 인한 책임이나 적용 법령상 이용자의 권리를 배제하지 않습니다.'
  ]),
  section('purchases-refunds', '게임·유료 콘텐츠 구매 및 환불', [
    'MushDash와 같이 플랫폼에서 판매되는 게임 본체의 구매와 결제는 이용자가 선택한 플랫폼을 통해 이루어집니다. Lv.B 공식 웹사이트는 게임이나 유료 콘텐츠를 직접 판매하거나 결제를 처리하지 않습니다. 별도 유료 콘텐츠는 실제로 제공되는 경우에만 해당 플랫폼에서 구매할 수 있습니다.',
    '취소·청약철회·환불은 구매한 플랫폼의 최신 절차와 적용 법령에 따라 처리됩니다. 플랫폼 정책은 법령상 보장되는 소비자 권리를 배제하지 않으며, 이 약관은 특정 플레이 시간이나 고정된 환불 조건을 별도로 정하지 않습니다.'
  ]),
  section('external-services', '외부 플랫폼과 서비스', [
    'Steam, Epic Games Store와 EOS는 각 사업자가 운영하는 외부 서비스입니다. Lv.B는 외부 서비스의 계정, 결제 시스템, 네트워크, 정책 변경 또는 장애를 직접 통제하지 않습니다.',
    '외부 서비스의 변경이나 종료로 게임 이용의 일부가 영향을 받을 수 있습니다. Lv.B는 확인 가능한 범위에서 문제를 안내하고 합리적인 대응을 검토하지만, 외부 사업자가 직접 관리하는 사항은 해당 사업자의 지원 절차를 이용해야 할 수 있습니다.'
  ]),
  section(
    'privacy',
    '개인정보 보호',
    [
      '게임, 온라인 기능, 웹사이트 및 이메일 문의에서 처리될 수 있는 개인정보에 관한 자세한 내용은 Lv.B 개인정보 처리방침을 따릅니다. 이 약관은 개인정보 처리방침의 세부 내용을 반복하거나 대체하지 않습니다.'
    ],
    undefined,
    [{ label: '개인정보 처리방침', href: getLocalePath('ko', 'privacy') }]
  ),
  section('restrictions-liability', '이용 제한 및 책임 범위', [
    '금지행위가 의심되거나 확인된 경우 Lv.B는 사실관계를 검토한 뒤 행위 중단 요청, 관련 증거 보존, 기술적으로 가능한 범위의 온라인 기능 보호조치 또는 플랫폼 사업자에 대한 조치 요청 등 필요하고 비례적인 대응을 할 수 있습니다. 구체적인 조치는 당시 게임과 플랫폼이 실제 제공하는 기능 및 관련 법령에 따릅니다.',
    'Lv.B는 합리적으로 통제하기 어려운 플랫폼·통신망·제3자 서비스의 장애로 인한 손해에 대해 적용 법령이 허용하는 범위에서 책임이 제한될 수 있습니다. 이 조항은 Lv.B의 고의 또는 중대한 과실에 따른 책임, 법률상 담보책임이나 소비자의 강행법규상 권리를 배제하거나 부당하게 제한하지 않습니다.'
  ]),
  section('law-disputes', '준거법과 분쟁 해결', [
    '이 약관은 대한민국 법률을 준거법으로 합니다. 다만 이용자의 거주지 또는 거래에 적용되는 강행법규상 권리는 이 선택으로 배제되지 않습니다.',
    'Lv.B와 이용자는 분쟁이 발생하면 우선 성실한 협의를 통해 해결하도록 노력합니다. 협의로 해결되지 않는 분쟁의 관할은 민사소송법 등 관계 법령이 정하는 바에 따릅니다.'
  ]),
  section('contact-dates', '문의·변경일', [
    `이 약관 또는 게임 이용에 관한 문의는 ${contactPolicy.businessEmail}으로 보낼 수 있습니다. 게임 지원과 버그 신고는 공식 Discord 안내도 이용할 수 있습니다.`,
    '약관이 변경되면 이 페이지의 최종 수정일을 갱신하고, 필요한 경우 게임·플랫폼 또는 공식 웹사이트의 적절한 위치에서 추가로 안내합니다.'
  ])
];

const enSections: readonly TermsSection[] = [
  section('scope', 'Purpose and scope', [
    'These Terms set out the basic conditions for using games provided by Lv.B and their related online features, together with the rights, responsibilities and obligations of Lv.B and users.',
    'These Terms do not directly govern the account, store or payment services operated by external platforms such as Steam or the Epic Games Store. Each provider’s own terms and policies apply to those services.'
  ]),
  section('definitions', 'Definitions', [
    '“Game” means MushDash, MushHero and any future game that expressly states these Terms apply. “Online Features” means network-based features such as sign-in, Lobby, Session, P2P connections and cloud saves.',
    '“Platform” means an external service—such as Steam or the Epic Games Store—that provides purchase, download, launch or account functions. “User” means a person who uses a Game under applicable law and the relevant Platform process.'
  ]),
  section('notice-changes', 'Application, notice and changes', [
    'These Terms apply to the extent they are presented in an appropriate place, such as the official website, a Game or a Platform interface, and any notice or consent required by applicable law has been completed. Purchase or launch of a Game alone does not, without proper notice, automatically establish agreement to every provision.',
    'Lv.B may revise these Terms when laws, Platform policies, service features or reasonable operating needs change. Material changes will be announced by a reasonable method and with reasonable advance notice, and changes requiring individual consent will follow the applicable process. A change will not unfairly restrict, with retroactive effect, rights protected by law in relation to use that occurred before the change.'
  ]),
  section('platform-terms', 'Relationship with Platform terms', [
    'The latest terms and policies of the relevant Platform apply to Platform accounts, purchases, payments, downloads and features operated directly by that Platform. Those rules and these Terms apply together within their respective scopes.',
    'If provisions conflict, applicable law and mandatory user rights take priority. No Platform policy is interpreted here as automatically overriding rights granted by law.'
  ], undefined, [
    { label: 'Steam Subscriber Agreement', href: platformTerms.steam },
    { label: 'Epic Games Store End User License Agreement', href: platformTerms.epic }
  ]),
  section('license-ip', 'Game license and intellectual property', [
    'When a User lawfully acquires a Game, Lv.B grants a limited, non-exclusive right to use it for personal, non-commercial purposes under the Platform conditions and these Terms. This license does not transfer ownership of the Game or its intellectual property.',
    'Rights in the Game’s code, graphics, music, characters, names and other content remain with Lv.B or the relevant rights holder. Except where permitted by law, unauthorized copying, distribution, sale, rental or commercial use is prohibited.'
  ]),
  section('accounts-online', 'Platform accounts and Online Features', [
    'Lv.B currently operates no separate Lv.B membership account. MushDash uses Steam or Epic account integration and Epic Online Services(EOS) for Online Features, which may require an active Platform or EOS sign-in and available services.',
    'Lobby, Session and P2P connections may use network connections between user devices. Users should protect their Platform credentials and also use the relevant Platform process for account-related issues.'
  ]),
  section('user-obligations', 'User obligations and prohibited conduct', [
    'Users must use the Games and Online Features in accordance with applicable law, these Terms and applicable Platform rules.',
    'The following conduct is prohibited.'
  ], [
    'Using or distributing unauthorized programs such as cheats or hacks',
    'Improperly modifying Game data or communications',
    'Maliciously exploiting or spreading a bug or vulnerability',
    'Intentionally disrupting the service or another user’s normal play',
    'Violating applicable law, third-party rights or applicable Platform policies'
  ]),
  section('service-changes', 'Game service, updates and feature changes', [
    'Lv.B may provide updates or patches and change Game features, rules or content to address security, errors, quality, balance, legal requirements or Platform requirements.',
    'Lv.B does not promise permanent updates or the indefinite availability of any particular feature. Changes expected to cause material disadvantage will be announced where reasonably possible and as required by applicable law.'
  ]),
  section('online-termination', 'Suspension or end of Online Features', [
    'Online Features may depend on EOS, Platforms, network conditions and other external services. They may be suspended or discontinued in whole or in part for technical, security, legal, Platform-policy or reasonable operational reasons.',
    'Planned termination or a material long-term interruption will be announced in advance where reasonably possible. Any required refund or other remedy will be handled under the purchasing Platform’s process and applicable law.'
  ]),
  section('game-data', 'Game data, local saves and EOS UserCloud', [
    'Game data may be divided between local storage on the User’s device and EOS UserCloud where supported. The Privacy Policy describes the categories of information and how they are handled.',
    'Lv.B uses reasonable care in providing save features but cannot guarantee lossless preservation in every case, including device failure, file corruption, synchronization conflicts or failures of a Platform or external service. This does not exclude liability for Lv.B’s intent or gross negligence or any mandatory rights under applicable law.'
  ]),
  section('purchases-refunds', 'Purchases and refunds', [
    'Purchases and payments for Games sold through a Platform, including MushDash, are completed through the Platform selected by the User. The official Lv.B website does not sell Games or paid content directly and does not process payments. Separate paid content can be purchased through the relevant Platform only when it is actually offered.',
    'Cancellation, withdrawal and refund requests are handled under the current process of the purchasing Platform and applicable law. Platform policies do not exclude mandatory consumer rights, and these Terms do not set a fixed play-time threshold or other separate fixed refund rule.'
  ]),
  section('external-services', 'External Platforms and services', [
    'Steam, the Epic Games Store and EOS are external services operated by their respective providers. Lv.B does not directly control their accounts, payment systems, networks, policy changes or outages.',
    'A change or termination of an external service may affect part of a Game. Lv.B will review reasonable responses and share confirmed information where possible, but matters managed directly by an external provider may need to be handled through that provider’s support process.'
  ]),
  section('privacy', 'Privacy', [
    'The Lv.B Privacy Policy explains personal information that may be handled through Games, Online Features, the website and email inquiries. These Terms do not repeat or replace the detailed Privacy Policy.'
  ], undefined, [{ label: 'Privacy Policy', href: getLocalePath('en', 'privacy') }]),
  section('restrictions-liability', 'Restrictions and limits of responsibility', [
    'When prohibited conduct is suspected or confirmed, Lv.B may review the circumstances and take necessary, proportionate steps such as requesting that the conduct stop, preserving relevant evidence, applying technically available protections to affected Online Features, or asking a Platform provider to act. The specific response depends on functions actually available in the Game or Platform and applicable law.',
    'To the extent permitted by law, Lv.B’s responsibility may be limited for failures of Platforms, communication networks or third-party services outside its reasonable control. Nothing here excludes or unfairly limits liability for Lv.B’s intent or gross negligence, statutory warranties or mandatory consumer rights.'
  ]),
  section('law-disputes', 'Governing law and disputes', [
    'These Terms are governed by the laws of the Republic of Korea. This choice does not exclude mandatory rights available under the law of a User’s residence or transaction.',
    'Lv.B and the User will first try in good faith to resolve a dispute through discussion. If no resolution is reached, jurisdiction is determined under applicable laws, including the Korean Civil Procedure Act.'
  ]),
  section('contact-dates', 'Contact and updates', [
    `Questions about these Terms or Game use may be sent to ${contactPolicy.businessEmail}. The official Discord channel may also be used for Game support and bug reports.`,
    'When these Terms change, Lv.B will update the Last updated date and, where needed, provide additional notice in an appropriate place on the Game, Platform or official website.'
  ])
];

const jaSections: readonly TermsSection[] = [
  section('scope', '目的および適用範囲', [
    '本ゲーム利用規約は、Lv.Bが提供するゲームおよび関連するオンライン機能の利用条件ならびにLv.Bと利用者の権利、義務、責任に関する基本事項を定めるものです。',
    '本規約は、SteamやEpic Games Storeなどの外部プラットフォームが運営するアカウント、ストア、決済サービスそのものには直接適用されません。これらには各事業者の規約およびポリシーが別途適用されます。'
  ]),
  section('definitions', '用語の定義', [
    '「ゲーム」とは、MushDash、MushHeroおよび今後本規約の適用を明示するゲームをいいます。「オンライン機能」とは、ログイン、Lobby、Session、P2P接続、クラウドセーブなど、ゲームが提供するネットワーク機能をいいます。',
    '「プラットフォーム」とは、SteamやEpic Games Storeなど、ゲームの購入、ダウンロード、起動またはアカウント機能を提供する外部サービスをいいます。「利用者」とは、適用法令およびプラットフォームの手続に従ってゲームを利用する方をいいます。'
  ]),
  section('notice-changes', '規約の適用、周知および変更', [
    '本規約は、公式サイト、ゲーム画面またはプラットフォーム上の適切な場所に表示され、適用法令上必要な周知または同意の手続が行われた範囲で適用されます。ゲームを購入または起動した事実だけをもって、適切な周知なくすべての条項に同意したものとはみなしません。',
    'Lv.Bは、法令、プラットフォームポリシー、サービス内容または合理的な運営上の必要に変更が生じた場合、関係法令に従って本規約を変更することがあります。重要な変更は合理的な方法と期間をもって事前に案内し、個別の同意が必要な場合は所定の手続を行います。変更前に生じた利用関係について法令上保護される権利を不当に遡及して制限しません。'
  ]),
  section('platform-terms', 'プラットフォーム規約との関係', [
    'プラットフォームアカウント、購入、決済、ダウンロードおよびプラットフォームが直接提供する機能には、当該プラットフォームの最新の規約とポリシーが適用されます。本規約とは、それぞれが管理する範囲で併せて適用されます。',
    '内容が抵触する場合は、適用法令および強行法規上の利用者の権利が優先されます。プラットフォームポリシーが法令上の権利を一律に制限するものとは解釈しません。'
  ], undefined, [
    { label: 'Steam利用規約', href: platformTerms.steam },
    { label: 'Epic Games Storeエンドユーザーライセンス契約', href: platformTerms.epic }
  ]),
  section('license-ip', 'ゲーム利用ライセンスと知的財産権', [
    '利用者がゲームを正当に取得した場合、Lv.Bはプラットフォームの利用条件および本規約に従い、個人的かつ非商業的にゲームを利用するための限定的、非独占的な権利を付与します。この権利は、ゲームまたは知的財産権の所有権を移転するものではありません。',
    'ゲームのコード、グラフィック、音楽、キャラクター、名称その他のコンテンツに関する権利は、Lv.Bまたは正当な権利者に帰属します。適用法令で認められる場合を除き、無断での複製、配布、販売、貸与または商業利用は禁止されます。'
  ]),
  section('accounts-online', 'プラットフォームアカウントとオンライン機能', [
    'Lv.Bは現在、独自のLv.B会員アカウントを運営していません。MushDashのオンライン機能ではSteamまたはEpicアカウント連携とEpic Online Services(EOS)を利用しており、プラットフォームまたはEOSへのログインとサービスの稼働が必要となる場合があります。',
    'Lobby、SessionおよびP2P接続では、利用者の端末間でネットワーク接続が行われることがあります。利用者はプラットフォームの認証情報を適切に管理し、アカウントに関する問題については当該プラットフォームの手続も利用してください。'
  ]),
  section('user-obligations', '利用者の義務および禁止行為', [
    '利用者は、適用法令、本規約および適用されるプラットフォームポリシーに従ってゲームとオンライン機能を利用するものとします。',
    '次の行為は禁止します。'
  ], [
    'チートやハックなどの非公認プログラムを使用または配布する行為',
    'ゲームデータまたは通信を不正な目的で改変する行為',
    '不具合または脆弱性を悪意をもって利用または拡散する行為',
    'サービスまたは他の利用者の正常なプレイを故意に妨害する行為',
    '関係法令、第三者の権利または適用されるプラットフォームポリシーに違反する行為'
  ]),
  section('service-changes', 'ゲームサービス、アップデートおよび機能変更', [
    'Lv.Bは、セキュリティ、エラー修正、品質改善、バランス調整、法令またはプラットフォームの要件に対応するため、アップデートやパッチを提供し、ゲームの機能、ルールまたはコンテンツの一部を変更することがあります。',
    'Lv.Bは、すべてのゲームに対する継続的なアップデートや特定機能の恒久的な提供を保証しません。利用者に重大な不利益が見込まれる変更は、合理的に可能な範囲および関係法令が求める方法で案内します。'
  ]),
  section('online-termination', 'オンライン機能の停止および終了', [
    'オンライン機能は、EOS、プラットフォーム、ネットワーク環境その他の外部サービスに依存する場合があります。技術、セキュリティ、法令、プラットフォームポリシーまたは合理的な運営上の理由により、その全部または一部を一時停止または終了することがあります。',
    '予定された終了または重要な長期停止については、合理的に可能な範囲で事前に案内します。返金その他の対応が必要な場合は、購入したプラットフォームの手続および適用法令に従います。'
  ]),
  section('game-data', 'ゲームデータ、ローカル保存およびEOS UserCloud', [
    'ゲームデータは、利用者の端末にあるローカル保存領域と、対応している場合はEOS UserCloudに分けて保存されることがあります。保存される情報の種類と取扱いはプライバシーポリシーをご確認ください。',
    'Lv.Bは保存機能の安定性確保に合理的な努力を行いますが、端末の故障、ファイル破損、同期の競合、プラットフォームまたは外部サービスの障害など、あらゆる場合にデータが損失なく保存されることを保証するものではありません。ただし、Lv.Bの故意または重大な過失による責任や適用法令上の利用者の権利を排除しません。'
  ]),
  section('purchases-refunds', 'ゲーム・有料コンテンツの購入および返金', [
    'MushDashなど、プラットフォームで販売されるゲーム本体の購入と決済は、利用者が選択したプラットフォームを通じて行われます。Lv.B公式サイトはゲームや有料コンテンツを直接販売せず、決済も処理しません。別途の有料コンテンツは、実際に提供される場合に限り、当該プラットフォームで購入できます。',
    'キャンセル、申込みの撤回および返金は、購入したプラットフォームの最新の手続と適用法令に従って処理されます。プラットフォームポリシーによって法令上保障される消費者の権利が排除されることはなく、本規約ではプレイ時間などの固定された返金条件を別途定めません。'
  ]),
  section('external-services', '外部プラットフォームおよびサービス', [
    'Steam、Epic Games StoreおよびEOSは、それぞれの事業者が運営する外部サービスです。Lv.Bは、外部サービスのアカウント、決済システム、ネットワーク、ポリシー変更または障害を直接管理しません。',
    '外部サービスの変更や終了により、ゲームの一部が影響を受ける場合があります。Lv.Bは確認できる範囲で案内し、合理的な対応を検討しますが、外部事業者が直接管理する事項については当該事業者のサポート手続が必要となることがあります。'
  ]),
  section('privacy', 'プライバシー', [
    'ゲーム、オンライン機能、公式サイトおよびメールでのお問い合わせにおける個人情報の取扱いについては、Lv.Bプライバシーポリシーをご確認ください。本規約はプライバシーポリシーの詳細を繰り返し記載したり、これに代わるものではありません。'
  ], undefined, [{ label: 'プライバシーポリシー', href: getLocalePath('ja', 'privacy') }]),
  section('restrictions-liability', '利用制限および責任の範囲', [
    '禁止行為が疑われ、または確認された場合、Lv.Bは事実関係を確認したうえで、行為の中止要請、関連証拠の保全、技術的に可能なオンライン機能の保護措置、プラットフォーム事業者への対応要請など、必要かつ相当な措置を講じることがあります。具体的な対応は、その時点でゲームやプラットフォームが実際に提供する機能および関係法令に従います。',
    'Lv.Bが合理的に管理できないプラットフォーム、通信網または第三者サービスの障害による損害については、適用法令で認められる範囲で責任が制限されることがあります。本条は、Lv.Bの故意または重大な過失による責任、法定の担保責任、消費者の強行法規上の権利を排除または不当に制限するものではありません。'
  ]),
  section('law-disputes', '準拠法および紛争解決', [
    '本規約の準拠法は大韓民国法とします。ただし、利用者の居住地または取引に適用される強行法規上の権利は、この準拠法の選択によって排除されません。',
    'Lv.Bと利用者は、紛争が生じた場合、まず誠実な協議による解決に努めます。協議で解決しない場合の管轄は、民事訴訟法その他の関係法令に従います。'
  ]),
  section('contact-dates', 'お問い合わせ・更新日', [
    `本規約またはゲーム利用に関するお問い合わせは${contactPolicy.businessEmail}までお送りください。ゲームサポートや不具合報告には公式Discordも利用できます。`,
    '本規約を変更した場合は、このページの最終更新日を更新し、必要に応じてゲーム、プラットフォームまたは公式サイトの適切な場所で追加の案内を行います。'
  ])
];

const zhSections: readonly TermsSection[] = [
  section('scope', '目的与适用范围', [
    '本游戏服务条款规定使用Lv.B提供的游戏及相关在线功能时的基本条件，以及Lv.B与用户的权利、义务和责任。',
    '本条款不直接适用于Steam、Epic Games Store等外部平台自行运营的账户、商店或支付服务。上述服务另行适用相应运营方的条款与政策。'
  ]),
  section('definitions', '术语定义', [
    '“游戏”是指MushDash、MushHero以及今后明确适用本条款的游戏。“在线功能”是指登录、Lobby、Session、P2P连接、云存档等基于网络提供的功能。',
    '“平台”是指Steam、Epic Games Store等提供游戏购买、下载、启动或账户功能的外部服务。“用户”是指按照适用法律与平台流程使用游戏的人员。'
  ]),
  section('notice-changes', '条款的适用、告知与变更', [
    '本条款在官方网站、游戏界面或平台提供的适当位置向用户展示，并完成适用法律要求的告知或同意程序后，在相应范围内适用。不会仅因用户购买或启动游戏，便在未适当告知的情况下认定其已同意全部条款。',
    '法律、平台政策、服务内容或合理运营需求发生变化时，Lv.B可依法修改本条款。重要变更将以合理方式提前告知；依法需要单独取得同意的，将履行相应程序。不会对变更前已经发生的使用关系所享有的法定权利作不当追溯限制。'
  ]),
  section('platform-terms', '与平台条款的关系', [
    '平台账户、购买、支付、下载以及平台直接提供的功能，适用相应平台的最新条款与政策。本条款与平台规则在各自管理的服务范围内共同适用。',
    '如相关内容发生冲突，应优先适用法律及强制性规定保障的用户权利。平台政策不得被解释为当然排除用户依法享有的权利。'
  ], undefined, [
    { label: 'Steam订户协议', href: platformTerms.steam },
    { label: 'Epic Games Store最终用户许可协议', href: platformTerms.epic }
  ]),
  section('license-ip', '游戏使用许可与知识产权', [
    '用户合法取得游戏后，Lv.B依照平台使用条件与本条款，授予用户为个人、非商业目的使用游戏的有限、非独占权利。该许可不转移游戏或相关知识产权的所有权。',
    '游戏代码、画面、音乐、角色、名称及其他内容的权利归Lv.B或相应权利人所有。除适用法律允许的情况外，不得擅自复制、传播、销售、出租或用于商业目的。'
  ]),
  section('accounts-online', '平台账户与在线功能', [
    'Lv.B目前不运营独立的Lv.B会员账户。MushDash的在线功能使用Steam或Epic账户关联以及Epic Online Services(EOS)，因此可能需要保持相应平台或EOS的登录状态且相关服务可用。',
    'Lobby、Session和P2P连接可能在用户设备之间建立网络连接。用户应妥善保护平台账户凭证；账户相关问题还应使用对应平台提供的处理流程。'
  ]),
  section('user-obligations', '用户义务与禁止行为', [
    '用户应遵守适用法律、本条款及相关平台政策使用游戏和在线功能。',
    '禁止实施下列行为。'
  ], [
    '使用或传播作弊工具、外挂等未经授权的程序',
    '以不正当目的篡改游戏数据或通信内容',
    '恶意利用或传播程序错误、漏洞',
    '故意妨碍服务或其他用户正常游戏',
    '违反相关法律、第三方权利或适用的平台政策'
  ]),
  section('service-changes', '游戏服务、更新与功能变更', [
    '为处理安全问题、修复错误、改善品质、调整平衡，或满足法律及平台要求，Lv.B可提供更新或补丁，并调整游戏的部分功能、规则或内容。',
    'Lv.B不保证永久为所有游戏提供更新，也不保证任何特定功能无限期持续可用。可能对用户造成重大不利影响的变更，将在合理可行范围内并按照法律要求进行告知。'
  ]),
  section('online-termination', '在线功能的暂停与终止', [
    '在线功能可能依赖EOS、平台、网络环境及其他外部服务。基于技术、安全、法律、平台政策或合理运营原因，在线功能可能全部或部分暂停或终止。',
    '对于计划内终止或重要的长期中断，Lv.B将在合理可行范围内提前告知。依法需要退款或采取其他措施时，将按照购买平台的流程及适用法律处理。'
  ]),
  section('game-data', '游戏数据、本地存档与EOS UserCloud', [
    '游戏数据可能分别保存在用户设备的本地存储空间以及支持情况下的EOS UserCloud中。有关信息类别和处理方式，请参阅隐私政策。',
    'Lv.B将为存档功能的稳定性采取合理措施，但无法保证在设备故障、文件损坏、同步冲突、平台或外部服务故障等所有情况下数据均无损保存。此说明不排除Lv.B因故意或重大过失应承担的责任，也不限制用户依据强制性法律享有的权利。'
  ]),
  section('purchases-refunds', '游戏、付费内容的购买与退款', [
    '对于MushDash等通过平台销售的游戏本体，用户通过所选择的平台完成购买与付款。Lv.B官方网站不直接销售游戏或付费内容，也不处理支付。独立付费内容仅在实际提供时通过相应平台购买。',
    '取消、撤回购买及退款按照购买平台的最新流程与适用法律处理。平台政策不排除法律保障的消费者权利，本条款也不另行规定固定游戏时长或其他固定退款条件。'
  ]),
  section('external-services', '外部平台与服务', [
    'Steam、Epic Games Store和EOS是由各自运营方提供的外部服务。Lv.B无法直接控制外部服务的账户、支付系统、网络、政策变更或故障。',
    '外部服务发生变更或终止时，游戏的部分功能可能受到影响。Lv.B会在可确认的范围内提供说明并评估合理的应对措施；由外部运营方直接管理的事项，可能需要通过其支持流程处理。'
  ]),
  section('privacy', '隐私保护', [
    '有关游戏、在线功能、官方网站及邮件咨询中可能处理的个人信息，请参阅Lv.B隐私政策。本条款不重复或取代隐私政策的详细内容。'
  ], undefined, [{ label: '隐私政策', href: getLocalePath('zh-cn', 'privacy') }]),
  section('restrictions-liability', '使用限制与责任范围', [
    '发现或合理怀疑存在禁止行为时，Lv.B可在核实情况后采取必要且适度的措施，包括要求停止相关行为、保存有关证据、在技术可行范围内保护受影响的在线功能，或请求平台运营方采取措施。具体处理取决于当时游戏和平台实际提供的功能以及相关法律。',
    '对于Lv.B无法合理控制的平台、通信网络或第三方服务故障造成的损失，Lv.B的责任可在适用法律允许的范围内受到限制。本条不排除或不当限制Lv.B因故意或重大过失应承担的责任、法定担保责任或消费者依据强制性规定享有的权利。'
  ]),
  section('law-disputes', '适用法律与争议解决', [
    '本条款以大韩民国法律为准据法。但用户居住地或相关交易所适用的强制性法律权利，不因该法律选择而被排除。',
    '发生争议时，Lv.B与用户应首先本着诚信原则协商解决。协商未能解决的，管辖法院依照《民事诉讼法》等相关法律确定。'
  ]),
  section('contact-dates', '联系与更新日期', [
    `有关本条款或游戏使用的问题，可发送至${contactPolicy.businessEmail}。游戏支持及程序错误反馈也可通过官方Discord渠道提交。`,
    '本条款变更时，Lv.B将更新本页面的最后更新日期，并在必要时通过游戏、平台或官方网站的适当位置另行告知。'
  ])
];

function assertSectionOrder(locale: Locale, sections: readonly TermsSection[]) {
  const actual = sections.map(({ id }) => id);
  if (actual.length !== termsSectionIds.length || actual.some((id, index) => id !== termsSectionIds[index])) {
    throw new Error(`Terms section order mismatch for ${locale}.`);
  }
}

const documents: Record<Locale, TermsDocumentContent> = {
  en: {
    locale: 'en',
    metaTitle: 'Game Terms of Use | Lv.B',
    metaDescription: 'Terms governing Lv.B games, online features, platform purchases, game data and user responsibilities.',
    eyebrow: 'Legal',
    title: 'Game Terms of Use',
    summary: 'The rules that apply to Lv.B games, their online features and related Platform use.',
    lastUpdatedLabel: 'Last updated:',
    lastUpdated,
    lastUpdatedDisplay: 'August 12, 2026',
    effectiveDateLabel: 'Effective date:',
    effectiveDate,
    effectiveDateDisplay: 'August 12, 2026',
    tableOfContentsLabel: 'On this page',
    externalLinkLabel: 'opens in a new tab',
    contactCardTitle: 'Lv.B legal contact',
    contactLabels: { name: 'Provider', website: 'Website', email: 'Email', privacy: 'Related policy' },
    privacyLabel: 'Privacy Policy',
    sections: enSections
  },
  ko: {
    locale: 'ko',
    metaTitle: '게임 이용약관 | Lv.B',
    metaDescription: 'Lv.B 게임, 온라인 기능, 플랫폼 구매, 게임 데이터와 이용자 의무에 관한 게임 이용약관입니다.',
    eyebrow: '법적 고지',
    title: '게임 이용약관',
    summary: 'Lv.B 게임과 온라인 기능 및 관련 플랫폼 이용에 적용되는 기본 기준입니다.',
    lastUpdatedLabel: '최종 수정일:',
    lastUpdated,
    lastUpdatedDisplay: '2026년 8월 12일',
    effectiveDateLabel: '시행일:',
    effectiveDate,
    effectiveDateDisplay: '2026년 8월 12일',
    tableOfContentsLabel: '목차',
    externalLinkLabel: '새 탭에서 열림',
    contactCardTitle: 'Lv.B 약관 문의',
    contactLabels: { name: '제공자', website: '공식 사이트', email: '이메일', privacy: '관련 정책' },
    privacyLabel: '개인정보 처리방침',
    sections: koSections
  },
  ja: {
    locale: 'ja',
    metaTitle: 'ゲーム利用規約 | Lv.B',
    metaDescription: 'Lv.Bのゲーム、オンライン機能、プラットフォームでの購入、ゲームデータおよび利用者の義務に関する利用規約です。',
    eyebrow: '法的情報',
    title: 'ゲーム利用規約',
    summary: 'Lv.Bのゲーム、オンライン機能および関連するプラットフォーム利用に適用される基本ルールです。',
    lastUpdatedLabel: '最終更新日：',
    lastUpdated,
    lastUpdatedDisplay: '2026年8月12日',
    effectiveDateLabel: '施行日：',
    effectiveDate,
    effectiveDateDisplay: '2026年8月12日',
    tableOfContentsLabel: '目次',
    externalLinkLabel: '新しいタブで開きます',
    contactCardTitle: 'Lv.B規約窓口',
    contactLabels: { name: '提供者', website: '公式サイト', email: 'メール', privacy: '関連ポリシー' },
    privacyLabel: 'プライバシーポリシー',
    sections: jaSections
  },
  'zh-cn': {
    locale: 'zh-cn',
    metaTitle: '游戏服务条款 | Lv.B',
    metaDescription: '适用于Lv.B游戏、在线功能、平台购买、游戏数据及用户义务的游戏服务条款。',
    eyebrow: '法律信息',
    title: '游戏服务条款',
    summary: '适用于Lv.B游戏、在线功能及相关平台使用的基本规则。',
    lastUpdatedLabel: '最后更新日期：',
    lastUpdated,
    lastUpdatedDisplay: '2026年8月12日',
    effectiveDateLabel: '生效日期：',
    effectiveDate,
    effectiveDateDisplay: '2026年8月12日',
    tableOfContentsLabel: '目录',
    externalLinkLabel: '在新标签页中打开',
    contactCardTitle: 'Lv.B条款咨询',
    contactLabels: { name: '提供方', website: '官方网站', email: '电子邮件', privacy: '相关政策' },
    privacyLabel: '隐私政策',
    sections: zhSections
  }
};

for (const locale of Object.keys(documents) as Locale[]) {
  assertSectionOrder(locale, documents[locale].sections);
}

export function getTermsDocument(locale: Locale): TermsDocumentContent {
  return documents[locale];
}
