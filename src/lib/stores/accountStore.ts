import { create } from 'zustand';
import type { Account, SelectZoneRequest } from '../api/types';
import { accountApi } from '../api/services';

interface AccountState {
  // 상태
  account: Account | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchAccount: () => Promise<void>;
  selectZone: (data: SelectZoneRequest) => Promise<void>;
  clearError: () => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  // 초기 상태
  account: null,
  isLoading: false,
  error: null,

  // 계좌 정보 조회
  fetchAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      const account = await accountApi.getAccount();
      set({ account, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '계좌 정보를 불러오는데 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  // 존 선택
  selectZone: async (data: SelectZoneRequest) => {
    set({ isLoading: true, error: null });
    try {
      const account = await accountApi.selectZone(data);
      set({ account, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '존 선택에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  // 에러 클리어
  clearError: () => {
    set({ error: null });
  },
}));
