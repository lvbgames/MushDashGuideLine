# Product

## 목적과 정체성

- Lv.B의 공식 홈페이지다. Lv.B(레벨비)는 부산을 기반으로 활동하는 인디 게임 개발사다.
- 멀티플레이와 독창적인 세계관을 바탕으로, 함께 웃고 함께 성장할 수 있는 게임을 만든다.
- 누구나 쉽게 시작할 수 있지만 오래 기억에 남는 경험을 선사하는 것을 목표로 한다.
- 방문자는 게임 발견과 상세 확인, Store 이동, 공식 커뮤니티 팔로우, 게임 지원과 비즈니스 문의를 수행한다.
- Lv.B는 비즈니스·파트너십·행사·전시·크리에이터·Steam 큐레이터·언론·인터뷰 문의를 기존 비즈니스 이메일로 받는다. 확정되지 않은 파트너·계약·성과나 게임 키 제공을 보장하는 표현은 사용하지 않는다.

## 우선순위

1. 게임 설명·스크린샷·Store CTA
2. 회사 소개
3. 공식 SNS·커뮤니티
4. 검증된 News & Press
5. Contact

MushHero를 가장 중요하게, MushDash보다 크게 강조한다. 현재 공개 페이지는 Home, Our Games, MushHero, MushDash, About, Contact, News & Press와 404다. Privacy와 검토 중인 게임 이용약관은 네 locale Astro route로 제공하되 `noindex, follow`이며 sitemap에서 제외한다.

Home은 MushHero·MushDash 통합 full-bleed Hero, MushHero 주력 Featured Game, Our Games, 회사 소개, 공식 커뮤니티, 비즈니스 문의 순서다. Hero는 두 게임의 공식 이미지 각 2장을 자동 순환하며 수동 indicator와 재생 제어도 제공한다. 별도의 하단 MushDash 대형 소개는 Hero와 Our Games의 반복을 피하기 위해 두지 않는다.

About은 회사 소개, 함께할수록 더 즐거운 경험·오래 기억되는 세계·쉽게 시작해 깊게 즐기는 경험의 단일 3원칙, 소규모 팀 소개, 스튜디오 위치, Business Contact 순서다. 같은 철학을 별도 영역에서 반복하지 않으며 직접 출시나 Self-Publishing을 회사의 핵심 정체성으로 표현하지 않는다.

Our Games는 Games Hero, MushHero 주력 영역, MushDash Early Access 영역, Lv.B의 게임 제작 기준, Business Contact 순서다. 현재 Steam·Epic 출시 사실은 각 게임 정보와 Store CTA에서 유지한다.

Contact의 비즈니스 문의는 정적 `mailto:`를 유지한다. 문의 범위는 Business Inquiry, Partnership, Events & Exhibitions, Creators & Steam Curators, Press & Interviews, General Company Inquiry다. 크리에이터·큐레이터 게임 키 요청은 개별 검토하며 제공을 보장하지 않는다. Bug Report·Game Feedback·Technical Support는 공식 Discord로 안내한다.

News & Press는 검증된 외부 자료 7건과 Lv.B가 직접 발행하는 짧은 Studio Update를 한 목록에 제공한다. 외부 기사 본문·이미지를 복제하거나 자동 수집하지 않으며 내부 글도 검증된 Lv.B 사실만 사용한다. 운영 기준은 `NEWS.md`를 따른다. Press Kit은 기존 검증 데이터와 공개 브랜드·게임 자산을 조합한다.

공식 YouTube URL이 없으면 영상 UI를 렌더링하지 않는다.
