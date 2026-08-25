# MushDash EOS UserCloud 코드 감사

조사일: 2026-07-31

이 문서는 `E:\MushDash`의 현재 작업 트리를 읽기 전용으로 조사한 결과다. 실제 이용자 세이브 파일, 로그 payload, 계정 식별자 또는 설정의 비밀값은 열거나 기록하지 않았다. 공개 Privacy 문구에는 내부 클래스명·변수명이 아니라 아래 코드로 확인된 일반 데이터 범주만 반영한다.

## 1. 조사 기준

- 프로젝트: `E:\MushDash`
- Git top-level: `E:\MushDash`
- branch: `master`
- HEAD: `931e5008771349962b7ba20c4c69f2d60120f6dd`
- 원격 기준: `origin/master`와 HEAD 일치
- Unreal Engine: `MushDash.uproject`의 `EngineAssociation` `5.1`
- 온라인 provider: `Config/DefaultEngine.ini:2`의 `DefaultPlatformService=EIK`; runtime module은 `OnlineSubsystemEIK`를 연결
- 주의: 감사 시점 작업 트리에 미커밋 변경과 신규 파일이 존재한다. 따라서 이 문서는 HEAD 커밋만이 아니라 **2026-07-31 현재 작업 트리의 소스**를 설명한다.
- 공개 빌드 대응: 저장소에 release tag가 없고 배포된 Steam·Epic 빌드와 특정 commit을 연결하는 검증 가능한 provenance가 없어 `Production build correspondence not verified`로 둔다.

## 2. 조사한 파일

- `Source/MushDash/System/USaveManager.h`
- `Source/MushDash/System/USaveManager.cpp`
- `Source/MushDash/Data/MDServerSaveData.h`
- `Source/MushDash/Data/MDLocalSaveData.h`
- `Source/MushDash/System/MDGameInstance.h`
- `Source/MushDash/System/MDGameInstance.cpp`
- `Source/MushDash/System/UChallengeManager.cpp`
- `Source/MushDash/System/UServerManager.cpp`
- `Source/MushDash/System/MDCloudBackupManager.h/.cpp`
- `Source/MushDash/System/MDCloudRoundTripManager.h/.cpp`
- `Source/MushDash/MushDash.Build.cs`
- `Config/DefaultEngine.ini`과 `MushDash.uproject`의 provider·engine 선언
- Blueprint binary 문자열 참조 확인: `CAD_Profile.uasset`, `CAD_UpMenu.uasset`, `CAD_Confirm.uasset`, `CAD_GraphicSetting.uasset`, `CAD_Shop.uasset`

`Source`, `Config`, `Plugins`에서 `UserCloud`, `IOnlineUserCloud`, `ReadUserFile`, `WriteUserFile`, `DeleteUserFile`, `EnumerateUserFiles`, `SaveGameToSlot`, `LoadGameFromSlot`, JSON 직렬화와 SaveManager 관련 문자열을 검색했다. `DeleteUserFile`, `ClearFile`, `ClearFiles` 호출은 0건이다.

## 3. 정상 게임 흐름

### 다운로드

1. `UMDGameInstance::StartGameInstance`가 진단 모드가 아닐 때 `USaveManager`를 만든다 (`MDGameInstance.cpp:101-115`).
2. 온라인 로그인이 완료되면 `HandleLoginCompleted`가 `USaveManager::Initialize`를 호출한다 (`MDGameInstance.cpp:267-352`).
3. `Initialize`는 `LoadPlayerData`를 호출한다 (`USaveManager.cpp:15-23`).
4. `LoadPlayerData`는 프로필, 재화, 인벤토리, 이벤트, 주간 도전 파일을 각각 `ReadUserFile`로 요청한다 (`USaveManager.cpp:193-213`, `389-448`).
5. callback은 `GetFileContents`로 UTF-8 byte array를 받고 JSON을 각 struct로 역직렬화한다 (`USaveManager.cpp:479-562`).
6. 요청 거절, callback 실패, 빈 payload 또는 JSON parse 실패 시 해당 파일의 기본값을 한 번 적용한다. 클라우드 기본값 쓰기, 삭제, 자동 재시도는 하지 않는다 (`USaveManager.cpp:565-604`).

파일 목록 조회는 정상 SaveManager 로드 전제조건이 아니다. `EnumerateUserFiles`는 별도의 development backup·round-trip 진단에서만 사용된다.

### 업로드

1. `SetProfile`, `SetMoney`, `SetInventory`, `SetEvent`, `SetWeeklyChallenge`가 cache를 바꾸고 해당 dirty flag를 세운다 (`USaveManager.cpp:80-133`).
2. BlueprintCallable GameInstance setter, 주간 도전 갱신·보상, 구매 receipt 처리 등이 `SavePlayerData`를 호출한다 (`MDGameInstance.h:101-140`, `UChallengeManager.cpp:124-140`, `USaveManager.cpp:686-711`).
3. `SavePlayerData`가 변경된 struct만 JSON으로 만들고 `SaveSingleData`에 전달한다 (`USaveManager.cpp:145-180`).
4. `SaveSingleData`는 JSON 문자열을 UTF-8 byte array로 바꾸고 로그인된 `FUniqueNetId`와 고정 파일명을 `WriteUserFile`에 전달한다 (`USaveManager.cpp:289-358`).
5. 동일 파일의 중복 in-flight 요청은 거절한다. 성공 callback은 dirty flag를 지우고 같은 파일을 다시 읽어 cache를 확인한다. 실패 시 dirty flag를 유지하지만 자동 재시도하지 않는다 (`USaveManager.cpp:645-684`).

## 4. UserCloud 파일 계약

| 파일 key | 원본 object | 실제 payload | 쓰기 | 읽기 | 로컬 병행 | 삭제 |
|---|---|---|---|---|---|---|
| `PlayerProfile.json` | `FS_PlayerProfile` | JSON UTF-8 | profile dirty 시 | 로그인 후 정상 로드 | 없음 | 없음 |
| `PlayerMoney.json` | `FS_PlayerMoney` | JSON UTF-8 | money dirty 시 | 로그인 후 정상 로드 | 없음 | 없음 |
| `PlayerInventory.json` | `FS_PlayerInventory` | JSON UTF-8 | inventory dirty 시 | 로그인 후 정상 로드 | 없음 | 없음 |
| `PlayerEvent.json` | `FS_Event` | JSON UTF-8 | event dirty 시 | 로그인 후 정상 로드 | 없음 | 없음 |
| `PlayerChallenge.json` | `FS_WeeklyChallengeWrapper` | JSON UTF-8 | challenge dirty 시 | 로그인 후 정상 로드 | 없음 | 없음 |
| `TransactionIds.json` | `SavedTransactionIds` set | `{ "transactions": string[] }` JSON UTF-8 | 구매 receipt 처리 후 dirty 시 | `LoadTransactionIds` 본문이 주석 처리되어 정상 startup read는 비활성 | 없음 | 없음 |
| `MushDashCloudValidation.json` | development 진단 object | JSON UTF-8 | development round-trip 명령에서만 | 같은 진단 또는 reload에서만 | `Saved/CloudValidation`에 검증 증거 생성 | 없음 |

정상 6개 계약 파일명은 `USaveManager.h:138-143`과 development backup 계약 `MDCloudBackupManager.cpp:20-30`에서 일치한다. 진단 파일은 `MDCloudRoundTripManager.cpp:21-24`에 별도로 선언된다. 파일명은 계정 문자열·플랫폼 ID·주차·프로필 이름·버전 번호를 조합하지 않는 고정 key다. 계정별 namespace 선택은 SDK 호출의 `FUniqueNetId` 인자가 담당한다.

## 5. 실제 저장 필드

### `PlayerProfile.json`

`MDServerSaveData.h:7-38`

- `Tutorial`: 튜토리얼 진행 상태
- `PlayerIcon`: 선택한 프로필 아이콘 식별값
- `PlayerName`: 플레이어 표시 이름; 온라인 로그인에서 받은 nickname이 source (`MDGameInstance.cpp:347-354`)
- `PlayerNamePlate`: 선택한 이름표 식별값
- `PlayerAvatar`: 네 부위의 선택 아바타 식별값 배열

### `PlayerMoney.json`

`MDServerSaveData.h:42-60`

- `Cash`
- `Game`

두 개의 게임 내 재화 잔액이다. 코드만으로 공개 상품명이나 현금성 분류를 확정하지 않는다.

### `PlayerInventory.json`

`MDServerSaveData.h:64-100`

- `AvatarCap`
- `AvatarFace`
- `AvatarBody`
- `AvatarArmFoot`
- `PlayerIcon`
- `ProfileNamePlate`

각 값은 해당 꾸미기 항목의 보유 상태를 나타내는 정수 bit field다.

### `PlayerEvent.json`

`MDServerSaveData.h:104-118`

- `InfinityTowerMax`: Infinity Tower 최고 기록

### `PlayerChallenge.json`

`MDServerSaveData.h:121-164`

- `ChallengeID`: 도전 식별값
- `CurrentValue`: 현재 진행값
- `bIsCompleted`: 완료 여부
- `bRewardClaimed`: 보상 수령 여부
- `CurrentWeek`: 현재 주차 번호

wrapper의 `WeeklyChallenges` 배열에 위 진행 row가 저장된다. 전체 UTC timestamp는 정상 도전 payload에 없다.

### `TransactionIds.json`

`USaveManager.cpp:231-250`, `686-711`

- `transactions`: 처리한 구매 receipt의 transaction identifier 문자열 배열

목적은 동일 거래의 중복 처리를 확인하는 것이다. 쓰기 경로는 활성이나 load 구현은 주석 처리되어 있어, 현재 프로세스 재시작 후 중복 방지 동작은 소스만으로 보장되지 않는다. transaction identifier를 출력하는 로그 구문도 있어 release logging 정책을 별도로 검토해야 한다.

### development 진단 파일

`MDCloudRoundTripManager.cpp:186-210`

- `format_version`
- `store_marker`
- 임의 실행 nonce
- UTC timestamp
- 고정 validation text

이 파일은 `UE_BUILD_DEVELOPMENT`일 때 명시적 진단 명령으로만 생성되는 round-trip 검증 payload다. 정상 게임 저장 범주나 공개 Privacy의 이용자 gameplay 범주에는 합산하지 않는다. 이미 같은 파일이 있으면 진단은 덮어쓰지 않고 중단하며, 삭제 호출은 없다.

## 6. 계정 식별자와 payload 구분

- `ReadUserFile(*UserId, FileName)`과 `WriteUserFile(*UserId, FileName, Data)`는 로그인된 SDK 계정 식별자를 **호출 인자**로 사용한다 (`USaveManager.cpp:289-339`, `389-432`).
- 위 정상 저장 struct와 transaction JSON에는 Steam ID, Epic Account ID, EOS Product User ID 필드가 없다.
- 이메일 주소, IP 주소, 기기 식별 정보, 다른 플레이어 계정 식별자, 채팅·음성 데이터 필드도 없다.
- `PlayerName`은 계정 ID가 아니라 온라인 로그인에서 받은 표시 이름이며 실제 profile payload에 포함된다.
- 주간 도전에는 `CurrentWeek`이 있고 development 진단에는 UTC timestamp가 있으나, 정상 profile·money·inventory·event·transaction payload에 timestamp 필드는 없다.

## 7. 로컬 저장과 UserCloud의 관계

`MDLocalSaveData.h:11-167`, `USaveManager.cpp:181-228`, `360-477`

- 논리적 로컬 SaveGame slot: `PS`
- source object: `FL_PlayerSetting`
- 저장 내용:
  - 언어·언어 index·수동 선택 여부
  - 자동 서버 지역 값, 매칭 지역·수동 선택 여부
  - 해상도, frame, window mode, VSync, texture·shadow·GI·post-processing·reflection·anti-aliasing 품질
  - master, background, environment, effect, UI, character audio volume
- `FL_PlayerSetting`을 JSON으로 만든 뒤 `USaveManager::SavedJson_Setting`에 넣어 Unreal `SaveGameToSlot`로 저장하고, `LoadGameFromSlot`에서 다시 JSON으로 읽도록 작성되어 있다.
- 코드가 `PS_<UserId>` 문자열을 계산하지만 실제 `SaveGameToSlot`과 `LoadGameFromSlot`에는 고정 `PS`를 전달한다. 계정 ID를 로컬 파일명에 쓰는 동작은 현재 코드에 없다.
- 로컬 설정은 UserCloud의 다섯 gameplay file 또는 transaction file에 병합하거나 업로드하지 않는다. 반대로 UserCloud download를 로컬 SaveGame slot에 기록하지도 않는다.
- 최신 데이터 선택, timestamp 비교, Steam·Epic 간 충돌 병합 로직은 없다. UserCloud failure 시 gameplay cache에는 파일별 기본값을 적용하고, 로컬 설정 slot을 fallback으로 사용하지 않는다.
- 이 감사는 실제 이용자 local save를 열지 않았으므로 packaged runtime에서의 로컬 `PS` slot round-trip은 별도 검증 항목으로 남긴다.

## 8. 백업·진단 경로

- development backup 명령은 계정의 UserCloud 파일 목록을 열거하고 정상 6개 계약 파일을 읽어 프로젝트 `Saved/CloudBackups` 아래에 증거 복사본을 만든다 (`MDCloudBackupManager.cpp:20-30`, `77-79`, `119-146`, `222-330`). 정상 게임 실행 경로가 아니며 UserCloud에 쓰거나 삭제하지 않는다.
- development round-trip 명령은 전용 validation 파일 하나를 열거·쓰기·읽기하고 byte count, digest, payload equality를 비교한다 (`MDCloudRoundTripManager.cpp:306-420`, `470-543`).
- 진단 모드에서는 정상 `USaveManager`를 만들지 않아 gameplay save와 진단 payload를 섞지 않는다 (`MDGameInstance.cpp:101-115`, `290-336`, `657-661`).

## 9. 삭제와 보유기간

- `Source`, `Config`, `Plugins`에서 `DeleteUserFile`, `ClearFile`, `ClearFiles` 프로젝트 호출: 0건.
- 게임 UI에서 UserCloud 파일을 삭제하는 C++ 진입점, 계정 연결 해제 시 삭제, 프로필 초기화 시 cloud delete, delete callback, delete retry: 확인되지 않음.
- read failure는 기본값만 cache에 적용하며 cloud write 또는 delete를 하지 않는다.
- 정상 UserCloud 파일에 TTL, 만료 timestamp, 자동 삭제 schedule 또는 보유기간 설정이 없다.
- 게임 삭제 또는 플랫폼 계정 연결 해제에 반응해 UserCloud 파일을 삭제하는 코드도 없다.
- EOS/Unreal 온라인 서비스 계층에는 사용자 파일 삭제 API가 존재하지만, 현재 MushDash 프로젝트는 이 호출을 사용하지 않는다. 서비스 기능의 존재와 현재 게임 구현을 구분한다.
- 따라서 데이터는 온라인 저장 기능 제공을 위해 유지되며, 유효한 요청·서비스 종료·처리 목적 종료 시 적용 법령과 플랫폼·EOS 기술 절차에 따라 처리해야 한다. 소스만으로 고정 보유기간을 만들 수 없다.
- 이용자는 `lvb909@naver.com`으로 열람·정정·삭제·처리정지를 요청할 수 있다. 현재 저장소에는 이메일 발신자와 특정 UserCloud 계정의 소유 관계를 확정하는 검증된 운영 도구가 없으므로 표시 이름만으로 처리하지 않는다. 상세 절차와 한계는 `PRIVACY_REQUEST_RUNBOOK.md`에 둔다.
- Epic Developer Portal의 조직 단위 `Delete User`는 여러 제품의 데이터와 계정 연결에 영향을 줄 수 있으므로 MushDash 파일 삭제의 기본 절차로 사용하지 않는다. 실제 영향 범위와 권한은 운영 계정 및 Epic 지원을 통해 확인해야 한다.

## 10. 공개 Privacy에 반영한 범주

- 튜토리얼 진행 상태
- 플레이어 표시 이름과 선택한 아이콘·이름표·아바타 또는 커스터마이징 정보
- 게임 내 재화 잔액
- 보유 아이템·꾸미기 항목과 인벤토리
- Infinity Tower 최고 기록
- 주간 도전 ID·진행값·완료 여부·보상 수령 여부·주차
- 중복 구매 처리를 방지하기 위한 거래 식별자
- 로컬에만 저장되는 언어·매칭 지역·그래픽·오디오 설정의 분리
- 계정 식별자는 SDK namespace 선택에 쓰이지만 확인한 save JSON 필드는 아니라는 구분
- 게임 내 UserCloud 삭제 호출과 확정 보유기간이 없다는 제한

내부 파일명, C++ field명, 개발 진단 payload는 공개 Privacy 본문에 노출하지 않는다.

## 11. 미확정·후속 확인

1. 현재 작업 트리와 실제 Steam·Epic 공개 빌드의 commit·package provenance.
2. Epic Developer Portal과 EOS 지원의 제품별 UserCloud 처리 권한, 조직 단위 `Delete User`의 실제 영향 범위.
3. 게임 삭제, 플랫폼 계정 연결 해제, EOS 계정 삭제 때 UserCloud가 실제로 어떻게 처리되는지.
4. 이용자 요청 시 Steam·Epic별 계정 소유 확인 절차. 현재 구현만으로 확정된 절차는 없다.
5. `TransactionIds.json` load 비활성 상태와 transaction identifier release log의 제품 의도·보안 검토.
6. 로컬 `PS` slot의 packaged runtime round-trip과 Steam·Epic 계정 전환 시 동작.
7. 향후 로그인된 이용자가 자신의 정상 gameplay·transaction 파일 여섯 개만 삭제하는 게임별 기능과 Steam·Epic별 부분 실패·재시도 검증.

## 12. 보안 finding 분리

- 경로: `E:\MushDash\Config\DefaultEngine.ini`
- 유형: EOS/EIK artifact 식별자, downloadable-client credential, Player/Title Data Storage용 data-encryption material, Android development file-server token 유형의 설정 key. 실제 값·일부 값·길이·hash는 기록하지 않는다.
- Git 상태: `Config/DefaultEngine.ini`는 현재 MushDash Git에서 tracked다.
- 공개 노출: configured `origin`은 사설 NAS 주소이며 공개 GitHub remote는 확인되지 않았다. 따라서 Git 이력 노출은 확인되지만 공개 저장소 노출은 현재 로컬 정보로 입증되지 않았다. 공개 package 및 실제 Store-live artifact 포함 범위는 별도 release inventory가 필요하다.
- 기존 finding 중복: `E:\Codex\MushDash\SECURITY.md`의 SEC-002·SEC-003과 `SECURITY_REMEDIATION.md`에 이미 실제 값 없이 분류·대응 상태가 기록돼 있다. 이번 작업에서는 중복 finding을 만들지 않고 Privacy와 분리했다.
- 별도 검토: 기존 보안 문서의 `Accepted Risk`·`Pending Human Action`과 Review Trigger를 따른다. 이번 작업에서 credential을 수정·삭제·회전하지 않았다.
- 거래 식별자 로그: `USaveManager.cpp:690,713`은 처리한 transaction identifier를 runtime log에 기록한다. 이는 위 credential finding과 별개의 개인정보·로그 최소화 점검 항목이며 공개 Privacy에는 노출하지 않는다. 현재 게임 코드는 수정하지 않았고 release logging 정책 검토 대상으로 유지한다.
