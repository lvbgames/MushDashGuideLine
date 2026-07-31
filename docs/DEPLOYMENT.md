# Deployment

- GitHub: `https://github.com/lvbgames/MushDashGuideLine`, branch `main`, 기존 배포 소스 기준 HEAD `fcba5a78ba02adeaff0bef9c18bc3ab6825f32dd`. 로컬 `legacy-site/`는 보관 영역이다.
- 공식 도메인: `lvb.kr`; DNS는 카페24 관리로 제공되었으나 실제 DNS/Netlify site 값은 저장소에서 확인되지 않는다.
- legacy `netlify.toml`과 `next.config.ts`는 `legacy-site/`에 있다. 기존 실서비스 설정은 변경하지 않았다.
- 신규 root `netlify.toml`: base `site`, command `npm run build`, publish `dist`. Astro adapter·Next plugin·functions·serverless 설정은 사용하지 않는다. 실행 권한과 배포 전 검증은 `VALIDATION.md`를 따른다.
- Naver 사이트 소유확인은 HTML 파일이 아니라 `site/src/config/site.ts`의 `naverSiteVerification` 값을 `BaseLayout.astro`가 정적 `<head>` meta로 출력하는 방식을 사용한다. 과거 `naver799482ce0e5e513c37daff06412293c5.html` 파일은 사용하거나 배포하지 않는다.
- `lvbgames.store`는 `legacy-site/public/privacy.html:115` 및 byte-identical 신규 복제본에 있다. 2026-08-01 종료 예정이나 보호 규칙상 수정하지 않는다.
- `/privacy` 동작(`/privacy` 200, `/privacy/` 301→`/privacy`, `/privacy.html` 200)은 신규 배포에서도 보존해야 한다.

무료 운영 정책: 정적 배포만 사용하고 유료 기능·자동 결제·대용량 영상 자체 호스팅을 사용하지 않는다. production deploy는 최소화하고 Deploy Preview를 우선한다. 무료 사용량 소진 가능성은 운영 시 관리한다.

## Production 명령

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\prepare-production.ps1

powershell -ExecutionPolicy Bypass -File .\scripts\deploy-production.ps1 `
  -ConfirmProduction `
  -CommitMessage "feat: launch new Lv.B website"
```

- `prepare-production.ps1`은 root·main·origin·divergence, 재현 빌드, Privacy, Naver meta, 필수 route·asset을 검사하며 Commit·Push하지 않는다.
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
