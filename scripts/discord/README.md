# Discord Publisher scripts

Lv.B 홈페이지의 정적 News 데이터를 Discord Incoming Webhook 형식으로 변환하는 로컬 운영 도구다. 기본 실행은 항상 Dry Run이며 Discord 네트워크 요청을 만들지 않는다.

```powershell
node scripts/discord/publish-discord.mjs
node scripts/discord/publish-discord.mjs --channel media --output references/reviews/discord-media-initial-sync.md
node --test scripts/discord/discord-publisher.test.mjs
```

실제 게시 명령, 환경변수 설정, 중복 방지 state와 수정 승인 정책은 `docs/DISCORD_PUBLISHING.md`를 따른다. Webhook URL은 파일, 명령 인자, 로그에 기록하지 않는다.
