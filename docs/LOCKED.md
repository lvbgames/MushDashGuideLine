# Locked: Privacy

- `site/`는 Astro static build를 사용하지만 `site/public/privacy.html`은 그대로 복사되는 public asset이다. 따라서 Astro page·layout·i18n routing은 `/privacy` 콘텐츠에 적용하지 않는다.

- 보호 URL: `https://lvb.kr/privacy` 및 `/privacy`.
- 보호 파일: `legacy-site/public/privacy.html` 및 `site/public/privacy.html`. 기준 SHA-256과 byte-identical 검증은 `VALIDATION.md`를 따른다. 내부 `<style>`, metadata, 본문, `lvbgames.store` 링크가 모두 잠금 대상이다.
- 정적 경로: 기존 source상 `/privacy.html`; legacy App Router에 `app/privacy/page.tsx`는 없다. 신규 `site/`에서는 `public/privacy.html`이 Astro 처리 없이 그대로 `dist/privacy.html`로 복사된다.
- runtime: `/privacy` 200, `/privacy/` 301→`/privacy`, `/privacy.html` 200; 세 최종 본문은 4,271 bytes 및 원본과 같은 SHA-256이다. Mapping mechanism은 Likely Netlify Pretty URLs, Netlify UI setting은 Unverified다.
- routing 영향: `next.config.ts`에는 redirect/rewrite가 없고 `netlify.toml`에는 redirect 규칙이 없으며 middleware 파일도 없다.
- 변경 금지: 정책 본문, 제목·문장·링크·이메일·날짜, metadata, 파일 내 스타일, 페이지 구조·표시, HTTP 응답, 직접 접근성, redirect/rewrite, 404/catch-all, middleware, locale routing.
- `lvbgames.store` 링크가 존재하더라도 이를 이유로 정책을 수정하지 않는다. `/privacy`에 다국어 route·이동·redirect를 적용하지 않는다.
- 검증 절차는 `VALIDATION.md`를 따른다. 신규 framework·Netlify 설정은 직접 접근성과 출력을 보존해야 한다.
- 사용자 명시적 별도 승인 없이는 두 보호 파일과 관련 URL·라우팅을 수정·삭제·교체하지 않는다.
