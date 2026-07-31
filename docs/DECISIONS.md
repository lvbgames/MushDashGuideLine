# Decisions

| ID | 날짜 | 상태 | 결정 | 이유 | 영향 |
|---|---|---|---|---|---|
| ADR-001 | 2026-07-30 | Confirmed | 게임 우선 홈페이지 | 방문 목적과 콘텐츠 우선순위 | MushHero 주력 강조 |
| ADR-002 | 2026-07-30 | Superseded | Lv.B를 자체 개발·자체 출시 스튜디오로 표현 | 초기 회사 사실 | ADR-025로 대체 |
| ADR-003 | 2026-07-30 | Confirmed | English 기본, 한국어·日本語·简体中文 지원 요구 | 제공된 언어 정책 | fallback은 English |
| ADR-004 | 2026-07-30 | Confirmed | PC·모바일 반응형 요구 | 제공된 반응형 정책 | 고정 폭 전용 금지 |
| ADR-005 | 2026-07-30 | Confirmed | `lvb.kr` 사용, `lvbgames.store` 2026-08-01 종료 예정 | 제공된 도메인 사실 | 신규 지원 금지 |
| ADR-006 | 2026-07-30 | Confirmed | 기존 GitHub 저장소 이름·remote 유지 | 제공된 저장소 정책 | 변경 금지 |
| ADR-007 | 2026-07-30 | Confirmed | `/privacy` 변경 금지 | 보호 규칙 | 별도 승인 필요 |
| ADR-008 | 2026-07-30 | Confirmed | 목적별 MD로 반복 규칙 분리 | 토큰 사용 최소화 | 필요한 문서만 읽음 |
| ADR-009 | 2026-07-30 | Confirmed | 참조 사이트는 구조만 참고 | 저작물 복제 방지 | 디자인/문구/코드 복제 금지 |
| ADR-010 | 2026-07-30 | Confirmed | 기존·신규 사이트를 물리적으로 분리 | 배포본 보존과 신규 구현 혼동 방지 | legacy-site 읽기 전용, 구현은 site만 |
| ADR-011 | 2026-07-30 | Confirmed | Codex 문서를 docs에서 관리 | 작업 경계 명확화 | 루트에는 AGENTS만 유지 |
| ADR-012 | 2026-07-30 | Confirmed | privacy를 신규 site에 byte-identical 복제 | 기존 보호 URL·내용 보존 | 두 파일 동시 잠금·해시 검증 |
| ADR-013 | 2026-07-30 | Confirmed | 신규 홈페이지는 Astro 7 static | 무료 정적 배포와 단순 운영 | site는 legacy와 독립 |
| ADR-014 | 2026-07-30 | Confirmed | strict TS·Tailwind CSS 4·4개 언어 | type safety와 반응형 기반 | English 기본 Astro i18n |
| ADR-015 | 2026-07-30 | Superseded | 호스팅 수집 폼과 Discord 분리 검토 | 서버리스·유료 이메일 API 없이 문의 분류 | ADR-022로 대체 |
| ADR-016 | 2026-07-30 | Confirmed | 외부 Steam 미디어, 영상 자체 호스팅 금지 | 비용·scraping 위험 제한 | 승인 URL만 데이터화 |
| ADR-017 | 2026-07-30 | Confirmed | SSR·Functions·CMS·DB 미사용 | 무료 정적 운영 유지 | adapter 미설치 |
| ADR-018 | 2026-07-30 | Confirmed | i18n text fallback과 route fallback 분리 | static locale root 충돌 경고 제거 | English text fallback 유지 |
| ADR-019 | 2026-07-30 | Confirmed | Steam/Epic 고정 데이터와 Steam CDN media 사용 | 공식 출처·비용 절감 | runtime/build scraping 금지 |
| ADR-020 | 2026-07-30 | Confirmed | token 기반 공통 Astro UI | 페이지 구현 전 일관성·접근성 확보 | Header/Footer/게임 UI 재사용 |
| ADR-021 | 2026-07-30 | Confirmed | Home 1차본은 게임 콘텐츠를 약 70%로 구성하고 Contact shell을 실제 route로 제공 | 게임 발견 우선·깨진 링크 방지 | SNS는 검증 데이터가 있을 때만 조건부 노출 |
| ADR-022 | 2026-07-31 | Confirmed | Contact는 `mailto:` 직접 이메일 방식 사용 | 홈페이지와 호스팅 플랫폼에 문의 데이터를 저장하지 않음 | 공개 비즈니스 이메일 `lvb909@naver.com`; 버그·게임 피드백은 향후 공식 Discord |
| ADR-023 | 2026-07-31 | Superseded | About은 회사 사실·자체 개발 및 직접 출시·현재 게임 포트폴리오만 사용 | 초기 회사 소개 방향 | ADR-025로 대체 |
| ADR-024 | 2026-07-31 | Confirmed | Header·Footer Games는 locale별 Our Games 전용 route로 연결 | Home anchor와 포트폴리오 탐색 역할 분리 | Home `#games` 콘텐츠는 유지하고 Games route에서 MushHero를 주력 강조 |
| ADR-025 | 2026-07-31 | Confirmed | Lv.B를 부산 기반·멀티플레이·독창적인 세계관·함께 성장하는 경험 중심으로 소개 | 사용자 제공 회사 기준 원문 | 직접 출시·Self-Publishing 중심 표현 제거, 열린 협업 유지 |
| ADR-026 | 2026-07-31 | Confirmed | X·Instagram·Discord·Steam Developer Page를 공식 링크로 사용 | 사용자 검증 URL 제공 | Home·Footer·About·Contact에 조건부 공통 데이터 적용 |
| ADR-027 | 2026-07-31 | Confirmed | YouTube는 nullable 게임 데이터만 준비하고 URL 등록 전 UI를 숨김 | 가짜 URL·빈 영상·초기 iframe 방지 | 자체 호스팅·autoplay 금지 |
| ADR-028 | 2026-07-31 | Confirmed | News는 빈 type-safe 정적 큐레이션으로 시작 | scraping·가짜 seed·본문 복제 방지 | 항목 0개에서는 route·navigation 미노출 |
