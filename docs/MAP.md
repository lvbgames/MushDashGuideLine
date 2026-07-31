# Workspace Map

```text
Homepage/
├─ legacy-site/             # 기존 배포 사이트 보관본; 읽기 전용
├─ references/
│  ├─ Reference.png         # 초기 참고 이미지
│  ├─ Profile/              # 사용자 제공 팀 프로필 원본; 사이트 복사본과 분리 보존
│  └─ reviews/              # 단계별 시각 QA 캡처
├─ site/                    # 신규 Astro 정적 사이트
├─ docs/                    # 상태·콘텐츠·스타일·다국어 문서
├─ AGENTS.md
└─ README.md
```

## 신규 사이트

- `site/src/components/pages/HomePage.astro`: 네 locale Home 조립.
- `site/src/components/pages/GamesPage.astro`: 네 locale Our Games 조립.
- `site/src/components/pages/AboutPage.astro`: 네 locale About, 소규모 팀 소개, 공통 회사 데이터 기반 스튜디오 위치·Google 지도 조립.
- `site/src/components/pages/GameDetailPage.astro`: MushHero와 Mush Dash가 공유하는 상세 페이지 조립.
- `site/src/components/pages/ContactPage.astro`: 문의 범위와 locale별 정적 mailto CTA.
- `site/src/components/pages/NewsPage.astro`: 최신순 단일 News & Press 목록과 SNS Follow CTA를 공유하는 네 locale 페이지.
- `site/src/components/news/NewsItemCard.astro`: locale별 제목·요약과 외부 원문 링크를 출력하는 텍스트 카드.
- `site/src/components/game-detail/`: Hero, Overview, Feature Grid, Featured Screenshot, Gallery, Purchase CTA, More Games 섹션.
- `site/src/components/home/`: Home 전용 섹션. Mush Dash 영역은 locale별 상세 CTA를 포함한다.
- `site/src/components/games/`: Our Games Hero, MushHero 주력 영역, Mush Dash 출시작 영역.
- `site/src/components/about/TeamMembers.astro`: `team.ts` 기반 팀원 카드와 승인 프로필 이미지·브랜드 대체 표시.
- `site/src/components/layout/`: Header, Footer, 모바일 내비게이션, 언어 전환.
- `site/src/components/ui/`: 버튼과 공통 표시 요소.
- `site/src/data/games.ts`: 확인된 스토어 URL, 출시 상태, 미디어, 게임별 상세 태그.
- `site/src/data/contact.ts`: 공개 비즈니스 이메일, 허용된 business category, 선택적 Discord URL.
- `site/src/data/company.ts`: UI 브랜드명, 한국어 공식 스튜디오 주소, Google Maps 공유 iframe URL과 안전하게 인코딩한 검색 URL.
- `site/src/data/team.ts`, `site/src/types/team.ts`: 팀원 이름·역할·담당·선택적 프로필 이미지 경로의 단일 원본과 타입.
- `site/src/data/socialLinks.ts`: 검증된 X·Instagram·Discord·Steam Developer 링크의 단일 원본.
- `site/src/data/news.ts`, `site/src/types/news.ts`: 원문을 검증한 인터뷰·보도 자료 3건의 type-safe 정적 큐레이션.
- `site/src/i18n/`: route 생성과 네 언어 번역 데이터.
- `site/src/pages/`: Home·Our Games·About·Contact·MushHero·Mush Dash·News의 28개 명시적 정적 route와 sitemap에서 제외되는 브랜드 `404.astro`.
- `site/src/styles/games.css`: Our Games 전용 반응형 포트폴리오 레이아웃.
- `site/src/styles/about.css`: About V1 전용 반응형 레이아웃과 게임별 accent.
- `site/src/styles/game-detail.css`: 두 게임이 공유하는 상세 레이아웃과 게임별 accent override.
- `site/src/styles/not-found.css`: JavaScript 없는 브랜드 V3 404 전용 반응형 레이아웃.
- `site/src/styles/news.css`: 이미지 없는 동일 구조의 최신순 목록·Follow CTA를 위한 News 전용 반응형 레이아웃.
- `site/public/robots.txt`: 공개 sitemap index를 가리키는 최소 crawler 안내.
- `site/public/privacy.html`: 보호된 개인정보 처리방침 복제본.
- `site/public/brand/lvb-symbol.png`, `lvb-symbol-128.png`: 원본 가로 로고에서 분리한 투명 웹 symbol.
- `site/public/team/profiles/`: 사용자 승인 프로필 이미지 복사본과 원본 해시 확인·`team.ts` 연결 규칙.

## 게임 상세 라우트

- MushHero: `/games/mushhero/`, `/ko/games/mushhero/`, `/ja/games/mushhero/`, `/zh-cn/games/mushhero/`
- Mush Dash: `/games/mushdash/`, `/ko/games/mushdash/`, `/ja/games/mushdash/`, `/zh-cn/games/mushdash/`

## Our Games 라우트

- `/games/`, `/ko/games/`, `/ja/games/`, `/zh-cn/games/`

## About 라우트

- `/about/`, `/ko/about/`, `/ja/about/`, `/zh-cn/about/`

## News & Press 라우트

- `/news/`, `/ko/news/`, `/ja/news/`, `/zh-cn/news/`

## 예외 라우트

- `/404.html`: 영어 기본 안내와 네 locale Home 링크를 제공하며 `noindex`이고 sitemap에 포함하지 않는다.
- `/privacy`: 보호된 정적 Privacy 파일이며 sitemap에 포함하지 않는다.

## 준비 중인 콘텐츠

- YouTube: 게임별 `youtubeTrailerUrl`·`videoTitleKey`·`videoPoster`가 모두 선택 필드이며 현재 `null`이다.
