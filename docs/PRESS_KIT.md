# Press Kit

- 네 locale Press Kit은 `site/src/data/press.ts`의 표시 문구·브랜드 asset metadata와 기존 회사·게임·연락처·News 데이터를 조합한다.
- 공개 브랜드 원본은 `/brand/lvb-logo.png`, `/brand/lvb-symbol.png`이며 개별 PNG와 정적 ZIP에서 같은 승인 원본을 제공한다. 사용 안내는 기사·보도 목적임을 설명할 뿐 새로운 상표 라이선스를 만들지 않는다.
- Steam CDN 스크린샷은 `games.ts`의 검증 URL에서 2026-08-21에 내려받은 원본 byte를 `/press/assets/`에 보존한다. crop·resize·re-encode하지 않으며 외부 기사·블로그·행사 촬영 이미지와 본문은 포함하지 않는다.
- 브랜드 자료 용도 안내는 Lv.B와 게임의 기사·보도 목적 범위로 제한한다.
- 다운로드 manifest의 단일 원본은 `site/src/data/press.ts`다. 화면은 로컬 자산만 다운로드하고, `scripts/prepare-production.ps1`은 public/dist byte·SHA, ZIP entry와 화면 링크를 함께 검증한다.

## Local screenshot manifest

모든 파일은 JPEG, 1920×1080이며 원본 HTTP 응답은 `200 image/jpeg`로 확인했다.

| 공개 파일 | bytes | SHA-256 | 검증 source |
|---|---:|---|---|
| `mushhero/mushhero-01.jpg` | 291902 | `484B07E40D88556C53425222C1FCE4A9953DAA8A21AEA83CE33964060E106077` | `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/2bd506a8530d829461a9dd09474bf75dbbe9d8f2/ss_2bd506a8530d829461a9dd09474bf75dbbe9d8f2.1920x1080.jpg?t=1782291404` |
| `mushhero/mushhero-02.jpg` | 476674 | `13741FE3995FBC4FB8D84453BAB191B700AAF0823C4DA3D44E62CD3ED7CD37AF` | `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/f96a767c38c8d9b7baf269e049acd6f20744b8f2/ss_f96a767c38c8d9b7baf269e049acd6f20744b8f2.1920x1080.jpg?t=1782291404` |
| `mushhero/mushhero-03.jpg` | 525926 | `3CE54AC177C4A2D4CC7578B39904E97CB5C62CD995532DA8B4BDBBE193C50E90` | `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4711200/da2fffa5e4c7162cb00c418bb963e1865329ee95/ss_da2fffa5e4c7162cb00c418bb963e1865329ee95.1920x1080.jpg?t=1782291404` |
| `mushdash/mushdash-01.jpg` | 321542 | `6B22EE5A5218B4EFA03ED05F86ABC5D5104995CD84CCE53B8877F7511165C4E4` | `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/7966ab2fd72923decd51e216d4924880e9e1382e/ss_7966ab2fd72923decd51e216d4924880e9e1382e.1920x1080.jpg?t=1781498090` |
| `mushdash/mushdash-02.jpg` | 443933 | `3F7E7C093C0430F7E87DB2ECF9E3C64E88D8DE081C2A6843F15774EC434D55F9` | `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/512f8f3be28f4ee7832a47d06460d8eb9e1e3ea0/ss_512f8f3be28f4ee7832a47d06460d8eb9e1e3ea0.1920x1080.jpg?t=1781498090` |
| `mushdash/mushdash-03.jpg` | 409143 | `10D6AD2513F92DE008B61BA969B4FD8D7C293D90199E151383E6B01FB698BADB` | `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3153140/92c6b9367ee79a2b56ed98a67df94c1b3043207d/ss_92c6b9367ee79a2b56ed98a67df94c1b3043207d.1920x1080.jpg?t=1781498090` |

## Static download packs

| 파일 | bytes | SHA-256 | 내용 |
|---|---:|---|---|
| `lvb-brand-assets.zip` | 81756 | `B9281432DD14EDB034B3691D32262F9A07A86B9055B911C0EA1DE8427D3A696B` | `lvb-logo.png`, `lvb-symbol.png`, `USAGE.txt` |
| `mushhero-press-kit.zip` | 1374168 | `F46E37BFFF886D72187F470DA998E000FE64B9F99C8622FCAF9B701B07560496` | 공식 JPG 3개, Lv.B PNG 2개, `FACT_SHEET_EN/KO/JA/ZH-CN.txt` |
| `mushdash-press-kit.zip` | 1236568 | `61BBE31E60C9E68B7513139D02D94998A2782E94E1605D29D9FF77D4025800ED` | 공식 JPG 3개, Lv.B PNG 2개, `FACT_SHEET_EN/KO/JA/ZH-CN.txt` |

## Update procedure

1. `games.ts`의 검증 source와 실제 Store 정보를 먼저 확인한다.
2. 원본 byte를 해당 `/press/assets/<game>/` 경로에 저장하고 HTTP status·MIME·크기·해상도·SHA를 갱신한다.
3. `press.ts` manifest와 네 언어 fact sheet를 확인한 뒤 ZIP을 다시 만든다. 개발 소스·PSD·AI 등은 넣지 않는다.
4. ZIP entry를 모두 열어 integrity와 예상 목록을 확인하고 크기·SHA를 이 문서와 `press.ts`에 반영한다.
5. `npm run build`와 `scripts/prepare-production.ps1`로 public/dist 자산, 화면 링크, archive를 검증한다.
