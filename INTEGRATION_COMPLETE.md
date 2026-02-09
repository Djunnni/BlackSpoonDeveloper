# REST API 연동 완료!

REST API 연동이 완료되었습니다. 다음 기능들이 구현되었습니다:

## ✅ 구현된 기능

### 1. REST API 호출
- **Base URL**: `https://blackspoondev-sandbox.mxapps.io/rest/apiservice/v1`
- **GET /user**: 사용자 및 계좌 정보 조회
- **Native Bridge 인증**: accessToken 자동 요청

### 2. 타입 시스템
- `api-types.ts`: API 응답 타입 정의
- `mappers.ts`: API ↔ App 타입 자동 변환
- Zone Type, PowerWork Ratio 매핑 완료

### 3. 상태 관리
- `authStore`: 사용자 정보 관리 + API 연동
- `accountStore`: 계좌 정보 관리 + API 연동
- Mock/Real API 모드 자동 전환

### 4. Native Bridge 유틸리티
- `native-bridge.ts`: iOS/Android 통신 헬퍼
- accessToken 요청/수신 자동화
- 플랫폼 감지 (iOS/Android/Web)
- 탭 이동, 지역 선택 알림 등

### 5. 개발자 도구
- 우측 하단 ⚙️ 버튼으로 접근
- Mock ↔ Real API 모드 전환
- 계좌번호 설정
- Native Bridge 상태 확인
- AccessToken 테스트

## 🎯 사용 방법

### 개발 모드 (Mock 데이터)
```bash
# 기본값: Mock 모드로 시작
npm run dev
```

앱이 자동으로 테스트 데이터를 사용합니다. Native Bridge 없이도 모든 기능을 테스트할 수 있습니다.

### 프로덕션 모드 (Real API)

**방법 1: 환경 변수**
```bash
# .env 파일 수정
VITE_USE_MOCK_API=false
VITE_MYBOX_ACCOUNT_NO=1068011596267

npm run dev
```

**방법 2: 개발자 도구**
1. 앱 실행
2. 우측 하단 ⚙️ 버튼 클릭
3. "Real API 모드로 전환" 클릭

## 📱 Native Bridge 연동

### iOS 예시
```swift
// WebView 설정
let config = WKWebViewConfiguration()
config.userContentController.add(self, name: "BlackSpoonDevHandler")

// 메시지 수신
func userContentController(_ userContentController: WKUserContentController, 
                          didReceive message: WKScriptMessage) {
    guard let body = message.body as? [String: Any],
          let type = body["type"] as? String else { return }
    
    if type == "accessTokenInfo" {
        // AccessToken 반환
        let js = """
        window.tokenInfo({
            accessToken: "\(yourAccessToken)"
        });
        """
        webView.evaluateJavaScript(js)
    }
}
```

### Android 예시
```kotlin
webView.addJavascriptInterface(object {
    @JavascriptInterface
    fun postMessage(message: String) {
        val json = JSONObject(message)
        when (json.getString("type")) {
            "accessTokenInfo" -> {
                // AccessToken 반환
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
}, "BlackSpoonDevHandler")
```

## 🧪 테스트 시나리오

### 1. Mock 모드 테스트
1. 앱 실행
2. JB 머니 잔액 확인 (15,750,000원)
3. 계좌번호 확인 (123-456-789012)
4. Zone 전환 테스트

### 2. Real API 모드 테스트
1. 개발자 도구 열기 (⚙️)
2. "Real API 모드로 전환" 클릭
3. Native Bridge 상태 확인
4. "AccessToken 테스트" 클릭
5. 사용자 정보 확인 (이동준, 완주군)
6. 계좌번호 확인 (037-1068011596267)

### 3. Native Bridge 테스트
1. 네이티브 앱에서 WebView 열기
2. 개발자 도구 확인
   - Native Bridge: IOS 또는 ANDROID (초록색)
3. AccessToken 테스트 실행
4. 콘솔에서 accessToken 확인

## 📋 API 응답 매핑

```typescript
// API 응답
{
  "todayZoneType": "INTEREST_WORK",
  "todayPowerWorkType": "RATIO_50"
}

// 변환 후
{
  currentZone: "extreme",
  balanceRatio: 50
}
```

| API Zone Type | App Zone Type |
|--------------|---------------|
| NONE         | interest      |
| INTEREST     | interest      |
| INTEREST_WORK | extreme      |
| POWER_WORK   | balance       |

| API Ratio     | App Ratio |
|--------------|-----------|
| NONE         | undefined |
| RATIO_25     | 25        |
| RATIO_50     | 50        |
| RATIO_75     | 75        |

## 📁 파일 목록

```
/src/lib/api/
├── api-types.ts          # API 응답 타입
├── rest-api.ts           # REST API 호출
├── mappers.ts            # 타입 변환
└── types.ts              # 앱 타입

/src/lib/stores/
├── authStore.ts          # 사용자 상태
└── accountStore.ts       # 계좌 상태

/src/lib/utils/
└── native-bridge.ts      # Native Bridge 유틸

/src/app/components/
├── MainApp.tsx           # 메인 앱 (API 연동)
└── DevToolsPanel.tsx     # 개발자 도구

/.env                     # 환경 변수
/API_GUIDE.md            # 상세 가이드
```

## 🚀 다음 단계

### 추가 구현이 필요한 API
- **존 선택 API**: 내일 Zone 변경 저장
- **거래 내역 API**: 투자 히스토리 조회
- **지역 변경 API**: 사용자 지역 업데이트
- **포트폴리오 API**: 이자워크존/파워워크존 상세 정보

### 개선 사항
- [ ] API 에러 핸들링 강화
- [ ] 재시도 로직 추가
- [ ] 토큰 갱신 자동화
- [ ] 오프라인 모드 지원

## 💡 팁

- **빠른 테스트**: Mock 모드 사용
- **실제 연동**: Real API 모드 + Native Bridge
- **디버깅**: 개발자 도구의 Console 탭 확인
- **상태 확인**: 개발자 도구의 Native Bridge 상태 확인

---

**모든 준비가 완료되었습니다!** 🎉

이제 Native Bridge만 연결하면 실제 API와 통신할 수 있습니다.
