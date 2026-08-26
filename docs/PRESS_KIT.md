# Press Kit

- Press 공개 자산의 승인 원본은 Git에서 제외된 `references/LvbResult/press-kit/{brand,mushhero,mushdash}/`다. `previews/`, `docs/`, contact sheet와 중간 후보는 공개하지 않는다.
- 네 locale Press 페이지는 `site/src/data/press.ts`의 로컬 자산 manifest와 기존 회사·게임·연락처 데이터를 조합한다. 레이아웃은 Hero → About → Games → Brand → Downloads → Game Images → Key Facts → Contact이고 Recent Press는 표시하지 않는다.
- MushDash의 `promo-*`는 실제 플레이 스크린샷이 아닌 프로모션 이미지다. 화면과 ZIP 모두 이 분류를 유지한다.
- 기존 Steam 스크린샷 6개는 Home의 source image로 계속 참조되므로 삭제하지 않지만 Press 페이지와 새 ZIP에는 포함하지 않는다.
- `site/src/data/siteFacts.json`은 공식명·홈페이지·Press 이메일·SNS·게임명·게임/Store/Press 경로·플랫폼·출시 상태·Press용 locale fact를 관리하는 canonical factual source다. `games.ts`·`contact.ts`·`socialLinks.ts`와 Press ZIP 생성기가 같은 값을 읽는다. 외부 Store의 `Lv.B Games` 원문 표기는 별도 store label로만 보존한다.
- `scripts/press-kit-content.json`은 Brand Guide 색상, Fact Sheet label, 두 게임의 4개 언어 About·Key Features처럼 Press 전용 문구만 관리한다.
- `scripts/build-press-kits.ps1`은 canonical facts와 Press copy, 승인 이미지를 결합해 고정 entry 이름·순서·timestamp의 ZIP 3개를 재생성하며, 모든 TXT를 Windows 메모장과 호환되는 UTF-8 BOM·CRLF로 기록한다. `scripts/prepare-production.ps1`은 source 역할 분리, public/dist SHA, ZIP 크기·entry·중복·0-byte·TXT BOM/strict UTF-8, replacement character·의도하지 않은 `??` 부재와 README `—` separator 수, 화면 링크와 OG 출력을 검증한다.

## Public OG assets

| 공개 URL | 규격 | bytes | SHA-256 | 사용 위치 |
|---|---:|---:|---|---|
| `/og/lvb-og-primary.png` | 1200×630 PNG | 54998 | `16FBF6BD0FE9BC30AC4AD6982788C3AE93C193B928F9F55E562FDC24A408C490` | Home, About, Games, News, Press, Contact |
| `/og/mushhero-og-primary.jpg` | 1200×630 JPEG | 108786 | `558408C081859B7B345344FD203C806D4DD16E714DB2EF4FEDB5F4B0232F6481` | MushHero 상세, BIC 2026 자체 News |
| `/og/mushdash-og-primary.jpg` | 1200×630 JPEG | 141107 | `8C90AA12908B9222FB1CF7DD0136FF5CB4C390DB9A88A6166D21CC8CB9E2C215` | MushDash 상세 |

## Public Press assets

| 공개 URL | 규격 | bytes | SHA-256 |
|---|---:|---:|---|
| `/press/assets/brand/lvb-brand-card-yellow.png` | 1920×1080 PNG | 39311 | `6C9E13C002CA61BDA104392542EE6CEA33E9EB4EC09E7CFDC70D9B888DE28CE3` |
| `/press/assets/brand/lvb-brand-press-preview.png` | 1920×1080 PNG | 84702 | `60137D3041246091AEA53D178BBF86AF9DD4174050BAA555A843990564CE8E54` |
| `/press/assets/brand/lvb-logo-horizontal-transparent.png` | 1876×769 PNG | 54992 | `349DE31265DDEB443651FE017AF31CB392069D94DA47FD559F8DB1856C45DA8D` |
| `/press/assets/brand/lvb-logo-stacked-transparent.png` | 1052×1213 PNG | 47726 | `AF926288880882B2002B66FEAB8C9FCACDC23D05799B0E3FBEE4E87AB56201EC` |
| `/press/assets/brand/lvb-symbol-transparent.png` | 1024×1024 PNG | 65102 | `26A4284E8AB254294D9A5A5B0775EDD06AD86A8F96EA6EB225502DE66B3EA754` |
| `/press/assets/mushhero/mushhero-keyart-alt-01.jpg` | 1920×1080 JPEG | 290445 | `D4406D0CF6ACE86D137EC08294D655D04058F553269DC672B3E15F4E123BC288` |
| `/press/assets/mushhero/mushhero-keyart-primary.jpg` | 1920×1080 JPEG | 257961 | `028EC8FFA2FFE42682D8D1AD3C7684BFB4EC675DB63FE62A6D02266CF4D81376` |
| `/press/assets/mushhero/mushhero-logo-transparent.png` | 1280×720 PNG | 506872 | `C8A49CE599F7CCF249561FEB95FF593E7C2E9C3C1744C7AEBFDAA78D448263BA` |
| `/press/assets/mushhero/mushhero-press-wide-1920.jpg` | 1920×620 JPEG | 264157 | `F1DC15B8AA03B9B56E54D32011B2F64292FD809515883C3AA4FA33DBB0DD395E` |
| `/press/assets/mushhero/mushhero-screenshot-01.jpg` | 1920×1080 JPEG | 371053 | `88A96824E6769553EE9C74EE2EBB0F64B0D52A95807A6213AB849DD7B2CF2DAD` |
| `/press/assets/mushhero/mushhero-screenshot-02.jpg` | 1920×1080 JPEG | 422147 | `B126E858CBE7FC025311C756138C1C344937441D9DA65DE52C901C3852BF26EB` |
| `/press/assets/mushhero/mushhero-screenshot-03.jpg` | 1920×1080 JPEG | 194399 | `86ABE54FAE0BD873492426CB03D5D7F686C37E23F3C0127DF0B4151EC6416190` |
| `/press/assets/mushdash/mushdash-keyart-primary.jpg` | 1920×1080 JPEG | 284104 | `82C2529AE443F29BC1CDD8F9EB6A65BBFD8B49012D686195933D2C9177FBDD65` |
| `/press/assets/mushdash/mushdash-logo-transparent.png` | 1280×720 PNG | 117430 | `F682FF99F832CEB8BDDDFC8E6700F5E98FD72ABA0691AF61CE050FC577198516` |
| `/press/assets/mushdash/mushdash-press-wide-1920.jpg` | 1920×620 JPEG | 197282 | `BB07BC36DA6412C7F728AF8D08B8A2E6DFB0CFA7DAC33BCB878FEFC3CC21B3A9` |
| `/press/assets/mushdash/mushdash-promo-01.jpg` | 800×450 JPEG | 117980 | `2A57A43FBCDA4B194B984E894812CC6E2DEF51465942B3AB6E82C5EB7B9F6B39` |
| `/press/assets/mushdash/mushdash-promo-02.jpg` | 800×450 JPEG | 106831 | `066C37C5FEFC6D866DAA0CF98533CEEB5EB544C7B2B221F798AAD580A37F6D30` |
| `/press/assets/mushdash/mushdash-promo-03.jpg` | 800×450 JPEG | 108004 | `2418780B7F0A04005553803190F1FD228C7325F0E73CF0602C54D1BD7318F7DB` |

## Static download packs

| 공개 URL | bytes | SHA-256 | 내용 |
|---|---:|---|---|
| `/press/downloads/lvb-brand-assets.zip` | 256641 | `07682DAFE439CDEB4ABC6A01A34D7026669BDFF6507E47069925ACAF16B6FB08` | PNG 5개 + `README.txt` + `BRAND_GUIDE.txt` (총 7 entry) |
| `/press/downloads/mushhero-press-kit.zip` | 2304239 | `AAAE718EFBC3E4B39DC54E0D610BE0CD0C90523598D9FD04EB06601335222D33` | 이미지 7개 + EN·KO·JA·ZH-CN Fact Sheet 4개 + README (총 12 entry) |
| `/press/downloads/mushdash-press-kit.zip` | 918996 | `31A85D8D1FBAC9ABD293D7CE63868B1179B51C3B6348641C33DE93C71CDE9F37` | 이미지 6개 + EN·KO·JA·ZH-CN Fact Sheet 4개 + README (총 11 entry) |

## Update procedure

1. 새 승인 파일을 `references/LvbResult/press-kit/`의 해당 게임 또는 브랜드 폴더에 반영하고 해상도·포맷·공개 권한을 확인한다.
2. 같은 파일명으로 `site/public/press/assets/`에 복사하고 원본·public SHA가 일치하는지 확인한다.
3. 게임 정보·URL·연락처 같은 사실은 `site/src/data/siteFacts.json`, Press 전용 소개·특징·label·Brand Guide 색상은 `scripts/press-kit-content.json`에서 갱신한다. 확인할 수 없는 플레이 인원·출시일·플랫폼은 새로 추측하지 않는다.
4. `scripts/build-press-kits.ps1`을 실행하고 실제 bytes·SHA를 `site/src/data/press.ts`, 이 문서와 production 검증에 반영한다.
5. `npm run build`와 `scripts/prepare-production.ps1`로 화면 링크, public/dist byte, ZIP entry·UTF-8 TXT와 OG 회귀를 검증한다.
