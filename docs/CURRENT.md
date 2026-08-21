# Current

- 전체 페이지 구현 상태: 공개 색인 route는 기존 28개에 Press Kit 4개와 첫 Lv.B Studio Update 상세 4개를 더한 36개다. News는 검증된 외부 자료 7건과 `2026-08-21` BIC 2026 MushHero 첫 공개 플레이 테스트 자체 글 1건을 최신순 단일 목록으로 제공한다. Privacy 네 언어 19개 조항·`2026-08-03`, Terms 네 언어 16개 조항·`2026-08-12`와 sitemap 제외 정책은 변경하지 않았다.
- QA 결과: Home 최상단 Hero에 MushHero·Mush Dash 수동 game tab과 게임별 공식 이미지 2장의 수동 Carousel을 통합했다. 이미지는 flex track에서 겹치지 않고 한 번에 한 장만 보이며 최초 진입은 MushHero 첫 WebP 한 장만 로드한다. 이전 Home의 Featured Game → Games Overview → Mush Dash → About → Community → Contact 흐름을 복구하고 대형 Game Showcase 두 개와 관련 component·CSS를 제거했다. 네 locale을 390·768·1024·1440px 16개 조합에서 검사해 text/media overlap·clipping·document overflow·깨진 이미지·콘솔 오류·경고 0건을 확인했다. 모바일 Lighthouse는 Home 99, CLS 0, TBT 0이며 `npm audit` 0건, Astro check 127개 파일 0 errors·0 warnings·0 hints, 정적 build 45 HTML, sitemap 36 URL과 `prepare-production.ps1`이 성공했다.
- 배포 전 남은 사용자 확인 항목: Home Hero의 두 게임 문구·이미지 조합, tab과 수동 Carousel의 시각적 밀도, 390·1440px 검토 캡처를 최종 확인한다.
- 다음 권장 작업: 사용자 시각 승인 후 전체 QA 기준으로 별도 배포하고, 배포 후 Home Hero의 게임·Carousel 전환과 초기 이미지 전송을 운영 환경에서 재검증한다.
