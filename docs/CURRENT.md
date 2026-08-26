# Current

- 전체 페이지 구현 상태: 색인 route는 52개, 전체 HTML은 Privacy·Terms·404를 포함해 61개다. News는 검증된 외부 자료 12건과 자체 글 3건을 최신순 6/6/3으로 제공하며 page 3과 자체 글 네 locale route를 생성한다. MushHero 상세에는 공식 Shorts 2편을 Featured Screenshot과 Gallery 사이에서 click-to-load로 제공한다.
- QA 결과: BGC 원문, 공식 Instagram 근거 6건과 Lv.B YouTube Shorts 2편을 확인했다. 내부 글은 게임별 OG·Article JSON-LD를 사용하며 YouTube 초기 iframe·외부 thumbnail 요청은 없다. Privacy 19개 section은 click-to-load YouTube 고지를 추가하고 최종 수정일·시행일을 `2026-08-26`으로 갱신했다. Terms·Home·Press·Geo 구조는 유지했다.
- 배포 전 남은 사용자 확인 항목: 신규 News 네 언어 문구와 MushHero 영상 카드의 390·768·1440px 시각 결과, Privacy 시행일 변경을 최종 승인한다. MushHero Steam X 공지는 개별 status URL과 정확한 날짜를 확보한 뒤 검토한다.
- 다음 권장 작업: 사용자 승인 후 별도 Commit·배포하고, 운영 News page 3·Article JSON-LD·YouTube click-to-load·Privacy 날짜를 재검증한다.
