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
- `LanguageSwitcher`는 현재 페이지 종류와 게임 상세 slug를 유지해야 한다.
- Header·Footer와 본문 CTA가 현재 locale의 의도한 경로를 사용해야 한다.
- sitemap은 공개 정규 Astro route만 포함하고 404와 보호된 정적 Privacy 파일은 제외한다.
- `robots.txt`는 공개 sitemap index를 가리켜야 하며 404는 `noindex`이고 복잡한 locale 자동 감지나 JavaScript를 사용하지 않아야 한다.
- Home 빌드 HTML의 `<head>`에는 `siteConfig.naverSiteVerification`과 일치하는 Naver 소유확인 meta가 정확히 한 번 있어야 하며, 과거 Naver HTML 확인 파일은 `public/`과 `dist/` 모두에 없어야 한다.

## 페이지 품질과 메타데이터

- 정규 페이지의 title·description 중복, canonical·네 locale `hreflang`·`x-default` 대응을 확인한다.
- 페이지별 H1 하나와 heading 단계, `main`·`nav`·`footer` landmark를 확인한다.
- 이미지의 `width`·`height`·`alt`와 Hero `eager`·나머지 `lazy` 우선순위를 확인한다.
- 화면에 TODO·placeholder·개발 상태 문구가 노출되지 않는지 확인한다.
- Contact의 수신 주소와 locale별 subject·body를 percent-decoding해 손상 여부를 확인하고, 사용하지 않는 form·success 코드가 없는지 검사한다.
- 신규 Astro 페이지의 외부 새 탭 링크는 보안 속성을 검사한다. Privacy는 기준 해시 보존을 우선하며 기존 속성 차이는 보호된 legacy 예외로 기록한다.

## 반응형과 접근성

- 320·390·768·1024·1440·1920 CSS px에서 가로 넘침, Header 충돌, 이미지 비율, 정보 위계와 CTA 배치를 확인한다.
- 한국어·日本語·简体中文은 최소 320·768 CSS px에서 overflow와 부자연스러운 잘림을 추가 확인한다.
- 키보드 focus-visible, 모바일 메뉴 열기·Escape 닫기·초점 복귀, 주요 터치 대상 48px 수준을 확인한다.
- `prefers-reduced-motion`에서 스크롤·전환·애니메이션이 축소되는지 확인한다.
- 브라우저 콘솔 error·warning과 실패한 이미지 로드를 확인한다.

## 보호 대상

- `legacy-site/`는 현재 작업에서 변경하지 않는다.
- `references/Reference.png`는 이동·수정·교체하지 않으며 기준 해시는 `docs/REFERENCE.md`를 따른다.
- 다음 세 Privacy 파일은 byte-identical이어야 한다.
  - `legacy-site/public/privacy.html`
  - `site/public/privacy.html`
  - `site/dist/privacy.html`
- Privacy 기준 SHA-256:
  `95CA28BD2313111606DDAE18492BEB7C785152911F14CA60618DF88D8FF36F29`

## 실행 권한

- Commit, Push, Deploy Preview, Production 배포는 사용자가 명시적으로 요청한 경우에만 수행한다.
- 새 패키지·유료 기능·서버 기능은 제품 또는 배포 문서의 범위와 사용자 요청을 모두 확인한 뒤 추가한다.
- 운영 Push는 `scripts/deploy-production.ps1 -ConfirmProduction`으로만 수행하며 main·origin·divergence와 staged 비밀정보를 재검사하고 Force Push하지 않는다.
