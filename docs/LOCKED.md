# Locked: Privacy history and change policy

## 역사 보관본

- `legacy-site/public/privacy.html`은 이전 영어 단일 Privacy의 역사 보관본이며 수정·이동·삭제하지 않는다.
- 기준 SHA-256은 `95CA28BD2313111606DDAE18492BEB7C785152911F14CA60618DF88D8FF36F29`다.
- 보관본의 구형 본문, 내부 스타일, raw GitHub logo, `lvbgames.store`와 과거 EOS 문구는 현재 정책의 사실 근거로 사용하지 않는다.

## 신규 정책

- 사용자는 2026-07-31 작업에서 기존 Privacy의 내용·디자인·로고·언어 구조 변경과 `site/public/privacy.html` 폐기를 명시적으로 승인했다.
- 현재 source는 `site/src/data/privacy.ts`, 타입은 `site/src/types/privacy.ts`다.
- 정규 route는 `/privacy/`, `/ko/privacy/`, `/ja/privacy/`, `/zh-cn/privacy/`이며 모두 `noindex, follow`이고 sitemap에서 제외한다.
- `/privacy.html`은 `/privacy/`로 forced 301하며, 깊이별 `index.html` canonical redirect를 유지한다.
- 2026-07-31 사용자가 Netlify Analytics·RUM·Log Drains 미사용, Mush Dash의 Epic Online Services(EOS)·Lobby·Session·P2P·UserCloud 사용, 자체 서버·DB 및 자체 텔레메트리·자동 크래시 전송 미사용, 이메일 보관·아동 정책·담당부서를 확정했다. 상세 근거는 `PRIVACY_DATA_INVENTORY.md`에서만 관리한다.

## 검증과 향후 변경

- 신규 Astro 생성 HTML은 빌드 포맷·줄바꿈 차이 때문에 raw byte SHA-256으로 잠그지 않는다.
- `scripts/prepare-production.ps1`은 legacy 해시, 네 route, 19개 section의 동일 ID·순서, canonical·hreflang·robots, 언어 경로, 금지 문구와 sitemap 제외를 의미 기반으로 검사한다.
- 개인정보 처리 사실과 운영자 확인 항목은 `docs/PRIVACY_DATA_INVENTORY.md`를 단일 근거 문서로 사용한다.
- MushDash UserCloud 공개 범주는 `E:\MushDash` 현재 작업 트리의 `PRIVACY_USERCLOUD_AUDIT.md` 근거로만 갱신한다. 내부 파일명·key·C++ field·SDK 함수·development 검증 파일과 보안 finding은 공개 정책에 노출하지 않는다.
- 삭제 API가 서비스에 존재한다는 사실과 현재 Mush Dash의 삭제 호출 0건을 구분한다. 이메일 요청은 `PRIVACY_REQUEST_RUNBOOK.md`의 본인·게임·플랫폼·범위 확인을 거치며, 조직 단위 삭제를 Mush Dash 기본 절차로 사용하지 않는다.
- 사용자는 2026-08-03 운영 배포와 같은 날짜의 시행일을 승인했다. 네 언어의 최종 수정일과 시행일은 모두 `2026-08-03`으로 유지하며 정책 변경 시 함께 갱신한다.
- 승인본 영구 잠금이 필요하면 생성 HTML이 아니라 정규화한 `site/src/data/privacy.ts` 또는 별도 policy source snapshot을 대상으로 규칙과 해시를 새 작업에서 확정한다.
- 이후 처리 활동·외부 서비스·연락처·보유 기준이 바뀌면 inventory, source, 네 번역과 검증을 함께 갱신하며, 추측한 법적 관계를 추가하지 않는다.
