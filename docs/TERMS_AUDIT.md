# Terms Audit

상태: `Approved for publication / Effective 2026-08-12`. 이 문서는 Lv.B 게임 이용약관의 사실 근거와 후속 확인 항목을 관리한다. 법률 자문을 대체하지 않으며, 운영자와 필요 시 대한민국 자격 법률 전문가의 검토가 필요하다.

## 참고자료 사용 범위

- 2026-08-12에 [올라프게임즈 게임 이용약관](https://allafgames0102.wixsite.com/mysite/about-1)을 읽고 목적, 정의, 변경, 이용자 의무, 서비스 변경, 구매·환불, 계정·데이터, 금지행위, 개인정보, 책임, 준거법·분쟁이라는 조항 범주만 참고했다.
- 원문 문장과 영문 번역은 복제하지 않았다. Lv.B 약관은 `site/src/data/terms.ts`의 한국어 기준 원문을 먼저 작성하고 실제 게임·플랫폼 구조에 맞춰 독립적으로 구성했다.
- 환불·면책·관할 문구는 2026-08-12 현재 국가법령정보센터의 [전자상거래법 제17조](https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1022341977), [약관법 제6조부터 제14조](https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900589959)를 참고했다. 강행법규상 소비자 권리, 고의·중과실 책임과 법정 관할을 배제하지 않는 방향만 반영했으며 구체적 사건에 대한 법률 판단은 하지 않는다.

## 의도적으로 채택하지 않은 내용

- Steam의 특정 플레이 시간처럼 바뀔 수 있는 고정 환불 수치.
- Lv.B가 제공하지 않는 Nintendo 플랫폼 관련 내용.
- 실제 판매가 확인되지 않은 DLC, 시즌패스 또는 특정 인게임 상품 제공 주장.
- 모든 게임에 대한 지속적 업데이트·패치의 영구 보장.
- 기기·동기화·외부 서비스 원인을 포함한 모든 데이터 유실 책임의 전면 면제.
- 플랫폼 정책이 대한민국 법률이나 강행법규상 소비자 권리보다 항상 우선한다는 표현.
- 회사 소재지 법원의 무조건적인 전속 관할.
- 적절한 고지·동의 절차 확인 없이 구매 또는 실행만으로 모든 조항에 동의한 것으로 보는 표현.
- 채팅·UGC·독립적인 영구정지 시스템이 존재한다고 전제하는 제재 조항.

## 실제 Lv.B 기능 근거

- Steam·Epic 빌드: `E:\MushDash\Config\Custom\Steam\DefaultEngine.ini`, `Config\Custom\Epic\DefaultEngine.ini`, `Source\MushDash.Target.cs`에 스토어별 빌드 구성이 있다.
- EOS 온라인 기능: `Config\DefaultEngine.ini`, `Source\MushDash\System\EIKServerManager.cpp`, `UServerManager.cpp`에서 Steam/Epic 계정 연동, EOS 로그인, Lobby·Session 및 P2P listen 연결을 확인했다.
- 저장: `USaveManager.cpp`, `MDLocalSaveData.h`, `MDServerSaveData.h`에서 기기 로컬 설정과 EOS UserCloud 게임 데이터를 구분한다. 공개 세부 범주는 Privacy와 `PRIVACY_USERCLOUD_AUDIT.md`를 따른다.
- 계정·서버: 별도 Lv.B 회원가입이나 자체 중앙 계정·게임 서버·개인정보 DB는 확인되지 않았다. 온라인 경기는 플랫폼/EOS 계정과 listen/P2P 구조를 사용한다.
- 구매 코드: `UServerManager.cpp`에 플랫폼 checkout·영수증 조회, `USaveManager.cpp`에 거래 식별자 중복 방지와 offer 처리, Content에 상점 UI 자산이 있다. 그러나 `MDGameInstance.h`의 공개 `PurchaseOffer` 경로는 현재 no-op이고 실제 스토어 상품 판매 상태는 코드만으로 확인할 수 없다. 따라서 약관은 게임 또는 별도 유료 콘텐츠가 플랫폼에서 실제 제공되는 경우에만 적용되는 조건부 문구를 사용하며 DLC·시즌패스를 주장하지 않는다.
- 제재·커뮤니케이션: C++ source, config와 관련 asset 명칭에서 별도 ban, 채팅, 음성 채팅 또는 UGC 업로드 기능을 확인하지 못했다. 바이너리 Blueprint 자산만으로 부재를 완전히 증명할 수 없으므로 실제 패키지 기능 변경 시 다시 감사한다.
- `E:\MushDash` 작업 트리는 사용자 개발 변경이 있는 상태이며 이번 감사에서는 읽기만 했다.

## 약관 정책 결정

- Mush Dash 게임 본체는 Steam과 Epic Games Store에서 판매 중이며 홈페이지 직접 결제는 없다. 게임 본체의 구매·환불은 구매 플랫폼의 절차와 적용 법령에 따른다. 별도 유료 콘텐츠는 실제 제공되는 경우에만 적용되는 조건부 문구를 유지한다.
- Lv.B 자체 계정이 아닌 Steam 또는 Epic 계정과 EOS 기반 온라인 기능을 설명한다.
- 업데이트·기능 변경 가능성은 두되 영구적인 지원을 보장하지 않는다.
- 온라인 기능 종료는 합리적으로 가능한 사전 안내와 법령·플랫폼 절차를 전제로 한다.
- 저장 무결성을 절대 보장하지 않지만 Lv.B의 고의·중과실 책임과 강행법규상 권리를 배제하지 않는다.
- 금지행위는 비인가 프로그램, 부정한 데이터 변조, 악의적 취약점 이용, 정상 이용 방해, 법령·권리·플랫폼 정책 위반으로 한정한다.
- 이용 제한은 당시 기술적으로 가능한 필요·비례 조치로만 설명하며 독립적인 영구정지 기능을 약속하지 않는다.
- 대한민국 법을 준거법으로 하되 이용자에게 적용되는 강행법규상 권리를 보존하고, 관할은 관계 법령에 따른다.
- 약관 변경은 중요한 내용을 적용 전에 합리적인 방법과 기간으로 알리고 필요한 동의 절차를 따르며, 변경 전 이용관계에 관한 법정 권리를 부당하게 소급 제한하지 않는다. 법적 근거와 운영 절차가 확정되지 않은 고정 7일·30일 기간은 두지 않는다.

## 게임 내 고지 구조 감사

2026-08-12에 `E:\MushDash`의 C++ source, config, 프로젝트·플러그인 설정, UI·image·map asset 경로와 주요 Main Menu·Settings·Credits Blueprint binary의 검색 가능한 문자열을 읽기 전용으로 확인했다. Blueprint graph 전체 의미나 실제 공개 package 동작을 완전히 증명하는 감사는 아니므로 최종 출시 빌드에서 수동 확인한다.

| 분류 | 결과 |
|---|---|
| Existing | Steam·Epic 계정 로그인과 EOS 온라인 기능, Main Menu·Settings·Credits UI asset 자체는 존재한다. Steam·Epic 공개 store page는 게임 본체 구매와 플랫폼 약관을 제공한다. |
| Missing | Terms, Privacy, EULA, Agreement, Legal, Consent/Agree 또는 `lvb.kr` 링크·URL launch 진입점을 source·config·관련 UI asset 이름 및 검색 가능한 문자열에서 확인하지 못했다. 약관 버전 저장, 최초 실행 확인, 기존 이용자 대상 변경 고지 기록도 확인되지 않았다. |
| Recommended | Main Menu 또는 Settings에 게임 언어별 Terms·Privacy 링크를 제공한다. 약관을 실제 동의 계약으로 운영할 경우 최초 실행 또는 중요한 변경 시 별도 고지·확인 UI와 버전 기록이 필요한지는 법률 검토 후 별도 MushDash 개발 작업으로 결정한다. 현재 약관은 이런 Agree 기능이 이미 있다고 표현하지 않는다. |

권장 공개 경로는 다음과 같다.

| 게임 언어 | Terms | Privacy |
|---|---|---|
| EN | `https://lvb.kr/terms/` | `https://lvb.kr/privacy/` |
| KO | `https://lvb.kr/ko/terms/` | `https://lvb.kr/ko/privacy/` |
| JA | `https://lvb.kr/ja/terms/` | `https://lvb.kr/ja/privacy/` |
| ZH-CN | `https://lvb.kr/zh-cn/terms/` | `https://lvb.kr/zh-cn/privacy/` |

## 동의·변경 고지와 운영 결정

- 현재 홈페이지 route만으로 게임 구매자에게 약관이 계약 전에 제시되거나 동의가 기록되는 것은 아니다. 실제 시행 전에 게임 시작 화면, 최초 온라인 이용, 업데이트 고지 또는 플랫폼 페이지 중 어떤 경로로 최신 약관을 제시할지 결정해야 한다.
- 약관 변경 시 버전, 고지일, 시행일, 고지 수단과 필요한 동의 기록을 어떻게 관리할지 확정해야 한다.
- 공식 변경 고지 채널로 Steam News, 게임 내 공지, 공식 웹사이트 또는 Discord 중 무엇을 사용할지는 아직 정하지 않았다. 중요한 변경을 이용자가 실제로 확인할 수 있는 주 채널과 보조 채널, 게시 책임자, 증거 보관 방법을 운영자가 결정해야 한다.
- 변경 이전에 발생한 이용관계의 법정 권리를 부당하게 소급 제한하지 않는 의미를 네 언어 3조에 동일하게 반영했다.

## 플랫폼 Terms/EULA 후속 확인

- Steam Subscriber Agreement는 게임별 추가 Subscription Terms가 있을 수 있음을 밝히지만, 공개 Steamworks 문서와 공개 store page만으로 Mush Dash 앱에 Lv.B Custom EULA를 등록할 수 있는 정확한 Portal 필드나 현재 등록 여부를 확인하지 못했다. 권한 있는 Steamworks에서 Mush Dash 앱의 Store Admin·Legal·Custom EULA 관련 설정과 외부 website/legal link를 `Manual Portal Check`한다.
- Epic Games Store EULA는 개발자와 이용자 사이의 Software Specific Terms가 거래 중 제시될 수 있음을 밝힌다. 그러나 공개 문서만으로 Mush Dash 제품의 Developer Portal EULA·Legal 필드 및 Epic Launcher 노출 상태는 확인되지 않았다. Product·Store Settings와 offer별 표시 방식을 `Manual Portal Check`한다.
- 이용자에게 연결하는 외부 플랫폼 약관은 [Steam Subscriber Agreement](https://store.steampowered.com/subscriber_agreement/)와 [Epic Games Store EULA](https://legal.epicgames.com/store/eula?lang=en-US)다. Lv.B Terms는 이 플랫폼 구매약관을 대체하지 않고, 플랫폼 약관이 존재한다는 이유로 Lv.B의 게임 이용 조건이 불필요하다고 보지도 않는다.
- 실제 유료 offer가 활성화되어 있는지 Steamworks·Epic Developer Portal의 상품·카탈로그 설정과 출시 package에서 별도로 확인한다. 활성 상품이 있다면 상품 유형, 가격 표시, 청약철회 안내와 지급·복구 흐름을 다시 감사한다.

## 구매 상태 감사

- 2026-08-12 공개 Steam과 Epic Games Store page에서 Mush Dash Base Game의 구매 UI를 확인했다. Terms는 게임 본체의 플랫폼 판매를 가정형으로 숨기지 않고, Lv.B 홈페이지가 직접 판매·결제를 처리하지 않는다는 사실을 함께 표시한다.
- Epic 공개 page에는 `In-Game Purchases` 표시가 있으나 이것만으로 특정 인게임 offer가 현재 실제 client에서 구매 가능한지 확정하지 않는다.
- source에는 checkout, receipt 조회, 특정 offer 처리와 transaction identifier 저장 코드가 있으나 `MDGameInstance.h`의 BlueprintCallable `PurchaseOffer` 본문은 현재 no-op이다. 실제 Steam·Epic catalog와 공개 client를 확인하기 전에는 인게임 유료 offer 활성 상태를 `미확정`으로 유지한다.

## Terms 버전 관리 원칙

- 공개 문서에는 `Last updated`와 승인된 `Effective date`를 구분해 표시한다. 두 날짜는 사용자 승인 운영 배포일인 `2026-08-12`로 확정했다.
- 배포 승인 시 당시 `site/src/data/terms.ts`의 정규화 snapshot 또는 동등한 내부 archive를 이전 버전과 함께 보존한다. 이번 작업에서는 public archive route를 만들지 않는다.
- 각 버전에 적용 언어, 최종 수정일, 시행일, 주요 변경 요약, 고지 채널과 고지 시점을 내부 기록으로 남긴다.
- 변경 시 네 언어 section ID·순서·법적 의미를 함께 검토하고 `prepare-production.ps1` 검증을 통과시킨다.

## npm audit 2026-08-12

`npm audit --json`, `npm ls`, `npm outdated`, `npm explain`을 실행했다. 프로젝트가 build 도구를 모두 `dependencies`에 두어 npm 분류상 production dependency tree에 포함되지만, 아래 세 패키지는 정적 사이트 runtime이 아니라 check/build 경로에서만 사용되고 생성된 `dist`에는 포함되지 않는다.

| package | advisory / severity | 현재 경로 | 현재 → 최소 수정 | 정적 production 영향 | 판정 |
|---|---|---|---|---|---|
| `fast-uri` | `GHSA-7p8r-x3mc-p8w7` / High | `@astrojs/check` → language server → `ajv` | `3.1.4` → `3.1.5` | URL 정책 검사를 공격자 입력으로 수행하는 공개 runtime이 없고 dist 포함 0건 | Build/dev only · Not reachable in static output · Needs update |
| `js-yaml` | `GHSA-5p4m-2wfm-xmqj` / High | `astro`·internal helpers | `4.3.0` → `4.3.1` | 신뢰되지 않은 YAML을 받는 서버가 없고 repository build 입력만 처리하며 dist 포함 0건 | Build/dev only · Not reachable in static output · Needs update |
| `nanoid` | `GHSA-2v37-7h3g-55p8` / High | `astro` → `vite` → `postcss` | `3.3.16` → `3.3.17` | 공격자 제어 size로 custom generator를 호출하는 공개 runtime이 없고 dist 포함 0건 | Build/dev only · Not reachable in static output · Needs update |

- 세 수정 버전은 현재 의존 범위 안의 patch release라 major 변경은 필요하지 않다. 그러나 Terms 감사와 분리된 작업에서 lockfile만 최소 갱신한 뒤 clean install, check, build, production preparation과 dist 비교를 다시 수행한다.
- `npm outdated`는 direct dependency 중 Astro `7.1.6`의 wanted/latest `7.2.1`을 보고했다. 취약점 해소를 이유로 이 minor upgrade를 이번 작업에서 자동 수행하지 않았다.
- 현재 정적 Netlify 배포에 원격 요청으로 실행되는 공격 경로는 없어 세 finding을 Terms 배포의 직접 차단 사유로 판정하지 않는다. 다만 Netlify build가 장기간 취약 버전을 설치하지 않도록 patch lockfile 갱신은 다음 보안 유지보수 작업으로 권고한다.

## 시행 전 게이트

- 한국어 기준 원문과 EN·JA·ZH-CN 번역의 법적 의미를 사용자와 필요 시 법률 전문가가 검토한다.
- `Last updated`와 시행일은 모두 `2026-08-12`로 확정해 네 언어에 함께 반영한다. 실제 게임·플랫폼의 고지 및 동의 경로는 후속 운영 확인 항목으로 유지한다.
- Privacy의 `2026-08-03` 최종 수정일·시행일과 처리 사실은 Terms 배포 때문에 변경하지 않는다.
- 최종 시행 전에 Steam/Epic별 약관 노출·동의 방식, 환불 문의 경로, 온라인 기능 종료 고지 채널, 기술적으로 가능한 이용 제한 조치를 실제 운영과 대조한다.
