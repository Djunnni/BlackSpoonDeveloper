import { create } from 'zustand';
import type { InvestmentRecord, RegionalRanking } from '../api/types';
import { investmentApi } from '../api/services';

interface InvestmentState {
  // 상태
  records: InvestmentRecord[];
  ranking: RegionalRanking | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchInvestmentRecords: () => Promise<void>;
  fetchRegionalRanking: () => Promise<void>;
  clearError: () => void;
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  // 초기 상태
  records: [],
  ranking: null,
  isLoading: false,
  error: null,

  // 투자 내역 조회
  fetchInvestmentRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const records = await investmentApi.getInvestmentRecords();
      set({ records, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '투자 내역을 불러오는데 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  // 지역 순위 조회
  fetchRegionalRanking: async () => {
    set({ isLoading: true, error: null });
    try {
      const ranking = await investmentApi.getRegionalRanking();
      set({ ranking, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '순위 정보를 불러오는데 실패했습니다.',
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
