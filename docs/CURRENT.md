# Current

- 전체 페이지 구현 상태: 공개 색인 route는 기존 36개에 News page 2 네 locale을 더한 40개다. News는 검증된 외부 자료 11건과 `2026-08-21` BIC 2026 MushHero 첫 공개 플레이 테스트 자체 글 1건을 최신순으로 정렬하고 페이지당 6건씩 정적 제공한다. Privacy 네 언어 19개 조항·`2026-08-03`, Terms 네 언어 16개 조항·`2026-08-12`와 sitemap 제외 정책은 변경하지 않았다.
- QA 결과: Home은 기존 full-bleed 구조를 유지한다. 전용 1200×630 Lv.B·MushHero·MushDash OG를 페이지 유형별로 연결했고, 네 locale의 절대 `og:image`·규격·MIME·alt·Twitter image를 빌드 HTML에서 검증했다. Press는 `references/LvbResult` 승인 자산으로 브랜드 5개·MushHero 7개·MushDash 6개와 기존 URL의 ZIP 3개를 갱신했으며, 화면 갤러리는 MushHero 5개·MushDash 5개를 한 번씩 표시한다.
- 배포 전 남은 사용자 확인 항목: 실제 SNS 공유 디버거의 cache refresh와 390·1440px Press 키아트 crop·투명 로고 대비를 최종 확인한다. MushDash 실제 플레이 스크린샷은 승인 자료가 없어 프로모션 이미지로 명확히 구분했다.
- 다음 권장 작업: 사용자 시각 승인 후 별도 배포하고, 운영 URL의 OG 응답 MIME·Press ZIP 다운로드·SNS 캐시를 재검증한다.
