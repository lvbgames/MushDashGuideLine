# News

News는 실시간 scraping이나 기사 본문 복제 없이 `site/src/data/news.ts`에서 정적으로 큐레이션한다.

## 현재 상태

- `site/src/types/news.ts`와 `site/src/data/news.ts`에 검증된 외부 자료 3건을 정적으로 등록했다.
- `/news/`, `/ko/news/`, `/ja/news/`, `/zh-cn/news/`와 locale별 Header·Footer News 링크를 공개한다.
- 등록 자료: hashiruka48의 Lv.B 인터뷰 1건, 게임메카·부산일보의 BIC 2024 보도 2건.
- 모든 항목은 `publishedAt` 내림차순의 단일 목록에서 동일한 정보 구조로 한 번씩 표시한다. Featured 분리나 첫 항목 시각 강조는 사용하지 않는다.
- 자동 수집·RSS·검색·scraping 기능은 없으며 기사 상세 route도 만들지 않는다.

## 항목 추가

- 검증된 외부 기사만 수동 등록한다.
- `slug`, `kind`(`interview` 또는 `press-coverage`), `originalTitle`, 네 locale `localizedTitle`·`localizedSummary`, `publisher`, `publishedAt`, `sourceUrl`, `lastVerifiedAt`을 입력한다.
- 기사 이미지는 사용 권리와 안정적인 출처를 확인하지 못하면 사용하지 않는다.
- 제목·언론사·날짜·원문 링크와 짧은 자체 요약만 사용하고 기사 전체 본문은 복제하지 않는다.

## 검증과 공개

- 원문 URL, 게시 주체, 날짜를 직접 확인하고 `lastVerifiedAt`을 갱신한다.
- 검증되지 않은 URL·기사·가짜 seed 데이터는 추가하지 않는다.
- 새 기사 추가 후 `npm run check`와 정적 build·링크 검증을 수행한다.
- 새 기사도 최신순 단일 목록 정책을 유지하며 별도 Featured 필드나 중복 노출을 만들지 않는다.
- 중복 기사와 동일 이벤트의 반복 노출 여부를 검토하고, 별도 가치가 확인될 때만 함께 유지한다.
- 항목이 다시 0개가 되면 Header·Footer News 링크와 빈 News UI를 노출하지 않는다.
- 향후 자동 검색은 홈페이지 기능이 아니라 별도 모니터링 작업으로 분리한다.
