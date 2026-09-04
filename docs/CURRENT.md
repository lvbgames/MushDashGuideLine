# Current

- 전체 페이지 구현 상태: 52개 색인 route와 전체 HTML 61개를 유지한다. Visitor Analytics·매일 00:10 KST Cron·Netlify의 `PUBLIC_ANALYTICS_ENDPOINT`와 Press Kit 다운로드 집계 3종이 production active이며, 네 언어 Privacy 최종 수정일·시행일은 `2026-09-04`이다.
- QA 결과: Visitor Analytics는 `2026-09-01`부터 운영 중이고 일일 Cron의 backlog recovery와 과거 일일 visitor hash 삭제를 검증했다. Download Analytics는 기존 방문 집계를 바꾸지 않고 production D1 `0003`, 고정 ZIP redirect, bot 제외, 30회/분 limiter, D1 실패 fail-open과 aggregate-only schema를 검증했다. 통합 Web Admin과 조회 전용 .NET 8 WPF Admin App은 같은 통계 API를 사용한다.
- 배포 전 남은 사용자 확인 항목: 없음. 관리자 자격증명은 저장소에 기록하지 않고 Windows DPAPI 로컬 저장만 사용하며, 다운로드 수는 파일 전송 완료나 고유 이용자가 아닌 시작 횟수라는 점을 운영 해석에 유지한다.
- 다음 권장 작업: 실제 운영 사용량과 첫 정기 집계 이후의 다운로드 통계 연속성을 읽기 전용으로 점검하고, Secret·관리자 자격증명은 정기 운영 절차에 따라 교체한다.
