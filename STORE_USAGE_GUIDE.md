# Store 사용 가이드

## 🎯 개요

이 앱은 Zustand를 사용한 전역 상태 관리로 구성되어 있습니다. 모든 UI 컴포넌트는 store에서 데이터를 가져와 표시합니다.

## 📦 Store 구조

### 1. **authStore** - 인증 상태 관리
- 사용자 로그인/로그아웃
- 사용자 정보 (이름, 이메일, 지역 등)
- 인증 상태 확인

### 2. **accountStore** - 계좌 상태 관리
- JB 머니 잔액
- 오늘 발생한 이자
- 일 수익률
- 현재 투자중인 존 / 내일 투자할 존
- 존 선택 (이자존, 익스트림존, 밸런스존)

### 3. **investmentStore** - 투자 분석 상태 관리
- 투자 내역 조회
- 지역 내 순위

## 🚀 현재 적용된 페이지들

### 1. MainApp (메인 페이지)
**사용하는 Store:**
- `authStore`: 사용자 정보, 지역 선택 여부
- `accountStore`: 잔액, 이자, 수익률, 존 정보

**주요 기능:**
```tsx
const { user } = useAuthStore();
const { account, fetchAccount, selectZone } = useAccountStore();

// 계좌 정보 로드
useEffect(() => {
  fetchAccount();
}, []);

// 지역 확인
const hasRegion = user?.regionCode && user.regionCode !== "000000";
```

### 2. ReportPage (투자 분석 페이지)
**사용하는 Store:**
- `investmentStore`: 투자 내역, 지역 순위
- `accountStore`: 계좌 정보

**주요 기능:**
```tsx
const { records, ranking, fetchInvestmentRecords, fetchRegionalRanking } = useInvestmentStore();

// 데이터 로드
useEffect(() => {
  fetchInvestmentRecords();
  fetchRegionalRanking();
}, []);
```

### 3. SettingsPage (설정 페이지)
**사용하는 Store:**
- `authStore`: 사용자 정보, 로그아웃
- `regionApi`: 지역 목록, 지역 설정

**주요 기능:**
```tsx
const { user, logout, updateUser } = useAuthStore();

// 지역 설정
const handleRegionSave = async () => {
  const updatedUser = await regionApi.setUserRegion(selectedRegionCode);
  updateUser(updatedUser);
};

// 로그아웃
const handleLogout = async () => {
  await logout();
  navigate('/login');
};
```

## 🔐 인증 보호

모든 페이지는 `ProtectedRoute` 컴포넌트로 감싸져 있어 로그인하지 않으면 접근할 수 없습니다.

```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <MainApp />
    </ProtectedRoute>
  }
/>
```

## 💾 Mock 데이터 모드

현재 `.env` 파일에서 `VITE_USE_MOCK_API=true`로 설정되어 있어 Mock 데이터를 사용합니다.

### Mock 데이터 내용:
- **사용자**: 홍길동 (user@example.com)
- **잔액**: 15,750,000원
- **오늘 이자**: 329원
- **일 수익률**: +0.33%
- **현재 존**: 이자존
- **투자 내역**: 6개의 샘플 내역
- **지역 순위**: 서울특별시 1,247명 중 89위

### 실제 API로 전환하기:
1. `.env` 파일 수정:
```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://your-real-api.com
```

2. 백엔드 API 엔드포인트가 준비되면 자동으로 실제 데이터를 사용합니다.

## 🎨 UI 데이터 흐름

### 메인 페이지 (/)
```
1. 페이지 로드
   ↓
2. authStore에서 사용자 정보 가져오기
   ↓
3. accountStore.fetchAccount() 호출
   ↓
4. API에서 계좌 정보 가져오기 (또는 Mock 데이터)
   ↓
5. UI에 표시: 잔액, 이자, 수익률, 존 정보
```

### 투자 분석 페이지 (/analysis)
```
1. 페이지 로드
   ↓
2. investmentStore.fetchInvestmentRecords() 호출
3. investmentStore.fetchRegionalRanking() 호출
   ↓
4. API에서 투자 내역 + 순위 가져오기
   ↓
5. UI에 표시: 투자 내역, 차트, 순위
```

### 존 선택 흐름
```
1. 사용자가 내일 투자할 존 선택
   ↓
2. 지역 선택 여부 확인 (익스트림/밸런스존만)
   ↓
3. 설정 모달 열기 (테마 또는 비율 선택)
   ↓
4. accountStore.selectZone() 호출
   ↓
5. API로 선택 저장
   ↓
6. account 상태 업데이트
   ↓
7. UI 자동 반영
```

## 🔄 상태 업데이트 방법

### 1. 자동 업데이트 (Zustand)
Store의 상태가 변경되면 해당 상태를 사용하는 모든 컴포넌트가 자동으로 리렌더링됩니다.

```tsx
// Store에서 상태 변경
await selectZone({ zone: 'extreme', theme: '미국 테크' });

// 자동으로 MainApp의 account가 업데이트되고 UI 반영됨
```

### 2. 수동 새로고침
필요한 경우 명시적으로 데이터를 다시 가져올 수 있습니다.

```tsx
const { fetchAccount } = useAccountStore();

// 버튼 클릭 시 새로고침
<button onClick={() => fetchAccount()}>
  계좌 정보 새로고침
</button>
```

## 📱 로그인 테스트

Mock 모드에서는 아무 이메일/비밀번호로 로그인 가능합니다:

```
이메일: user@example.com (또는 아무거나)
비밀번호: password (또는 아무거나)
```

로그인하면 자동으로 `localStorage`에 토큰이 저장되고, 모든 API 요청에 자동으로 포함됩니다.

## 🛠 개발 팁

### 1. 새로운 페이지에서 Store 사용하기
```tsx
import { useAccountStore } from '../../lib/stores/accountStore';

function MyPage() {
  const { account, isLoading } = useAccountStore();
  
  if (isLoading) return <div>로딩중...</div>;
  
  return <div>{account?.balance}</div>;
}
```

### 2. Store 상태 확인 (개발자 도구)
```tsx
// 콘솔에서 현재 상태 확인
import { useAccountStore } from './lib/stores/accountStore';
console.log(useAccountStore.getState());
```

### 3. 에러 처리
```tsx
const { error, clearError } = useAccountStore();

if (error) {
  return (
    <div className="error">
      {error}
      <button onClick={clearError}>닫기</button>
    </div>
  );
}
```

## 🔍 디버깅

Zustand DevTools를 사용하려면:

1. `zustand/middleware` 임포트
2. Store 생성 시 `devtools` 미들웨어 추가

```tsx
import { devtools } from 'zustand/middleware';

export const useAccountStore = create<AccountState>()(
  devtools(
    (set) => ({
      // ... 상태 정의
    }),
    { name: 'AccountStore' }
  )
);
```

## 📊 데이터 구조

### User (사용자)
```typescript
{
  id: string;
  name: string;
  email: string;
  regionCode?: string; // "110000" = 서울, "000000" or null = 미선택
}
```

### Account (계좌)
```typescript
{
  balance: number;          // JB 머니 잔액
  todayInterest: number;    // 오늘 발생한 이자
  dailyReturnRate: number;  // 일 수익률 (0.0033 = 0.33%)
  currentZone: Zone;        // 오늘 투자중인 존
  nextZone: Zone;           // 내일 투자할 존
  extremeTheme?: string;    // 익스트림존 테마
  balanceRatio?: number;    // 밸런스존 비율 (25, 50, 75)
}
```

### InvestmentRecord (투자 내역)
```typescript
{
  id: string;
  date: string;             // "2026-02-08"
  zone: Zone;               // "interest" | "extreme" | "balance"
  investedAmount: number;   // 투자 금액
  profit: number;           // 수익금
  returnRate: number;       // 수익률
}
```

## ✅ 체크리스트

실제 API 연동 전 확인사항:

- [ ] `.env`에서 `VITE_USE_MOCK_API=false` 설정
- [ ] `VITE_API_BASE_URL`에 실제 API URL 입력
- [ ] 백엔드 API 엔드포인트가 타입 정의와 일치하는지 확인
- [ ] 토큰 인증 방식이 일치하는지 확인 (Bearer token)
- [ ] CORS 설정 확인
- [ ] API 응답 형식이 타입 정의와 일치하는지 확인
