# News

News는 실시간 scraping이나 기사 본문 복제 없이 `site/src/data/news.ts`에서 정적으로 큐레이션한다.

## 현재 상태

- `site/src/types/news.ts`와 `site/src/data/news.ts`에 검증된 외부 자료 12건과 Lv.B 자체 글 3건을 정적으로 등록했다.
- `/news/`와 locale별 첫 페이지에 이어 page 2·3을 정적 생성한다. Header·Footer News 링크는 첫 페이지를 가리킨다.
- 자체 글은 Studio Update·Development Update·Announcement를 지원하고 검증 근거 URL을 데이터에 보존한다. 외부 BGC 인터뷰는 원문이 직접 지원하는 MushDash·스튜디오 방향만 요약했다.
- 모든 항목은 `publishedAt` 내림차순의 하나의 정렬 목록에서 같은 카드 위계로 한 번씩 표시하며 페이지당 6건으로 나눈다. 외부 카드 전체는 원문 새 탭, 내부 카드 전체는 같은 locale 상세 route로 연결한다.
- 카드 metadata는 첫 줄에 category·publisher·author 중 존재하는 값을, 둘째 줄에 날짜만 표시해 긴 출처명에서도 날짜 위치를 일정하게 유지한다.
- 자동 수집·검색·scraping 기능은 없다. RSS는 자체 글 운영량과 배포 요구가 확정될 때 별도 검토한다.

## 항목 추가

- 검증된 외부 기사만 수동 등록한다.
- `slug`, `kind`(`interview`, `press-coverage`, `blog-review`, `feature`), `originalTitle`, 네 locale `localizedTitle`·`localizedSummary`, `publisher`, 선택적 `author`, `publishedAt`, `sourceUrl`, `lastVerifiedAt`을 입력한다.
- 기사 이미지는 사용 권리와 안정적인 출처를 확인하지 못하면 사용하지 않는다.
- 제목·언론사·날짜·원문 링크와 짧은 자체 요약만 사용하고 기사 전체 본문은 복제하지 않는다.
- 개인 블로그는 작성자·게시일·본문의 직접 언급을 확인하고 실제 시연 후기는 `blog-review`, 개별 게임 소개는 `feature`로 분류한다. 개인 블로그를 언론 보도로 표시하지 않는다.
- 공공기관·지역 게임 기관이 Lv.B 또는 게임을 개별 소개한 자료는 원문 제목·게시일·직접 언급을 확인한 뒤 `feature`로 등록할 수 있다.
- 동일 캠페인의 공식 블로그·Instagram·Facebook 재게시는 대표 원문 하나만 등록한다. 공식 SNS 기반 자체 글은 개별 URL·게시일·공식 계정을 확인하고 caption을 복제하지 않은 자체 문장으로 작성한다.
- BIC 공식 전시 listing은 기사로 등록하지 않고 참가 사실의 근거로만 취급한다. BIC 2026의 머쉬히어로·레벨비·비경쟁 퍼블릭 인디·PC·액션 표기는 `https://www.bicfest.org/exhibition/view/2087?chk=0&param=0`에서 확인했다.

## 검증과 공개

- 원문 URL, 게시 주체, 날짜를 직접 확인하고 `lastVerifiedAt`을 갱신한다.
- Lv.B·MushHero·MushDash를 본문에서 직접 다루거나 실제 플레이·인터뷰·개별 기관 소개에 해당하는 자료만 포함한다. 행사 전체 보도에서 이름이 없거나 검색 metadata에만 잡힌 결과는 제외한다.
- 검증되지 않은 URL·기사·가짜 seed 데이터는 추가하지 않는다.
- 새 기사 추가 후 `npm run check`와 정적 build·링크 검증을 수행한다.
- 새 기사도 최신순 단일 정렬 정책을 유지하며 별도 Featured 필드나 중복 노출을 만들지 않는다. 7건째부터 다음 정적 pagination route가 자동 생성된다.
- 중복 기사와 동일 이벤트의 반복 노출 여부를 검토하고, 별도 가치가 확인될 때만 함께 유지한다.
- 항목이 다시 0개가 되면 Header·Footer News 링크와 빈 News UI를 노출하지 않는다.
- 향후 자동 검색은 홈페이지 기능이 아니라 별도 모니터링 작업으로 분리한다.

## Pagination

- `site/src/utils/newsPagination.ts`의 `NEWS_PAGE_SIZE = 6`을 단일 기준으로 사용한다.
- 첫 페이지는 locale별 `/news/`이고 `/news/page/1/`은 만들지 않는다. 두 번째 페이지부터 `/news/page/2/` 형식으로 생성하며 항목 수가 늘면 다음 페이지도 자동 생성한다.
- 각 pagination page는 자기 canonical, 같은 페이지 번호의 네 locale hreflang과 x-default를 사용하고 sitemap에 포함한다.
- 카드 summary 데이터는 유지하고 화면에서만 두 줄로 제한한다. 별도 원문 CTA 없이 카드 전체를 링크로 사용한다.

## Lv.B 자체 글 추가

- `type: internal`, 공통 slug·category·publishedAt·updatedAt·author·검증된 hero image와 네 locale title·summary·body를 하나의 데이터 항목에 추가한다.
- 정적 `[slug].astro` route가 네 locale 상세 페이지를 생성하며 목록은 날짜로 자동 정렬한다.
- 자체 글은 게임별 Article Open Graph와 Article JSON-LD를 사용한다. 근거·Store 같은 외부 링크는 새 탭 보안 속성을, locale 내부 링크는 같은 탭을 사용한다.
- 사실·일정·성과를 추측하지 않고 외부 기사 문장을 복제하지 않는다.
