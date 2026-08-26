# Architecture

- `legacy-site/`는 기존 Next.js 15.3.2, React 19, TypeScript 5, Tailwind CSS 기반 App Router 프로젝트다. 기존 build/Netlify 설정도 이 디렉터리에 보관한다.
- legacy static export 산출물은 `out/`이었고 설정은 `.next` publish와 Netlify plugin을 사용했다. 이는 보관 정보이며 수정·자동 계승 대상이 아니다.
- `site/`: Astro 7.1.6 static output, TypeScript strict, npm/package-lock, Tailwind CSS 4.3.3 + `@tailwindcss/vite` 4.3.3, `@astrojs/sitemap` 3.7.3, `@astrojs/check` 0.9.10. Node engine은 `>=22.12.0`, `.nvmrc`는 지원 LTS major 24다.
- site는 Home·Our Games·About·Contact·News·MushHero·MushDash·Privacy·Terms의 4개 locale 명시적 static route와 sitemap을 생성한다. Privacy·Terms 각 4개와 404는 sitemap에서 제외한다. React/Vue/Svelte, SSR, adapter, Functions, DB, CMS는 사용하지 않는다. Netlify Edge Function은 정적 콘텐츠를 렌더링하지 않고 루트 `/`의 locale 선택만 처리하는 한 개의 독립 기능이다.
- Astro automatic locale route fallback은 static locale roots와 충돌해 build 경고를 만들었으므로 사용하지 않는다. `src/i18n/translations`의 `getTranslation()`이 English text fallback을 제공한다.
- `src/data/games.ts`는 사람이 확인한 Steam/Epic URL과 Steam CDN media metadata를 type-safe하게 관리한다. browser/build scraping과 영상 자체 호스팅은 사용하지 않으며, trailer는 확인 전 `null` 또는 Steam Store 이동만 사용한다.
- 신규 구현은 legacy 코드를 복사하거나 import하지 않는다. 이전 Privacy는 `legacy-site/public/privacy.html`에 역사 보관하며, 현재 정책은 `site/src/data/privacy.ts`와 공통 Astro 컴포넌트에서 독립적으로 관리한다.
- `docs/`와 `references/`는 실행 코드가 아니다. `.codex/config.toml`은 루트에 남는다.
