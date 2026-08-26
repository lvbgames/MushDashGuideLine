# Privacy Data Inventory

조사일: 2026-07-31. 이 문서는 코드·설정·현재 프로젝트 문서에서 확인할 수 있는 개인정보 처리 단서와 운영자 확인이 필요한 사항을 분리한다. 법적 처리 관계를 확정하는 문서가 아니며, `Manual confirmation` 항목을 확인하기 전에는 신규 Privacy를 배포 가능 상태로 간주하지 않는다.

상태:

- `Confirmed`: 현재 저장소의 소스·설정 또는 사용자 검증 데이터로 확인됨.
- `Manual confirmation`: 저장소 밖의 계정 설정, 계약 또는 게임 런타임을 운영자가 확인해야 함.
- `Not used`: 현재 홈페이지 소스와 배포 설정에서 사용하지 않음.

## 공식 작성·외부 서비스 참고 자료

- 개인정보보호위원회, [현재 안내서: 개인정보 처리방침 작성지침(2026.4. 개정)](https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=&nttId=12018) — 2026-04-23 게시된 현재 작성지침. 2026-04-09 의견수렴안과 구분한다.
- 개인정보보호위원회, [현재 안내서: 개인정보 처리방침 표준(안)(2026.2.)](https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=&nttId=11838) — 분야별 표준안 자료이며 현재 작성지침과 구분한다.
- [Netlify Privacy Statement](https://www.netlify.com/privacy/), [Netlify Web Analytics 문서](https://docs.netlify.com/manage/monitoring/web-analytics/how-web-analytics-works/)
- [Google Maps Platform 데이터 수집·보유 설명](https://developers.google.com/maps/security/compliance/security-compliance), [Google Privacy Policy](https://policies.google.com/privacy)
- [Steam Privacy Policy](https://store.steampowered.com/privacy_agreement/), [Epic Games Privacy Policy](https://legal.epicgames.com/epicgames/privacy-policy)
- [NAVER 개인정보 처리방침](https://policy.naver.com/policy/privacy.html)

## 홈페이지

| 서비스 또는 기능 | 적용 대상 | 처리 주체 | 처리 가능 정보 | 처리 목적 | 저장 위치 | 보유 또는 처리 기간 | 외부 서비스 | 국외 처리 가능성 | 근거 파일·설정·문서 | 상태 |
|---|---|---|---|---|---|---|---|---|---|---|
| 회원가입 | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | `site/src/pages`, `site/src/components` 전체 검색 | Not used |
| 로그인 | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | `site/src/pages`, `site/src/components` 전체 검색 | Not used |
| Contact form | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | `site/src/components/pages/ContactPage.astro` | Not used |
| Netlify Forms | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | Netlify | 없음 | `data-netlify`, form-name 전체 검색 0건 | Not used |
| Netlify Functions | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | Netlify | 없음 | `netlify.toml`, `site/astro.config.mjs` | Not used |
| Netlify Edge locale redirect | 홈페이지 루트 `/` 일반 방문 | Netlify 및 locale 선택 기능을 제공하는 Lv.B | Netlify가 요청 시 제공하는 국가 코드, 사용자가 직접 선택한 언어 preference cookie | 최초 루트 방문의 언어 경로 선택과 명시적 언어 선택 유지 | Netlify Edge 실행 중 처리; 국가 코드는 Lv.B DB·analytics·cookie에 저장하지 않음 | 국가 코드는 요청 처리 중에만 사용; 언어 preference는 이용자 브라우저에 1년 | Netlify | 가능 | `netlify.toml`, `site/netlify/edge-functions/locale-redirect.ts`, `site/src/i18n/localePreference.ts` | Confirmed in source; deployment pending |
| 자체 API | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | Astro static output, API route 0건 | Not used |
| 자체 DB | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | DB 연결·환경변수·adapter 0건, `docs/ARCHITECTURE.md` | Not used |
| CMS | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | CMS 패키지·연결 설정 0건 | Not used |
| Google Analytics | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | Google | 없음 | `gtag`, GA measurement ID 전체 검색 0건 | Not used |
| Google Tag Manager | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | Google | 없음 | `GTM-`, tag manager 전체 검색 0건 | Not used |
| 광고·마케팅 Pixel | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | pixel·광고 SDK 전체 검색 0건 | Not used |
| 클라이언트 분석·RUM 코드 | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | Netlify 등 | 계정 설정에 따라 가능 | RUM·analytics client script 검색 0건 | Not used |
| Netlify Web Analytics | 운영 사이트 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | Netlify | 없음 | 저장소 코드 0건 및 사용자 운영 확인(2026-07-31): 비활성 | Not used |
| Netlify Real User Monitoring | 운영 사이트 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | Netlify | 없음 | 저장소 코드 0건 및 사용자 운영 확인(2026-07-31): 비활성 | Not used |
| Netlify Log Drains | 운영 사이트 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | Netlify | 없음 | 저장소 설정 0건 및 사용자 운영 확인(2026-07-31): 비활성 | Not used |
| Netlify 정적 호스팅 | 모든 홈페이지 방문 | Netlify | IP 주소, 요청 URL, 시각, 브라우저·기기·요청 헤더 등 일반적인 CDN 요청 정보 가능 | 정적 파일 제공, 운영·보안 | Netlify 인프라 | Netlify 정책·프로젝트 설정에 따름 | Netlify | 가능 | `netlify.toml`, `site/astro.config.mjs`, Netlify 공식 정책 | Confirmed |
| 언어 preference cookie | 사용자가 언어 전환 링크를 직접 선택한 홈페이지 방문 | 이용자 브라우저와 Lv.B 홈페이지 | `lvb_locale` 및 `en`·`ko`·`ja`·`zh-cn` 중 선택값 | 이용자의 명시적 언어 선택을 Geo 자동 선택보다 우선 | 이용자 브라우저의 1st-party cookie | 선택 시점부터 1년(`Max-Age=31536000`) | 없음 | 없음 | `site/src/components/layout/LanguageSwitcher.astro`, `site/src/i18n/localePreference.ts`; 자동 Geo 이동은 cookie를 만들지 않음 | Confirmed in source; deployment pending |
| localStorage | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | `localStorage` 검색 0건 | Not used |
| sessionStorage | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | `sessionStorage` 검색 0건 | Not used |
| IndexedDB | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | `IndexedDB` 검색 0건 | Not used |
| service worker | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | service worker 등록·파일 검색 0건 | Not used |
| 외부 JavaScript | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | 외부 `<script src>` 0건; 모바일 메뉴 스크립트는 자체 빌드 자산 | Not used |
| Google Maps iframe | About 4개 locale 방문 | Google | IP 주소, 요청 URL, 시각, 브라우저·OS·요청 헤더 등 Google Maps 요청 로그 | 스튜디오 위치 지도 표시 | Google 인프라 | Google 정책에 따름 | Google Maps | 가능 | `site/src/data/company.ts`, `AboutPage.astro`, Google 공식 문서 | Confirmed |
| Steam CDN 이미지 | Home·Games·게임 상세 등 | Valve/Steam CDN | IP 주소, 이미지 URL, 시각, 브라우저·요청 헤더 등 CDN 요청 정보 | 게임 이미지 전송 | Valve 또는 CDN 인프라 | Valve 정책에 따름 | Steam | 가능 | `site/src/data/games.ts`의 `shared.akamai.steamstatic.com` URL | Confirmed |
| 외부 영상 embed | 홈페이지 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | `youtubeTrailerUrl: null`, iframe은 Google Maps 1종뿐 | Not used |
| mailto 문의 | Contact·Privacy | Lv.B, 발신·수신 이메일 사업자 | 이름·표시 이름, 이메일 주소, 본문, 첨부 파일과 첨부 내 로그·스크린샷·기타 정보 | 문의 확인·답변·후속 연락·기술 지원·비즈니스 협의·계약/거래 기록·분쟁 대응 | 발신자 메일함, NAVER 메일함 및 관련 보관 위치 | 일반 문의·게임 지원은 처리 완료 후 1년; 계약·거래·분쟁은 법정 기간 또는 종료 시점 중 적용 근거에 따른 기간 | NAVER 및 발신자 이메일 사업자 | 사업자 인프라에 따라 가능 | `site/src/data/contact.ts`, `ContactPage.astro`, 사용자 운영 확인(2026-07-31) | Confirmed |
| 이메일 문의 삭제 | Lv.B 수신 메일 | Lv.B | 문의 기록과 첨부 | 보유기간 종료 후 파기 | NAVER 메일함 및 관련 보관 위치 | 보유기간 종료 시 운영자가 직접 확인·삭제; 법정 보존 대상은 분리 보관 | NAVER | 가능 | 사용자 운영 정책 확인(2026-07-31); 자동 삭제 시스템은 사용하지 않음 | Confirmed |
| 검색엔진 인증 meta | 모든 페이지 | NAVER Search Advisor가 검증 토큰 확인 | 개인 식별 정보가 아닌 고정 사이트 인증 토큰; 방문 요청은 일반 호스팅 요청에 포함 가능 | 사이트 소유권 인증 | 빌드 HTML, NAVER 시스템 | NAVER 정책에 따름 | NAVER | 정책에 따름 | `site/src/config/site.ts`, `BaseLayout.astro` | Confirmed |

## 게임과 플랫폼

용어 관리 원칙: `EIK`는 EOS를 Unreal Engine에 연동하는 내부 구현 명칭이다. 이용자 대상 Privacy Policy에는 `Epic Online Services(EOS)`만 표시하며, 내부 기술 감사에서는 실제 구현 증거를 보존하기 위해 `EIK` 명칭을 유지할 수 있다.

MushDash 실제 게임 프로젝트 `E:\MushDash`의 2026-07-31 현재 작업 트리를 읽기 전용으로 조사했다. branch는 `master`, HEAD는 `931e5008771349962b7ba20c4c69f2d60120f6dd`이며 미커밋 변경이 존재하므로 아래 결과는 HEAD만이 아니라 조사 시점 작업 트리 기준이다. 상세 호출 흐름과 필드 근거는 `docs/PRIVACY_USERCLOUD_AUDIT.md`에 둔다. `legacy-site/public/privacy.html`의 구형 EOS 문구는 근거로 사용하지 않는다.

| 서비스 또는 기능 | 적용 대상 | 처리 주체 | 처리 가능 정보 | 처리 목적 | 저장 위치 | 보유 또는 처리 기간 | 외부 서비스 | 국외 처리 가능성 | 근거 파일·설정·문서 | 상태 |
|---|---|---|---|---|---|---|---|---|---|---|
| MushHero 배포 정보 | 게임·스토어 방문자 | Steam, Lv.B | Steam이 처리하는 계정·구매·접속 관련 정보 가능 | 스토어 제공·위시리스트·게임 배포 | Steam 인프라 | Steam 정책에 따름 | Steam | 가능 | `site/src/data/games.ts`, `docs/CONTENT.md` | Confirmed |
| MushDash 배포 정보 | 게임·스토어 방문자 | Steam, Epic Games | 각 플랫폼이 처리하는 계정·구매·접속 관련 정보 가능 | 스토어 제공·게임 배포 | Steam·Epic 인프라 | 각 정책에 따름 | Steam, Epic Games Store | 가능 | `site/src/data/games.ts`, `docs/CONTENT.md` | Confirmed |
| Epic Online Services | MushDash 이용자 | Epic Games 및 온라인 기능을 제공하는 Lv.B | 계정 식별자와 접속에 필요한 기술 정보가 SDK를 통해 처리될 수 있음 | 온라인 로그인·Lobby·Session·P2P·UserCloud | Epic Online Services 인프라와 실행 중인 게임 클라이언트 | Epic 정책·서비스 설정에 따름 | Epic Online Services | 가능 | 사용자 운영 확인(2026-07-31) | Confirmed |
| EIK | MushDash 이용자 | Lv.B, Epic Games | EOS 연동에 필요한 런타임 정보 | EOS 온라인 기능 연동 | 게임 클라이언트·EOS 인프라 | 런타임 및 Epic 정책에 따름 | Epic Online Services | 가능 | `MushDash.uproject`, `Config/DefaultEngine.ini:1-2`, `Source/MushDash/MushDash.Build.cs:16` | Confirmed |
| 온라인 로그인 | MushDash 이용자 | Steam/Epic/EOS | 플랫폼 또는 EOS 계정 식별자와 인증·접속 기술 정보 가능 | 계정 인증과 온라인 기능 | 플랫폼·EOS 및 게임 실행 메모리 | 플랫폼 정책·온라인 세션에 따름 | Steam, Epic, EOS | 가능 | 사용자 운영 확인(2026-07-31) | Confirmed |
| 플랫폼 식별자 자체 저장 | MushDash 이용자 | 해당 없음 | 해당 없음 | 해당 없음 | Lv.B 자체 서버·DB 없음 | 해당 없음 | Steam/Epic/EOS에서 온라인 기능 제공을 위해 처리 | 해당 서비스에 따라 가능 | 사용자 운영 확인: 클라이언트 실행 중 SDK 사용 가능, Lv.B 자체 서버·DB에 복제·저장하지 않음 | Not used |
| Lobby·Session | MushDash 이용자 | Epic Online Services 및 온라인 기능을 제공하는 Lv.B | 계정 식별자, 세션·로비 속성, 접속 기술 정보 가능 | 매치 구성·온라인 플레이 | EOS 인프라와 게임 클라이언트 | Epic 정책·세션 수명에 따름 | Epic Online Services | 가능 | 사용자 운영 확인(2026-07-31) | Confirmed |
| P2P 연결 | MushDash 이용자 | Epic Online Services 및 참가 이용자 | 연결에 필요한 계정 식별자·기술 정보 가능 | 플레이어 간 온라인 연결 | EOS 네트워크와 참가자 기기 | Epic 정책·연결 수명에 따름 | Epic Online Services | 가능 | 사용자 운영 확인(2026-07-31) | Confirmed |
| EOS UserCloud gameplay save | MushDash 이용자 | Epic Online Services 및 온라인 기능을 제공하는 Lv.B | 튜토리얼 진행, 플레이어 표시 이름, 선택한 아이콘·이름표·아바타, 게임 내 재화 잔액, 보유 아이템·인벤토리, Infinity Tower 최고 기록, 주간 도전 ID·진행·완료·보상 수령 상태·주차 | 계정별 게임 진행·상태 저장과 불러오기 | EOS UserCloud의 고정 JSON key 5개 | 온라인 저장 기능 제공 중 유지; 코드에 자동 만료·정기 삭제·게임 제거·계정 연결 해제 연동 삭제 없음; 유효한 요청·서비스/목적 종료 시 법령과 플랫폼·EOS 절차 확인 | Epic Online Services | 가능 | `MDServerSaveData.h:7-164`, `USaveManager.h:138-142`, `USaveManager.cpp:145-213,289-562` | Confirmed |
| 구매 transaction identifier save | MushDash 이용자 중 구매 처리 대상 | Epic Online Services 및 온라인 기능을 제공하는 Lv.B | 처리한 구매 receipt의 transaction identifier 문자열 배열 | 동일 거래 중복 처리 방지 | EOS UserCloud `TransactionIds.json` | 코드에 자동 만료·삭제 기간 없음; load 본문은 비활성 | Epic Online Services | 가능 | `USaveManager.h:86,96,143`, `USaveManager.cpp:231-287,686-711`, `UServerManager.cpp:492-563` | Confirmed |
| UserCloud 계정 namespace | MushDash 이용자 | Steam/Epic/EOS | 로그인된 `FUniqueNetId`가 SDK read/write 인자로 사용됨; 확인한 save JSON에는 Steam ID·Epic Account ID·EOS Product User ID 필드 없음 | 계정별 UserCloud 영역 지정 | SDK와 EOS 인프라; 정상 save payload 내부에는 미포함 | 플랫폼·Epic 정책에 따름 | Steam, Epic, EOS | 가능 | `USaveManager.cpp:289-339,389-432`; `MDServerSaveData.h:7-164` | Confirmed |
| 로컬 게임 설정 save | MushDash 이용자 | 이용자 기기와 게임 클라이언트 | 언어·언어 index·수동 선택, 자동 서버 지역·매칭 지역, 그래픽 품질·표시 설정, 오디오 볼륨 | 기기별 게임 설정 저장 | Unreal SaveGame 논리 slot `PS` | 이용자가 로컬 파일을 관리하는 기간 | 없음 | 없음 | `MDLocalSaveData.h:11-167`, `USaveManager.h:76,98,145`, `USaveManager.cpp:181-228,360-477` | Confirmed in source; packaged round-trip pending |
| EOS UserCloud 삭제 | MushDash 이용자 | Epic Games 및 Lv.B의 기술적 역할 미확정 | 클라우드 게임 저장 데이터 | 이용자 삭제 요청 처리 | EOS UserCloud | EOS/온라인 서비스에는 user-file 삭제 API가 있으나 MushDash의 `DeleteUserFile`·`ClearFile(s)` 호출과 게임 내 삭제 UI는 0건; 제품별 운영 권한·본인 확인 절차 미확정 | Epic Online Services | 가능 | `Source`, `Config`, `Plugins` 전체 관련 호출 검색; Epic User File·`IOnlineUserCloud` 공식 문서; `PRIVACY_REQUEST_RUNBOOK.md` | Manual confirmation |
| development UserCloud validation | 개발 검증 계정 | Lv.B, Epic Online Services | store marker, 임의 실행 nonce, UTC timestamp, 고정 검증 문자열 | UserCloud write/read round-trip 검증 | EOS UserCloud `MushDashCloudValidation.json`; 로컬 `Saved/CloudValidation` 증거 | 자동 삭제 없음; development 명령에서만 생성 | Epic Online Services | 가능 | `MDCloudRoundTripManager.cpp:21-24,40-100,186-215,306-543` | Confirmed, non-production diagnostic |
| 자동 크래시 리포트 전송 | MushDash 이용자 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | 사용자 운영 확인(2026-07-31) | Not used |
| Lv.B 자체 플레이 분석·텔레메트리 | MushDash 이용자 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | 사용자 운영 확인(2026-07-31); EOS 자체 서비스 운영 처리는 별도 | Not used |
| 로컬 게임 로그 | MushDash 이용자·문의자 | 이용자 기기, 첨부 시 Lv.B와 이메일 사업자 | 로컬 로그 및 이용자가 함께 첨부한 스크린샷·파일 | 로컬 진단, 이용자 요청 시 기술 지원 | 이용자 기기; 직접 첨부 시 NAVER 메일함 | 로컬은 이용자 관리; 이메일 첨부본은 일반 지원 문의 완료 후 1년 | NAVER | 이메일 전송 경로에 따라 가능 | 사용자 운영 확인(2026-07-31): 자동 전송 없음 | Confirmed |
| Lv.B 자체 중앙 게임 서버 | MushDash 이용자 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | 사용자 운영 확인(2026-07-31) | Not used |
| Lv.B 자체 개인정보 DB | MushDash 이용자 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 해당 없음 | 없음 | 없음 | 사용자 운영 확인(2026-07-31) | Not used |
| 고객 지원 이메일 | 게임 이용자·문의자 | Lv.B, 이메일 사업자 | 이메일 주소, 본문, 첨부 및 자발적으로 제공한 로그·스크린샷·파일 | 기술 지원·문의 답변 | NAVER 메일함 및 관련 보관 위치 | 문의 처리 완료 후 1년 | NAVER | 가능 | `site/src/data/contact.ts`, 사용자 운영 확인(2026-07-31) | Confirmed |
| 만 14세 미만 정책 | 웹·게임 이용자 | Lv.B | 법정대리인 동의가 필요한 경우 관련 정보 | 동의와 보호 절차 | 실제 처리 발생 시 확정 | 관련 법령에 따름 | 사용 플랫폼이 별도 정책을 운영할 수 있음 | 처리 경로에 따라 가능 | 사용자 승인 정책(2026-07-31): 의도적 직접 수집 없음, 필요한 경우 법정 절차 적용 | Confirmed |
| 플랫폼과 Lv.B의 법적 처리 관계 | 게임·웹 이용자 | 계약 당사자 | 서비스별 정보 | 서비스 제공 | 계약·서비스별 | 계약·정책별 | Netlify, Google, Valve, Epic, NAVER | 가능 | 계약서·계정 설정이 저장소에 없음 | Manual confirmation |

## MushDash UserCloud 코드 조사

- 조사 경로: `E:\MushDash\Source`, `Config`, `Plugins`와 `E:\Codex\MushDash`의 문서 라우팅. 드라이브 전체는 검색하지 않았다.
- 정상 save key: `PlayerProfile.json`, `PlayerMoney.json`, `PlayerInventory.json`, `PlayerEvent.json`, `PlayerChallenge.json`, `TransactionIds.json`.
- 직렬화: gameplay struct는 `FJsonObjectConverter`, transaction set은 `FJsonSerializer`; 모두 JSON 문자열을 UTF-8 byte array로 바꿔 `WriteUserFile`에 전달한다.
- 정상 download: 로그인 완료 후 profile·money·inventory·event·challenge를 각각 `ReadUserFile`; transaction load 본문은 주석 처리되어 비활성이다.
- 정상 upload: cache setter가 dirty flag를 세우고 `SavePlayerData`가 바뀐 파일만 쓴다. 성공 후 같은 파일을 다시 읽으며, 실패 자동 재시도는 없다.
- failure: read 실패·빈 payload·parse 실패에는 파일별 기본값을 한 번 적용하고 cloud write·delete·retry는 하지 않는다.
- 계정 식별자: SDK 호출 인자에는 사용하지만 확인한 save JSON field는 아니다. 온라인 nickname에서 받은 `PlayerName`은 profile payload에 포함된다.
- 로컬 설정: `PS` slot에 언어·지역·그래픽·오디오 설정을 별도 저장하도록 작성되어 있고 UserCloud와 병합·동기화하지 않는다.
- 삭제: 프로젝트 코드의 `DeleteUserFile`, `ClearFile`, `ClearFiles` 호출 0건. 서비스 API의 삭제 기능과 현재 게임 구현을 구분하고, 요청 처리는 `PRIVACY_REQUEST_RUNBOOK.md`의 본인·범위 확인 gate를 따른다.
- 상세 표와 라인 근거: `docs/PRIVACY_USERCLOUD_AUDIT.md`.

## 배포 전 운영자·법률 확인

1. 현재 감사한 작업 트리와 실제 Steam·Epic 공개 빌드의 commit·package provenance를 확인한다.
2. EOS UserCloud의 실제 보유기간, 게임 삭제·계정 연결 해제 시 동작, 이용자 요청에 따른 조회·삭제 방법, 제품별 운영 권한과 조직 단위 `Delete User`의 영향 범위를 확인한다.
3. transaction identifier load 비활성 상태와 release log 출력 정책을 제품·보안 관점에서 확인한다.
4. 로컬 `PS` slot의 packaged round-trip과 플랫폼 계정 전환 시 동작을 확인한다.
5. EIK 버전과 EOS 배포 설정을 확인하되 비밀값은 문서나 보고에 기록하지 않는다.
6. Netlify, Google, Valve, Epic, NAVER의 계약상 역할과 국외 처리·이전의 법적 분류를 법률적으로 확인한다.
7. Steam·Epic에서 요청자와 UserCloud 계정의 소유 관계를 안전하게 확인할 절차를 확정한다. 현재 구현에는 검증된 절차가 없다.
8. 개인정보 요청 처리 기록의 보유기간과 삭제 담당자를 확정한다.
9. 개인정보 처리방침의 실제 운영 배포일과 Effective date는 사용자 승인에 따라 `2026-08-03`으로 확정했다.

운영 확인 결과가 현재 코드 감사와 다르면 `site/src/data/privacy.ts`, `docs/PRIVACY_USERCLOUD_AUDIT.md`와 본 인벤토리를 함께 갱신하고 네 언어 의미 검증과 전체 빌드를 다시 수행한다.
