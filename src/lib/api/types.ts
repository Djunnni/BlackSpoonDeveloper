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
type Zone = "NONE" | "INTEREST" | "INTEREST_WORK" | "POWER_WORK";
export interface UserInMyBoxDto {
  accountNo: string; // 계좌번호 (123-456-789012 형식)
  balance: number; // JB 머니 잔액
  bankCode: String;
  investBalance: number;
  selectedRegionCode: string;
  selectedRegionName: string;
  todayInterestAmount: string;
  todayPowerWorkType: string;
  todayProfit: number;
  todayZoneType: Zone;
  tommorrowZoneType: Zone;
  tomorrowPowerWorkType: string;
}
// 계좌 정보
export interface Account {
  name: String;
  phone: String;
  UserInMyBoxDto: UserInMyBoxDto;
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
  myAccountNo: string;
}

// 로그인 응답
export interface LoginResponse {
  token: string;
  user: User;
}

// 존 선택 요청
export interface SelectZoneRequest {
  zone:   "NONE" | "INTEREST" | "INTEREST_WORK" | "POWER_WORK";
  theme?: string; // 익스트림존일 경우 필수
  ratio?: number; // 밸런스존일 경우 필수 (25, 50, 75)
}

// API 에러 응답
export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}
