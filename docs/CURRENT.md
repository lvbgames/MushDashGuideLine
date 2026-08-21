# Current

- 전체 페이지 구현 상태: 공개 색인 route는 기존 28개에 Press Kit 4개와 첫 Lv.B Studio Update 상세 4개를 더한 36개다. News는 검증된 외부 자료 7건과 `2026-08-21` BIC 2026 MushHero 첫 공개 플레이 테스트 자체 글 1건을 최신순 단일 목록으로 제공한다. Privacy 네 언어 19개 조항·`2026-08-03`, Terms 네 언어 16개 조항·`2026-08-12`와 sitemap 제외 정책은 변경하지 않았다.
- QA 결과: 공통 progressive reveal, reduced-motion, Home 공식 이미지 3장 rotator, 게임 상세·Press 공통 scroll-snap/dialog gallery와 절제된 hover를 추가했다. Press는 정적 ZIP 3개·로컬 공식 스크린샷 6개·개별 다운로드·boilerplate 복사를 제공하며 public/dist SHA와 archive entry를 검증한다. 프로필 PNG와 quality 88의 640·1024 WebP responsive `picture`는 유지했다. Home mobile Lighthouse는 94→95, LCP 3145→2985ms, CLS·TBT 0이며 MushHero 95, Press 100, About 100이다. 390·768·1440px 27개 화면 조합에서 overflow·clipping·깨진 이미지·콘솔 오류·경고 0건이다. `npm audit` 0건, Astro check 126개 파일 0 errors·0 warnings·0 hints, 정적 build 45 HTML, sitemap 36 URL과 강화한 `prepare-production.ps1`이 성공했다.
- 배포 전 남은 사용자 확인 항목: Home 자동 전환 속도·crossfade 체감, News 행간, carousel/lightbox 조작, Press 다운로드 문구·ZIP 내용과 네 언어 boilerplate를 최종 검토한다.
- 다음 권장 작업: 사용자 interaction·자료 승인 후 전체 QA 기준으로 배포하고, 배포 후 정적 ZIP/JPG MIME·다운로드와 Press·Article canonical/JSON-LD를 운영 환경에서 재검증한다.
