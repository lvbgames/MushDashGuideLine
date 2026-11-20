# Discord Publishing

Lv.B Discord 게시 도구는 개인 계정 자동화나 self-bot이 아닌 공식 Discord Incoming Webhook만 사용한다. 홈페이지/Analytics/Cloudflare 런타임과 분리된 `scripts/discord/`의 로컬 운영 도구이며, 기본 실행은 네트워크 요청이 없는 Dry Run이다.

## Channel mapping

| Logical channel | Discord 위치 | 허용 콘텐츠 | 환경변수 |
| --- | --- | --- | --- |
| `media` | Archive → media | 검증된 외부 기사·인터뷰·특집·플레이 후기 | `DISCORD_MEDIA_WEBHOOK_URL` |
| `mushdash_updates` | Mush Dash → updates | `discordChannel`로 명시 승인한 MushDash 내부 업데이트 | `DISCORD_MUSHDASH_UPDATES_WEBHOOK_URL` |
| `mushhero_updates` | Mush Hero → updates | `discordChannel`로 명시 승인한 MushHero 내부 업데이트 | `DISCORD_MUSHHERO_UPDATES_WEBHOOK_URL` |

`announcements`, `another-sites`, `media-report`, 지원·토론·음성 채널은 이 도구의 대상이 아니다. 외부 기사는 update 채널에 보내지 않고, 내부 Studio Update·Development Update·Announcement는 media에 보내지 않는다. Devlog도 자동 승인하지 않는다.

## Secrets

Webhook URL은 Git 파일이나 문서에 저장하지 않는다. 사용자가 Discord에서 만든 값을 Windows 사용자 환경변수 또는 별도의 로컬 secret mechanism에 직접 저장한다. URL을 ChatGPT에 전달할 필요가 없다. 실제 전송 시 선택한 채널의 환경변수만 읽고, Dry Run에서는 환경변수를 읽지 않는다.

배포 스크립트는 세 환경변수에 비밀 값이 할당된 staged line과 Discord Webhook URL 형식을 차단한다. 로그에는 channel, content ID, 상태, HTTP 상태, 성공 후 message ID만 허용한다.

## Language policy

공개 Discord 게시물의 기본 언어는 `media`, `mushdash_updates`, `mushhero_updates` 모두 English다. 홈페이지의 기존 `localizedTitle.en`과 `localizedSummary.en`을 직접 사용하며 Discord 전용 번역 원본을 중복 관리하지 않는다. 같은 콘텐츠를 한국어·일본어·중국어로 중복 게시하지 않고 한 콘텐츠당 Discord message 한 개만 유지한다. Update의 primary link도 English 홈페이지 article route를 사용한다.

## Dry Run

```powershell
node scripts/discord/publish-discord.mjs
node scripts/discord/publish-discord.mjs --channel media --output references/reviews/discord-media-initial-sync.md
node scripts/discord/publish-discord.mjs --channel mushhero_updates
```

채널 생략 시 검토 편의를 위해 `media`를 표시하지만 여전히 Dry Run이다. 보고서는 oldest → newest 순이며 `NEW`, `SKIP`, `UPDATE CANDIDATE`를 표시한다. `references/reviews/` 출력은 Git에서 제외한다. 현재 실제 내부 글을 이용한 MushHero/MushDash 템플릿은 `SAMPLE ONLY / NOT FOR SEND`이고 publication state에 포함하지 않는다.

## Explicit send and update approval

실제 POST는 `--send`와 단일 `--channel`을 함께 명시해야 한다. 모든 채널을 한 번에 보내는 명령은 없다.

```powershell
node scripts/discord/publish-discord.mjs --send --channel media
```

- `NEW`: `wait=true` POST 후 Discord message ID를 받은 경우에만 state에 기록한다.
- `SKIP`: 최종 Discord 표현의 hash가 같으므로 요청하지 않는다.
- `UPDATE CANDIDATE`: 자동 수정하지 않는다. Dry Run 검토 뒤 사용자가 명시적으로 승인한 실행에만 `--approve-updates`를 추가해 기존 message ID를 PATCH한다.
- 자동 삭제는 지원하지 않는다.

초기 bulk sync는 한 항목 실패 시 중단하는 fail-fast 방식이다. 성공한 message ID는 즉시 state에 보존해 부분 성공 후 재실행에서도 중복 게시를 막고, 실패 항목은 published로 기록하지 않는다. 429는 서버의 Retry-After를 따르고, 네트워크 오류와 5xx만 제한된 횟수로 재시도한다. 4xx는 재시도하지 않는다.

## Homepage + Discord workflow

1. 외부 자료는 기존 검증 절차를 거쳐 `site/src/data/news.ts`에 등록한다.
2. update 채널 게시가 필요한 내부 글만 `discordChannel: 'mushhero_updates'` 또는 `discordChannel: 'mushdash_updates'`를 명시한다. 필드가 없으면 게시 대상이 아니다.
3. formatter test와 Dry Run을 실행해 언어, 링크, 썸네일, 상태를 검토한다.
4. `UPDATE CANDIDATE`가 있으면 변경 내용을 별도로 승인한다.
5. 사용자가 게시를 명시적으로 승인한 뒤 해당 한 채널만 전송한다.
6. 홈페이지 및 production 검증은 기존 절차대로 별도 수행한다.

Publication state는 `scripts/discord/discord-publications.json`에서 `contentId`, logical `channel`, Discord `messageId`, `contentHash`, `publishedAt`만 관리한다. Webhook secret은 포함하지 않는다. Hash는 최종 title, summary, URL, date, source/category 및 선택적 version/platform을 canonicalize해 SHA-256으로 계산한다.

## Payload policy

- 언어는 English 한 건만 사용한다.
- embed accent는 Lv.B Brand Yellow `#FFD746`이다.
- 모든 payload는 `allowed_mentions.parse`를 빈 배열로 고정한다.
- 외부 media는 원문 URL, English 제목·요약, `Source`·`Published`·`Type`, `MMM D, YYYY`, English 분류와 기존 공개 OG를 사용한다. 검증된 영문 매체명만 사용하며 확신할 수 없는 고유명은 원문 표기를 유지한다.
- 게임 판별이 명확하지 않으면 Lv.B OG를 사용한다.
- Discord 한도보다 보수적인 길이 제한을 적용하고 NFC/CJK를 보존하며 필요한 경우 `…`로 끝낸다.
- 사용자가 입력한 임의 Webhook destination이나 Discord API URL은 받지 않는다. HTTPS의 공식 Webhook host와 고정 path만 허용한다.

## Validation

```powershell
node --test scripts/discord/discord-publisher.test.mjs
node scripts/discord/publish-discord.mjs --output references/reviews/discord-media-initial-sync.md
```

Dry Run에서 Discord API 요청 수가 0인지, 외부/내부 분리와 순서, `allowed_mentions`, content hash와 상태, secret masking, 길이 제한, update channel mapping을 확인한다. 실제 전송 전에는 site check/build와 `scripts/prepare-production.ps1`도 통과해야 한다.

## Steam-ready update workflow

게임 업데이트의 canonical source는 홈페이지의 English·한국어·日本語·简体中文 데이터다. Discord는 같은 source에서 English message 한 개를 만들고, 향후 Steam Publish Package는 EN·KO·JA·ZH-CN 네 언어를 만든다. Steam 게시 자체는 자동화하지 않으며 사용자가 Steamworks에서 최종 확인하고 직접 게시한다.

향후 Steam 출력 도구는 locale별 `title`, `summary`, `body`, Import HTML, image checklist, event type과 데이터에 실제 존재할 때만 optional build/version을 제공한다. Discord와 Steam용 문구가 서로 다른 별도 원본으로 갈라지지 않도록 같은 홈페이지 update source를 사용한다.
