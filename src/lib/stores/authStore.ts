import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../api/types';
import { authApi } from '../api/services';

// Mock 사용자 데이터
const mockUser: User = {
  id: 'user-1',
  name: '홍길동',
  email: 'user@example.com',
  phoneNumber: '010-1234-5678',
  regionCode: '110000',
  createdAt: '2026-01-01T00:00:00Z',
};

// 개발 중에는 기본적으로 Mock 모드 사용
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

interface AuthState {
  // 상태
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태 - Mock 모드일 때는 자동 로그인
      user: USE_MOCK ? mockUser : null,
      token: USE_MOCK ? 'mock-token-12345' : null,
      isAuthenticated: USE_MOCK ? true : false,
      isLoading: false,
      error: null,

      // 로그인
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        // Mock 모드이거나 이메일/비밀번호가 비어있으면 자동 로그인
        if (USE_MOCK || (!email && !password)) {
          setTimeout(() => {
            set({
              user: mockUser,
              token: 'mock-token-12345',
              isAuthenticated: true,
              isLoading: false,
            });
          }, 500); // 로그인 애니메이션을 위한 짧은 딜레이
          return;
        }
        
        try {
          const response = await authApi.login({ email, password });
          
          // 토큰 저장
          localStorage.setItem('auth_token', response.token);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || '로그인에 실패했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      // 로그아웃
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          // 로컬 상태 및 저장소 초기화
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // 인증 확인 (앱 시작 시 또는 페이지 로드 시)
      checkAuth: async () => {
        // Mock 모드일 때는 자동으로 인증된 상태로 설정
        if (USE_MOCK) {
          set({
            user: mockUser,
            token: 'mock-token-12345',
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }

        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authApi.getCurrentUser();
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // 인증 실패 시 토큰 제거
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // 에러 클리어
      clearError: () => {
        set({ error: null });
      },

      // 사용자 정보 업데이트 (지역 선택 등)
      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      // 토큰은 localStorage에 별도로 저장하므로 여기서는 user만 persist
      partialize: (state) => ({ user: state.user }),
    }
  )
);
