import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../lib/stores/authStore';
import { LogIn, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      // 로그인 성공 시 메인으로 이동
      navigate('/main', { replace: true });
    } catch (err) {
      // 에러는 스토어에서 처리
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">JB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              JB Money 로그인
            </h1>
            <p className="text-sm text-gray-600">
              계좌를 관리하고 투자를 시작하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>로그인 중...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>로그인</span>
                </>
              )}
            </button>
          </form>

          {/* 추가 링크 */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <button className="text-blue-600 font-medium hover:underline">
                회원가입
              </button>
            </p>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              비밀번호를 잊으셨나요?
            </button>
          </div>
        </div>

        {/* 개발용 안내 */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
          <p className="text-xs text-white text-center">
            💡 개발 모드: 실제 API 연동 전까지는 mock 데이터를 사용합니다
          </p>
        </div>
      </div>
    </div>
  );
}
