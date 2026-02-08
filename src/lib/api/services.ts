import { apiClient } from "./client";
import type {
  User,
  Account,
  InvestmentRecord,
  RegionalRanking,
  LoginRequest,
  LoginResponse,
  SelectZoneRequest,
} from "./types";

// Mock mode 확인
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

// Mock 데이터
const mockUser: User = {
  id: "user-1",
  name: "홍길동",
  email: "user@example.com",
  phoneNumber: "010-1234-5678",
  regionCode: "000000",
  createdAt: "2026-01-01T00:00:00Z",
};

const mockAccount: Account = {
  accountId: "account-1",
  balance: 15750000,
  todayInterest: 329,
  dailyReturnRate: 0.0033,
  currentZone: "interest",
  nextZone: "interest",
};

// 인증 관련 API
export const authApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      // Mock 응답
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        token: "mock-token-12345",
        user: { ...mockUser, email: data.email },
      };
    }
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }
    await apiClient.post("/auth/logout");
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockUser;
    }
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};

// 계좌 관련 API
export const accountApi = {
  // 계좌 정보 조회
  getAccount: async (): Promise<Account> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAccount;
    }
    const response = await apiClient.get<Account>("/account");
    return response.data;
  },

  // 존 선택
  selectZone: async (data: SelectZoneRequest): Promise<Account> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        ...mockAccount,
        nextZone: data.zone,
        extremeTheme: data.theme,
        balanceRatio: data.ratio,
      };
    }
    const response = await apiClient.post<Account>(
      "/account/select-zone",
      data,
    );
    return response.data;
  },
};

// 투자 분석 관련 API
export const investmentApi = {
  // 투자 내역 조회
  getInvestmentRecords: async (): Promise<InvestmentRecord[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const ANNUAL_INTEREST_RATE = 1.2;
      const DAILY_INTEREST_RATE = ANNUAL_INTEREST_RATE / 365;
      const PRINCIPAL = 10000000;
      const DAILY_INTEREST = Math.floor(
        PRINCIPAL * (DAILY_INTEREST_RATE / 100),
      );

      return [
        {
          id: "1",
          date: "2026-02-08",
          zone: "extreme",
          theme: "미국 테크",
          principal: PRINCIPAL,
          investedAmount: DAILY_INTEREST,
          profit: 105,
          returnRate: 32.0,
          status: "ongoing",
        },
        {
          id: "2",
          date: "2026-02-07",
          zone: "extreme",
          theme: "AI/클라우드",
          principal: PRINCIPAL,
          investedAmount: DAILY_INTEREST,
          profit: 76,
          returnRate: 23.1,
          status: "completed",
        },
        {
          id: "3",
          date: "2026-02-06",
          zone: "balance",
          ratio: 50,
          principal: PRINCIPAL,
          investedAmount: DAILY_INTEREST + Math.floor(PRINCIPAL * 0.5),
          profit: 90150,
          returnRate: 1.8,
          status: "completed",
        },
        {
          id: "4",
          date: "2026-02-05",
          zone: "interest",
          principal: PRINCIPAL,
          investedAmount: PRINCIPAL,
          profit: DAILY_INTEREST,
          returnRate: DAILY_INTEREST_RATE,
          status: "completed",
        },
        {
          id: "5",
          date: "2026-02-04",
          zone: "extreme",
          theme: "반도체",
          principal: PRINCIPAL,
          investedAmount: DAILY_INTEREST,
          profit: -98,
          returnRate: -29.8,
          status: "completed",
        },
        {
          id: "6",
          date: "2026-02-03",
          zone: "balance",
          ratio: 25,
          principal: PRINCIPAL,
          investedAmount: DAILY_INTEREST + Math.floor(PRINCIPAL * 0.25),
          profit: 30100,
          returnRate: 1.2,
          status: "completed",
        },
      ];
    }
    const response = await apiClient.get<InvestmentRecord[]>("/investments");
    return response.data;
  },

  // 지역 순위 조회
  getRegionalRanking: async (): Promise<RegionalRanking> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        regionCode: "110000",
        regionName: "서울특별시",
        totalUsers: 1247,
        myRank: 89,
        percentile: 92.9,
      };
    }
    const response = await apiClient.get<RegionalRanking>(
      "/investments/regional-ranking",
    );
    return response.data;
  },
};

// 지역 관련 API
export const regionApi = {
  // 사용 가능한 지역 목록 조회
  getRegions: async (): Promise<Array<{ code: string; name: string }>> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [
        { code: "110000", name: "서울특별시" },
        { code: "260000", name: "부산광역시" },
        { code: "270000", name: "대구광역시" },
        { code: "280000", name: "인천광역시" },
        { code: "290000", name: "광주광역시" },
        { code: "300000", name: "대전광역시" },
        { code: "310000", name: "울산광역시" },
        { code: "360000", name: "세종특별자치시" },
        { code: "410000", name: "경기도" },
        { code: "420000", name: "강원도" },
        { code: "430000", name: "충청북도" },
        { code: "440000", name: "충청남도" },
        { code: "450000", name: "전라북도" },
        { code: "460000", name: "전라남도" },
        { code: "470000", name: "경상북도" },
        { code: "480000", name: "경상남도" },
        { code: "490000", name: "제주특별자치도" },
      ];
    }
    const response = await apiClient.get("/regions");
    return response.data;
  },

  // 사용자 지역 설정
  setUserRegion: async (regionCode: string): Promise<User> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { ...mockUser, regionCode };
    }
    const response = await apiClient.post<User>("/user/region", { regionCode });
    return response.data;
  },
};
