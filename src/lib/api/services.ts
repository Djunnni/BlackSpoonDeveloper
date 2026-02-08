import { apiClient } from './client';
import type {
  User,
  Account,
  InvestmentRecord,
  RegionalRanking,
  LoginRequest,
  LoginResponse,
  SelectZoneRequest,
} from './types';

// 인증 관련 API
export const authApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};

// 계좌 관련 API
export const accountApi = {
  // 계좌 정보 조회
  getAccount: async (): Promise<Account> => {
    const response = await apiClient.get<Account>('/account');
    return response.data;
  },

  // 존 선택
  selectZone: async (data: SelectZoneRequest): Promise<Account> => {
    const response = await apiClient.post<Account>('/account/select-zone', data);
    return response.data;
  },
};

// 투자 분석 관련 API
export const investmentApi = {
  // 투자 내역 조회
  getInvestmentRecords: async (): Promise<InvestmentRecord[]> => {
    const response = await apiClient.get<InvestmentRecord[]>('/investments');
    return response.data;
  },

  // 지역 순위 조회
  getRegionalRanking: async (): Promise<RegionalRanking> => {
    const response = await apiClient.get<RegionalRanking>('/investments/regional-ranking');
    return response.data;
  },
};

// 지역 관련 API
export const regionApi = {
  // 사용 가능한 지역 목록 조회
  getRegions: async (): Promise<Array<{ code: string; name: string }>> => {
    const response = await apiClient.get('/regions');
    return response.data;
  },

  // 사용자 지역 설정
  setUserRegion: async (regionCode: string): Promise<User> => {
    const response = await apiClient.post<User>('/user/region', { regionCode });
    return response.data;
  },
};
