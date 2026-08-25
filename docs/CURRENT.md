# Current

- 전체 페이지 구현 상태: 공개 색인 route는 기존 36개에 News page 2 네 locale을 더한 40개다. News는 검증된 외부 자료 11건과 `2026-08-21` BIC 2026 MushHero 첫 공개 플레이 테스트 자체 글 1건을 최신순으로 정렬하고 페이지당 6건씩 정적 제공한다. Privacy 네 언어 19개 조항·`2026-08-03`, Terms 네 언어 16개 조항·`2026-08-12`와 sitemap 제외 정책은 변경하지 않았다.
- QA 결과: Home은 full-bleed Hero → Featured Game → Our Games → About → Community → Contact 순서다. Featured Game은 `FEATURED PROJECT → MushHero → 장르·2027 상태 → 기존 headline → 설명 → 내부 상세/Steam`의 단일 정보 흐름으로 정리했다. Header와 Hero의 deepest charcoal은 유지하고 page `#1a1714`, surface `#221e19`, raised `#29241e`, warm `#302a22`, muted text `#bdb2a2`로 본문 Warm Charcoal을 한 단계 더 밝게 했다. 사용자 대면 게임명은 `MushHero`·`MushDash`로 통일했고 News는 네 locale page 1·2에서 각각 6개 카드, 작성 정보·날짜의 2줄 metadata, 전체 카드 링크, 2줄 summary, canonical·hreflang·pagination을 제공한다.
- 배포 전 남은 사용자 확인 항목: Featured Project의 새 정보 위계와 전체 Warm Bright Charcoal 명암을 review capture로 최종 시각 승인한다. Legal mobile disclosure의 실제 screen reader·물리 키보드 확인 항목은 이전과 동일하게 남아 있다.
- 다음 권장 작업: 사용자 승인 후 전체 QA 기준으로 별도 배포하고, 운영 환경에서 Home Featured Project·Hero 이미지 색감·대표 카드와 Legal 대비를 재검증한다.
