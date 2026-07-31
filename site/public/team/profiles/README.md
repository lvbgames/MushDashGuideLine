# Team profile images

- 직원 프로필 이미지 전용 폴더다.
- 사용자 승인 이미지만 사용한다.
- 원본은 `references/Profile/`에서 관리하며 이동·수정·재인코딩하지 않는다.
- 현재 박재민은 `park-jaemin.png`, 정보건은 `jeong-bogeon.png`를 사용한다.
- `references/Profile/프로그래밍.png`는 현재 사이트에서 사용하지 않는다.
- 권장 형식은 WebP 또는 PNG이며 카드 간 동일한 화면 비율을 권장한다. 현재 카드 이미지 영역은 세로 4:5다.
- 이미지를 교체할 때는 승인 원본을 이 폴더에 복사하고 복사 전후 SHA-256을 확인한 뒤, `site/src/data/team.ts`의 해당 팀원 `profileImage`를 `/team/profiles/파일명.확장자`로 갱신한다.
