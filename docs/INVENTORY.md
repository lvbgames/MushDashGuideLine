# Reuse Inventory and Implementation Order

조사일: 2026-07-30. 작업공간 분리 결정에 따라 아래 `legacy-site/` 항목은 역사적 인벤토리이며, 명시적 사용자 요청 없이는 신규 `site/`에 재사용·복사·수정하지 않는다. 자산 출처 미확인은 사용자 확인 필요다.

| 대상 | 분류 | 근거 |
|---|---|---|
| legacy Header/Footer/모바일 Navigation | 보관 전용 | 신규 `site/`에 기반으로 사용하지 않는다. |
| legacy Home/About/Contact/Projects/MushDash/404 | 보관 전용 | 기존 route·문구·외부 Readdy 이미지·지도는 신규 구현에 자동 사용하지 않는다. |
| legacy 로고·폰트·아이콘·SNS/스토어 링크 | 보관 전용 | 출처·승인 확인 전 신규 site에서 사용하지 않는다. |
| `legacy-site/public/privacy.html`, `site/public/privacy.html` | E | 유일한 허용 예외. byte-identical 상태로 보호하며 본문·스타일·metadata·링크·URL·매핑을 변경하지 않는다. |
| `references/Reference.png` | 참고 전용 | 구조·분위기 참고만 가능하며 웹 삽입 에셋이 아니다. |

## Implementation order

| 단계 | 범위 | 선행 조건 | 위험 | 검증 |
|---|---|---|---|---|
| 1 | 보호 경로·배포 기준 고정 | Netlify UI 확인 | `/privacy` 회귀 | 세 URL·원본 해시 비교 |
| 2 | 디자인 토큰·전역 스타일 | 승인 브랜드 자산 | 기존 route 영향 | 기존/신규 route 시각 점검 |
| 3 | English 기본 i18n 데이터 구조 | locale 정책 확정 | `/privacy` 침범 | locale fallback·privacy 제외 |
| 4 | Header/Footer/언어 선택 | 확인된 링크 | 모바일 접근성 | 키보드·모바일 메뉴 |
| 5 | Home | MushHero 승인 콘텐츠 | 우선순위 불일치 | CTA·반응형 점검 |
| 6 | Our Games·MushHero·MushDash | 게임별 자산/스토어 URL | 추정 콘텐츠 | 링크·미디어 검증 |
| 7 | About·Community·Contact·Press Kit·404 | 회사/연락/채널 자료 | 허위 정보 | 콘텐츠 승인·404 확인 |
| 8 | 반응형·접근성 | 구현 완료 | 모바일 회귀 | viewport·대비·탭 순서 |
| 9 | Netlify Preview·실서비스 전환 | 배포 승인 | publish 불일치 | Preview, `/privacy`, route smoke test |
