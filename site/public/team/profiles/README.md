# Team profile images

- 직원 프로필 이미지 전용 폴더다.
- 사용자 승인 이미지만 사용한다.
- 원본은 `references/Profile/`에서 관리하며 이동·수정·재인코딩하지 않는다.
- 현재 박재민은 `park-jaemin.png`, 정보건은 `jeong-bogeon.png`를 사용한다.
- 브라우저 전송용 파생본은 각 인물별 `-640.webp`, `-1024.webp`이며 원본 비율을 유지한 quality 88 WebP다. `TeamMembers.astro`가 `srcset`으로 선택하고 PNG를 fallback으로 유지한다.
- `references/Profile/프로그래밍.png`는 현재 사이트에서 사용하지 않는다.
- 권장 형식은 WebP 또는 PNG이며 카드 간 동일한 화면 비율을 권장한다. 현재 카드 이미지 영역은 세로 4:5다.
- 이미지를 교체할 때는 승인 원본을 이 폴더에 복사하고 복사 전후 SHA-256을 확인한 뒤, 같은 기준의 640px·1024px WebP를 생성한다. `site/src/data/team.ts`의 `profileImage` PNG 경로와 `profileImageWebp` 두 경로를 함께 갱신한다.
