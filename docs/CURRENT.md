# Current

- 전체 페이지 구현 상태: 52개 색인 route와 전체 HTML 61개를 유지한다. Visitor Analytics·매일 00:10 KST Cron·Netlify의 `PUBLIC_ANALYTICS_ENDPOINT`와 Press Kit 다운로드 집계 3종이 production active이며, 네 언어 Privacy 최종 수정일·시행일은 `2026-09-04`이다.
- QA 결과: Visitor Analytics는 `2026-09-01`부터 운영 중이고 일일 Cron의 backlog recovery와 과거 일일 visitor hash 삭제를 검증했다. Download Analytics는 기존 방문 집계를 바꾸지 않고 production D1 `0003`, 고정 ZIP redirect, bot 제외, 30회/분 limiter, D1 실패 fail-open과 aggregate-only schema를 검증했다. 통합 Web Admin과 조회 전용 .NET 8 WPF Admin App은 같은 통계 API를 사용한다.
- 로컬 변경(2026-10-29): Astro 7.3.3·Vite 8.1.6, Wrangler 4.153.0 및 취약 전이 의존성 보안 업데이트. 기존 주요 버전 계열과 정적 배포 구조를 유지하고 영구 overrides는 추가하지 않았다. Deep Dive 멘토 참여는 기존 목록에 없어 브릿지경제 2026-01-07 기사 한 건을 네 언어로 추가했다. News 총 16건, 페이지별 6·6·4건이며 HTML 61·sitemap 52 구조는 유지한다.
- 로컬 검증: site·analytics 설치 및 audit 0건, Astro 오류·경고·힌트 0, 정적 build와 prepare-production 통과. Analytics 타입 검사·단위 테스트 8개·로컬 Worker/D1 QA 통과. 운영 배포는 수행하지 않았다.
- 배포 승인(2026-10-29): 사용자가 보안 업데이트와 대표 기사 한 건의 선별 Commit·Push·Netlify 배포를 승인했다. 실제 운영 반영 결과와 Commit SHA는 배포 완료 보고를 기준으로 확인한다. 기존 Discord 관련 미커밋 작업은 배포에서 제외하고 별도로 보존한다. 관리자 자격증명은 Windows DPAPI 로컬 저장만 사용하며, 다운로드 수는 시작 횟수로 해석한다.
- 다음 권장 작업: 실제 운영 사용량과 첫 정기 집계 이후의 다운로드 통계 연속성을 읽기 전용으로 점검하고, Secret·관리자 자격증명은 정기 운영 절차에 따라 교체한다.
