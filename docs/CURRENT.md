# Current

- 전체 페이지 구현 상태: 기존 52개 색인 route와 전체 HTML 61개를 유지한다. 별도 `analytics/`에 Cloudflare Workers Free + D1 Free용 자체 일간 순 방문자 집계와 인증 관리자 화면을 구현했으며, production build는 설정된 endpoint로 정상 페이지마다 비차단 hit를 한 번 보낸다.
- QA 결과: local D1의 rollback·재시도 검증에 더해 Cloudflare Free D1에 두 migration을 적용하고 Worker·Cron을 배포했다. 원격 Worker에서 동일 IP 중복 +0, bot +0, Basic Auth, CORS, raw IP 비저장과 3·5 과거 fixture의 scheduled 집계·hash 삭제·재실행 멱등성을 확인했다. QA row는 모두 삭제했다. 공개 Privacy 네 언어 source는 동일 사실로 준비했으며 날짜는 기존 `2026-08-26`을 유지한다.
- 배포 전 남은 사용자 확인 항목: Netlify production의 `PUBLIC_ANALYTICS_ENDPOINT`와 공개 Privacy 시행일 `2026-08-31`을 같은 배포에 반영하고 실제 hit·관리자 통계를 확인한다.
- 다음 권장 작업: 운영 첫날의 TODAY·WEEK·TOTAL과 다음 00:10 KST Cron 뒤 일간 집계·hash 삭제를 확인하고 Free 사용량을 주기적으로 점검한다.
