# Lv.B Analytics Worker

Lv.B 홈페이지의 단순 일간 순 방문자를 집계하는 독립 Cloudflare Worker다. Astro 정적 사이트와 빌드·배포를 공유하지 않으며, Worker 또는 D1이 실패해도 홈페이지는 그대로 동작한다. Cloudflare Free의 Worker·D1과 Netlify Production의 `PUBLIC_ANALYTICS_ENDPOINT`를 2026-08-31 적용 기준으로 연결한다.

## 수집 범위와 계산

- `POST /hit`: 허용 Origin에서 온 일반 브라우저 요청만 받고 성공 여부와 관계없이 빈 `204`를 반환한다.
- `GET /admin/`: Basic Authentication 뒤 TODAY, WEEK, TOTAL, RECENT 30 DAYS를 HTML로 표시한다.
- `GET /api/stats`: 같은 인증 뒤 같은 집계를 JSON으로 반환한다.
- KST 날짜와 Cloudflare의 `CF-Connecting-IP`를 `ANALYTICS_HASH_SECRET`으로 HMAC-SHA256 처리한다.
- D1의 `daily_visitors`에는 `visit_date`, 당일 `visitor_hash`, `created_at`만 임시 저장한다. 원본 IP, User-Agent, URL, referrer, 국가, 세션은 저장하지 않는다.
- `(visit_date, visitor_hash)` 복합 기본키와 `INSERT OR IGNORE`로 같은 날의 반복 방문을 한 번만 센다.
- `WITHOUT ROWID` 복합 기본키의 첫 열이 `visit_date`라 날짜 범위 조회에 사용할 수 있으므로, write·storage를 늘리는 중복 날짜 index는 추가하지 않는다.
- 날짜가 HMAC 입력에 포함되므로 다음 날 hash는 달라진다. 여러 날짜의 동일 방문자를 연결하는 장기 identifier가 없다.
- 매일 한국시간 00:10(UTC 15:10)의 Cron이 현재 KST 날짜보다 이른 모든 미집계 날짜를 처리한다. 날짜별 고유 방문자 수를 `daily_stats(visit_date, unique_visitors, finalized_at)`에 저장한 뒤 같은 트랜잭션에서 해당 hash row를 삭제한다.
- 집계 저장 또는 삭제가 하나라도 실패하면 D1 batch 전체가 rollback되어 hash를 먼저 잃지 않는다. 남은 과거 날짜는 다음 Cron에서 다시 처리하며, 동일 작업을 반복해도 이미 삭제된 row를 다시 더하지 않는다.
- 장기 보관 데이터는 날짜, 그 날짜의 최종 고유 방문자 수, 집계 완료 시각뿐이다. 정상 상태에서 `daily_stats`는 하루 한 row이고 과거 방문자 hash는 남지 않는다.
- bot User-Agent는 집계 전에 제외한다. User-Agent는 식별자나 D1 데이터에 포함하지 않는다.

## Free 한도와 장애 분리

2026-08-28 확인 기준 공식 Free 한도는 다음과 같다.

- Workers Free: 일 100,000 requests, 요청당 CPU 10 ms, 메모리 128 MB. 일일 request 한도는 UTC 자정에 초기화되며 초과 요청은 실패할 수 있다. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- D1 Free: 일 5,000,000 rows read, 일 100,000 rows written, 계정 전체 5 GB. 개별 Free DB 최대 크기는 500 MB이며 계정당 DB는 10개다. 일일 query 한도 초과 시 D1 query가 다음 초기화 시점까지 실패할 수 있다. [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)
- Workers Free 계정은 Cron Trigger를 최대 5개 사용할 수 있으며 이 프로젝트는 `10 15 * * *` 한 개만 사용한다. Cron은 UTC 기준이므로 이 값은 매일 한국시간 00:10이다. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)

유료 기능, Durable Objects, 유료 Rate Limiting, 외부 Analytics 제품은 사용하지 않는다. 한도 초과 시 집계 누락을 허용하며 Paid plan으로 자동 전환하지 않는다. 사이트 client는 fire-and-forget 요청의 오류를 모두 흡수하므로 홈페이지 로딩·내비게이션·UI는 실패하지 않는다.

## 로컬 검증

```powershell
cd E:\Codex\LvB\Homepage\analytics
npm ci
npm audit
npm run check
npm test
npm run qa:local
```

`qa:local`은 고유한 `analytics/.wrangler/qa-*` 임시 위치에 local D1을 만들고 두 migration을 적용한다. 2026-08-27=3명, 08-28=5명, 08-29=2명 fixture로 집계 전후 TODAY·WEEK·TOTAL·최근 30일 표시가 같은지, 과거 두 날짜만 `daily_stats`에 3·5로 남는지, `daily_visitors`에는 오늘 2개 hash만 남는지 검사한다. 강제 삭제 실패의 전체 rollback, 재시도와 2회 실행의 멱등성, 중복 제거, bot 제외, CORS, Basic Auth와 raw IP 비노출도 확인한 뒤 임시 DB를 제거한다. 테스트 전용 IP·날짜·실패 헤더는 `ANALYTICS_ENV=development`와 `ANALYTICS_ALLOW_TEST_HEADERS=true`가 동시에 설정된 local QA에서만 읽는다.

## Cloudflare 운영 리소스

2026-08-31 Cloudflare Free 계정에서 다음 리소스를 준비하고 원격 staging QA를 완료했다. Secret 값과 관리자 평문 비밀번호는 저장소에 기록하지 않는다.

- Worker name: `lvb-analytics`
- Worker URL: `https://lvb-analytics.lvb-analytics-worker.workers.dev`
- D1 database name: `lvb-analytics` (`database_id`는 `wrangler.jsonc` 한 곳에서 관리)
- Cron: `10 15 * * *` 한 개
- production hit endpoint: `https://lvb-analytics.lvb-analytics-worker.workers.dev/hit`

재구성 또는 secret 교체가 필요할 때만 다음 순서를 사용한다. 유료 plan이나 billing 추가를 자동화하지 않는다.

1. `npx wrangler login`으로 본인 Cloudflare 계정에 로그인한다.
2. `npx wrangler d1 create lvb-analytics`로 D1을 만들고 출력된 실제 `database_id`를 `wrangler.jsonc`의 placeholder와 교체한다.
3. 충분히 긴 임의값을 준비해 `npx wrangler secret put ANALYTICS_HASH_SECRET`으로 저장한다.
4. 관리자 username을 `ANALYTICS_ADMIN_USER` secret으로 저장한다.
5. 실제 비밀번호를 파일에 쓰지 않고 현재 PowerShell process에만 넣어 `npm run hash-password`를 실행한다.

   ```powershell
   $env:ANALYTICS_ADMIN_PASSWORD_INPUT = Read-Host -AsSecureString | ConvertFrom-SecureString -AsPlainText
   npm run hash-password
   Remove-Item Env:ANALYTICS_ADMIN_PASSWORD_INPUT
   ```

6. 출력된 salt와 hash만 각각 `ANALYTICS_ADMIN_PASSWORD_SALT`, `ANALYTICS_ADMIN_PASSWORD_HASH` secret으로 저장한다. 평문 비밀번호는 repository, config, D1, HTML에 저장하지 않는다.
7. `npx wrangler d1 migrations apply DB --remote`로 `0001_initial.sql`과 `0002_daily_stats.sql`을 적용하고, 별도 승인 뒤 `npx wrangler deploy`와 `npx wrangler triggers deploy`를 실행한다.
8. 별도 production 승인에서만 Netlify build 환경의 `PUBLIC_ANALYTICS_ENDPOINT`에 위 HTTPS `/hit` URL을 설정한다. 공개 Privacy 네 언어의 실제 시행일도 같은 배포에서 확정한다.

Cloudflare가 Worker에 제공하는 실제 client IP는 `CF-Connecting-IP`에서만 읽는다. request body나 query의 IP는 받지 않는다. 자세한 header 의미는 [Cloudflare HTTP headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/)를 따른다. Secrets는 [Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/) 절차로만 저장한다.

## 운영 보안 확인

- production 허용 Origin은 `https://lvb.kr` 하나다. CORS는 브라우저 호출 범위를 줄이는 장치이며 완전한 abuse 방지는 아니다.
- `/admin/`과 `/api/stats`는 `private, no-store`, `X-Robots-Tag: noindex, nofollow`를 반환한다.
- 운영 전 관리자 비밀번호, secret, Worker URL, Free plan 상태와 D1 dashboard 사용량 경보를 수동 확인한다.
- Worker log에 request header나 원본 IP를 추가하지 않는다.
- 통계 시작일은 `daily_stats`와 아직 집계되지 않은 `daily_visitors`를 합친 첫 `visit_date`이며 과거 방문을 추정하거나 복원하지 않는다.
