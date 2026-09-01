# Current

- 전체 페이지 구현 상태: 52개 색인 route와 전체 HTML 61개를 유지한다. Cloudflare Worker·D1, 매일 00:10 KST Cron, Netlify의 `PUBLIC_ANALYTICS_ENDPOINT`, 네 언어 Privacy `2026-08-31` 적용은 production active다.
- QA 결과: 기존 production Analytics의 중복 제거·bot 제외·Basic Auth·CORS·raw IP 비저장·scheduled 집계와 hash 삭제를 유지한다. 이번 보안 hardening은 HTTP 선행 거부, HTTPS HSTS, `/hit` 60회/분 및 관리자 경로 합산 10회/분 Rate Limiting binding, 사이트 기본 보안 헤더와 CSP Report-Only, 배포 staging/secret 검사를 로컬에서 구현·검증했으며 아직 운영 배포하지 않았다.
- 배포 전 남은 사용자 확인 항목: 별도 승인 작업에서 Worker hardening을 먼저 배포해 HTTP·HTTPS·429를 확인하고, 이어 Netlify 보안 헤더를 배포해 대표 페이지의 CSP Report-Only 보고와 기능 회귀를 확인한다. Cloudflare dashboard의 실제 Free plan 표시와 관리자 비밀번호 강도는 값 노출 없이 사용자가 수동 확인한다.
- 다음 권장 작업: hardening 운영 반영 후 429·HSTS·CSP report를 관찰하고, 위반 0이 확인될 때만 nonce/hash 기반 enforced CSP 전환을 별도 검토한다.
