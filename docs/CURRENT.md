# Current

- 전체 페이지 구현 상태: 공개 색인 route는 기존 28개에 Press Kit 4개와 첫 Lv.B Studio Update 상세 4개를 더한 36개다. News는 검증된 외부 자료 7건과 `2026-08-21` BIC 2026 MushHero 첫 공개 플레이 테스트 자체 글 1건을 최신순 단일 목록으로 제공한다. Privacy 네 언어 19개 조항·`2026-08-03`, Terms 네 언어 16개 조항·`2026-08-12`와 sitemap 제외 정책은 변경하지 않았다.
- QA 결과: Home 최상단 Hero를 선택 tab 없는 cinematic full-bleed slideshow로 구성했다. MushHero 공식 이미지 2장 다음 Mush Dash 공식 이미지 2장을 6.5초 간격으로 crossfade하며, 같은 게임의 두 이미지 사이에서는 콘텐츠를 유지하고 게임이 바뀔 때만 문구와 CTA를 전환한다. dot 4개와 작은 재생 제어를 제공하고 hover·focus·비활성 문서에서 일시정지하며 reduced motion에서는 최초 slide를 고정한다. 최초 진입은 MushHero 첫 WebP 한 장만 요청하고 다음 이미지는 전환 전에 순차 준비한다. 이전 Home의 Featured Game → Games Overview → Mush Dash → About → Community → Contact 흐름과 대형 Game Showcase 제거 상태는 유지한다.
- 배포 전 남은 사용자 확인 항목: full-bleed 배경의 이미지 focal point·gradient 대비, 6.5초 순환 속도와 390·1440px 시각 결과를 최종 확인한다.
- 다음 권장 작업: 사용자 시각 승인 후 전체 QA 기준으로 별도 배포하고, 배포 후 Home Hero의 게임·Carousel 전환과 초기 이미지 전송을 운영 환경에서 재검증한다.
