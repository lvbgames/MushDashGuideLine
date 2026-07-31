# Current

- 전체 페이지 구현 상태: 정규 28개 locale 페이지·브랜드 404·보호된 Privacy를 구현했다. Naver 소유확인은 과거 HTML 파일 대신 `site/src/config/site.ts`의 verification 값을 공통 BaseLayout `<head>`에 정적 meta로 출력한다. Contact·News·지도·팀 프로필을 포함한 승인 콘텐츠와 정적 Astro 구조를 유지한다.
- QA 결과: `prepare-production.ps1`, `npm ci`, `astro check` 0/0/0, 정적 build 29개가 성공했다. 전체 HTML 30개·정규 28개·sitemap 28 URL이며, Home Naver meta 1개·과거 확인 파일 0개·빈 링크와 broken link 0개·Privacy와 프로필 해시 일치를 확인했다. 네 언어 전체 페이지를 320/390/768/1024/1440/1920px의 168개 조합에서 확인해 가로 overflow와 eager 이미지 실패가 없었다.
- 운영 배포 상태: 사용자가 `main` 운영 배포를 승인했다. `preDeployHead`는 `fcba5a78ba02adeaff0bef9c18bc3ab6825f32dd`이며 fetch 후 local main과 origin/main은 ahead/behind 0/0이었다. 배포 Commit message는 `feat: launch new Lv.B website`이고 실제 Commit SHA와 운영 확인 결과는 배포 스크립트 출력과 완료 보고에서 기록한다.
- 다음 권장 작업: Push 후 Netlify 자동 배포에서 `lvb.kr`의 네 locale·News·게임 상세·프로필·Privacy·custom 404·Naver meta를 확인한다. 운영 확인이 끝나면 사용자가 Naver 서치어드바이저에서 소유확인 버튼을 누른다.
