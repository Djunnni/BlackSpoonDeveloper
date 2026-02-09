// 사용자 정보
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  regionCode?: string; // 지역 코드 (null 또는 "000000"이면 미선택)
  regionName?: string; // 지역 이름 (예: "서울특별시 강남구")
  createdAt: string;
}

// 계좌 정보
export interface Account {
  accountId: string;
  balance: number; // JB 머니 잔액
  todayInterest: number; // 오늘 발생한 이자
  totalInterest: number; // 누적 발생 이자
  dailyReturnRate: number; // 일 단위 수익률
  currentZone: 'interest' | 'extreme' | 'balance'; // 오늘 투자중인 존
  nextZone: 'interest' | 'extreme' | 'balance'; // 내일 투자할 존
  extremeTheme?: string; // 익스트림존 선택 테마
  balanceRatio?: number; // 밸런스존 비율 (25, 50, 75)
}

// 투자 내역
export interface InvestmentRecord {
  id: string;
  date: string;
  zone: 'interest' | 'extreme' | 'balance';
  theme?: string;
  ratio?: number;
  principal: number; // 원금
  investedAmount: number; // 실제 투자에 사용된 금액
  profit: number; // 수익
  returnRate: number; // 수익률
  status: 'completed' | 'ongoing';
}

// 지역 순위 정보
export interface RegionalRanking {
  regionCode: string;
  regionName: string;
  totalUsers: number;
  myRank: number;
  percentile: number; // 상위 퍼센트 (예: 92.9 = 상위 7.1%)
}

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  token: string;
  user: User;
}

// 존 선택 요청
export interface SelectZoneRequest {
  zone: 'interest' | 'extreme' | 'balance';
  theme?: string; // 익스트림존일 경우 필수
  ratio?: number; // 밸런스존일 경우 필수 (25, 50, 75)
}

// API 에러 응답
export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}
