import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * 인증 관련 훅
 * - 로그인 상태 확인
 * - 지역 선택 여부 확인
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  // 앱 시작 시 인증 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 지역이 선택되어 있는지 확인
  const hasRegion = user?.regionCode && user.regionCode !== '000000';

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRegion,
  };
};
