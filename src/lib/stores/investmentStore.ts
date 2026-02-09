import { create } from 'zustand';
import type { InvestmentRecord, RegionalRanking } from '../api/types';
import { investmentApi } from '../api/services';

// 개발 중에는 기본적으로 Mock 모드 사용
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Mock 데이터
const mockRecords: InvestmentRecord[] = USE_MOCK ? [
  {
    id: '1',
    date: '2026-02-08',
    zone: 'extreme',
    theme: '미국 테크',
    principal: 10000000,
    investedAmount: 329,
    profit: 105,
    returnRate: 32.0,
    status: 'ongoing',
  },
  {
    id: '2',
    date: '2026-02-07',
    zone: 'extreme',
    theme: 'AI/클라우드',
    principal: 10000000,
    investedAmount: 329,
    profit: 76,
    returnRate: 23.1,
    status: 'completed',
  },
  {
    id: '3',
    date: '2026-02-06',
    zone: 'balance',
    ratio: 50,
    principal: 10000000,
    investedAmount: 5000329,
    profit: 90150,
    returnRate: 1.8,
    status: 'completed',
  },
  {
    id: '4',
    date: '2026-02-05',
    zone: 'interest',
    principal: 10000000,
    investedAmount: 10000000,
    profit: 329,
    returnRate: 0.0033,
    status: 'completed',
  },
  {
    id: '5',
    date: '2026-02-04',
    zone: 'extreme',
    theme: '반도체',
    principal: 10000000,
    investedAmount: 329,
    profit: -98,
    returnRate: -29.8,
    status: 'completed',
  },
  {
    id: '6',
    date: '2026-02-03',
    zone: 'balance',
    ratio: 25,
    principal: 10000000,
    investedAmount: 2500329,
    profit: 30100,
    returnRate: 1.2,
    status: 'completed',
  },
] : [];

const mockRanking: RegionalRanking | null = USE_MOCK ? {
  regionCode: '110000',
  regionName: '서울특별시',
  totalUsers: 1247,
  myRank: 89,
  percentile: 92.9,
} : null;

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
  // 초기 상태 - Mock 모드일 때는 초기 데이터 제공
  records: mockRecords,
  ranking: mockRanking,
  isLoading: false,
  error: null,

  // 투자 내역 조회
  fetchInvestmentRecords: async () => {
    // Mock 모드일 때는 이미 초기 데이터가 있으므로 빠르게 처리
    if (USE_MOCK) {
      set({ isLoading: true });
      setTimeout(() => {
        set({ records: mockRecords, isLoading: false });
      }, 300);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const records = await investmentApi.getInvestmentRecords();
      set({ records, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '투자 내역을 불러오는데 실패했습니다.',
        isLoading: false,
      });
      console.error('Failed to fetch investment records:', error);
    }
  },

  // 지역 순위 조회
  fetchRegionalRanking: async () => {
    // Mock 모드일 때는 이미 초기 데이터가 있으므로 빠르게 처리
    if (USE_MOCK) {
      set({ isLoading: true });
      setTimeout(() => {
        set({ ranking: mockRanking, isLoading: false });
      }, 300);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const ranking = await investmentApi.getRegionalRanking();
      set({ ranking, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '순위 정보를 불러오는데 실패했습니다.',
        isLoading: false,
      });
      console.error('Failed to fetch regional ranking:', error);
    }
  },

  // 에러 클리어
  clearError: () => {
    set({ error: null });
  },
}));
