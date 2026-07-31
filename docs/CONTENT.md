# Content Inventory

상태: `Verified Store Data`, `Verified Media`, `Draft / User Review`, `Missing`, `Locked`.

| 항목 | 상태 | 근거/비고 |
|---|---|---|
| 사용자 대면 브랜드명 | Verified Brand Asset | Lv.B |
| 회사 소개 기준 | Draft / User Review | 부산 기반 인디 게임 개발사, 멀티플레이, 독창적인 세계관, 함께 웃고 성장하는 경험, 쉬운 시작과 오래 남는 기억 |
| Store 개발/퍼블리싱 원문 | Verified Store Data | Lv.B Games. Store 검증 데이터에만 유지하고 UI·SEO 브랜드 표기는 `Lv.B` 사용 |
| 브랜드 로고 | Verified Brand Asset | `lvb-symbol.png`: Header·Footer symbol, `lvb-symbol-128.png`: favicon 후보. `lvb-logo.png`: About Hero의 넓은 브랜드 패널에서 비파괴 사용, `lvb-logo-128.png`: 원본 보존 |
| MushHero | Verified Store Data / Verified Media | Steam 4711200, 2027 예정, 등록된 Steam CDN 미디어 |
| Mush Dash | Verified Store Data / Verified Media | Steam 3153140, Epic Games Store, Early Access, Steam 출시일 2025-08-26 |
| Mush Dash 플레이 정보 | Verified Store Data | 최대 7인 온라인 파티 레이스, 한 경기 3 wave, 선택한 테마의 5개 wave 중 3개 스테이지 무작위 선택, 함정·폭탄·움직이는 발판, 결승 순위와 Mushroom Coin으로 최종 순위 결정 |
| Mush Dash 분류 | Verified Store Data | Platformer(Epic taxonomy). 상세 태그는 사용자 관점의 별도 필드로 관리 |
| Mush Dash 미디어 | Verified Media | `games.ts`의 Steam CDN 1920×1080 스크린샷 3개만 사용 |
| Mush Dash 영상 | Missing | 확인된 안정적 trailer URL이 없어 영상 영역을 만들지 않음 |
| Home English/Korean/Japanese/Simplified Chinese | Draft / User Review | 게임 사실 기반 1차 문구 |
| Our Games 4개 언어 | Draft / User Review | MushHero 주력·2027 예정, Mush Dash Early Access 출시작, 독창적인 세계·멀티플레이·오래 남는 경험 |
| About 4개 언어 | Draft / User Review | 부산 기반·멀티플레이·독창적인 세계관·쉬운 시작·소규모 팀·스튜디오 위치 |
| 팀 정보 | Draft / User Review | 박재민(대표: 프로그래밍·프로젝트 매니지먼트·마케팅), 정보건(3D 아티스트: 3D 아트). 이름은 네 locale 모두 한국어 표기 유지 |
| 팀 프로필 이미지 | Verified User Asset / User Review | `references/Profile/대표.png`를 `park-jaemin.png`로, `디자인.png`를 `jeong-bogeon.png`로 무손실 복사해 `team.ts`에 연결. 두 복사본은 원본과 SHA-256이 일치하며 `프로그래밍.png`는 미사용 상태로 원본 폴더에 보존 |
| 스튜디오 주소·지도 | Draft / User Review | 공식 표기는 네 locale 모두 `부산광역시 수영강변대로 140, 9층 905호`. Google Maps 공유 iframe과 검색 링크는 `site/src/data/company.ts`에서 관리 |
| MushHero 상세 4개 언어 | Draft / User Review | 공식 Steam 설명 기반 |
| Mush Dash 상세 4개 언어 | Draft / User Review | 공식 Steam·Epic 정보 기반 |
| Contact 4개 언어 | Draft / User Review | 6개 비즈니스 문의 범위, 크리에이터·Steam 큐레이터 키 문의의 개별 검토, 언론·기사·인터뷰 안내, 직접 이메일 CTA·mailto subject/body template 사용자 검토 필요 |
| 404 영어 안내 | Draft / User Review | 브랜드 V3 mark, Home·Games CTA, 네 locale Home 링크. 자동 언어 감지 없이 영어를 기본으로 사용 |
| X | Verified External Link | `https://x.com/Lv_B_Games` |
| Instagram | Verified External Link | `https://www.instagram.com/lv.b_games/` |
| Discord | Verified External Link | `https://discord.gg/yuphyAWWUr`; 게임 피드백·버그·기술지원 |
| Steam Developer Page | Verified External Link | `https://store.steampowered.com/search/?developer=Lv.B` |
| 공식 YouTube | Missing | `youtubeTrailerUrl`이 `null`이면 영상 UI 전체를 숨김 |
| News & Press | Verified External Link / Draft / User Review | 원문·매체·날짜를 확인한 인터뷰 1건과 BIC 2024 보도 2건을 최신순 단일 목록에 한 번씩 표시. 네 locale 제목·자체 요약은 User Review, 기사 이미지·본문 복제·자동 수집 없음 |
| `/privacy` 콘텐츠 | Locked | `docs/LOCKED.md`와 보호 파일 적용 |
| Naver 사이트 소유확인 | Verified Public Metadata | `site/src/config/site.ts`의 공개 verification 값을 `BaseLayout.astro`가 일반 Astro 페이지 `<head>`에 정적 meta로 출력. 과거 HTML 확인 파일 방식은 폐기 |

게임 데이터는 `site/src/data/games.ts`에서 고정 관리하며 브라우저·빌드 중 runtime scraping을 하지 않는다. 기존 사이트의 코드·문구·자산은 `legacy-site/` 보관물일 뿐 신규 구현의 기반이 아니다.
