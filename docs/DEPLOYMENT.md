# Deployment

- GitHub: `https://github.com/lvbgames/MushDashGuideLine`, branch `main`, 기존 배포 소스 기준 HEAD `fcba5a78ba02adeaff0bef9c18bc3ab6825f32dd`. 로컬 `legacy-site/`는 보관 영역이다.
- 공식 도메인: `lvb.kr`; DNS는 카페24 관리로 제공되었으나 실제 DNS/Netlify site 값은 저장소에서 확인되지 않는다.
- legacy `netlify.toml`과 `next.config.ts`는 `legacy-site/`에 있다. 기존 실서비스 설정은 변경하지 않았다.
- 신규 root `netlify.toml`: base `site`, command `npm run build`, publish `dist`. Astro adapter·Next plugin·functions·serverless 설정은 사용하지 않는다. 실행 권한과 배포 전 검증은 `VALIDATION.md`를 따른다.
- 대표 URL 정책: HTTP와 `www`는 Netlify에서 `https://lvb.kr/`로 301 처리한다. root와 최대 3개 경로 segment의 명시적 `index.html` 요청은 `netlify.toml`의 forced 301 규칙으로 같은 trailing-slash 대표 URL에 통합한다. 기존 `/privacy.html`과 호환용 `/terms.html`은 generic 규칙보다 앞선 명시적 forced 301로 각각 `/privacy/`, `/terms/`에 연결한다.
- Naver 사이트 소유확인은 HTML 파일이 아니라 `site/src/config/site.ts`의 `naverSiteVerification` 값을 `BaseLayout.astro`가 정적 `<head>` meta로 출력하는 방식을 사용한다. 과거 `naver799482ce0e5e513c37daff06412293c5.html` 파일은 사용하거나 배포하지 않는다.
- 기존 운영 `/privacy`는 영어 단일 static HTML이고 `/privacy/`가 `/privacy`로 이동하며 `/privacy.html`도 200이었다. 신규 배포에서는 `/privacy/`와 세 locale Privacy를 Astro 정규 URL로 제공하고, `/privacy.html` 및 각 `index.html` 직접 경로는 trailing-slash canonical로 301 처리한다.
- `site/public/privacy.html`은 새 Astro route 빌드 확인 후 제거했다. `legacy-site/public/privacy.html`은 4,271 bytes·SHA-256 `95CA28BD2313111606DDAE18492BEB7C785152911F14CA60618DF88D8FF36F29`인 역사 보관본으로 유지한다.
- 신규 생성 HTML은 빌드 포맷과 줄바꿈에 따라 byte가 달라지므로 raw SHA-256 잠금을 사용하지 않는다. `prepare-production.ps1`은 네 route, 19개 section 순서, canonical·hreflang·robots, Footer·언어 경로, 금지 문구와 sitemap 제외를 의미 기반으로 검사한다.

무료 운영 정책: 정적 배포만 사용하고 유료 기능·자동 결제·대용량 영상 자체 호스팅을 사용하지 않는다. production deploy는 최소화하고 Deploy Preview를 우선한다. 무료 사용량 소진 가능성은 운영 시 관리한다.

## robots.txt 운영

- 원본은 `site/public/robots.txt`이며 Astro static build가 `site/dist/robots.txt`로 byte 그대로 복사한다. wildcard와 네이버 Yeti를 명시 허용하고 `https://lvb.kr/sitemap-index.xml`을 안내한다.
- 운영 요구 응답은 `https://lvb.kr/robots.txt`의 200, redirect 0회, `Content-Type: text/plain`이다. 현재 Netlify 정적 응답이 이를 충족하므로 별도 `[[headers]]`는 추가하지 않는다.
- 배포 후 `curl.exe -sS -D - https://lvb.kr/robots.txt`와 Yeti User-Agent 요청을 다시 실행한다. HTTP 요청은 같은 HTTPS 경로로 한 번만 이동해야 한다.
- 운영 응답 확인 후 네이버 서치어드바이저의 등록 사이트에서 `검증` → `robots.txt`로 이동해 수집 요청을 실행하고 최신 수집 결과를 확인한다. 메뉴 표기가 변경된 경우 등록 사이트의 robots.txt 검증·수집 화면을 사용한다.

## Production 명령

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\prepare-production.ps1

powershell -ExecutionPolicy Bypass -File .\scripts\deploy-production.ps1 `
  -ConfirmProduction `
  -CommitMessage "feat: launch new Lv.B website"
```

- `prepare-production.ps1`은 root·main·origin·divergence, 재현 빌드, legacy Privacy 보관 해시, 신규 Privacy 의미 구조, Naver meta, 필수 route·asset을 검사하며 Commit·Push하지 않는다.
- `deploy-production.ps1`은 `-ConfirmProduction`이 있을 때만 준비 검사를 다시 실행하고, 생성물·로그·리뷰 캡처·비밀정보를 제외한 변경을 단일 Commit으로 만든 뒤 `origin/main`에 일반 Push한다.
- Pull·Merge·Rebase·Reset·Force Push·토큰 저장은 사용하지 않는다. Git 인증은 Windows Git Credential Manager에 맡긴다.
- 배포 Commit SHA는 자기 자신을 포함하는 Commit 파일에 고정하지 않고 `git log -1 --format=%H`, 배포 스크립트 출력과 완료 보고를 기준 기록으로 사용한다.

## 2026-07-31 Production launch

- `preDeployHead`: `fcba5a78ba02adeaff0bef9c18bc3ab6825f32dd`.
- 배포 branch/remote: `main` → `origin/main`.
- Commit message: `feat: launch new Lv.B website`.
- `prepare-production.ps1`의 재현 빌드와 보호 검사가 통과한 경우에만 단일 Commit·일반 Push를 수행한다.
- Push 후 Netlify 자동 배포와 `lvb.kr` 운영 결과, 실제 Commit SHA는 스크립트 출력과 완료 보고를 기준 기록으로 사용한다.

## Contact 운영

- Contact는 사용자 이메일 프로그램을 여는 정적 `mailto:` 링크다. 홈페이지와 호스팅 플랫폼은 문의 내용을 저장하지 않는다.
- 수신과 회신은 Lv.B 비즈니스 메일함에서 처리하며 공개 주소는 `site/src/data/contact.ts`에서 관리한다.
- SMTP·이메일 API·Functions·Edge Functions를 사용하지 않는다.

## Privacy 배포 게이트

- `docs/PRIVACY_DATA_INVENTORY.md`에 남은 UserCloud 제품별 처리 권한·본인 확인·공개 package provenance와 외부 사업자 법적 관계를 운영자와 필요 시 법률 전문가가 확인한다.
- `docs/PRIVACY_REQUEST_RUNBOOK.md`에 따라 Steam·Epic별 계정 소유 확인, Mush Dash 범위의 열람·정정·삭제·처리정지 절차와 요청 처리 기록 보유기간을 확정한다. 조직 단위 `Delete User`는 제품별 영향 확인 없이 기본 절차로 사용하지 않는다.
- 네 언어 본문을 사용자와 필요 시 법률 전문가가 검토한다.
- 사용자는 2026-08-03 운영 배포를 승인했으며, 네 언어 Privacy의 최종 수정일과 시행일은 모두 `2026-08-03`으로 확정한다. `site/src/data/privacy.ts` 반영 후 check/build/prepare와 운영 route 검사를 다시 수행한다.
- 영구 잠금이 필요하면 생성 HTML이 아닌 승인된 정책 source snapshot의 정규화 규칙과 해시를 별도 작업에서 확정한다.
- 배포 후 `/privacy`, `/privacy/`, 세 locale route, `/privacy.html`, 네 locale `index.html` redirect를 실제 HTTP로 다시 검사한다.

## Terms 배포 게이트

- `docs/TERMS_AUDIT.md`의 한국어 기준 원문, 네 언어 법적 의미, 실제 Steam/Epic 구매 상태, 고지·동의 방식과 필요 시 법률 검토를 완료한다.
- 사용자는 2026-08-12 운영 배포를 승인했으며 Terms 네 언어의 `Last updated`와 `Effective date`는 모두 `2026-08-12`로 확정한다. `site/src/data/terms.ts` 반영 후 check/build/prepare와 운영 route·redirect를 다시 검증한다.
- 권한 있는 Steamworks·Epic Games Store Developer Portal에서 제품별 Terms/EULA URL 등록 위치와 현재 연결 상태를 수동 확인한다.
- 배포 후 `/terms`, `/terms/`, 세 locale route, `/terms.html`, 네 locale `index.html` redirect와 Privacy 상호 링크를 실제 HTTP로 검사한다.
