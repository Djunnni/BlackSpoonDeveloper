import { create } from 'zustand';
import type { Account, SelectZoneRequest } from '../api/types';
import { accountApi } from '../api/services';
import { getUserInfo } from '../api/rest-api';
import { mapApiResponseToAccount } from '../api/mappers';

// 개발 중에는 기본적으로 Mock 모드 사용
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Mock 계좌 데이터
const mockAccount: Account = {
  accountId: '037-1068011596267',
  accountNo: '106-801-159626',
  balance: 80000000,
  investBalance: 6800000,
  todayInterest: 329,
  todayProfit: '+8.50',
  totalInterest: 0,
  dailyReturnRate: 0.0033,
  currentZone: 'interest',
  nextZone: 'interest',
  currentBalanceRatio: undefined,
  nextBalanceRatio: undefined,
};

interface AccountState {
  // 상태
  account: Account | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchAccount: () => Promise<void>;
  fetchAccountFromApi: (accountNo: string) => Promise<void>;
  selectZone: (data: SelectZoneRequest) => Promise<void>;
  clearError: () => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  // 초기 상태 - Mock 모드일 때는 초기 데이터 제공
  account: USE_MOCK ? mockAccount : null,
  isLoading: false,
  error: null,

  // 계좌 정보 조회
  fetchAccount: async () => {
    // Mock 모드일 때는 이미 초기 데이터가 있으므로 빠르게 처리
    if (USE_MOCK) {
      set({ isLoading: true });
      setTimeout(() => {
        set({ account: mockAccount, isLoading: false });
      }, 300);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const account = await accountApi.getAccount();
      set({ account, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '계좌 정보를 불러오는데 실패했습니다.',
        isLoading: false,
      });
      // 에러를 던지지 않고 기본값 설정
      console.error('Failed to fetch account:', error);
    }
  },

  // REST API로 계좌 정보 가져오기
  fetchAccountFromApi: async (accountNo: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getUserInfo(accountNo);
      const account = mapApiResponseToAccount(response);
      
      set({
        account,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || '계좌 정보를 불러오는데 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  // 존 선택
  selectZone: async (data: SelectZoneRequest) => {
    // Mock 모드일 때는 로컬 상태만 업데이트
    if (USE_MOCK) {
      set({ isLoading: true });
      setTimeout(() => {
        set((state) => ({
          account: state.account ? {
            ...state.account,
            nextZone: data.zone,
            extremeTheme: data.theme,
            balanceRatio: data.ratio,
          } : null,
          isLoading: false,
        }));
      }, 400);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const account = await accountApi.selectZone(data);
      set({ account, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '존 선택에 실패했습니다.',
        isLoading: false,
      });
      console.error('Failed to select zone:', error);
    }
  },

  // 에러 클리어
  clearError: () => {
    set({ error: null });
  },
}));
