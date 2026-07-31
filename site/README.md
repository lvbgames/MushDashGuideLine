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
- Mush Dash: `/games/mushdash/`와 세 locale prefix route
- Business Contact: `/contact/`와 세 locale prefix route
- News & Press: `/news/`와 세 locale prefix route
- Branded 404: `/404.html` (영어 기본 안내, 네 locale Home 링크, `noindex`)

정규 Astro 페이지 28개와 별도 404를 빌드한다. `public/privacy.html`을 포함한 전체 HTML은 30개이며 sitemap에는 정규 URL 28개만 포함한다.

## Structure

- `src/components/pages/GameDetailPage.astro`가 MushHero와 Mush Dash 상세 구조를 공유한다.
- `src/components/pages/AboutPage.astro`가 네 locale About 구조, 소규모 팀 소개, 스튜디오 위치·Google 지도를 공유하고 `src/components/about/TeamMembers.astro`가 `team.ts` 기반 팀원 카드를 출력한다.
- `src/components/pages/NewsPage.astro`와 `src/components/news/NewsItemCard.astro`가 네 locale의 최신순 단일 News & Press 목록을 공유한다.
- `src/components/pages/GamesPage.astro`가 네 locale Our Games 구조를 공유하고 `src/components/games/`가 주력·출시작 위계를 구성한다.
- `src/components/game-detail/`은 공통 섹션 컴포넌트다.
- `src/data/games.ts`는 확인된 Store URL·출시 상태·Steam CDN 이미지·상세 태그를 관리한다.
- `src/data/contact.ts`는 공개 비즈니스 이메일, business category, 선택적 Discord URL을 관리한다.
- `src/data/company.ts`는 UI 브랜드명, 한국어 공식 스튜디오 주소, 검증된 Google Maps 공유 iframe URL과 검색 URL 생성을 관리한다.
- `src/data/team.ts`와 `src/types/team.ts`는 팀원 이름·역할·담당·선택적 프로필 이미지 경로를 관리한다. 현재 `public/team/profiles/park-jaemin.png`와 `jeong-bogeon.png`를 사용하며 로드 실패 또는 경로가 `null`이면 기존 Lv.B symbol을 대체 표시한다. 승인 원본과 교체 절차는 `public/team/profiles/README.md`를 따른다.
- `src/data/socialLinks.ts`는 공식 X·Instagram·Discord·Steam Developer 링크를 한 번만 관리한다.
- `src/data/news.ts`는 원문·매체·날짜를 검증한 외부 자료 3건과 네 locale 자체 제목·요약을 정적으로 관리한다.
- `src/i18n/`은 네 언어 문구와 locale 보존 route를 관리한다.
- `src/styles/game-detail.css`는 공통 레이아웃에 게임별 accent override만 적용한다.
- `src/pages/404.astro`와 `src/styles/not-found.css`는 JavaScript 없는 브랜드 V3 404를 구성한다.
- `public/robots.txt`는 `https://lvb.kr/sitemap-index.xml`을 가리킨다.
- `src/config/site.ts`의 `naverSiteVerification`은 `BaseLayout.astro`를 통해 일반 Astro 페이지 `<head>`에 정적 meta로 출력된다. 과거 Naver HTML 확인 파일은 사용하지 않는다.
- `public/brand/lvb-symbol.png`는 Header·Footer compact mark에, `lvb-symbol-128.png`는 favicon·apple-touch-icon 후보에 사용한다.
- `public/brand/lvb-logo.png`는 About Hero의 넓은 브랜드 패널에서 원본 비율로 사용하며 `lvb-logo-128.png`는 원본 보존 자산이다.

UI·SEO 브랜드명은 `Lv.B`다. Store 검증 데이터에 포함된 `Lv.B Games` 개발사·퍼블리셔 문자열은 원문 데이터로 유지한다. 공통 UI는 warm-charcoal surface와 logo yellow를 사용하며, Mush Dash 상세의 Steam primary CTA는 게임 teal을 사용한다.

Mush Dash는 Steam을 primary, Epic Games Store를 secondary CTA로 사용한다. 게임별 `youtubeTrailerUrl`·`videoTitleKey`·`videoPoster`는 선택 필드이며 현재 모두 `null`이므로 영상 UI를 출력하지 않는다. 외부 Store 링크는 새 탭 보안 속성을 포함한다.

Contact는 JavaScript·Functions·SMTP·외부 이메일 API 없이 locale별 정적 `mailto:` 링크를 사용한다. 홈페이지와 호스팅 플랫폼은 문의 내용을 수집·저장하지 않으며 사용자가 자신의 이메일 프로그램에서 직접 전송한다. Contact 문구와 subject·body template은 `Draft / User Review`다. 게임 피드백·버그·기술지원은 공식 Discord로 안내한다.

Contact 문의 범위는 비즈니스, 파트너십, 행사·전시, 크리에이터·Steam 큐레이터, 언론·인터뷰, 일반 회사 문의의 여섯 종류다. 게임 키 문의는 개별 검토하며 제공을 보장하지 않고, 언론 문의도 같은 비즈니스 이메일 CTA를 사용한다.

News & Press는 네 locale route와 Header·Footer 링크를 제공한다. 모든 항목은 외부 원문으로 연결되는 최신순 단일 목록에 한 번씩 표시하며 기사 본문·이미지·Featured 분리·자동 수집 기능은 포함하지 않는다. 기사 추가 기준은 `../docs/NEWS.md`를 따른다.

`public/privacy.html`은 보호 파일이다. 내용·경로·출력물을 임의로 수정하지 않는다. 반복 검증과 실행 권한은 `../docs/VALIDATION.md`를 따른다.
