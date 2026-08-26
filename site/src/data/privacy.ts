import { company } from './company';
import { contactPolicy } from './contact';
import type { Locale } from '../i18n/config';
import {
  privacySectionIds,
  type PrivacyDocumentContent,
  type PrivacyLink,
  type PrivacySection
} from '../types/privacy';

const policyDate = '2026-08-26';

const externalPolicies = {
  netlify: 'https://www.netlify.com/privacy/',
  google: 'https://policies.google.com/privacy',
  steam: 'https://store.steampowered.com/privacy_agreement/',
  epic: 'https://legal.epicgames.com/epicgames/privacy-policy',
  naver: 'https://policy.naver.com/policy/privacy.html'
} as const;

const remedyUrls = {
  privacyPortal: 'https://www.privacy.go.kr/',
  infringementCenter: 'https://privacy.kisa.or.kr/',
  disputeCommittee: 'https://www.kopico.go.kr/'
} as const;

function section(
  id: PrivacySection['id'],
  title: string,
  paragraphs: readonly string[],
  bullets?: readonly string[],
  links?: readonly PrivacyLink[]
): PrivacySection {
  return { id, title, paragraphs, bullets, links };
}

const koSections: readonly PrivacySection[] = [
  section('scope', '처리방침의 목적과 적용 범위', [
    `이 처리방침은 Lv.B 공식 웹사이트, Lv.B가 제공하는 MushHero와 MushDash 및 MushDash의 온라인 기능, 이메일을 통한 문의와 고객 지원에 적용됩니다.`,
    `웹사이트 방문, 게임 플랫폼 이용, 이메일 문의는 서로 다른 경로입니다. 각 플랫폼 사업자가 자체적으로 처리하는 정보에는 해당 사업자의 개인정보 처리방침이 함께 적용됩니다.`
  ]),
  section('controller', '개인정보 처리자 정보', [
    `이 처리방침에서 Lv.B가 직접 받거나 관리하는 개인정보의 처리자는 Lv.B입니다. 주소는 ${company.address}이며, 개인정보 관련 문의는 ${contactPolicy.businessEmail}으로 접수합니다.`
  ]),
  section('purposes', '개인정보 처리 목적', [
    `Lv.B는 문의 확인과 답변, 후속 연락, 기술 지원, 비즈니스 협의, 계약·거래 기록 관리 및 분쟁 대응을 위해 이용자가 이메일로 제공한 정보를 처리할 수 있습니다. 웹사이트 제공과 보안에 필요한 기술 정보는 호스팅 및 외부 콘텐츠 제공 과정에서 각 서비스 사업자가 처리할 수 있습니다.`
  ]),
  section('data-categories', '처리하는 개인정보 항목', [
    `웹사이트에는 회원가입, 로그인, 문의 폼 또는 자체 이용자 데이터베이스가 없습니다. 페이지를 불러올 때 IP 주소, 브라우저·기기 정보, 요청 URL, 접속 시각과 같은 일반적인 요청 정보가 Netlify, Google Maps 또는 Steam 이미지 서버에 전달될 수 있습니다.`,
    `Lv.B가 직접 받을 수 있는 정보는 이용자가 이메일이나 첨부 파일에 자발적으로 포함한 정보입니다.`
  ]),
  section('email-inquiries', '이메일 문의를 통해 처리될 수 있는 정보', [
    `이용자가 메일 프로그램에서 문의를 보내면 표시 이름 또는 이름, 이메일 주소, 문의 내용, 첨부 파일 및 첨부 파일에 포함된 로그·스크린샷·기타 정보가 Lv.B와 이메일 서비스 사업자에게 전달될 수 있습니다. 웹사이트 자체는 메일 본문이나 첨부 파일을 저장하지 않습니다.`
  ]),
  section('games-platforms', '게임 및 플랫폼 온라인 기능', [
    `MushDash는 Steam 또는 Epic 계정 연동과 Epic Online Services(EOS)를 통한 온라인 로그인, Lobby, Session, P2P 연결 및 EOS UserCloud를 사용합니다. 이 과정에서 플랫폼 또는 EOS가 계정 식별자와 접속에 필요한 기술 정보를 처리할 수 있으며, 게임 클라이언트는 실행 중 온라인 기능을 위해 SDK를 통해 해당 식별자를 사용할 수 있습니다.`,
    `EOS UserCloud에는 튜토리얼 진행 상태, 플레이어 표시 이름, 선택한 프로필 아이콘·이름표·아바타 설정, 게임 내 재화 잔액, 보유 꾸미기 항목·인벤토리, Infinity Tower 최고 기록, 주간 도전 식별자·진행값·완료 여부·보상 수령 여부·주차, 중복 구매 처리를 방지하기 위한 거래 식별자가 저장될 수 있습니다. 그래픽·오디오·언어·매칭 지역 설정은 이용자 기기의 로컬 저장 슬롯에 별도로 저장되며 이 UserCloud 경로로 업로드되지 않습니다.`,
    `게임 클라이언트는 계정별 UserCloud 영역을 찾기 위해 SDK에 계정 식별자를 전달하지만, 확인한 저장 JSON 자체에는 Steam ID, Epic Account ID 또는 EOS Product User ID가 포함되지 않습니다. 다만 온라인 로그인에서 받은 플레이어 표시 이름은 프로필 저장 데이터에 포함됩니다. Lv.B는 플랫폼 식별자를 자체 서버나 별도 데이터베이스에 복제·저장하지 않으며, 자체 중앙 게임 서버 또는 개인정보 데이터베이스를 운영하지 않습니다.`,
    `Lv.B는 자체 플레이 분석·텔레메트리 시스템을 운영하지 않습니다. 게임 로그는 이용자 기기에만 생성되며, 크래시 리포트나 로컬 게임 로그를 Lv.B 서버로 자동 전송하지 않습니다. 이용자가 기술 지원 이메일에 로그, 스크린샷 또는 파일을 직접 첨부한 경우에만 해당 자료를 문의 처리에 사용합니다.`
  ]),
  section('retention', '보유 및 이용 기간', [
    `일반 문의 및 게임 지원 이메일은 문의 처리가 완료된 날부터 1년간 보관한 뒤 삭제합니다.`,
    `계약·거래·분쟁 관련 이메일은 관련 법령상 보관 의무가 있는 기간 또는 해당 계약·거래·분쟁이 종료될 때까지 보관하며, 더 긴 보관이 필요한 근거가 적용되는 경우 그 기간을 따릅니다.`,
    `EOS UserCloud 데이터는 온라인 저장 기능을 제공하기 위해 보관됩니다. 현재 확인한 게임 코드에는 자동 만료·정기 삭제 기간이 없으며, 게임 삭제 또는 계정 연동 해제만으로 자동 삭제되는 기능도 없습니다. 유효한 이용자 요청, 서비스 종료 또는 처리 목적 종료 시에는 적용 법령과 플랫폼·EOS의 기술 절차에 따라 보관 또는 삭제를 처리하며, Lv.B가 별도로 확정한 고정 보유기간은 없습니다.`
  ]),
  section('deletion', '파기 절차와 방법', [
    `Lv.B는 보유기간이 지난 일반 문의 이메일과 첨부 파일을 메일함과 관련 보관 위치에서 일반적인 방법으로 복구하기 어렵도록 삭제합니다. 이 정리는 자동 삭제 시스템이 아니라 운영 과정에서 직접 확인하여 수행합니다. 법령상 보존 대상은 일반 문의 기록과 분리하여 필요한 기간 동안만 보관합니다.`,
    `현재 확인한 게임 코드에는 이용자가 직접 실행하는 EOS UserCloud 삭제 기능이나 클라우드 파일 삭제 호출이 없습니다. 이용자는 ${contactPolicy.businessEmail}으로 UserCloud 데이터 관련 문의 또는 삭제 요청을 보낼 수 있으며, Lv.B는 본인 확인, 적용 법령, 플랫폼 및 EOS가 제공하는 기술 절차를 확인한 뒤 처리합니다. 즉시 또는 항상 삭제할 수 있다고 보장하지 않으며, 처리가 불가능하거나 제한되는 경우 그 사유를 안내합니다.`
  ]),
  section('third-party-disclosure', '제3자 제공', [
    `현재 웹사이트 코드에는 개인정보를 판매하거나 제3자에게 전송하는 기능이 없습니다. 이용자가 외부 플랫폼이나 지도, 소셜 링크를 이용하면 정보는 Lv.B 웹사이트를 통하지 않고 해당 사업자에게 직접 전달될 수 있습니다. 법령상 의무 또는 이용자의 요청·동의에 따른 제공이 필요한 경우에는 적용 법령에 따라 처리합니다.`
  ]),
  section('processors', '개인정보 처리업무 위탁', [
    `Netlify의 정적 호스팅과 NAVER 메일 등 외부 서비스가 사용되지만, 현재 저장소만으로 각 사업자와 Lv.B 사이의 법적 처리 관계를 위탁, 제3자 제공 또는 독립 처리 중 하나로 확정하지 않습니다. 계약과 실제 운영 설정이 확인되면 필요한 공개 사항을 갱신합니다.`
  ]),
  section(
    'external-services',
    '외부 서비스 및 플랫폼',
    [
      `웹사이트는 Netlify에서 정적으로 호스팅되며, About 페이지의 Google Maps iframe과 Steam 서버의 게임 이미지를 사용합니다. 문의 메일은 NAVER 메일 주소로 수신하고, 게임 및 스토어 링크는 Steam과 Epic Games Store로 연결됩니다. MushDash의 온라인 기능에는 EOS가 사용됩니다.`,
      `MushHero 페이지의 공식 영상은 이용자가 재생을 선택한 뒤에만 YouTube의 개인정보 보호 강화 모드 도메인(youtube-nocookie.com)에서 불러옵니다. Lv.B는 영상 시청 정보를 자체 데이터베이스에 저장하지 않으며, 영상을 불러온 뒤에는 Google 또는 YouTube의 정책이 적용될 수 있습니다.`,
      `외부 콘텐츠를 불러오거나 링크를 방문하면 IP 주소, 요청 URL, 브라우저·기기 정보, 접속 시각 같은 기술 정보가 해당 사업자에게 전달될 수 있습니다. Lv.B는 외부 사업자의 계정·로그·보유기간을 직접 관리하지 않습니다.`
    ],
    undefined,
    [
      { label: 'Netlify 개인정보 처리방침', href: externalPolicies.netlify },
      { label: 'Google 개인정보처리방침', href: externalPolicies.google },
      { label: 'Steam 개인정보 처리방침', href: externalPolicies.steam },
      { label: 'Epic Games 개인정보 처리방침', href: externalPolicies.epic },
      { label: 'NAVER 개인정보 처리방침', href: externalPolicies.naver }
    ]
  ),
  section('international-processing', '국외 처리 또는 이전', [
    `Netlify, Google, Valve 및 Epic Games 같은 외부 사업자는 여러 국가의 인프라를 사용할 수 있어 기술 요청이나 플랫폼 정보가 대한민국 밖에서 처리될 가능성이 있습니다. 실제 처리 위치, 보유기간 및 이전의 법적 형태는 이용 서비스와 계약·계정 설정에 따라 달라지므로 각 사업자의 최신 정책을 함께 확인해 주세요.`
  ]),
  section('automatic-data', '자동 수집 정보, 쿠키 및 로컬 저장소', [
    `Lv.B는 홈페이지에서 별도의 방문자 분석·광고·행동 추적 도구를 운영하지 않으며, Netlify Web Analytics, Real User Monitoring 및 Log Drains를 사용하지 않습니다. Google Analytics, Google Tag Manager, 광고 픽셀이나 자체 분석 쿠키도 사용하지 않습니다.`,
    `Netlify는 정적 호스팅 제공 과정에서 일반적인 네트워크 요청 정보를 처리할 수 있으며 Netlify의 정책이 적용됩니다. Google Maps iframe과 외부 플랫폼도 자체 정책에 따라 쿠키 또는 유사 기술을 사용할 수 있습니다.`
  ]),
  section('children', '만 14세 미만 이용자', [
    `Lv.B는 만 14세 미만 아동을 대상으로 개인정보를 의도적으로 직접 수집하지 않습니다. 법정대리인의 동의가 필요한 개인정보를 직접 처리하게 되는 경우 관련 법령에 따른 동의 및 보호 절차를 진행합니다.`
  ]),
  section('rights', '정보주체와 법정대리인의 권리', [
    `정보주체 또는 법정대리인은 Lv.B가 관리하는 개인정보에 대해 열람, 정정, 삭제 또는 처리정지를 요청할 수 있습니다. Lv.B는 요청자 본인 여부와 적용 법령상 제한을 확인한 뒤 회신합니다. 외부 플랫폼이 직접 관리하는 정보는 해당 사업자의 개인정보 설정이나 문의 절차를 이용해야 합니다.`
  ]),
  section('security', '안전성 확보조치', [
    `Lv.B는 홈페이지에서 직접 수집하는 정보를 줄이기 위해 계정, 문의 폼과 자체 데이터베이스를 운영하지 않으며 HTTPS 기반 정적 호스팅과 필요한 범위의 접근 관리를 사용합니다. 개인정보가 포함된 이메일이나 첨부 파일을 보낼 때에는 필요한 정보만 포함해 주세요.`
  ]),
  section('contact', '개인정보 관련 문의', [
    `개인정보 보호 담당부서는 Lv.B입니다. 개인정보 처리, 열람·정정·삭제·처리정지 요청 또는 이 처리방침에 관한 문의는 ${contactPolicy.businessEmail}으로 보내 주세요. 공식 사이트는 https://lvb.kr/ 이며 별도의 개인정보 전용 폼이나 전화번호는 운영하지 않습니다.`
  ]),
  section(
    'remedies',
    '권익침해 구제방법',
    [
      `개인정보 침해에 대한 상담이나 분쟁 조정이 필요한 경우 아래 대한민국의 공식 기관을 이용할 수 있습니다. Lv.B에 먼저 문의하는 것을 권장하지만, 이는 외부 기관에 도움을 요청할 권리를 제한하지 않습니다.`
    ],
    undefined,
    [
      { label: '개인정보 포털', href: remedyUrls.privacyPortal },
      { label: '개인정보침해신고센터 (국번 없이 118)', href: remedyUrls.infringementCenter },
      { label: '개인정보분쟁조정위원회 (1833-6972)', href: remedyUrls.disputeCommittee }
    ]
  ),
  section('changes', '처리방침 변경과 시행', [
    `Lv.B는 서비스 또는 개인정보 처리 방식이 바뀌면 이 페이지의 내용과 최종 변경일을 갱신합니다. 중요한 변경은 필요한 경우 홈페이지의 적절한 위치에서 추가로 안내합니다.`
  ])
];

const enSections: readonly PrivacySection[] = [
  section('scope', 'Purpose and scope', [
    `This Policy applies to the official Lv.B website, MushHero and MushDash, the online features of MushDash, and inquiries or support sent by email.`,
    `Website visits, game-platform use and email inquiries are separate interactions. A platform provider’s own privacy notice also applies to information it processes independently.`
  ]),
  section('controller', 'Who is responsible', [
    `Lv.B is responsible for personal information it receives or manages directly under this Policy. Lv.B is located at ${company.address}, and privacy inquiries may be sent to ${contactPolicy.businessEmail}.`
  ]),
  section('purposes', 'Why information may be processed', [
    `Lv.B may use information submitted by email to review and answer inquiries, follow up, provide technical support, discuss business matters, maintain contract or transaction records and respond to disputes. Hosting and external-content providers may process technical request data to deliver and secure the website.`
  ]),
  section('data-categories', 'Information that may be processed', [
    `The website has no registration, login, contact form or first-party user database. Loading a page may send ordinary request data—such as an IP address, browser or device information, requested URL and access time—to Netlify, Google Maps or Steam image servers.`,
    `Lv.B may directly receive information that a person chooses to include in an email or attachment.`
  ]),
  section('email-inquiries', 'Email inquiries', [
    `When a person sends an inquiry from their email application, Lv.B and the email provider may receive their name or display name, email address, message, attachments, and logs, screenshots or other information contained in those attachments. The website itself does not store the message or attachments.`
  ]),
  section('games-platforms', 'Games and platform features', [
    `MushDash uses Steam or Epic account integration and Epic Online Services(EOS) for online sign-in, Lobby, Session, P2P connections and EOS UserCloud. A platform or EOS may process account identifiers and technical connection information, and the game client may use those identifiers through the SDK while online features are running.`,
    `EOS UserCloud may store tutorial progress, the player display name, selected profile icon, nameplate and avatar settings, in-game currency balances, owned customization items and inventory, the highest Infinity Tower record, weekly challenge ID, progress, completion, reward-claim status and week number, and transaction identifiers used to prevent duplicate purchase processing. Graphics, audio, language and matchmaking-region settings are stored separately in a local slot on the user’s device and are not uploaded through this UserCloud path.`,
    `The game client passes an account identifier to the SDK to locate the account-specific UserCloud area, but the reviewed save JSON does not itself contain a Steam ID, Epic Account ID or EOS Product User ID. The player display name received during online sign-in is included in the profile save data. Lv.B does not copy platform identifiers to its own server or a separate database and operates no proprietary central game server or personal-information database.`,
    `Lv.B operates no proprietary gameplay analytics or telemetry system. Game logs are created only on the user’s device, and Lv.B does not automatically send crash reports or local game logs to an Lv.B server. Lv.B receives logs, screenshots or files only when a person chooses to attach them to a technical-support email.`
  ]),
  section('retention', 'Retention', [
    `General inquiry and game-support emails are retained for one year after the inquiry is closed and are then deleted.`,
    `Emails concerning contracts, transactions or disputes are retained for the period required by applicable law or until the contract, transaction or dispute ends. If a longer retention basis applies, Lv.B follows that period.`,
    `EOS UserCloud data is retained to provide online save functionality. The reviewed game code sets no automatic expiry or scheduled deletion period and does not trigger deletion when the game is uninstalled or an account is unlinked. In response to a valid user request, service termination or the end of the processing purpose, retention or deletion is handled under applicable law and the technical procedures available from the platform and EOS. Lv.B has not established a separate fixed retention period.`
  ]),
  section('deletion', 'Deletion', [
    `Lv.B removes expired general-inquiry emails and attachments from its mailbox and related storage in a manner intended to prevent ordinary recovery. This is an operational review and deletion process, not an automated deletion system. Records that must be retained by law are separated from general inquiries and kept only for the required period.`,
    `The reviewed game code has no user-facing EOS UserCloud deletion feature and makes no cloud-file deletion call. A person may email ${contactPolicy.businessEmail} with a UserCloud-data inquiry or deletion request. Lv.B will verify the requester, applicable law and the technical procedures available from the platform and EOS before responding. Immediate or universal deletion is not guaranteed, and Lv.B will explain any applicable limitation.`
  ]),
  section('third-party-disclosure', 'Third-party disclosure', [
    `The current website code has no feature that sells personal information or sends it to third parties. When a person uses a platform, map or social link, information may be sent directly to that provider rather than through the Lv.B website. Any disclosure required by law or requested or authorized by the person will be handled under applicable law.`
  ]),
  section('processors', 'Service providers and processing roles', [
    `The site uses external services such as Netlify static hosting and NAVER Mail. The repository alone does not establish whether every provider is legally a processor, recipient or independent controller in relation to Lv.B. Required disclosures will be updated after the applicable contracts and operational settings are confirmed.`
  ]),
  section(
    'external-services',
    'External services and platforms',
    [
      `The website is statically hosted on Netlify, embeds Google Maps on the About page and loads game images from Steam servers. Inquiries are received at a NAVER Mail address, while game and store links lead to Steam and the Epic Games Store. MushDash uses EOS for its online features.`,
      `Official videos on the MushHero page load from YouTube's privacy-enhanced domain (youtube-nocookie.com) only after the visitor selects Play. Lv.B does not store video-viewing data in its own database; after a video is loaded, Google or YouTube policies may apply.`,
      `Loading external content or following a link may give that provider technical data such as an IP address, requested URL, browser or device information and access time. Lv.B does not directly manage those providers’ accounts, logs or retention periods.`
    ],
    undefined,
    [
      { label: 'Netlify Privacy Statement', href: externalPolicies.netlify },
      { label: 'Google Privacy Policy', href: externalPolicies.google },
      { label: 'Steam Privacy Policy', href: externalPolicies.steam },
      { label: 'Epic Games Privacy Policy', href: externalPolicies.epic },
      { label: 'NAVER Privacy Policy', href: externalPolicies.naver }
    ]
  ),
  section('international-processing', 'International processing or transfers', [
    `Providers such as Netlify, Google, Valve and Epic Games may use infrastructure in multiple countries, so technical requests or platform information may be processed outside South Korea. The location, retention period and legal form of any transfer depend on the service, contract and account settings; please review each provider’s current notice.`
  ]),
  section('automatic-data', 'Automatic data, cookies and local storage', [
    `Lv.B uses no separate visitor analytics, advertising or behavioral-tracking tool on the website and does not use Netlify Web Analytics, Real User Monitoring or Log Drains. It also uses no Google Analytics, Google Tag Manager, advertising pixel or first-party analytics cookie.`,
    `Netlify may process ordinary network-request information while providing static hosting, subject to Netlify’s policies. The Google Maps iframe and external platforms may also use cookies or similar technologies under their own policies.`
  ]),
  section('children', 'Children under 14', [
    `Lv.B does not intentionally collect personal information directly from children under 14. If Lv.B directly processes personal information for which consent from a legal guardian is required, it will apply the consent and protection procedures required by applicable law.`
  ]),
  section('rights', 'Your rights', [
    `A person or legal guardian may ask to access, correct, delete or restrict processing of personal information managed by Lv.B. Lv.B will verify the requester and any applicable legal limits before responding. Information managed directly by an external platform must be handled through that provider’s privacy settings or request process.`
  ]),
  section('security', 'Security measures', [
    `Lv.B reduces direct website collection by operating no account system, inquiry form or first-party user database, and uses HTTPS static hosting and access controls appropriate to the information involved. Please include only necessary information in emails and attachments.`
  ]),
  section('contact', 'Privacy contact', [
    `The department responsible for privacy inquiries is Lv.B. For questions about personal information, requests to access, correct, delete or restrict processing, or questions about this Policy, email ${contactPolicy.businessEmail}. The official website is https://lvb.kr/. Lv.B does not operate a separate privacy form or telephone line.`
  ]),
  section(
    'remedies',
    'Complaints and remedies',
    [
      `For privacy advice or dispute resolution in South Korea, you may contact the official bodies below. We encourage you to contact Lv.B first, but doing so does not limit your right to seek help elsewhere.`
    ],
    undefined,
    [
      { label: 'Korea Privacy Portal', href: remedyUrls.privacyPortal },
      { label: 'KISA Privacy Infringement Center (118)', href: remedyUrls.infringementCenter },
      { label: 'Personal Information Dispute Mediation Committee (1833-6972)', href: remedyUrls.disputeCommittee }
    ]
  ),
  section('changes', 'Changes and publication', [
    `Lv.B will update this page and the Last updated date when its services or privacy practices change. Material changes may also be announced in an appropriate area of the website.`
  ])
];

const jaSections: readonly PrivacySection[] = [
  section('scope', '本ポリシーの目的と適用範囲', [
    `本ポリシーは、Lv.B公式サイト、Lv.Bが提供するMushHeroおよびMushDash、MushDashのオンライン機能、メールによるお問い合わせとサポートに適用されます。`,
    `サイトの閲覧、ゲームプラットフォームの利用、メールでのお問い合わせは、それぞれ異なる経路です。各プラットフォームが独自に処理する情報には、その事業者のプライバシーポリシーも適用されます。`
  ]),
  section('controller', '個人情報を取り扱う事業者', [
    `本ポリシーに基づきLv.Bが直接受領または管理する個人情報は、Lv.Bが取り扱います。所在地は${company.address}、プライバシーに関する連絡先は${contactPolicy.businessEmail}です。`
  ]),
  section('purposes', '利用目的', [
    `Lv.Bは、お問い合わせの確認・回答、追加連絡、技術サポート、事業上の協議、契約・取引記録の管理、紛争対応のため、メールで提供された情報を取り扱う場合があります。サイトの配信と安全な運用に必要な技術情報は、ホスティング事業者や外部コンテンツ提供者が処理する場合があります。`
  ]),
  section('data-categories', '取り扱う可能性のある情報', [
    `本サイトには会員登録、ログイン、お問い合わせフォーム、独自のユーザーデータベースはありません。ページの読み込み時に、IPアドレス、ブラウザ・端末情報、リクエストURL、アクセス日時などの一般的な通信情報がNetlify、Google Maps、Steamの画像サーバーへ送信される場合があります。`,
    `Lv.Bが直接受け取る可能性があるのは、利用者がメールまたは添付ファイルに任意で含めた情報です。`
  ]),
  section('email-inquiries', 'メールでのお問い合わせ', [
    `メールソフトからお問い合わせを送信すると、表示名または氏名、メールアドレス、本文、添付ファイルおよび添付ファイルに含まれるログ、スクリーンショット、その他の情報がLv.Bとメールサービス事業者に送信される場合があります。本サイト自体は本文や添付ファイルを保存しません。`
  ]),
  section('games-platforms', 'ゲームとプラットフォーム機能', [
    `MushDashは、SteamまたはEpicアカウントとの連携、およびEpic Online Services(EOS)によるオンラインログイン、Lobby、Session、P2P接続、EOS UserCloudを利用します。この過程でプラットフォームまたはEOSがアカウント識別子や接続に必要な技術情報を処理する場合があり、ゲームクライアントはオンライン機能の実行中にSDKを通じて当該識別子を利用する場合があります。`,
    `EOS UserCloudには、チュートリアルの進行状況、プレイヤー表示名、選択したプロフィールアイコン・ネームプレート・アバター設定、ゲーム内通貨残高、所有しているカスタマイズ項目・インベントリ、Infinity Towerの最高記録、ウィークリーチャレンジのID・進行値・完了状況・報酬受取状況・週番号、および購入処理の重複を防止するための取引識別子が保存される場合があります。グラフィック、オーディオ、言語、マッチメイキング地域の設定は利用者端末のローカルスロットに別途保存され、このUserCloud経路ではアップロードされません。`,
    `ゲームクライアントはアカウント別のUserCloud領域を特定するため、SDKへアカウント識別子を渡しますが、確認したセーブJSON自体にSteam ID、Epic Account ID、EOS Product User IDは含まれていません。ただし、オンラインログイン時に受け取ったプレイヤー表示名はプロフィールのセーブデータに含まれます。Lv.Bはプラットフォーム識別子を独自サーバーや別個のデータベースへ複製・保存せず、独自の中央ゲームサーバーまたは個人情報データベースを運用していません。`,
    `Lv.Bは独自のプレイ分析・テレメトリシステムを運用していません。ゲームログは利用者の端末内にのみ生成され、クラッシュレポートやローカルゲームログがLv.Bのサーバーへ自動送信されることはありません。利用者が技術サポートのメールにログ、スクリーンショット、ファイルを自ら添付した場合に限り、お問い合わせ対応のために利用します。`
  ]),
  section('retention', '保存期間', [
    `一般のお問い合わせおよびゲームサポートのメールは、対応完了日から1年間保存した後に削除します。`,
    `契約、取引、紛争に関するメールは、関連法令で保存が義務付けられる期間、または当該契約、取引、紛争が終了するまで保存します。より長い保存を必要とする根拠が適用される場合は、その期間に従います。`,
    `EOS UserCloudデータは、オンラインセーブ機能を提供するために保存されます。確認したゲームコードには自動有効期限や定期削除期間がなく、ゲームのアンインストールやアカウント連携の解除を契機に自動削除する処理もありません。有効な利用者からの依頼、サービス終了、または処理目的の終了時には、適用法令およびプラットフォーム・EOSが提供する技術手続に従って保存または削除を取り扱います。Lv.Bが別途定めた固定保存期間はありません。`
  ]),
  section('deletion', '削除の手続と方法', [
    `Lv.Bは、保存期間を経過した一般のお問い合わせメールと添付ファイルを、メールボックスおよび関連する保存場所から通常の方法では復元しにくい形で削除します。これは自動削除システムではなく、運用上の確認を経て行う手続です。法令上保存が必要な記録は一般のお問い合わせ記録と分け、必要な期間に限って保存します。`,
    `確認したゲームコードには、利用者が直接実行できるEOS UserCloudの削除機能およびクラウドファイルの削除呼び出しがありません。UserCloudデータに関するお問い合わせや削除依頼は${contactPolicy.businessEmail}までお送りください。Lv.Bは本人確認、適用法令、プラットフォームとEOSが提供する技術手続を確認したうえで対応します。即時または常に削除できることを保証するものではなく、制限がある場合はその理由を案内します。`
  ]),
  section('third-party-disclosure', '第三者への提供', [
    `現在のサイトコードには、個人情報を販売したり第三者へ送信したりする機能はありません。外部プラットフォーム、地図、ソーシャルリンクを利用すると、情報がLv.Bサイトを経由せず各事業者へ直接送信される場合があります。法令上必要な場合、または本人の依頼・同意がある場合は、適用法令に従って対応します。`
  ]),
  section('processors', '外部事業者と処理上の役割', [
    `Netlifyの静的ホスティングやNAVERメールなどの外部サービスを利用していますが、リポジトリだけでは各事業者とLv.Bの法的関係を委託先、提供先、独立した管理者のいずれかに確定できません。契約と運用設定を確認したうえで、必要な開示内容を更新します。`
  ]),
  section(
    'external-services',
    '外部サービスとプラットフォーム',
    [
      `本サイトはNetlifyで静的にホスティングされ、AboutページではGoogle Mapsのiframe、ゲーム画像にはSteamのサーバーを利用しています。お問い合わせはNAVERメールで受信し、ゲームとストアのリンクはSteamおよびEpic Games Storeへ移動します。MushDashのオンライン機能にはEOSを利用します。`,
      `MushHeroページの公式動画は、利用者が再生を選択した後に限り、YouTubeのプライバシー強化モードのドメイン（youtube-nocookie.com）から読み込まれます。Lv.Bは動画の視聴情報を独自データベースへ保存しません。動画の読み込み後は、GoogleまたはYouTubeのポリシーが適用される場合があります。`,
      `外部コンテンツの読み込みやリンク先への移動により、IPアドレス、リクエストURL、ブラウザ・端末情報、アクセス日時などが各事業者へ送信される場合があります。Lv.Bは各事業者のアカウント、ログ、保存期間を直接管理しません。`
    ],
    undefined,
    [
      { label: 'Netlifyプライバシーステートメント', href: externalPolicies.netlify },
      { label: 'Googleプライバシーポリシー', href: externalPolicies.google },
      { label: 'Steamプライバシーポリシー', href: externalPolicies.steam },
      { label: 'Epic Gamesプライバシーポリシー', href: externalPolicies.epic },
      { label: 'NAVERプライバシーポリシー', href: externalPolicies.naver }
    ]
  ),
  section('international-processing', '国外での処理または移転', [
    `Netlify、Google、Valve、Epic Gamesなどは複数国のインフラを利用する場合があり、技術的なリクエストやプラットフォーム情報が韓国外で処理される可能性があります。処理場所、保存期間、移転の法的な形態は、サービス、契約、アカウント設定によって異なるため、各事業者の最新ポリシーをご確認ください。`
  ]),
  section('automatic-data', '自動取得情報、Cookie、ローカルストレージ', [
    `Lv.Bは、本サイトで独自の訪問者分析、広告、行動追跡ツールを運用せず、Netlify Web Analytics、Real User Monitoring、Log Drainsを使用していません。Google Analytics、Google Tag Manager、広告ピクセル、独自の分析Cookieも使用していません。`,
    `Netlifyは静的ホスティングの提供に伴い一般的なネットワークリクエスト情報を処理する場合があり、Netlifyのポリシーが適用されます。Google Mapsのiframeや外部プラットフォームも、各自のポリシーに基づきCookieなどを使用する場合があります。`
  ]),
  section('children', '14歳未満の利用者', [
    `Lv.Bは、14歳未満の子どもを対象として個人情報を意図的に直接収集しません。法定代理人の同意が必要な個人情報をLv.Bが直接取り扱う場合は、関連法令に基づく同意および保護手続を行います。`
  ]),
  section('rights', '本人および法定代理人の権利', [
    `本人または法定代理人は、Lv.Bが管理する個人情報について、開示、訂正、削除、取扱いの停止を求めることができます。Lv.Bは本人確認と適用法令上の制限を確認したうえで回答します。外部プラットフォームが直接管理する情報は、各事業者の設定または申請手続をご利用ください。`
  ]),
  section('security', '安全管理措置', [
    `Lv.Bは、アカウント、お問い合わせフォーム、独自のユーザーデータベースを設けず、サイト上で直接取得する情報を抑えています。また、HTTPSによる静的ホスティングと、情報に応じたアクセス管理を使用しています。メールや添付ファイルには必要な情報のみを含めてください。`
  ]),
  section('contact', 'プライバシーに関するお問い合わせ', [
    `プライバシーに関する担当部門はLv.Bです。個人情報の取扱い、開示・訂正・削除・取扱い停止の申請、本ポリシーに関するお問い合わせは${contactPolicy.businessEmail}へお送りください。公式サイトはhttps://lvb.kr/です。専用フォームや電話窓口は設けていません。`
  ]),
  section(
    'remedies',
    '相談・紛争解決窓口',
    [
      `韓国における個人情報の相談や紛争調整には、以下の公的機関を利用できます。まずLv.Bへご連絡いただくことを推奨しますが、外部機関へ相談する権利を制限するものではありません。`
    ],
    undefined,
    [
      { label: '個人情報ポータル', href: remedyUrls.privacyPortal },
      { label: '個人情報侵害申告センター（118）', href: remedyUrls.infringementCenter },
      { label: '個人情報紛争調整委員会（1833-6972）', href: remedyUrls.disputeCommittee }
    ]
  ),
  section('changes', '本ポリシーの変更と公開', [
    `Lv.Bは、サービスまたは個人情報の取扱いが変わった場合、本ページと最終更新日を更新します。重要な変更は必要に応じてサイト内の適切な場所でもお知らせします。`
  ])
];

const zhSections: readonly PrivacySection[] = [
  section('scope', '本政策的目的与适用范围', [
    `本政策适用于Lv.B官方网站、Lv.B提供的MushHero与MushDash、MushDash的在线功能，以及通过电子邮件进行的咨询与客户支持。`,
    `访问网站、使用游戏平台和发送电子邮件属于不同的处理场景。平台运营方独立处理的信息还适用其各自的隐私政策。`
  ]),
  section('controller', '个人信息处理方', [
    `对于Lv.B依照本政策直接接收或管理的个人信息，处理方为Lv.B。地址为${company.address}，隐私相关咨询可发送至${contactPolicy.businessEmail}。`
  ]),
  section('purposes', '处理目的', [
    `Lv.B可能会使用用户通过电子邮件提供的信息，以查看和回复咨询、进行后续联系、提供技术支持、开展商务沟通、管理合同与交易记录以及处理争议。为提供并保护网站，托管服务商和外部内容提供商可能会处理必要的技术请求信息。`
  ]),
  section('data-categories', '可能处理的信息', [
    `本网站不提供注册、登录或在线咨询表单，也不运营自有用户数据库。加载页面时，IP地址、浏览器或设备信息、请求URL、访问时间等常规请求信息可能会发送至Netlify、Google Maps或Steam图片服务器。`,
    `Lv.B可能直接收到用户自愿写入电子邮件或附件中的信息。`
  ]),
  section('email-inquiries', '电子邮件咨询', [
    `用户通过邮件客户端发送咨询时，Lv.B与邮件服务商可能会收到姓名或显示名称、电子邮件地址、咨询内容、附件，以及附件中包含的日志、截图或其他信息。网站本身不会保存邮件正文或附件。`
  ]),
  section('games-platforms', '游戏与平台在线功能', [
    `MushDash使用Steam或Epic账户关联，并通过Epic Online Services(EOS)提供在线登录、Lobby、Session、P2P连接和EOS UserCloud功能。在此过程中，平台或EOS可能会处理账户标识符及连接所需的技术信息；游戏客户端在运行在线功能时，可能会通过SDK使用相关标识符。`,
    `EOS UserCloud可能保存教程进度、玩家显示名称、所选个人资料图标、名牌与角色外观设置、游戏内货币余额、已拥有的自定义内容与物品栏、Infinity Tower最高记录、每周挑战ID、进度、完成状态、奖励领取状态与周次，以及用于防止重复处理购买交易的交易标识符。画面、音频、语言和匹配地区设置会单独保存至用户设备的本地存档槽，不会通过此UserCloud路径上传。`,
    `游戏客户端会向SDK传递账户标识符，以定位对应账户的UserCloud空间；但经核查，存档JSON本身不包含Steam ID、Epic Account ID或EOS Product User ID。在线登录时取得的玩家显示名称会包含在个人资料存档中。Lv.B不会将平台标识符复制或保存至自有服务器或单独的数据库，也不运营自有中央游戏服务器或个人信息数据库。`,
    `Lv.B不运营自有的游玩分析或遥测系统。游戏日志仅生成在用户设备本地，崩溃报告或本地游戏日志不会自动发送至Lv.B服务器。仅当用户主动将日志、截图或文件附加至技术支持邮件时，Lv.B才会将其用于处理咨询。`
  ]),
  section('retention', '保存期限', [
    `一般咨询和游戏支持邮件会在咨询处理完毕后保存1年，之后予以删除。`,
    `与合同、交易或争议有关的邮件，会按照相关法律要求的期限保存，或保存至相应合同、交易或争议结束为止。如存在需要更长期保存的依据，则按照该期限处理。`,
    `EOS UserCloud数据会为提供在线存档功能而保存。经核查，游戏代码未设置自动到期或定期删除期限，也不包含以卸载游戏或解除账户关联为触发条件的自动删除流程。收到有效用户请求、服务终止或处理目的结束时，将依据适用法律以及平台与EOS提供的技术流程处理保存或删除事宜。Lv.B尚未另行设定固定保存期限。`
  ]),
  section('deletion', '删除流程与方式', [
    `Lv.B会将超过保存期限的一般咨询邮件和附件从邮箱及相关保存位置中删除，使其通常难以恢复。该流程由运营人员确认并执行，并非自动删除系统。依法必须保存的记录会与一般咨询记录分开，仅在必要期限内保存。`,
    `经核查，游戏代码未提供用户可直接使用的EOS UserCloud删除功能，也未调用云端文件删除功能。用户可发送邮件至${contactPolicy.businessEmail}，咨询UserCloud数据或提出删除请求。Lv.B将在核实本人身份、适用法律及平台与EOS提供的技术流程后进行处理；不保证所有情况下均可立即删除，如存在限制将说明原因。`
  ]),
  section('third-party-disclosure', '向第三方提供', [
    `当前网站代码不包含出售个人信息或将其发送给第三方的功能。用户使用外部平台、地图或社交链接时，信息可能不经Lv.B网站而直接发送至相应服务商。因法律要求或用户请求、同意而需要提供信息时，将依照适用法律处理。`
  ]),
  section('processors', '外部服务商与处理角色', [
    `网站使用Netlify静态托管、NAVER邮箱等外部服务，但仅凭仓库无法确定每家服务商与Lv.B之间属于受托处理、第三方接收还是独立处理关系。确认适用合同和实际运营设置后，将更新需要公开的内容。`
  ]),
  section(
    'external-services',
    '外部服务与平台',
    [
      `网站由Netlify进行静态托管，About页面嵌入Google Maps iframe，游戏图片从Steam服务器加载。咨询邮件由NAVER邮箱接收，游戏和商店链接则指向Steam与Epic Games Store。MushDash的在线功能使用EOS。`,
      `MushHero页面中的官方视频仅会在用户选择播放后，从YouTube的隐私增强模式域名（youtube-nocookie.com）加载。Lv.B不会在自有数据库中保存视频观看信息；视频加载后，可能适用Google或YouTube的相关政策。`,
      `加载外部内容或访问链接时，IP地址、请求URL、浏览器或设备信息、访问时间等技术信息可能会发送给相应服务商。Lv.B不直接管理这些服务商的账户、日志或保存期限。`
    ],
    undefined,
    [
      { label: 'Netlify隐私声明', href: externalPolicies.netlify },
      { label: 'Google隐私权政策', href: externalPolicies.google },
      { label: 'Steam隐私政策', href: externalPolicies.steam },
      { label: 'Epic Games隐私政策', href: externalPolicies.epic },
      { label: 'NAVER隐私政策', href: externalPolicies.naver }
    ]
  ),
  section('international-processing', '境外处理或传输', [
    `Netlify、Google、Valve和Epic Games等服务商可能使用分布在多个国家或地区的基础设施，因此技术请求或平台信息可能在韩国境外处理。实际处理地点、保存期限和传输的法律形式取决于具体服务、合同与账户设置，请同时查看各服务商的最新政策。`
  ]),
  section('automatic-data', '自动收集信息、Cookie与本地存储', [
    `Lv.B不在本网站运营单独的访客分析、广告或行为追踪工具，也不使用Netlify Web Analytics、Real User Monitoring或Log Drains。网站同样不使用Google Analytics、Google Tag Manager、广告像素或自有分析Cookie。`,
    `Netlify在提供静态托管时可能会处理常规网络请求信息，并适用Netlify的政策。Google Maps iframe和外部平台也可能依照各自政策使用Cookie或类似技术。`
  ]),
  section('children', '未满14周岁的用户', [
    `Lv.B不会以未满14周岁的儿童为对象，故意直接收集其个人信息。如Lv.B需要直接处理依法应取得法定代理人同意的个人信息，将依照相关法律履行同意及保护程序。`
  ]),
  section('rights', '用户及法定代理人的权利', [
    `用户或其法定代理人可以请求查阅、更正、删除或停止处理由Lv.B管理的个人信息。Lv.B会在核实请求人身份以及适用法律限制后作出回复。由外部平台直接管理的信息，应通过该服务商的隐私设置或申请流程处理。`
  ]),
  section('security', '安全保护措施', [
    `Lv.B不运营账户系统、在线咨询表单或自有用户数据库，以减少网站直接收集的信息，并使用HTTPS静态托管及与所涉信息相适应的访问控制。请仅在邮件和附件中提供必要信息。`
  ]),
  section('contact', '隐私相关联系方式', [
    `隐私事务负责部门为Lv.B。如对个人信息处理，或查阅、更正、删除、停止处理等权利请求，以及本政策有疑问，请发送邮件至${contactPolicy.businessEmail}。官方网站为https://lvb.kr/。Lv.B不设单独的隐私申请表或联系电话。`
  ]),
  section(
    'remedies',
    '投诉与救济渠道',
    [
      `如需在韩国进行个人信息咨询或争议调解，可联系以下官方机构。我们建议先联系Lv.B，但这不会限制用户向其他机构寻求帮助的权利。`
    ],
    undefined,
    [
      { label: '韩国个人信息门户', href: remedyUrls.privacyPortal },
      { label: '个人信息侵害举报中心（118）', href: remedyUrls.infringementCenter },
      { label: '个人信息争议调解委员会（1833-6972）', href: remedyUrls.disputeCommittee }
    ]
  ),
  section('changes', '政策变更与发布', [
    `Lv.B会在服务或个人信息处理方式发生变化时更新本页面及最后更新日期。重大变更还可能在网站的适当位置另行告知。`
  ])
];

function assertSectionOrder(locale: Locale, sections: readonly PrivacySection[]) {
  const actual = sections.map(({ id }) => id);
  if (actual.length !== privacySectionIds.length || actual.some((id, index) => id !== privacySectionIds[index])) {
    throw new Error(`Privacy section order mismatch for ${locale}.`);
  }
}

const documents: Record<Locale, PrivacyDocumentContent> = {
  en: {
    locale: 'en',
    metaTitle: 'Privacy Policy | Lv.B',
    metaDescription: 'How Lv.B handles information across its official website, games, platform features and email inquiries.',
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    summary: 'How Lv.B handles information across its website, games and email support.',
    lastUpdatedLabel: 'Last updated:',
    lastUpdated: policyDate,
    lastUpdatedDisplay: 'August 26, 2026',
    effectiveDateLabel: 'Effective date:',
    effectiveDate: policyDate,
    effectiveDateDisplay: 'August 26, 2026',
    tableOfContentsLabel: 'On this page',
    externalLinkLabel: 'opens in a new tab',
    controllerCardTitle: 'Lv.B privacy contact',
    controllerLabels: { name: 'Controller', location: 'Location', website: 'Website', email: 'Email' },
    sections: enSections
  },
  ko: {
    locale: 'ko',
    metaTitle: '개인정보 처리방침 | Lv.B',
    metaDescription: 'Lv.B 공식 웹사이트, 게임과 플랫폼 기능, 이메일 문의의 개인정보 처리 기준을 안내합니다.',
    eyebrow: '법적 고지',
    title: '개인정보 처리방침',
    summary: 'Lv.B 웹사이트, 게임 및 이메일 지원에서 정보를 처리하는 방식을 안내합니다.',
    lastUpdatedLabel: '최종 수정일:',
    lastUpdated: policyDate,
    lastUpdatedDisplay: '2026년 8월 26일',
    effectiveDateLabel: '시행일:',
    effectiveDate: policyDate,
    effectiveDateDisplay: '2026년 8월 26일',
    tableOfContentsLabel: '목차',
    externalLinkLabel: '새 탭에서 열림',
    controllerCardTitle: 'Lv.B 개인정보 문의',
    controllerLabels: { name: '처리자', location: '주소', website: '공식 사이트', email: '이메일' },
    sections: koSections
  },
  ja: {
    locale: 'ja',
    metaTitle: 'プライバシーポリシー | Lv.B',
    metaDescription: 'Lv.B公式サイト、ゲーム、プラットフォーム機能、メールでのお問い合わせにおける情報の取扱いをご案内します。',
    eyebrow: '法的情報',
    title: 'プライバシーポリシー',
    summary: 'Lv.Bのサイト、ゲーム、メールサポートにおける情報の取扱いについてご案内します。',
    lastUpdatedLabel: '最終更新日：',
    lastUpdated: policyDate,
    lastUpdatedDisplay: '2026年8月26日',
    effectiveDateLabel: '施行日：',
    effectiveDate: policyDate,
    effectiveDateDisplay: '2026年8月26日',
    tableOfContentsLabel: '目次',
    externalLinkLabel: '新しいタブで開きます',
    controllerCardTitle: 'Lv.Bプライバシー窓口',
    controllerLabels: { name: '取扱事業者', location: '所在地', website: '公式サイト', email: 'メール' },
    sections: jaSections
  },
  'zh-cn': {
    locale: 'zh-cn',
    metaTitle: '隐私政策 | Lv.B',
    metaDescription: '了解Lv.B官方网站、游戏与平台功能以及电子邮件咨询中的个人信息处理方式。',
    eyebrow: '法律信息',
    title: '隐私政策',
    summary: '了解Lv.B网站、游戏和邮件支持中的信息处理方式。',
    lastUpdatedLabel: '最后更新日期：',
    lastUpdated: policyDate,
    lastUpdatedDisplay: '2026年8月26日',
    effectiveDateLabel: '生效日期：',
    effectiveDate: policyDate,
    effectiveDateDisplay: '2026年8月26日',
    tableOfContentsLabel: '目录',
    externalLinkLabel: '在新标签页中打开',
    controllerCardTitle: 'Lv.B隐私咨询',
    controllerLabels: { name: '处理方', location: '地址', website: '官方网站', email: '电子邮件' },
    sections: zhSections
  }
};

for (const locale of Object.keys(documents) as Locale[]) {
  assertSectionOrder(locale, documents[locale].sections);
}

export function getPrivacyDocument(locale: Locale): PrivacyDocumentContent {
  return documents[locale];
}
