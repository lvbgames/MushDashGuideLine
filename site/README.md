# New Lv.B Site

Lv.B 신규 홈페이지의 Astro 정적 사이트다. `legacy-site/`와 독립되어 있으며 기존 보관본을 runtime 의존성으로 사용하지 않는다.

## Commands

```bash
npm ci
npm run dev
npm run check
npm run build
```

Node 기준은 `.nvmrc`, 패키지 고정은 `package-lock.json`을 따른다.

## Routes

- Home: `/`, `/ko/`, `/ja/`, `/zh-cn/`
- Our Games: `/games/`와 세 locale prefix route
- About: `/about/`와 세 locale prefix route
- MushHero: `/games/mushhero/`와 세 locale prefix route
- MushDash: `/games/mushdash/`와 세 locale prefix route
- Business Contact: `/contact/`와 세 locale prefix route
- News & Press: `/news/`와 세 locale prefix route, 두 번째 페이지부터 locale별 `/news/page/2/` 구조
- Press Kit: `/press/`와 세 locale prefix route
- Studio Update: `/news/bic-2026-mushhero-first-public-playtest/`와 세 locale prefix route
- Privacy: `/privacy/`와 세 locale prefix route (`noindex, follow`, sitemap 제외)
- Game Terms: `/terms/`와 세 locale prefix route (`noindex, follow`, sitemap 제외, 2026-08-12 시행)
- Branded 404: `/404.html` (영어 기본 안내, 네 locale Home 링크, `noindex`)
- Robots: `public/robots.txt`를 루트 `/robots.txt`로 정적 제공하며 wildcard와 Yeti를 허용하고 `https://lvb.kr/sitemap-index.xml`을 안내한다. public·dist byte 일치와 BOM 없는 UTF-8은 `../scripts/prepare-production.ps1`이 검증한다.

색인 Astro 페이지 40개, Privacy·Terms 각 4개와 별도 404를 빌드해 전체 HTML 49개를 생성한다. sitemap에는 색인 URL 40개만 포함한다.

## Structure

- `src/components/pages/GameDetailPage.astro`가 MushHero와 MushDash 상세 구조를 공유한다.
- `src/components/pages/AboutPage.astro`가 네 locale About 구조, 소규모 팀 소개, 스튜디오 위치·Google 지도를 공유하고 `src/components/about/TeamMembers.astro`가 `team.ts` 기반 팀원 카드를 출력한다.
- `src/components/pages/NewsPage.astro`, `src/components/news/NewsItemCard.astro`, `NewsPagination.astro`가 네 locale의 최신순 News & Press 목록과 정적 pagination을 공유한다. `src/utils/newsPagination.ts`가 page size 6과 분배를 관리한다.
- `src/components/pages/PressPage.astro`가 `src/data/press.ts`와 기존 회사·게임 데이터를 조합해 네 locale Press Kit을 출력한다. Recent Press는 News 페이지와 중복하지 않는다.
- `src/components/media/MediaGallery.astro`가 게임 상세와 Press의 native scroll-snap, 무 JavaScript 원본 링크, progressive `dialog` lightbox를 공유한다. `ClickToLoadVideo.astro`는 검증된 URL과 poster가 모두 있을 때만 사용자 클릭 후 iframe을 만든다.
- `src/components/ui/MotionEnhancements.astro`와 `src/styles/motion.css`가 법률 페이지를 제외한 섹션의 일회성 progressive reveal, 내부 block stagger와 reduced-motion 정책을 관리한다. Home Hero는 MushHero 2장 다음 MushDash 2장의 full-bleed 자동 slideshow와 수동 indicator·재생 제어를 제공하며 첫 MushHero 이미지만 초기 연결한다. Home의 공식 JPG fallback은 `src/data/homeMedia.ts`가 `public/home/assets/`의 640/1280 WebP 파생본과 연결한다.
- `src/components/pages/NewsArticlePage.astro`와 동적 `[slug].astro`가 네 locale 자체 글을 생성하고 `ArticleStructuredData.astro`가 Article JSON-LD를 출력한다.
- `src/components/pages/GamesPage.astro`가 네 locale Our Games 구조를 공유하고 `src/components/games/`가 주력·출시작 위계를 구성한다.
- `src/components/game-detail/`은 공통 섹션 컴포넌트다.
- `src/data/games.ts`는 확인된 Store URL·출시 상태·Steam CDN 이미지·상세 태그를 관리한다.
- `src/data/contact.ts`는 공개 비즈니스 이메일, business category, 선택적 Discord URL을 관리한다.
- `src/data/company.ts`는 UI 브랜드명, 한국어 공식 스튜디오 주소, 검증된 Google Maps 공유 iframe URL과 검색 URL 생성을 관리한다.
- `src/data/structuredData.ts`는 site config·`company.ts`·`contact.ts`·`socialLinks.ts`를 조합해 루트 `/` 전용 WebSite·Organization JSON-LD를 관리하고, `src/components/seo/RootStructuredData.astro`가 BaseLayout `<head>`에 단일 script로 출력한다. 회사 정보 변경 시 각 원본 데이터를 수정하며 추측 정보를 추가하지 않는다.
- 색인 페이지 title·description은 `src/i18n/translations/*.ts`의 `meta`에서 locale별로 관리하고 `src/layouts/BaseLayout.astro`가 canonical·hreflang·Open Graph·Twitter를 출력한다. 공유 이미지는 `src/data/games.ts`의 검증된 Steam 스크린샷과 기존 locale별 이미지 alt를 사용하며 가짜 경로나 비율이 부적절한 placeholder를 추가하지 않는다.
- `src/data/team.ts`와 `src/types/team.ts`는 팀원 이름·역할·담당·프로필 PNG fallback과 640·1024 WebP srcset을 관리한다. 로드 실패 또는 경로가 `null`이면 기존 Lv.B symbol을 대체 표시한다. 승인 원본과 교체 절차는 `public/team/profiles/README.md`를 따른다.
- `src/data/socialLinks.ts`는 공식 X·Instagram·Discord·Steam Developer 링크를 한 번만 관리한다.
- `src/data/news.ts`는 검증한 외부 자료 11건과 Lv.B 자체 Studio Update 1건을 구분해 관리한다. 항목을 추가하면 최신순 분배와 다음 pagination route가 자동 계산되며, 내부 글은 네 locale 상세 route를 함께 생성한다.
- `src/data/privacy.ts`와 `src/types/privacy.ts`는 네 locale Privacy의 메타데이터와 동일 순서 19개 section을 관리한다. `src/data/terms.ts`와 `src/types/terms.ts`는 한국어 기준 원문과 네 locale Terms의 동일 순서 16개 section을 관리한다. 두 문서는 `src/components/legal/LegalTableOfContents.astro`와 `src/styles/privacy.css`의 Legal·print 레이아웃만 안전하게 공유하고 본문 컴포넌트는 분리한다.
- Privacy에는 사용자 확인 운영 사실인 Netlify 분석 기능 3종 미사용, MushDash의 Epic Online Services(EOS) 온라인 기능과 UserCloud, 자체 서버·DB·텔레메트리·자동 크래시 전송 미사용, 이메일 보관·아동 정책·Lv.B 담당부서를 반영한다. UserCloud 공개 범주는 `E:\MushDash` 현재 작업 트리의 SaveManager·server/local data struct 감사 결과만 사용하며 세부 파일·field 근거는 `../docs/PRIVACY_USERCLOUD_AUDIT.md`, 공개하지 않는 이메일 권리 요청 절차는 `../docs/PRIVACY_REQUEST_RUNBOOK.md`에서 관리한다.
- `src/i18n/`은 네 언어 문구와 locale 보존 route를 관리한다.
- `src/styles/game-detail.css`는 공통 레이아웃에 게임별 accent override만 적용한다.
- `src/pages/404.astro`와 `src/styles/not-found.css`는 JavaScript 없는 브랜드 V3 404를 구성한다.
- `public/robots.txt`는 `https://lvb.kr/sitemap-index.xml`을 가리킨다.
- `src/config/site.ts`의 `naverSiteVerification`은 `BaseLayout.astro`를 통해 일반 Astro 페이지 `<head>`에 정적 meta로 출력된다. 과거 Naver HTML 확인 파일은 사용하지 않는다.
- `public/brand/lvb-symbol.png`는 Header·Footer compact mark에, `lvb-symbol-128.png`는 favicon·apple-touch-icon 후보에 사용한다.
- `public/brand/lvb-logo.png`는 About Hero의 넓은 브랜드 패널에서 원본 비율로 사용하며 `lvb-logo-128.png`는 원본 보존 자산이다.

UI·SEO 브랜드명은 `Lv.B`다. Store 검증 데이터에 포함된 `Lv.B Games` 개발사·퍼블리셔 문자열은 원문 데이터로 유지한다. 공통 UI는 Header·Hero deepest charcoal과 한 단계 밝은 warm-charcoal page·surface·card, logo yellow를 사용하며 MushDash 상세의 Steam primary CTA는 게임 teal을 사용한다. Home Featured Game은 MushHero 게임명·장르/2027 상태·기존 headline·상세/Steam CTA를 한 정보 흐름으로 표시한다.

MushDash는 Steam을 primary, Epic Games Store를 secondary CTA로 사용한다. 게임별 `youtubeTrailerUrl`·`videoTitleKey`·`videoPoster`는 선택 필드이며 현재 모두 `null`이므로 영상 UI를 출력하지 않는다. 외부 Store 링크는 새 탭 보안 속성을 포함한다.

Contact는 JavaScript·Functions·SMTP·외부 이메일 API 없이 locale별 정적 `mailto:` 링크를 사용한다. 홈페이지와 호스팅 플랫폼은 문의 내용을 수집·저장하지 않으며 사용자가 자신의 이메일 프로그램에서 직접 전송한다. Contact 문구와 subject·body template은 `Draft / User Review`다. 게임 피드백·버그·기술지원은 공식 Discord로 안내한다.

Contact 문의 범위는 비즈니스, 파트너십, 행사·전시, 크리에이터·Steam 큐레이터, 언론·인터뷰, 일반 회사 문의의 여섯 종류다. 게임 키 문의는 개별 검토하며 제공을 보장하지 않고, 언론 문의도 같은 비즈니스 이메일 CTA를 사용한다.

News & Press는 네 locale route와 Header·Footer 링크를 제공한다. 외부 11건은 카드 전체로 원문 새 탭, 내부 글은 카드 전체로 대응 locale 상세 route의 같은 탭에 연결한다. 총 12건은 최신순으로 한 번씩 표시하고 페이지당 6건으로 정적 분리한다. 기사 본문·이미지 복제·Featured 분리·자동 수집 기능은 포함하지 않는다. 추가 기준은 `../docs/NEWS.md`를 따른다.

Press 다운로드는 `public/press/downloads/`의 정적 ZIP 3개와 `public/press/assets/`의 공식 게임 스크린샷 6개를 사용한다. 개별 브랜드 PNG·게임 JPG도 로컬 파일로 내려받으며 source URL·SHA·archive 내용과 재생성 절차는 `../docs/PRESS_KIT.md`가 단일 운영 기록이다. 서버 Function이나 runtime scraping은 사용하지 않는다.

Home은 같은 로컬 Press screenshot manifest에서 MushHero·MushDash 각각 첫 2장을 통합 Hero slideshow에 사용하고 최초 진입에는 MushHero 첫 이미지 한 장만 로드한다. Hero 아래는 Featured Game → Games Overview → About → Community → Contact 순서이며, Hero와 Games Overview에서 이미 노출되는 별도 하단 MushDash 대형 소개는 두지 않는다. About은 같은 철학을 반복하지 않고 하나의 3원칙 영역만 사용한다. 화면 전송은 Home 전용 640/1280 WebP 파생본을 우선하고 Press JPG 원본을 fallback으로 보존한다. 향후 사용자 승인 자산의 검토·교체 작업 공간은 `../references/press-assets/README.md`를 따른다. 이 references 폴더는 자동으로 public 자산과 동기화되지 않는다.

자체 News 상세 route는 sitemap과 Article JSON-LD에 포함한다. RSS는 자체 글 운영량과 배포 요구가 확정될 때 재검토한다.

루트 `netlify.toml`은 직접 요청된 `index.html` URL을 같은 trailing-slash canonical URL로 보내는 forced 301 규칙과 `/privacy.html` → `/privacy/`, `/terms.html` → `/terms/` 호환 301을 정의한다. 실제 응답은 배포 후 `../docs/VALIDATION.md` 절차로 확인한다.

기존 `public/privacy.html`은 폐기했으며 역사 보관본은 `../legacy-site/public/privacy.html`에만 남긴다. 신규 정책 source 변경 시 `../docs/PRIVACY_DATA_INVENTORY.md`와 `../docs/PRIVACY_USERCLOUD_AUDIT.md`의 근거·수동 확인 항목, 네 언어 section 순서 및 의미를 함께 검토한다. 생성 HTML raw hash는 사용하지 않으며, 네 언어의 최종 수정일과 시행일은 사용자 승인 운영 배포일 `2026-08-03`으로 확정했다. 이후 정책 변경 시 두 날짜와 전체 검증을 함께 갱신한다.

게임 이용약관은 `../docs/TERMS_AUDIT.md`의 실제 기능 근거와 미채택 원칙을 따른다. `Last updated`와 `Effective date`는 사용자 승인 운영 배포일 `2026-08-12`로 확정했으며, 실제 동의·변경 고지와 플랫폼별 Terms/EULA 노출 경로는 별도 운영 확인 항목으로 유지한다.
