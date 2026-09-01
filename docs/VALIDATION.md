# Validation

사이트 코드·라우팅·콘텐츠 또는 배포 설정을 변경한 작업은 완료 전에 이 절차를 수행한다. 작업별 추가 검증은 이 공통 절차 뒤에 더한다.

## 정적 검사와 빌드

1. `site/`에서 `npm run check`.
2. `site/`에서 `npm run build`.
3. 작업 루트에서 `git diff --check`.
4. 생성된 Astro 페이지 수, Privacy를 포함한 전체 HTML 수, sitemap URL 수를 현재 route 목록과 대조한다.
5. 운영 배포 준비에서는 루트에서 `scripts/prepare-production.ps1`을 실행하고 모든 검사가 성공해야 한다.

## 자체 Analytics

- `analytics/`에서 `npm ci`, `npm audit`, `npm run check`, `npm test`, `npm run qa:local`을 실행한다. local QA는 두 migration, 3·5·2 fixture의 집계 전후 TODAY·WEEK·TOTAL·최근 30일 불변, 과거 날짜의 `daily_stats` 3·5와 오늘 `daily_visitors` 2, 강제 실패 rollback, 재시도·2회 실행 멱등성, 같은 날짜·IP 중복 0, 다음 날짜 같은 IP +1, Googlebot·Yeti·Discordbot 제외, 일반 browser 포함, Origin 거부와 Basic Auth 401/200을 확인한다.
- production-mode HTTP `/admin/`·`/api/stats`는 인증과 rate limiter보다 먼저 426으로 거부하고 `WWW-Authenticate`와 HSTS를 반환하지 않아야 한다. HTTPS 무인증은 401과 Basic challenge, HTTPS 관리자 응답은 `Strict-Transport-Security: max-age=31536000`, `private, no-store`, `noindex, nofollow`를 반환해야 한다.
- local QA의 축소 window에서 `/hit`과 관리자 limiter가 독립적으로 정상 요청→429→window 후 정상 순서인지 검사한다. production 설정은 각각 60/60초, 두 관리자 경로 공유 10/60초이며 raw IP 대신 scope·날짜·IP의 HMAC key를 사용한다. Rate Limiting binding 장애 시 D1 또는 인증으로 우회하지 않고 503으로 fail closed해야 한다.
- production은 Cloudflare가 설정하는 `CF-Connecting-IP`만 사용하고 body/query의 IP를 받지 않아야 한다. 테스트 IP·날짜 header는 development와 명시적 QA flag가 동시에 켜진 local Worker에서만 허용한다.
- 임시 `daily_visitors` schema에는 `visit_date`, `visitor_hash`, `created_at`만, 장기 `daily_stats`에는 `visit_date`, `unique_visitors`, `finalized_at`만 있어야 한다. User-Agent·URL·referrer·country·raw IP·session 컬럼, 응답 또는 관리자 표시는 0건이어야 한다.
- Cron은 `10 15 * * *` 한 개여야 한다. 현재 KST 날짜보다 이른 모든 미집계 날짜를 날짜별 D1 batch로 집계한 뒤 hash를 삭제하며, 저장·삭제 중 실패하면 전체 rollback되어야 한다. 실패 backlog는 다음 실행에서 처리하고 두 번 실행해도 수치가 변하지 않아야 한다.
- TODAY는 오늘의 `daily_visitors`, WEEK·TOTAL·최근 30일은 확정 `daily_stats`와 아직 처리되지 않은 visitor row를 합쳐 계산한다. Tracking since는 두 table의 최소 날짜이며 빈 DB에서는 값이 없다고 표시해야 한다.
- `/admin/`과 `/api/stats`는 인증 전 통계 데이터를 반환하지 않고 `Cache-Control: private, no-store`, `X-Robots-Tag: noindex, nofollow`를 사용한다.
- production build는 `PUBLIC_ANALYTICS_ENDPOINT=https://lvb-analytics.lvb-analytics-worker.workers.dev/hit`를 사용한다. 60개 정상 HTML에는 endpoint와 initialization이 각각 한 번, 404에는 0번이어야 하며 fetch rejection이 처리되어야 한다. Admin username·password/hash/salt·HMAC secret·D1 ID는 HTML에 없어야 한다.
- Worker·D1·사이트 endpoint와 공개 Privacy는 2026-08-31 production active이며, 네 언어 Last updated·Effective date는 실제 적용일 `2026-08-31`을 사용한다. 이후 Worker hardening은 별도 승인·배포 전후 검증 대상으로 구분한다.

## 링크와 라우팅

- 모든 생성 HTML에서 빈 `href`와 존재하지 않는 내부 경로를 검사한다.
- `target="_blank"` 외부 링크는 `rel="noopener noreferrer"`를 포함해야 한다.
- 지원 locale별 route, canonical, `hreflang`, `x-default`를 확인한다.
- 중국어 locale route는 `/zh-cn/`을 유지하되 HTML `hreflang` 값은 BCP 47 표기 `zh-CN`인지 확인한다.
- `LanguageSwitcher`는 현재 페이지 종류와 게임 상세 slug를 유지해야 한다.
- Netlify Edge locale redirect는 `site/netlify/edge-functions/locale-redirect.ts` 한 개이며 `netlify.toml`에서 정확한 `/`에만 연결한다. KR→KO, JP→JA, CN→ZH-CN, 기타·미확인→EN과 유효한 `lvb_locale` 우선순위를 검사한다.
- Netlify 응답은 `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, camera·microphone·geolocation을 제한하는 `Permissions-Policy`, `X-Frame-Options: DENY`, `Content-Security-Policy-Report-Only`를 포함해야 한다. CSP는 wildcard·`unsafe-eval` 없이 self, Analytics Worker, Steam image host, Google Maps와 youtube-nocookie frame만 허용하며 기존 플랫폼 HSTS를 중복 설정하지 않는다.
- CSP Report-Only 상태에서 Home·MushHero·News·Press·Contact·Privacy·Terms·About, 모바일 메뉴, 언어 전환, Analytics hit, YouTube click-to-load와 Google Maps를 확인한다. report-only 위반과 콘솔 오류가 0이고 inline script/style 제거 또는 nonce/hash 전략이 확정되기 전에는 enforced CSP로 전환하지 않는다.
- 루트 Geo redirect는 307, `private, no-store`, query string 보존이어야 한다. locale·deep link에는 적용하지 않고 알려진 crawler·preview bot은 English root를 받아야 하며 redirect loop가 없어야 한다.
- 언어 선택 링크는 `lvb_locale` 값만 `Path=/`, 1년, `SameSite=Lax`로 저장하고 HTTPS에서는 `Secure`를 사용한다. 외부 Geo/IP API·브라우저 위치 권한·국가 코드 저장은 없어야 한다.
- Header·Footer와 본문 CTA가 현재 locale의 의도한 경로를 사용해야 한다.
- sitemap은 공개 정규 Astro route만 포함하고 404와 네 Astro Privacy·Terms route는 제외한다.
- `robots.txt`는 공개 sitemap index를 가리켜야 하며 404는 `noindex`이고 복잡한 locale 자동 감지나 JavaScript를 사용하지 않아야 한다.
- `site/public/robots.txt`와 빌드된 `site/dist/robots.txt`는 UTF-8 BOM 없는 동일 byte여야 한다. wildcard와 `Yeti` 각각에 `Allow: /`가 있어야 하고 절대 HTTPS sitemap URL을 포함하며, root `Disallow`, HTML 태그, `/robots.txt` redirect·rewrite는 없어야 한다.
- Home 빌드 HTML의 `<head>`에는 `siteConfig.naverSiteVerification`과 일치하는 Naver 소유확인 meta가 정확히 한 번 있어야 하며, 과거 Naver HTML 확인 파일은 `public/`과 `dist/` 모두에 없어야 한다.
- `dist/index.html`의 `<head>`에는 WebSite·Organization `application/ld+json` script가 정확히 한 번 있어야 한다. Lv.B 자체 Article 네 locale에는 Article script가 각각 한 번, 그 외 HTML에는 0개여야 한다. JSON 파싱, root 단일 `@graph`, Article headline·description·image·날짜·Organization author/publisher·mainEntityOfPage·inLanguage를 검사한다.
- JSON-LD 직렬화 소스는 `<`를 `\u003c`로 치환해 `</script>` 조기 종료를 방지하고 사용자 입력·runtime 외부 응답을 삽입하지 않아야 한다. `sameAs`는 전체 공식 프로필 4개와 Naver 지원 채널 X·Instagram 2개를 구분한다.

## 페이지 품질과 메타데이터

- 정규 페이지의 title·description 누락·중복, canonical·네 locale `hreflang`·`x-default` 대응을 확인한다. Open Graph·Twitter의 title·description은 페이지 메타와 같은 의미여야 한다. 전용 공유 이미지는 절대 URL, 1200×630, 실제 MIME, locale별 `og:image:alt`·`twitter:image:alt`를 포함하고 public/dist SHA가 승인 원본과 일치해야 한다.
- 페이지별 H1 하나와 heading 단계, `main`·`nav`·`footer` landmark를 확인한다.
- 이미지의 `width`·`height`·`alt`와 Hero `eager`·나머지 `lazy` 우선순위를 확인한다.
- MushHero 영상은 공식 ID 2개만 허용하고 초기 HTML의 iframe·YouTube API script·외부 thumbnail이 0인지 확인한다. Play 뒤 선택 카드에만 `youtube-nocookie.com` iframe이 생성되고 iframe title·allowfullscreen·referrerpolicy·focus 이동과 안전한 원문 fallback 링크가 작동해야 한다.
- 화면에 TODO·placeholder·개발 상태 문구가 노출되지 않는지 확인한다.
- Contact의 수신 주소와 locale별 subject·body를 percent-decoding해 손상 여부를 확인하고, 사용하지 않는 form·success 코드가 없는지 검사한다.
- 신규 Astro 페이지의 외부 새 탭 링크는 보안 속성을 검사한다.
- News 데이터는 총 12건, source URL·slug 중복 0건, `publishedAt` 내림차순, locale별 제목·요약 존재를 검사한다. page size 6으로 네 locale page 1·2에 각각 6건을 정적 출력하고 page 3은 만들지 않으며, 개인 블로그는 `blog-review`로 분류한다.
- News pagination은 첫 페이지에 `/page/1/`을 만들지 않고 page 2의 자기 canonical·같은 번호 hreflang·x-default·sitemap 포함, 이전·다음 링크와 현재 페이지 상태를 검사한다. 외부 카드 전체는 새 탭과 `noopener noreferrer`, 내부 카드 전체는 같은 탭을 사용하고 별도 원문 CTA·중첩 링크는 없어야 한다.
- News 카드 metadata는 네 locale page 1·2 모두 첫 줄 category·publisher·author, 둘째 줄 date 구조여야 하며 desktop에서도 날짜가 첫 줄로 합쳐지지 않아야 한다.
- 내부 News는 locale별 같은 slug 상세 route, 같은 탭 링크, Article OG·JSON-LD를 사용하고 외부 원문 표현·아이콘을 사용하지 않는지 검사한다. Press Kit은 네 locale canonical·hreflang·sitemap, 공개 브랜드 원본, lazy screenshot, Recent Press UI 0건과 기존 press mailto를 확인한다.
- Privacy 4개 HTML에서 `noindex, follow`, 자기 canonical, en·ko·ja·zh-CN·x-default, H1·main 각 1개, JSON-LD 0개, 19개 section ID의 일치·순서, locale별 Footer와 LanguageSwitcher 경로를 검사한다.
- Terms 4개 HTML에서 `noindex, follow`, 자기 canonical, en·ko·ja·zh-CN·x-default, H1·main 각 1개, JSON-LD 0개, 16개 section ID의 일치·순서, locale별 Footer와 LanguageSwitcher 경로를 검사한다. `Last updated`와 `Effective date`는 locale별 표기로 각각 한 번 표시하고 두 `<time>`의 `datetime` 값은 모두 `2026-08-12`여야 한다.
- Privacy와 Terms의 locale별 상호 링크, Footer active 상태와 `/terms.html` → `/terms/` forced 301을 검사한다. Terms의 Nintendo, 고정 Steam 환불 시간, 미확인 DLC·시즌패스, 지속 업데이트 보장, 전면 면책, 전속 관할, 확인되지 않은 영구정지 문구는 0건이어야 한다.
- Privacy 화면에서 `TODO`, `FIXME`, `placeholder`, `lvbgames.store`, raw GitHub logo, `Main Project: MushDash`, Epic brand requirement 문구가 0건인지 확인한다.
- Privacy 네 언어에 첫 언급 `Epic Online Services(EOS)`와 이후 `EOS`, Lobby·Session·P2P·EOS UserCloud, 일반 문의 1년 보관, Netlify Web Analytics·RUM·Log Drains 미사용, 자체 서버·DB·텔레메트리·자동 크래시 전송 미사용, 담당부서 Lv.B가 동일한 의미로 포함되는지 확인한다.
- 빌드된 Privacy 네 언어 HTML에서 대소문자 구분 없이 내부 구현 명칭 `EIK`가 0건인지 확인한다.
- 네 언어 Privacy는 최종 수정일과 시행일을 각각 locale별 문구로 표시하고 두 `<time>`의 `datetime` 값이 모두 `2026-08-31`인지 확인한다. 19개 section 순서, `noindex, follow`, sitemap 제외와 youtube-nocookie click-to-load 고지를 함께 확인한다.
- UserCloud 공개 범주는 네 언어 모두에서 튜토리얼 진행, 표시 이름, 선택한 아이콘·이름표·아바타, 재화 잔액, 보유 아이템·인벤토리, Infinity Tower 최고 기록, 주간 도전 ID·진행·완료·보상 수령, 중복 구매 처리를 방지하는 거래 식별자를 포함해야 한다.
- 네 언어 모두 계정 식별자는 계정별 영역을 찾는 SDK 처리와 save JSON payload를 구분하고, 로컬 언어·매칭 지역·그래픽·오디오 설정은 UserCloud 업로드 범주에서 제외해야 한다.
- UserCloud 자동 만료·정기 삭제·게임 제거·계정 연결 해제 시 자동 삭제 또는 이메일 요청의 즉시·무조건 삭제를 보장하는 문구는 없어야 한다. 요청 채널, Lv.B 담당부서, 본인·범위 및 플랫폼/EOS 절차 확인과 제한 안내는 있어야 한다.
- 공개 Privacy에는 내부 UserCloud 파일명·key·C++ field·SDK 함수·development 검증 파일과 credential 보안 finding이 없어야 한다. 내부 근거는 `PRIVACY_USERCLOUD_AUDIT.md`, 운영 절차는 공개 링크가 없는 `PRIVACY_REQUEST_RUNBOOK.md`에서만 관리한다.

## 반응형과 접근성

- 320·390·768·1024·1440·1920 CSS px에서 가로 넘침, Header 충돌, 이미지 비율, 정보 위계와 CTA 배치를 확인한다.
- 한국어·日本語·简体中文은 최소 320·768 CSS px에서 overflow와 부자연스러운 잘림을 추가 확인한다.
- 키보드 focus-visible, 모바일 메뉴 열기·Escape 닫기·초점 복귀, 주요 터치 대상 48px 수준을 확인한다.
- `prefers-reduced-motion`에서 스크롤·전환·애니메이션이 축소되는지 확인한다.
- 브라우저 콘솔 error·warning과 실패한 이미지 로드를 확인한다.
- About 프로필은 640·1024 WebP srcset과 승인 PNG fallback, public·dist WebP byte 일치, 4:5 crop을 검사하고 원본 PNG SHA를 유지한다.
- JavaScript 비활성 상태에서 첫 Home Hero, 모든 본문, 내비게이션, News, 게임 스크린샷 원본 링크와 Press ZIP/개별 다운로드가 남는지 확인한다. reveal의 CSS 기본 상태는 visible이어야 한다.
- Home Hero의 visible game selector는 0개여야 하며 MushHero 2장 → MushDash 2장의 full-bleed 배경 slide 4개, indicator dot 4개와 작은 재생 제어 하나만 사용한다. 같은 게임 이미지 사이에는 텍스트가 유지되고 게임 경계에서만 기존 문구·Store·상세 CTA가 함께 전환되는지 확인한다.
- slideshow는 6.5초 간격으로 MH1 → MH2 → MD1 → MD2 → MH1을 순환하고 hover·focus·비활성 문서에서 일시정지한다. reduced motion에서는 타이머와 crossfade가 비활성화되고 dot 수동 이동은 가능해야 한다. 첫 MushHero 이미지만 eager/high priority이며 다음 이미지는 전환 전에 한 장씩 순차 준비되는지 확인한다.
- Home Hero는 390·768·1024·1440px에서 배경이 Hero 전체를 채우고 gradient 아래 텍스트·CTA가 이미지와 충돌하거나 잘리지 않으며 가로 overflow가 없어야 한다. Hero 아래 대형 Game Showcase 출력과 관련 dead CSS는 0건이어야 한다.
- Home 본문은 Featured Game → Our Games → About → Community → Contact 순서를 유지하고, 별도 하단 MushDash 대형 소개와 전용 component·CSS·번역은 0건이어야 한다. Our Games → About 사이에는 단일 divider와 기존 section 여백이 자연스럽게 이어져야 한다.
- Home Featured Game은 네 locale 모두 `MushHero`가 section heading으로 한 번 표시되고, project eyebrow·장르/2027 상태·기존 headline·설명·내부 상세 primary·Steam wishlist secondary 순서를 유지해야 한다. 390·768·1440px에서 meta는 자연스러운 1~2줄, CTA는 48px 이상이며 01·02·03과 공식 screenshot 3장은 유지한다.
- Warm Bright Charcoal 변경은 Header·Hero의 `#0f0d0c`를 유지하고 page·surface·raised·warm surface를 구분해야 한다. body·secondary·muted·primary button·interactive border·focus-visible의 자동 contrast를 검사하고, decorative divider와 interactive boundary를 구분해 기록한다. Hero 이미지는 brightness/filter 없이 overlay 투명도만 조정한다.
- 사이트가 작성한 사용자 대면 콘텐츠는 `MushDash`를 사용한다. `Mush`와 `Dash` 사이 공백 표기가 남으면 외부 원문 제목·URL 등 보존 근거를 항목별로 기록한다.
- About은 네 locale 모두 회사 철학 영역이 정확히 1개이고 같은 순서·의미의 원칙이 정확히 3개여야 한다. 제거한 중복 approach 영역과 전용 component·CSS·번역은 0건이어야 한다.
- Legal 목차는 desktop nav와 mobile details가 DOM에 각각 하나씩 존재한다. 64rem 미만에서는 desktop aside, 64rem 이상에서는 mobile details가 `display:none`인 상위 subtree에 있어 접근성 트리와 탭 순서에서 제외되고, 보이는 목차만 anchor 대상으로 이동하는지 확인한다. 실제 screen reader를 실행하지 못한 경우 DOM·computed style·focusability·접근성 tree 검사 범위와 물리 키보드 미검증 항목을 구분해 보고한다.
- 공통 MediaGallery는 native scroll-snap, 이전·다음 label과 경계 disabled, mobile touch scroll, dialog Close·화살표·Escape·backdrop·trigger focus 복귀를 확인한다.
- Press는 승인된 브랜드 5개·MushHero 7개·MushDash 6개와 정적 ZIP 3개를 확인한다. 화면은 브랜드 다운로드 3개, 게임 이미지 10개, ZIP href 3개를 제공하고, public/dist SHA·ZIP bytes·entry integrity·중복·작업용 docs/previews 미포함을 검사한다. 기존 Home source용 Steam 스크린샷은 별도 보호하며 MushDash `promo-*`를 스크린샷으로 표기하지 않는다. Hero divider 아래 여백과 제목·설명 간격, Recent Press 관련 UI·번역·스타일 0건도 확인한다.
- Home·MushHero·Press·About mobile Lighthouse는 각각 90·90·90·95 이상, 모든 대상 CLS 0.02 이하·TBT 100ms 이하를 유지하고 report JSON과 Chrome 임시 profile은 저장소에 추가하지 않는다.

## Naver SEO 운영 감사

- `https://lvb.kr`의 정규 route, `robots.txt`, sitemap index·하위 sitemap, logo, custom 404를 리디렉션을 끈 HTTP 요청으로 검사한다.
- 배포 후 일반 요청과 Yeti User-Agent 요청으로 `https://lvb.kr/robots.txt`의 최초·최종 상태, redirect 횟수, `Location`, `Content-Type`, `Content-Length`, `Cache-Control`, `Server`와 body를 기록한다. HTTPS는 200 `text/plain`·redirect 0회여야 한다.
- 운영 확인 명령은 `curl.exe -sS -D - https://lvb.kr/robots.txt`, `curl.exe -sS -D - -A "Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)" https://lvb.kr/robots.txt`, `curl.exe -sS -D - -o NUL http://lvb.kr/robots.txt`를 사용한다.
- HTTP와 `www`는 대표 HTTPS 호스트로 301/308인지, 정규 페이지는 200인지, custom 404는 실제 404인지 확인한다.
- 색인 페이지에 `noindex`·`nofollow`·X-Robots-Tag 제한이 없는지 확인하고 404의 `noindex, follow`는 허용한다.
- sitemap의 모든 `loc`는 `https://lvb.kr/` 절대 URL이어야 하며 현재 News page 3과 자체 글을 포함한 52개 색인 route를 확인한다.
- `index.html` 직접 URL은 `netlify.toml`의 깊이별 forced 301 규칙이 대표 trailing-slash URL을 가리키는지 확인하고, 실제 동작은 배포 후 재검사한다.
- title·description 중복, 자기 canonical, H1 하나, 정적 main/nav/footer, frame·meta refresh·JavaScript redirect, 빈·hash-only·javascript href, broken 내부 링크, 내부 nofollow, 이미지 alt·크기·asset을 전체 생성 HTML에서 기계적으로 수집한다.
- News가 외부 기사 목록이고 자체 상세 본문이 없으면 RSS를 만들지 않으며, 자체 공지·개발일지 상세 route와 본문 발행이 생길 때 재검토한다.

## 보호 대상

- `legacy-site/`는 현재 작업에서 변경하지 않는다.
- `references/Reference.png`는 이동·수정·교체하지 않으며 기준 해시는 `docs/REFERENCE.md`를 따른다.
- `legacy-site/public/privacy.html`은 역사 보관본으로 변경하지 않으며 기준 SHA-256은 다음과 같다.
  `95CA28BD2313111606DDAE18492BEB7C785152911F14CA60618DF88D8FF36F29`
- `site/public/privacy.html`은 폐기했고 신규 출력은 locale별 Astro `index.html`이다. 생성 HTML은 빌드 포맷·줄바꿈에 따라 달라질 수 있으므로 raw byte 해시로 잠그지 않는다.
- `scripts/prepare-production.ps1`은 legacy 해시와 함께 네 route 존재, section 의미 구조, SEO, 언어 경로, 금지 문구, sitemap 제외를 검증한다.
- `scripts/prepare-production.ps1`은 Terms 네 route의 16개 section, SEO, 언어 경로, Privacy 상호 링크, 금지 문구와 sitemap 제외도 함께 검증한다.
- 최종 승인 후 잠금이 필요하면 `site/src/data/privacy.ts`의 정규화 source snapshot을 별도 검토해 확정하고, 정책 변경 시 source·네 번역·인벤토리·검증을 함께 갱신한다.

## 실행 권한

- Commit, Push, Deploy Preview, Production 배포는 사용자가 명시적으로 요청한 경우에만 수행한다.
- 새 패키지·유료 기능·서버 기능은 제품 또는 배포 문서의 범위와 사용자 요청을 모두 확인한 뒤 추가한다.
- 운영 Push는 `scripts/deploy-production.ps1 -ConfirmProduction`으로만 수행하며 main·origin·divergence와 staged 비밀정보를 재검사하고 Force Push하지 않는다.
