import { useState, useEffect } from 'react';
import { Settings, X, Check, AlertCircle, Clock } from 'lucide-react';
import { isNativeBridgeAvailable, detectPlatform, requestAccessToken } from '../../lib/utils/native-bridge';

type NativeBridgeLog = {
  id: number;
  timestamp: string;
  type: 'request' | 'response' | 'error';
  message: string;
  data?: any;
};

/**
 * 개발자 도구 패널
 * - Mock/Real API 모드 전환
 * - 계좌번호 설정
 * - Native Bridge 테스트
 * - Native Bridge 로그 확인
 */
export function DevToolsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountNo, setAccountNo] = useState(
    import.meta.env.VITE_MYBOX_ACCOUNT_NO || '1068011596267'
  );
  const [selectedScenario, setSelectedScenario] = useState('default');
  const [logs, setLogs] = useState<NativeBridgeLog[]>([]);
  const [lastToken, setLastToken] = useState<string | null>(null);

  const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';
  const nativeBridgeAvailable = isNativeBridgeAvailable();
  const platform = detectPlatform();

  // ✅ Native Bridge 메시지 수신 로깅
  useEffect(() => {
    const originalReceive = (window as any).BlackSpoonDevNativeReceive;
    
    (window as any).BlackSpoonDevNativeReceive = (payload: any) => {
      // 로그 추가
      addLog('response', `수신: ${payload?.type || 'unknown'}`, payload);
      
      // AccessToken 저장
      if (payload?.type === 'accessTokenInfo' && payload?.data?.accessToken) {
        setLastToken(payload.data.accessToken);
      }
      
      // 원래 함수 호출
      if (originalReceive) {
        originalReceive(payload);
      }
    };

    return () => {
      (window as any).BlackSpoonDevNativeReceive = originalReceive;
    };
  }, []);

  const addLog = (type: 'request' | 'response' | 'error', message: string, data?: any) => {
    const newLog: NativeBridgeLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('ko-KR'),
      type,
      message,
      data,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 20)); // 최근 20개만 유지
  };

  const scenarios = [
    { id: 'default', name: '기본 (이자존)', zone: 'INTEREST' },
    { id: 'extreme', name: '이자워크존', zone: 'INTEREST_WORK' },
    { id: 'balance-25', name: '파워워크존 25%', zone: 'POWER_WORK', ratio: 'SAFE' },
    { id: 'balance-50', name: '파워워크존 50%', zone: 'POWER_WORK', ratio: 'BALANCED' },
    { id: 'balance-75', name: '파워워크존 75%', zone: 'POWER_WORK', ratio: 'ATTACK' },
  ];

  const handleToggleApiMode = () => {
    const newMode = useMockApi ? 'false' : 'true';
    localStorage.setItem('VITE_USE_MOCK_API', newMode);
    window.location.reload();
  };

  const handleUpdateAccountNo = () => {
    localStorage.setItem('VITE_MYBOX_ACCOUNT_NO', accountNo);
    window.location.reload();
  };

  const handleTestNativeBridge = async () => {
    addLog('request', 'AccessToken 요청 중...', { type: 'accessTokenInfo' });
    console.log('🔔 Testing Native Bridge...');
    console.log('Platform:', platform);
    console.log('Available:', nativeBridgeAvailable);

    if (!nativeBridgeAvailable) {
      addLog('error', 'Native Bridge 사용 불가', { reason: '네이티브 앱에서 실행 필요' });
      alert('❌ Native Bridge를 사용할 수 없습니다. 네이티브 앱에서 실행하세요.');
      return;
    }

    try {
      const token = await requestAccessToken();
      console.log('✅ AccessToken received:', token);
      setLastToken(token);
      addLog('response', '✅ AccessToken 수신 성공', { tokenLength: token.length });
      alert(`✅ AccessToken 수신 성공!\n\n${token.substring(0, 50)}...`);
    } catch (error: any) {
      console.error('❌ AccessToken request failed:', error);
      addLog('error', `AccessToken 요청 실패: ${error.message}`, { error: error.message });
      alert(`❌ AccessToken 요청 실패:\n${error.message}`);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-4 -translate-y-1/2 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="개발자 도구 열기"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50 bg-slate-900 text-white rounded-lg shadow-2xl w-80 p-4 border border-slate-700 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">🛠️ 개발자 도구</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 text-sm">
        {/* API 모드 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">API 모드</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${useMockApi ? 'bg-amber-500 text-black' : 'bg-green-500 text-white'}`}>
              {useMockApi ? 'MOCK' : 'REAL API'}
            </span>
          </div>
          <button
            onClick={handleToggleApiMode}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-xs transition-colors"
          >
            {useMockApi ? '→ Real API 모드로 전환' : '→ Mock 모드로 전환'}
          </button>
        </div>

        {/* 계좌번호 설정 */}
        {!useMockApi && (
          <div>
            <label className="block text-slate-300 mb-2">계좌번호</label>
            <input
              type="text"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs mb-2 focus:outline-none focus:border-blue-500"
              placeholder="1068011596267"
            />
            <button
              onClick={handleUpdateAccountNo}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs transition-colors"
            >
              계좌번호 적용 (새로고침)
            </button>
          </div>
        )}

        {/* Native Bridge 테스트 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">Native Bridge</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${nativeBridgeAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {nativeBridgeAvailable ? `${platform.toUpperCase()}` : 'N/A'}
            </span>
          </div>
          <button
            onClick={handleTestNativeBridge}
            disabled={!nativeBridgeAvailable}
            className={`w-full px-3 py-2 rounded text-xs transition-colors ${
              nativeBridgeAvailable 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            🔗 AccessToken 테스트
          </button>
        </div>

        {/* ✅ 최근 수신한 토큰 */}
        {lastToken && (
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold text-green-400">최근 수신 토큰</span>
            </div>
            <div className="text-[10px] text-slate-300 break-all font-mono bg-slate-900 p-2 rounded">
              {lastToken.length > 100 ? `${lastToken.substring(0, 100)}...` : lastToken}
            </div>
            <div className="text-[9px] text-slate-500 mt-1">
              길이: {lastToken.length} 자
            </div>
          </div>
        )}

        {/* ✅ Native Bridge 로그 */}
        {logs.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">📝 Native Bridge 로그</span>
              <button
                onClick={() => setLogs([])}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                지우기
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="text-[10px] bg-slate-900 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    {log.type === 'request' && <Clock className="w-3 h-3 text-blue-400" />}
                    {log.type === 'response' && <Check className="w-3 h-3 text-green-400" />}
                    {log.type === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
                    <span className={`font-bold ${
                      log.type === 'request' ? 'text-blue-400' :
                      log.type === 'response' ? 'text-green-400' :
                      'text-red-400'
                    }`}>
                      {log.timestamp}
                    </span>
                  </div>
                  <div className="text-slate-300">{log.message}</div>
                  {log.data && (
                    <details className="mt-1">
                      <summary className="text-slate-500 cursor-pointer hover:text-slate-400">상세</summary>
                      <pre className="text-[9px] text-slate-400 mt-1 overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mock 시나리오 선택 */}
        {useMockApi && (
          <div>
            <label className="block text-slate-300 mb-2">테스트 시나리오</label>
            <select
              value={selectedScenario}
              onChange={(e) => {
                setSelectedScenario(e.target.value);
                // 시나리오 변경 시 새로고침 필요
                if (e.target.value !== selectedScenario) {
                  localStorage.setItem('TEST_SCENARIO', e.target.value);
                  alert('시나리오가 변경되었습니다. 새로고침하세요.');
                }
              }}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              다양한 존 상태를 테스트해보세요
            </p>
          </div>
        )}

        {/* 정보 */}
        <div className="pt-3 border-t border-slate-700 text-xs text-slate-400">
          <p>• Mock: 테스트 데이터 사용</p>
          <p>• Real API: 실제 서버 호출</p>
          <p className="mt-2 text-[10px]">
            Base URL:<br/>
            <span className="text-blue-400">
              blackspoondev-sandbox.mxapps.io
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
