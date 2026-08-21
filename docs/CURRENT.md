# Current

- 전체 페이지 구현 상태: 공개 색인 route는 기존 28개에 Press Kit 4개와 첫 Lv.B Studio Update 상세 4개를 더한 36개다. News는 검증된 외부 자료 7건과 `2026-08-21` BIC 2026 MushHero 첫 공개 플레이 테스트 자체 글 1건을 최신순 단일 목록으로 제공한다. Privacy 네 언어 19개 조항·`2026-08-03`, Terms 네 언어 16개 조항·`2026-08-12`와 sitemap 제외 정책은 변경하지 않았다.
- QA 결과: Home Hero의 로컬 공식 MushHero 3장 rotator는 유지하고, MushHero·Mush Dash를 같은 위계의 교차 쇼케이스로 구성해 각 게임에 로컬 공식 이미지 2장을 표시한다. Home은 640/1280 WebP 파생본을 우선 전송하고 Press JPG 원본을 fallback으로 보존한다. Press Hero 여백을 넓히고 Recent Press UI·데이터·번역·스타일 참조를 제거했다. section 이동 32px, 560ms reveal, 내부 block 75ms stagger와 교차 진입을 적용했으며 reduced-motion과 Privacy·Terms motion 제외를 유지했다. Home 네 locale·Press 네 locale·News·About을 390·768·1440px 30개 조합에서 검사해 document overflow·clipping·깨진 이미지·콘솔 오류·경고 0건을 확인했다. 모바일 Lighthouse는 Home 99, Press 100이며 두 페이지 모두 CLS 0·TBT 0이다. `npm audit` 0건, Astro check 128개 파일 0 errors·0 warnings·0 hints, 정적 build 45 HTML, sitemap 36 URL과 `prepare-production.ps1`이 성공했다.
- 배포 전 남은 사용자 확인 항목: Home 게임별 이미지 조합과 겹침 표현, 강화된 reveal 속도·이동량, Press Hero 여백과 네 언어 문구·다운로드 자료를 최종 검토한다.
- 다음 권장 작업: 사용자 시각·자료 승인 후 전체 QA 기준으로 배포하고, 배포 후 정적 ZIP/JPG MIME·다운로드와 Press·Article canonical/JSON-LD를 운영 환경에서 재검증한다.
