# Content Inventory

상태: `Verified Store Data`, `Verified Media`, `Draft / User Review`, `Missing`, `Locked`.

| 항목 | 상태 | 근거/비고 |
|---|---|---|
| 사용자 대면 브랜드명 | Verified Brand Asset | Lv.B |
| 회사 소개 기준 | Draft / User Review | 부산 기반 인디 게임 개발사, 멀티플레이, 독창적인 세계관, 함께 웃고 성장하는 경험, 쉬운 시작과 오래 남는 기억 |
| Store 개발/퍼블리싱 원문 | Verified Store Data | Lv.B Games. Store 검증 데이터에만 유지하고 UI·SEO 브랜드 표기는 `Lv.B` 사용 |
| 브랜드 로고 | Verified Brand Asset | `lvb-symbol.png`: Header·Footer symbol, `lvb-symbol-128.png`: favicon 후보. `lvb-logo.png`: About Hero의 넓은 브랜드 패널에서 비파괴 사용, `lvb-logo-128.png`: 원본 보존 |
| MushHero | Verified Store Data / Verified Media | Steam 4711200, 2027 예정, 등록된 Steam CDN 미디어 |
| MushDash | Verified Store Data / Verified Media | Steam 3153140, Epic Games Store, Early Access, Steam 출시일 2025-08-26 |
| MushDash 플레이 정보 | Verified Store Data | 최대 7인 온라인 파티 레이스, 한 경기 3 wave, 선택한 테마의 5개 wave 중 3개 스테이지 무작위 선택, 함정·폭탄·움직이는 발판, 결승 순위와 Mushroom Coin으로 최종 순위 결정 |
| MushDash 분류 | Verified Store Data | Platformer(Epic taxonomy). 상세 태그는 사용자 관점의 별도 필드로 관리 |
| MushDash 미디어 | Verified Media | `games.ts`의 검증 source와 `site/public/press/assets/mushdash/`의 원본 byte 보존 1920×1080 스크린샷 3개를 사용 |
| MushDash 영상 | Missing | 확인된 안정적 trailer URL이 없어 영상 영역을 만들지 않음 |
| Home English/Korean/Japanese/Simplified Chinese | Draft / User Review | 게임 사실 기반 문구, 최상단 full-bleed Hero에서 MushHero·MushDash 공식 이미지 각 2장을 자동 순환하고 수동 indicator·재생 제어를 함께 제공. Featured Game은 `FEATURED PROJECT`, `MushHero`, locale별 협동 Roguelite 장르·2027 출시 예정, 기존 headline·설명, 내부 상세 primary·Steam wishlist secondary 순서다. Hero 아래는 Featured Game·Our Games·About·Community·Contact 순서이며 별도 하단 MushDash 대형 소개는 반복을 피하기 위해 미사용 |
| Our Games 4개 언어 | Draft / User Review | MushHero 주력·2027 예정, MushDash Early Access 출시작, 독창적인 세계·멀티플레이·오래 남는 경험 |
| About 4개 언어 | Draft / User Review | 부산 기반 소개와 함께할수록 더 즐거운 경험·오래 기억되는 세계·쉽게 시작해 깊게 즐기는 경험의 단일 3원칙, 소규모 팀·스튜디오 위치 |
| 팀 정보 | Draft / User Review | 박재민(대표: 프로그래밍·프로젝트 매니지먼트·마케팅), 정보건(3D 아티스트: 3D 아트). 이름은 네 locale 모두 한국어 표기 유지 |
| 팀 프로필 이미지 | Verified User Asset / User Review | 승인 PNG `park-jaemin.png`·`jeong-bogeon.png`와 원본 SHA-256을 유지한다. 브라우저용 640·1024 WebP는 quality 88 파생본이며 `team.ts`의 srcset 데이터와 PNG fallback으로 제공한다. `프로그래밍.png`는 미사용 상태로 원본 폴더에 보존 |
| 스튜디오 주소·지도 | Draft / User Review | 공식 표기는 네 locale 모두 `부산광역시 수영강변대로 140, 9층 905호`. Google Maps 공유 iframe과 검색 링크는 `site/src/data/company.ts`에서 관리 |
| MushHero 상세 4개 언어 | Draft / User Review | 공식 Steam 설명 기반 |
| MushDash 상세 4개 언어 | Draft / User Review | 공식 Steam·Epic 정보 기반 |
| Contact 4개 언어 | Draft / User Review | 6개 비즈니스 문의 범위, 크리에이터·Steam 큐레이터 키 문의의 개별 검토, 언론·기사·인터뷰 안내, 직접 이메일 CTA·mailto subject/body template 사용자 검토 필요 |
| 404 영어 안내 | Draft / User Review | 브랜드 V3 mark, Home·Games CTA, 네 locale Home 링크. 자동 언어 감지 없이 영어를 기본으로 사용 |
| X | Verified External Link | `https://x.com/Lv_B_Games` |
| Instagram | Verified External Link | `https://www.instagram.com/lv.b_games/` |
| Discord | Verified External Link | `https://discord.gg/yuphyAWWUr`; 게임 피드백·버그·기술지원 |
| Steam Developer Page | Verified External Link | `https://store.steampowered.com/search/?developer=Lv.B` |
| 공식 YouTube | Missing | `youtubeTrailerUrl`이 `null`이면 영상 UI 전체를 숨김 |
| News & Press | Verified External Link / Draft / User Review | 기존 8건을 유지하고 사용자 승인 MushDash 네이버 블로그 플레이 후기 4건을 `blog-review`로 더해 총 12건을 최신순·페이지당 6건으로 정적 제공한다. 외부 카드 전체는 원문 새 탭, 자체 글 카드는 네 locale 상세 route의 같은 탭으로 연결하며 외부 이미지·본문을 복제하지 않는다. RSS는 후속 운영 요구가 생길 때 검토 |
| Press Kit | Draft / User Review | 네 locale route에서 기존 회사·게임·연락처 데이터와 공개 브랜드 원본을 조합한다. 브랜드 ZIP 1개와 게임 ZIP 2개, 공식 Steam CDN 원본 byte를 보존한 로컬 스크린샷 6개, 개별 PNG/JPG 다운로드, locale boilerplate 복사 기능을 제공한다. Recent Press는 중복을 피하기 위해 표시하지 않는다. 검증되지 않은 설립연도·직원 수·수상·사업자 정보와 외부 기사 이미지는 포함하지 않으며 source·SHA·갱신 절차는 `PRESS_KIT.md`를 따른다. |
| Privacy 4개 언어 | Draft / User Review | 네 언어 19개 동일 section에 Netlify 분석 기능 3종 미사용, MushDash Epic Online Services(EOS)·Lobby·Session·P2P·UserCloud의 검증된 gameplay·transaction 범주, 계정 식별자와 payload 구분, 로컬 설정 분리, 자동 만료·게임 제거·연결 해제 자동 삭제 없음, 자체 서버·DB·텔레메트리·자동 크래시 전송 미사용, 이메일 1년 보관과 예외, 만 14세 미만 정책, Lv.B 담당부서를 반영. `/privacy/` 및 세 locale route는 `noindex, follow`이고 sitemap에서 제외 |
| 게임 이용약관 4개 언어 | Draft / User Review | 한국어 기준 원문과 EN·JA·ZH-CN의 동일한 16개 조항. Steam·Epic Games Store·EOS, 플랫폼 계정, Lobby·Session·P2P, 로컬 저장·EOS UserCloud, 조건부 플랫폼 구매와 법령상 소비자 권리, 필요·비례적인 금지행위 대응을 반영. 시행일과 실제 동의·고지 방식은 미확정이며 `/terms/` 및 세 locale route는 `noindex, follow`, sitemap 제외 |
| Naver 사이트 소유확인 | Verified Public Metadata | `site/src/config/site.ts`의 공개 verification 값을 `BaseLayout.astro`가 일반 Astro 페이지 `<head>`에 정적 meta로 출력. 과거 HTML 확인 파일 방식은 폐기 |
| 루트 구조화 데이터 | Verified Public Metadata | `site/src/data/structuredData.ts`가 기존 site config·회사·연락처·공식 SNS 데이터를 조합해 `/`에만 WebSite와 Organization을 단일 `@graph`로 출력. 주 이름은 `Lv.B`, 대체 이름은 `레벨비`이며 추측한 법인·설립·대표·직원·평점 정보는 추가하지 않음. `sameAs` 4개 중 Naver 지원 연관 채널은 X·Instagram, Discord·Steam Developer Page는 기타 공식 프로필이며 검색 노출을 보장하지 않음 |
| 검색·공유 메타데이터 | Verified Public Metadata / Missing dedicated artwork | 색인 페이지 title·description은 locale별 `site/src/i18n/translations/*.ts`의 `meta`가 단일 원본이며 `BaseLayout.astro`가 canonical·hreflang·Open Graph·Twitter를 출력한다. 공유 이미지는 `games.ts`의 검증된 1920×1080 Steam 스크린샷을 사용하고 locale별 기존 게임 이미지 alt를 재사용한다. 전용 Lv.B·MushHero·MushDash 1200×630 이미지는 아직 없음 |

게임 데이터는 `site/src/data/games.ts`에서 고정 관리하며 브라우저·빌드 중 runtime scraping을 하지 않는다. 기존 사이트의 코드·문구·자산은 `legacy-site/` 보관물일 뿐 신규 구현의 기반이 아니다.

Privacy의 처리 사실 근거와 운영자 확인 항목은 `PRIVACY_DATA_INVENTORY.md`에서, MushDash UserCloud의 내부 파일·field·호출 라인은 `PRIVACY_USERCLOUD_AUDIT.md`에서 관리한다. 공개 문구는 2026-07-31 현재 게임 작업 트리에서 확인한 데이터 범주만 사용하고 내부 key·변수명·development 진단 payload는 노출하지 않는다. UserCloud의 고정 보유기간과 게임 내 삭제 기능은 없으며, 요청 접수·본인/범위 확인·플랫폼/EOS 확인은 내부 전용 `PRIVACY_REQUEST_RUNBOOK.md`를 따른다. 외부 사업자의 위탁·제3자 제공·독립 처리 관계와 국외 이전 유형도 법률 확인 전 단정하지 않는다. 공개 Privacy의 최종 수정일과 시행일은 사용자가 승인한 운영 배포일 `2026-08-03`으로 확정한다.
