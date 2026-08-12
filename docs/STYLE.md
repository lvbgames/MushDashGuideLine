# Style Direction

- 브랜드 공통은 로고에서 추출한 ink `#231f20`, cream `#fff08c`, yellow `#ffd746`, honey `#ffb400`을 기준으로 한다.
- 사이트 배경은 page `#0f0d0c`, primary surface `#16120f`, secondary surface `#1d1712`, warm elevated surface `#241b10`을 사용한다. 본문은 warm white `#f7f1e5`다.
- Header·Footer는 원본에서 분리한 투명 `lvb-symbol.png`와 semibold CSS `Lv.B` 텍스트를 결합한 compact mark를 무배경·무테두리·무그림자로 사용한다. Header symbol은 약 28px, Footer symbol은 약 34px이며 전체 가로 로고는 넓은 브랜드 영역용으로 보존한다.
- About Hero의 넓은 브랜드 패널에서만 보존 전체 로고 `lvb-logo.png`를 원본 비율로 사용한다. 밝은 warm-neutral 패널은 로고를 변형하지 않고 담으며 전체 폭 plate·glow·큰 그림자를 사용하지 않는다.
- 브랜드 yellow는 공통 primary CTA·eyebrow·active navigation·focus ring에 제한한다. 기본 divider는 warm neutral이며 cream은 hover와 제한적인 badge에 사용한다.
- MushHero accent는 브랜드 honey 계열(`--color-mushhero-accent`)을 사용한다.
- Mush Dash accent는 teal `#55b9b0` 계열(`--color-mushdash-accent`, hover, soft, text)을 게임 배지·미디어·약한 surface tint에 사용한다. Mush Dash 상세의 Steam primary CTA는 teal, Epic CTA는 dark secondary이며 공통 Header·Footer·Navigation은 브랜드 체계를 따른다.
- 게임 상세은 Hero → Overview → Features → Featured Screenshot → Gallery → Store CTA → More Game 순서를 공유한다.
- Steam은 Mush Dash의 primary CTA, Epic Games Store는 secondary CTA다. MushHero의 Steam Wishlist 우선순위는 유지한다.
- Our Games는 작은 동일 카드 두 개 대신 MushHero의 넓은 featured 영역과 Mush Dash의 작은 secondary 영역으로 위계를 만든다. MushHero는 honey, Mush Dash는 teal을 해당 게임 영역에만 적용한다.
- Hero 이미지는 eager, 나머지 이미지는 lazy loading을 기본으로 하고 원본 16:9 비율을 보존한다.
- 확인된 trailer URL이 없으면 빈 영상 shell이나 placeholder를 만들지 않는다.
- mobile-first로 320 CSS px부터 가로 스크롤을 방지한다. 48rem·64rem·90rem에서 구조와 여백을 확장한다.
- focus-visible, 48px 수준의 주요 터치 대상, 의미 있는 이미지 alt, reduced motion을 기본으로 유지한다.
- Contact는 warm raised surface의 직접 이메일 카드와 정적 `mailto:` CTA를 사용한다. CTA는 48px 이상 터치 영역과 yellow focus ring을 유지하며 glass·glow·다중 열 복잡화는 사용하지 않는다.
- Contact의 여섯 문의 범위는 desktop에서 읽기 좋은 2열 목록, mobile에서 1열로 표시한다. 크리에이터·큐레이터와 언론·인터뷰 설명은 별도 복잡한 카드 묶음 대신 하나의 보조 영역 안에서 간결한 2열/1열 위계로 구성한다.
- 현지화 문체·CTA 용어·CJK 타이포그래피와 줄바꿈은 `docs/I18N.md`를 따른다.
- Home 커뮤니티는 desktop에서 소개와 공식 SNS 세로 링크 목록을 2열로, mobile에서 1열로 표시한다. About은 텍스트 링크 카드, Footer는 간결한 inline 형태를 유지하며 아이콘 패키지를 추가하지 않는다.
- About 스튜디오 위치는 desktop에서 주소·설명·지도 CTA와 16:9 Google 지도를 2열로, mobile에서 1열로 배치한다. 지도는 raised surface·기존 border/radius를 사용하며 별도 glow나 지도 라이브러리를 추가하지 않는다.
- About 팀 소개는 desktop에서 소개와 팀원 카드 영역을 나누고 카드 2개를 나란히, mobile에서 카드 1열로 표시한다. 프로필은 4:5 영역을 유지하며 이미지가 `null`이면 기존 Lv.B symbol을 중립적으로 표시한다.
- News & Press는 Featured 위계 없이 모든 항목을 같은 정보 구조의 최신순 단일 목록으로 표시한다. mobile은 1열, desktop은 메타와 본문을 나눈 읽기 좋은 세로 목록을 사용한다.
- Privacy와 Terms는 같은 Legal Hero, mobile details 목차, desktop sticky 목차, 본문·print 스타일을 사용한다. 문서별 데이터와 본문 컴포넌트는 분리하고 목차처럼 안전한 표시 컴포넌트만 공통화한다.
- YouTube 영상은 공식 URL이 있을 때만 16:9로 제공하며 사용자 클릭 전 iframe을 로드하지 않고 autoplay를 사용하지 않는다.
- Home·MushHero·Mush Dash의 정보 구조와 게임별 미디어·문구는 브랜드 패스에서도 변경하지 않는다.

공통 token은 `site/src/styles/global.css`, Home 전용 규칙은 `home.css`, Our Games 전용 규칙은 `games.css`, About 전용 규칙은 `about.css`, 게임 상세 공통/게임별 규칙은 `game-detail.css`에서 관리한다.
