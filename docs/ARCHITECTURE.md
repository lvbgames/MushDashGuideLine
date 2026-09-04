# Architecture

- `legacy-site/`는 기존 Next.js 15.3.2, React 19, TypeScript 5, Tailwind CSS 기반 App Router 프로젝트다. 기존 build/Netlify 설정도 이 디렉터리에 보관한다.
- legacy static export 산출물은 `out/`이었고 설정은 `.next` publish와 Netlify plugin을 사용했다. 이는 보관 정보이며 수정·자동 계승 대상이 아니다.
- `site/`: Astro 7.1.6 static output, TypeScript strict, npm/package-lock, Tailwind CSS 4.3.3 + `@tailwindcss/vite` 4.3.3, `@astrojs/sitemap` 3.7.3, `@astrojs/check` 0.9.10. Node engine은 `>=22.12.0`, `.nvmrc`는 지원 LTS major 24다.
- `analytics/`: Cloudflare Workers Free와 D1 Free용 독립 TypeScript Worker이며 Astro·Netlify build에 포함하지 않는다. 기존 방문자 Worker·D1·매일 00:10 KST Cron과 사이트 endpoint는 production active다. `daily_visitors`에는 KST 날짜, 당일 HMAC-SHA256 hash, 생성 시각만 임시 저장하고 Cron이 과거 날짜의 수를 `daily_stats`에 확정한 뒤 같은 D1 batch에서 해당 hash를 삭제한다. 다운로드 확장은 고정 `/download/{brand|mushhero|mushdash}` → 기존 ZIP 302와 `download_stats`의 날짜·asset별 시작 횟수만 추가하며 2026-09-04 production에 적용했다. 다운로드 사용자 IP·hash·User-Agent·referrer·국가를 D1에 저장하지 않는다.
- site는 Home·Our Games·About·Contact·News·MushHero·MushDash·Privacy·Terms의 4개 locale 명시적 static route와 sitemap을 생성한다. Privacy·Terms 각 4개와 404는 sitemap에서 제외한다. React/Vue/Svelte, SSR, adapter, Functions, DB, CMS는 사용하지 않는다. Netlify Edge Function은 정적 콘텐츠를 렌더링하지 않고 루트 `/`의 locale 선택만 처리하는 한 개의 독립 기능이다.
- Astro automatic locale route fallback은 static locale roots와 충돌해 build 경고를 만들었으므로 사용하지 않는다. `src/i18n/translations`의 `getTranslation()`이 English text fallback을 제공한다.
- `src/data/games.ts`는 사람이 확인한 Steam/Epic URL과 Steam CDN media metadata를 type-safe하게 관리한다. browser/build scraping과 영상 자체 호스팅은 사용하지 않으며, trailer는 확인 전 `null` 또는 Steam Store 이동만 사용한다.
- 신규 구현은 legacy 코드를 복사하거나 import하지 않는다. 이전 Privacy는 `legacy-site/public/privacy.html`에 역사 보관하며, 현재 정책은 `site/src/data/privacy.ts`와 공통 Astro 컴포넌트에서 독립적으로 관리한다.
- `docs/`와 `references/`는 실행 코드가 아니다. `.codex/config.toml`은 루트에 남는다.

사이트의 `PUBLIC_ANALYTICS_ENDPOINT`가 유효한 HTTPS `/hit` URL일 때만 `BaseLayout.astro`가 작은 fire-and-forget POST를 한 번 출력한다. 값이 없거나 잘못되면 client code를 출력하지 않는다. Analytics timeout·429·500·quota 초과·network failure는 모두 무시하며 사이트 렌더링과 내비게이션에 영향을 주지 않는다.

`AdminApp/`은 고정 HTTPS `/api/stats`만 조회하는 .NET 8 WPF Windows 앱이다. 운영 데이터 수정·migration·배포 기능은 없고, 선택적으로 저장하는 자격증명 전체는 Windows DPAPI CurrentUser로 보호한다. build/publish 산출물은 Git에서 제외한다.
