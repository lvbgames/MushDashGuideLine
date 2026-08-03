# Validation

사이트 코드·라우팅·콘텐츠 또는 배포 설정을 변경한 작업은 완료 전에 이 절차를 수행한다. 작업별 추가 검증은 이 공통 절차 뒤에 더한다.

## 정적 검사와 빌드

1. `site/`에서 `npm run check`.
2. `site/`에서 `npm run build`.
3. 작업 루트에서 `git diff --check`.
4. 생성된 Astro 페이지 수, Privacy를 포함한 전체 HTML 수, sitemap URL 수를 현재 route 목록과 대조한다.
5. 운영 배포 준비에서는 루트에서 `scripts/prepare-production.ps1`을 실행하고 모든 검사가 성공해야 한다.

## 링크와 라우팅

- 모든 생성 HTML에서 빈 `href`와 존재하지 않는 내부 경로를 검사한다.
- `target="_blank"` 외부 링크는 `rel="noopener noreferrer"`를 포함해야 한다.
- 지원 locale별 route, canonical, `hreflang`, `x-default`를 확인한다.
- 중국어 locale route는 `/zh-cn/`을 유지하되 HTML `hreflang` 값은 BCP 47 표기 `zh-CN`인지 확인한다.
- `LanguageSwitcher`는 현재 페이지 종류와 게임 상세 slug를 유지해야 한다.
- Header·Footer와 본문 CTA가 현재 locale의 의도한 경로를 사용해야 한다.
- sitemap은 공개 정규 Astro route만 포함하고 404와 네 Astro Privacy route는 제외한다.
- `robots.txt`는 공개 sitemap index를 가리켜야 하며 404는 `noindex`이고 복잡한 locale 자동 감지나 JavaScript를 사용하지 않아야 한다.
- Home 빌드 HTML의 `<head>`에는 `siteConfig.naverSiteVerification`과 일치하는 Naver 소유확인 meta가 정확히 한 번 있어야 하며, 과거 Naver HTML 확인 파일은 `public/`과 `dist/` 모두에 없어야 한다.
- `dist/index.html`의 `<head>`에는 `application/ld+json` script가 정확히 한 번 있어야 하고 다른 HTML에는 없어야 한다. JSON 파싱, 단일 `@graph`, WebSite·Organization 각 1개, publisher의 Organization `@id` 연결, 절대 logo URL, `addressCountry: KR`, 공식 `sameAs` 4개를 검사한다.
- JSON-LD 직렬화 소스는 `<`를 `\u003c`로 치환해 `</script>` 조기 종료를 방지하고 사용자 입력·runtime 외부 응답을 삽입하지 않아야 한다. `sameAs`는 전체 공식 프로필 4개와 Naver 지원 채널 X·Instagram 2개를 구분한다.

## 페이지 품질과 메타데이터

- 정규 페이지의 title·description 중복, canonical·네 locale `hreflang`·`x-default` 대응을 확인한다.
- 페이지별 H1 하나와 heading 단계, `main`·`nav`·`footer` landmark를 확인한다.
- 이미지의 `width`·`height`·`alt`와 Hero `eager`·나머지 `lazy` 우선순위를 확인한다.
- 화면에 TODO·placeholder·개발 상태 문구가 노출되지 않는지 확인한다.
- Contact의 수신 주소와 locale별 subject·body를 percent-decoding해 손상 여부를 확인하고, 사용하지 않는 form·success 코드가 없는지 검사한다.
- 신규 Astro 페이지의 외부 새 탭 링크는 보안 속성을 검사한다.
- Privacy 4개 HTML에서 `noindex, follow`, 자기 canonical, en·ko·ja·zh-CN·x-default, H1·main 각 1개, JSON-LD 0개, 19개 section ID의 일치·순서, locale별 Footer와 LanguageSwitcher 경로를 검사한다.
- Privacy 화면에서 `TODO`, `FIXME`, `placeholder`, `lvbgames.store`, raw GitHub logo, `Main Project: MushDash`, Epic brand requirement 문구가 0건인지 확인한다.
- Privacy 네 언어에 첫 언급 `Epic Online Services(EOS)`와 이후 `EOS`, Lobby·Session·P2P·EOS UserCloud, 일반 문의 1년 보관, Netlify Web Analytics·RUM·Log Drains 미사용, 자체 서버·DB·텔레메트리·자동 크래시 전송 미사용, 담당부서 Lv.B가 동일한 의미로 포함되는지 확인한다.
- 빌드된 Privacy 네 언어 HTML에서 대소문자 구분 없이 내부 구현 명칭 `EIK`가 0건인지 확인한다.
- 네 언어 Privacy는 최종 수정일과 시행일을 각각 locale별 문구로 표시하고 두 `<time>`의 `datetime` 값이 모두 `2026-08-03`인지 확인한다. 공개 Privacy HTML의 `2026-07-31`, `pending`, `미정`은 0건이어야 한다.
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

## Naver SEO 운영 감사

- `https://lvb.kr`의 정규 route, `robots.txt`, sitemap index·하위 sitemap, logo, custom 404를 리디렉션을 끈 HTTP 요청으로 검사한다.
- HTTP와 `www`는 대표 HTTPS 호스트로 301/308인지, 정규 페이지는 200인지, custom 404는 실제 404인지 확인한다.
- 색인 페이지에 `noindex`·`nofollow`·X-Robots-Tag 제한이 없는지 확인하고 404의 `noindex, follow`는 허용한다.
- sitemap의 모든 `loc`는 `https://lvb.kr/` 절대 URL이어야 하며 28개 route가 모두 200인지 확인한다.
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
- 최종 승인 후 잠금이 필요하면 `site/src/data/privacy.ts`의 정규화 source snapshot을 별도 검토해 확정하고, 정책 변경 시 source·네 번역·인벤토리·검증을 함께 갱신한다.

## 실행 권한

- Commit, Push, Deploy Preview, Production 배포는 사용자가 명시적으로 요청한 경우에만 수행한다.
- 새 패키지·유료 기능·서버 기능은 제품 또는 배포 문서의 범위와 사용자 요청을 모두 확인한 뒤 추가한다.
- 운영 Push는 `scripts/deploy-production.ps1 -ConfirmProduction`으로만 수행하며 main·origin·divergence와 staged 비밀정보를 재검사하고 Force Push하지 않는다.
