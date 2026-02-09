# JB Money - REST API 연동 가이드

## 🚀 빠른 시작

### 1. API 모드 선택

앱은 두 가지 모드로 동작합니다:

- **Mock 모드** (기본값): 테스트 데이터 사용
- **Real API 모드**: 실제 서버 API 호출

### 2. 개발자 도구 사용

앱 화면 우측 하단의 ⚙️ 버튼을 클릭하여 개발자 도구 패널을 열 수 있습니다.

**개발자 도구 기능:**
- Mock ↔ Real API 모드 전환
- 계좌번호 설정
- Native Bridge 테스트

---

## 📡 API 명세

### Base URL
```
https://blackspoondev-sandbox.mxapps.io/rest/apiservice/v1
```

### 인증
Native Bridge를 통해 `accessToken`을 받아옵니다.

```javascript
// Native Bridge 요청
{
  "type": "accessTokenInfo",
  "callbackId": "tokenInfo",
  "ts": 1234567890
}

// Native Bridge 응답 (window.tokenInfo 콜백)
{
  "accessToken": "your_access_token_here"
}
```

### 엔드포인트

#### GET /user
사용자 및 계좌 정보 조회

**요청 파라미터:**
- `myBoxAccountNo` (string): 계좌번호

**헤더:**
```
Content-Type: application/json
Authorization: Bearer {accessToken}
```

**응답 예시:**
```json
{
  "name": "이동준",
  "phone": "01012341234",
  "UserInMyBoxDto": {
    "bankCode": "037",
    "accountNo": "1068011596267",
    "balance": 1000000,
    "investBalance": 0,
    "todayProfit": 0,
    "todayInterestAmount": 0,
    "todayZoneType": "NONE",
    "tommorrowZoneType": "INTEREST",
    "selectedRegionCode": "35510",
    "todayPowerWorkType": "NONE",
    "tomorrowPowerWorkType": "NONE",
    "selectedRegionName": "완주군"
  }
}
```

**Zone Type 매핑:**
- `NONE` → `interest` (기본값)
- `INTEREST` → `interest`
- `INTEREST_WORK` → `extreme`
- `POWER_WORK` → `balance`

**PowerWork Ratio 매핑:**
- `NONE` → `undefined`
- `RATIO_25` → `25`
- `RATIO_50` → `50`
- `RATIO_75` → `75`

---

## 🔧 개발 환경 설정

### 환경 변수 (.env)

```bash
# API 모드 설정
# 'false'로 설정하면 실제 REST API 호출
VITE_USE_MOCK_API=true

# MyBox 계좌번호 (실제 API 호출 시 사용)
VITE_MYBOX_ACCOUNT_NO=1068011596267
```

### Mock 모드 (개발용)

`.env` 파일에서 `VITE_USE_MOCK_API=true` 설정 시:
- 네트워크 요청 없이 Mock 데이터 반환
- Native Bridge 없이도 테스트 가능
- 빠른 개발 및 UI 테스트

### Real API 모드 (프로덕션)

`.env` 파일에서 `VITE_USE_MOCK_API=false` 설정 시:
- 실제 서버 API 호출
- Native Bridge에서 accessToken 필요
- 계좌번호 필요

---

## 🏗️ 코드 구조

### 파일 구조
```
/src/lib/api/
├── api-types.ts       # API 응답 타입 정의
├── rest-api.ts        # REST API 호출 함수
├── mappers.ts         # API ↔ App 타입 변환
└── types.ts           # 앱 내부 타입 정의

/src/lib/stores/
├── authStore.ts       # 사용자 인증 상태 관리
└── accountStore.ts    # 계좌 정보 상태 관리
```

### 주요 함수

#### `getUserInfo(accountNo: string)`
사용자 및 계좌 정보를 가져옵니다.

```typescript
import { getUserInfo } from '@/lib/api/rest-api';

const response = await getUserInfo('1068011596267');
// response: GetUserResponse
```

#### `mapApiResponseToUser(response)`
API 응답을 User 타입으로 변환합니다.

```typescript
import { mapApiResponseToUser } from '@/lib/api/mappers';

const user = mapApiResponseToUser(response);
// user: User
```

#### `mapApiResponseToAccount(response)`
API 응답을 Account 타입으로 변환합니다.

```typescript
import { mapApiResponseToAccount } from '@/lib/api/mappers';

const account = mapApiResponseToAccount(response);
// account: Account
```

---

## 🔄 Native Bridge 연동

### iOS (WebKit)

```swift
// accessToken 요청 받기
webView.configuration.userContentController.add(self, name: "BlackSpoonDevHandler")

func userContentController(_ userContentController: WKUserContentController, 
                          didReceive message: WKScriptMessage) {
    guard let body = message.body as? [String: Any],
          let type = body["type"] as? String,
          type == "accessTokenInfo" else { return }
    
    // accessToken 콜백 호출
    let js = """
    window.tokenInfo({
        accessToken: "\(yourAccessToken)"
    });
    """
    webView.evaluateJavaScript(js)
}
```

### Android

```kotlin
class BlackSpoonDevHandler(private val webView: WebView) {
    @JavascriptInterface
    fun postMessage(message: String) {
        val json = JSONObject(message)
        if (json.getString("type") == "accessTokenInfo") {
            // accessToken 콜백 호출
            webView.post {
                webView.evaluateJavascript("""
                    window.tokenInfo({
                        accessToken: "$yourAccessToken"
                    });
                """, null)
            }
        }
    }
}
```

---

## 🧪 테스트

### 1. Mock 모드에서 테스트
```bash
# .env 파일 설정
VITE_USE_MOCK_API=true

# 앱 실행
npm run dev
```

### 2. Real API 모드에서 테스트
```bash
# .env 파일 설정
VITE_USE_MOCK_API=false
VITE_MYBOX_ACCOUNT_NO=1068011596267

# 앱 실행 (Native Bridge 필요)
npm run dev
```

### 3. 개발자 도구로 전환
앱 실행 후 우측 하단 ⚙️ 버튼 클릭 → "Real API 모드로 전환" 버튼 클릭

---

## ⚠️ 주의사항

1. **Mock 모드 기본값**: 개발 편의를 위해 기본적으로 Mock 모드가 활성화되어 있습니다.
2. **Native Bridge 필수**: Real API 모드에서는 accessToken을 받기 위해 Native Bridge가 필수입니다.
3. **계좌번호 관리**: 환경변수 또는 Native Bridge를 통해 계좌번호를 전달해야 합니다.
4. **에러 처리**: API 호출 실패 시 자동으로 Mock 데이터로 폴백됩니다.

---

## 📞 문의

API 연동 관련 문의사항은 개발팀에 연락 주세요.
