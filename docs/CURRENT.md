# Current

- 전체 페이지 구현 상태: 공개 색인 route는 기존 36개에 News page 2 네 locale을 더한 40개다. News는 검증된 외부 자료 11건과 `2026-08-21` BIC 2026 MushHero 첫 공개 플레이 테스트 자체 글 1건을 최신순으로 정렬하고 페이지당 6건씩 정적 제공한다. Privacy 네 언어 19개 조항·`2026-08-03`, Terms 네 언어 16개 조항·`2026-08-12`와 sitemap 제외 정책은 변경하지 않았다. 정적 Astro 출력 위에 루트 `/` 요청만 처리하는 Netlify Edge locale redirect를 추가했다.
- QA 결과: Home·OG·Press 화면과 승인된 locale typography를 유지한다. `siteFacts.json`을 사이트와 Press ZIP 생성의 공통 factual source로 연결했고, 기존 Fact Sheet·README·Brand Guide의 ZIP byte와 SHA는 변하지 않았다. 공통 Header는 desktop compact outline·mobile menu CTA, Footer는 기존 일반 Press 링크 대신 compact primary CTA로 locale Press route를 제공한다. Geo locale은 KR→KO, JP→JA, CN→ZH-CN, 기타·미확인→EN이며 crawler·deep link를 우회하고 사용자가 직접 선택한 `lvb_locale`을 우선한다.
- 배포 전 남은 사용자 확인 항목: 320·390·768·1024·1440px에서 Header/Footer Press CTA의 시각적 강도와 Footer 배치를 최종 승인한다. MushDash 실제 플레이 스크린샷은 승인 자료가 없어 프로모션 이미지로 명확히 구분했다. 배포 후 실제 Netlify Edge country 판정과 cookie override를 운영 도메인에서 재검증한다.
- 다음 권장 작업: 사용자 시각 승인 후 별도 Commit·배포하고, 운영 locale redirect·Header/Footer CTA·기존 Press ZIP SHA를 함께 재검증한다.
