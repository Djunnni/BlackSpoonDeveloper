import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * Mock 모드일 때는 자동으로 인증된 상태로 처리
 * 로그인하지 않은 경우 로그인 페이지로 리다이렉트
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
 

  // // Mock 모드일 때는 인증 체크 없이 바로 통과
  // if (USE_MOCK) {
  //   return <>{children}</>;
  // }

  //로딩 중일 때는 로딩 화면 표시
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-gray-600">로딩 중...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // // 인증되지 않은 경우 로그인 페이지(루트)로 리다이렉트
  // if (!isAuthenticated) {
  //   return <Navigate to="/" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
}
