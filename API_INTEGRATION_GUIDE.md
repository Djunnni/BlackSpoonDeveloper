# API 연동 가이드

이 프로젝트는 Zustand를 사용한 상태관리와 Axios를 사용한 API 연동 구조를 갖추고 있습니다.

## 📁 프로젝트 구조

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # Axios 클라이언트 설정
│   │   ├── types.ts           # API 타입 정의
│   │   └── services.ts        # API 서비스 함수들
│   ├── stores/
│   │   ├── authStore.ts       # 인증 상태 관리
│   │   ├── accountStore.ts    # 계좌 상태 관리
│   │   └── investmentStore.ts # 투자 분석 상태 관리
│   └── hooks/
│       ├── useAuth.ts         # 인증 훅
│       └── useRequireAuth.ts  # 인증 필수 훅
└── app/
    └── components/
        ├── ProtectedRoute.tsx # 인증 보호 라우트
        └── pages/
            └── LoginPage.tsx  # 로그인 페이지
```

## 🚀 시작하기

### 1. 환경 변수 설정

`.env` 파일을 생성하고 API URL을 설정하세요:

```bash
# .env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_USE_MOCK_API=false  # true면 mock API 사용
```

### 2. 상태 관리 스토어 사용

#### 인증 스토어 (authStore)

```tsx
import { useAuthStore } from '@/lib/stores/authStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = async () => {
    await login('user@example.com', 'password123');
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>안녕하세요, {user?.name}님!</p>
      ) : (
        <button onClick={handleLogin}>로그인</button>
      )}
    </div>
  );
}
```

#### 계좌 스토어 (accountStore)

```tsx
import { useAccountStore } from '@/lib/stores/accountStore';
import { useEffect } from 'react';

function AccountInfo() {
  const { account, fetchAccount, selectZone } = useAccountStore();

  useEffect(() => {
    fetchAccount(); // 컴포넌트 마운트 시 계좌 정보 조회
  }, []);

  const handleSelectZone = async () => {
    await selectZone({
      zone: 'extreme',
      theme: '미국 테크',
    });
  };

  return (
    <div>
      <p>잔액: {account?.balance.toLocaleString()}원</p>
      <p>현재 존: {account?.currentZone}</p>
      <button onClick={handleSelectZone}>익스트림존 선택</button>
    </div>
  );
}
```

#### 투자 분석 스토어 (investmentStore)

```tsx
import { useInvestmentStore } from '@/lib/stores/investmentStore';
import { useEffect } from 'react';

function InvestmentReport() {
  const { records, ranking, fetchInvestmentRecords, fetchRegionalRanking } = useInvestmentStore();

  useEffect(() => {
    fetchInvestmentRecords();
    fetchRegionalRanking();
  }, []);

  return (
    <div>
      <p>지역 순위: {ranking?.myRank}위</p>
      {records.map((record) => (
        <div key={record.id}>
          <p>{record.date} - 수익: {record.profit.toLocaleString()}원</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. 인증 보호 라우트 사용

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { LoginPage } from '@/app/components/pages/LoginPage';
import { HomePage } from '@/app/components/pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### 4. 커스텀 훅 사용

#### useAuth - 인증 상태 확인

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, hasRegion } = useAuth();

  if (!hasRegion) {
    return <div>지역을 먼저 선택해주세요!</div>;
  }

  return <div>안녕하세요, {user?.name}님!</div>;
}
```

#### useRequireAuth - 인증 필수 페이지

```tsx
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return <div>인증된 사용자만 볼 수 있는 페이지</div>;
}
```

## 🔌 API 엔드포인트

### 인증 API

- `POST /auth/login` - 로그인
- `POST /auth/logout` - 로그아웃
- `GET /auth/me` - 현재 사용자 정보

### 계좌 API

- `GET /account` - 계좌 정보 조회
- `POST /account/select-zone` - 존 선택

### 투자 분석 API

- `GET /investments` - 투자 내역 조회
- `GET /investments/regional-ranking` - 지역 순위 조회

### 지역 API

- `GET /regions` - 지역 목록 조회
- `POST /user/region` - 사용자 지역 설정

## 📝 API 요청/응답 예시

### 로그인

**요청:**
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "홍길동",
    "email": "user@example.com",
    "regionCode": "110000"
  }
}
```

### 계좌 정보 조회

**요청:**
```
GET /account
Authorization: Bearer {token}
```

**응답:**
```json
{
  "accountId": "account-123",
  "balance": 10000000,
  "todayInterest": 329,
  "dailyReturnRate": 0.0033,
  "currentZone": "interest",
  "nextZone": "extreme",
  "extremeTheme": "미국 테크"
}
```

### 존 선택

**요청:**
```json
POST /account/select-zone
Authorization: Bearer {token}
{
  "zone": "extreme",
  "theme": "AI/클라우드"
}
```

**응답:** (계좌 정보 객체 동일)

### 투자 내역 조회

**요청:**
```
GET /investments
Authorization: Bearer {token}
```

**응답:**
```json
[
  {
    "id": "inv-1",
    "date": "2026-02-06",
    "zone": "extreme",
    "theme": "미국 테크",
    "principal": 10000000,
    "investedAmount": 329,
    "profit": 105,
    "returnRate": 32.0,
    "status": "ongoing"
  }
]
```

## 🔐 인증 처리

### 토큰 저장

로그인 성공 시 JWT 토큰이 자동으로 `localStorage`에 저장됩니다:
```typescript
localStorage.setItem('auth_token', token);
```

### 요청 인터셉터

모든 API 요청에 자동으로 토큰이 추가됩니다:
```typescript
config.headers.Authorization = `Bearer ${token}`;
```

### 응답 인터셉터

401 에러 발생 시 자동으로 로그아웃 처리됩니다:
```typescript
if (error.response?.status === 401) {
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
}
```

## 🧪 Mock API 사용 (개발 중)

실제 API가 준비되기 전까지는 mock 데이터를 사용할 수 있습니다:

1. `.env` 파일에서 `VITE_USE_MOCK_API=true` 설정
2. API 서비스 함수에서 mock 데이터 반환 로직 추가

```typescript
// services.ts 예시
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      // Mock 데이터 반환
      return {
        token: 'mock-token-12345',
        user: {
          id: 'user-1',
          name: '홍길동',
          email: data.email,
          regionCode: '110000',
          createdAt: new Date().toISOString(),
        },
      };
    }
    
    // 실제 API 호출
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
};
```

## 🎯 주요 타입 정의

자세한 타입 정의는 `/src/lib/api/types.ts` 파일을 참고하세요.

주요 타입:
- `User` - 사용자 정보
- `Account` - 계좌 정보
- `InvestmentRecord` - 투자 내역
- `RegionalRanking` - 지역 순위
- `LoginRequest/Response` - 로그인 요청/응답
- `SelectZoneRequest` - 존 선택 요청

## 💡 팁

1. **에러 처리**: 모든 API 호출은 try-catch로 감싸거나 스토어의 error 상태를 사용하세요
2. **로딩 상태**: 스토어의 isLoading을 사용하여 로딩 UI를 표시하세요
3. **토큰 갱신**: 토큰 만료 시 자동 갱신 로직이 필요하면 인터셉터에 추가하세요
4. **지역 제한**: 지역이 선택되지 않은 경우 익스트림존/밸런스존 접근을 제한하세요
