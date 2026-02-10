import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "./Layout";
import { Bell, Wallet, AlertTriangle, Shield, Landmark, RefreshCw } from "lucide-react";
import { ZoneCard } from "./ZoneCard";
import { CountdownTimer } from "./CountdownTimer";
import { TomorrowZoneSelector } from "./TomorrowZoneSelector";
import { TomorrowZoneSetupModal } from "./TomorrowZoneSetupModal";
import { useAuthStore } from "../../lib/stores/authStore";
import { useAccountStore } from "../../lib/stores/accountStore";
import { DevToolsPanel } from "./DevToolsPanel";
import { requestAccessToken } from "../../lib/utils/native-bridge";
import { getUserInfo } from "../../lib/api/rest-api";

type Zone = "INTEREST" | "INTEREST_WORK" | "POWER_WORK";

export function MainApp() {
  const navigate = useNavigate();
  const { account, fetchAccount, fetchAccountFromApi, selectZone, isLoading } =
    useAccountStore();
  console.log(account)
  const [showTomorrowZoneSetup, setShowTomorrowZoneSetup] =
    useState(false);
  const [setupZoneType, setSetupZoneType] = useState<
    "INTEREST_WORK" | "POWER_WORK"
  >("INTEREST_WORK");
  const [showRegionAlert, setShowRegionAlert] = useState(false);
  const [showAllZones, setShowAllZones] = useState(false);
  
  // Pull-to-Refresh 상태
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ✅ 개발 중 강제 활성화 (이거 true면 지역 없어도 밸런스/익스트림 무조건 열린다)
  const DEV_FORCE_ZONE_ENABLE = true;

  // ✅ 임시: 네이티브에서 regionSelected 못 받아도 "잠깐" 활성화하기 위한 플래그
  // (DEV_FORCE_ZONE_ENABLE 켜면 사실상 필요없지만, 남겨둠)
  const [tempHasRegion, setTempHasRegion] = useState(true);

  // ✅ Native Bridge: moveTab(0~5)
  // 0홈 1지역 2분석 3분석 4ai상담사 5설정
  const postMoveTab = (
    tab: 0 | 1 | 2 | 3 | 4 | 5,
    message?: string,
  ) => {
    const payload = {
      type: "moveTab",
      tab,
      message: message ?? "hello from web",
      ts: Date.now(),
    };

    try {
      (
        window as any
      ).webkit?.messageHandlers?.BlackSpoonDevHandler?.postMessage?.(
        payload,
      );
      (window as any).BlackSpoonDevHandler?.postMessage?.(
        JSON.stringify(payload),
      );
    } catch (e) {
      console.error("postMoveTab failed:", e, payload);
    }
  };

  // ✅ 컴포넌트 마운트 시 계좌 정보 로드
  useEffect(() => {
    const loadInitialData = async () => {
      const localStorageValue = localStorage.getItem('VITE_USE_MOCK_API');
      const USE_MOCK_API = localStorageValue !== null 
        ? localStorageValue !== 'false' 
        : import.meta.env.VITE_USE_MOCK_API !== 'false';
      
      console.log('[MainApp] 🔧 USE_MOCK_API:', USE_MOCK_API);
      
      // if (USE_MOCK_API) {
      //   // Mock 모드: 기존 방식 사용
      //   console.log('[MainApp] Using MOCK API mode');
      //   fetchAccount();
      // } else {
        // 실제 API 모드: fetchUserFromApi/fetchAccountFromApi가 내부에서 accessToken 처리
        console.log('[MainApp] Using REAL API mode - will call HTTP endpoint');
        try {
          console.log('[MainApp] Initial load: fetching from stores...');
          
          // 사용자 정보와 계좌 정보를 동시에 가져오기
          // (각 store의 fetch 함수가 내부에서 getUserInfo() 호출 → accessToken 자동 요청)
          await Promise.all([
            fetchAccountFromApi(),
          ]);
          
          console.log('[MainApp] Initial data loaded successfully');
        } catch (error) {
          console.error('[MainApp] Failed to load user data from API:', error);
          // 에러 발생 시 Mock 데이터로 폴백
          fetchAccount();
        }
      // }
    };
    
    loadInitialData();
  }, [fetchAccount, fetchAccountFromApi]);

  // ✅ 원래 지역 판단
  const realHasRegion = !!(
    account?.UserInMyBoxDto?.selectedRegionCode && account.UserInMyBoxDto?.selectedRegionCode !== "000000"
  );

  // ✅ 최종: 개발용 강제 활성화 or 임시 활성화가 켜져 있으면 true
  const hasRegion =
    realHasRegion || tempHasRegion || DEV_FORCE_ZONE_ENABLE;

  const handleTomorrowZoneClick = (zone: Zone) => {
    if (zone === "INTEREST") {
      selectZone({ zone: "INTEREST" });
      return;
    }

    if (zone === "INTEREST_WORK" || zone === "POWER_WORK") {
      // ✅ 개발 중에는 무조건 열리게 (지역 체크/모달 차단 전부 무시)
      if (DEV_FORCE_ZONE_ENABLE) {
        setShowRegionAlert(false);
        setSetupZoneType(zone);
        setShowTomorrowZoneSetup(true);
        return;
      }

      // ✅ 실서비스 모드에서는 지역 체크
      if (!hasRegion) {
        setShowRegionAlert(true);
        return;
      }

      setSetupZoneType(zone);
      setShowTomorrowZoneSetup(true);
    }
  };

  const handleTomorrowZoneSave = async (
    zone: Zone,
    options?: { theme?: string; ratio?: number },
  ) => {
    try {
      await selectZone({
        zone,
        theme: options?.theme,
        ratio: options?.ratio,
      });
      setShowTomorrowZoneSetup(false);
    } catch (error) {
      console.error("Failed to select zone:", error);
    }
  };

  // Pull-to-Refresh: 새로고침 로직
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    console.log('[MainApp] 🔄 Starting refresh...');
    
    try {
      const localStorageValue = localStorage.getItem('VITE_USE_MOCK_API');
      const USE_MOCK_API = localStorageValue !== null 
        ? localStorageValue !== 'false' 
        : import.meta.env.VITE_USE_MOCK_API !== 'false';
      
      console.log('[MainApp] 🔧 Refresh - USE_MOCK_API:', USE_MOCK_API);
      
      // if (USE_MOCK_API) {
      //   console.log('[MainApp] Using Mock API');
      //   // Mock 모드
      //   await fetchAccount();
      // } else {
        console.log('[MainApp] Using Real API - calling HTTP endpoint...');
        
        // ✅ 실제 API 호출: authStore와 accountStore가 각각 getUserInfo() 호출
        await Promise.all([
          fetchAccountFromApi(),
        ]);
        
        console.log('[MainApp] ✅ Data updated in stores');
  //    }
    } catch (error) {
      console.error('[MainApp] ❌ Failed to refresh data:', error);
      alert(`❌ API 호출 실패: ${error instanceof Error ? error.message : String(error)}`);
      // 에러 발생 시 Mock 데이터로 폴백
      await fetchAccount();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [isRefreshing, fetchAccount, fetchAccountFromApi]);

  // Pull-to-Refresh: 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // 스크롤이 최상단일 때만 활성화
    if (container.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container || isRefreshing) return;
    
    // 스크롤이 최상단일 때만 작동
    if (container.scrollTop === 0 && touchStartY.current > 0) {
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY.current;
      
      // 아래로 당길 때만 (distance > 0)
      if (distance > 0) {
        // 최대 80px까지만 당기기
        setPullDistance(Math.min(distance, 80));
        
        // 브라우저 기본 당기기 동작 방지
        if (distance > 10) {
          e.preventDefault();
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (isRefreshing) return;
    
    // 60px 이상 당기면 새로고침 트리거
    if (pullDistance >= 60) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
    
    touchStartY.current = 0;
  };

  // ✅ 네이티브 메시지 핸들러
  const onNativeMessage = useCallback((payload: any) => {
    console.log('[MainApp] Received native message:', payload);
    
    // ✅ iOS에서 accessTokenInfo 메시지 받기
    if (payload?.type === "accessTokenInfo") {
      console.log('[MainApp] accessTokenInfo detected');
      console.log('[MainApp] payload.data:', payload.data);
      console.log('[MainApp] Full payload:', payload);
      
      // ✅ requestAccessToken()이 기다리는 window.tokenInfo 콜백 호출
      if ((window as any).tokenInfo) {
        console.log('[MainApp] ✅ Calling window.tokenInfo with payload.data');
        // payload = { type: "accessTokenInfo", data: { accessToken: "..." } }
        // → payload.data만 전달 = { accessToken: "..." }
        (window as any).tokenInfo(payload.data);
      } else {
        console.warn('[MainApp] ⚠️ window.tokenInfo callback not found (maybe not waiting for token)');
      }
      return;
    }
    
    // 지역 선택 이벤트
    if (payload?.type === "regionSelected") {
      setTempHasRegion(false);
      setShowRegionAlert(false);
    }
    
    // 홈 새로고침 이벤트
    if (payload?.type === "refreshHome") {
      handleRefresh();
    }
  }, [handleRefresh]);

  // ✅ Native Bridge 메시지 리스너 등록
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      try {
        const data =
          typeof e.data === "string"
            ? JSON.parse(e.data)
            : e.data;
        onNativeMessage(data);
      } catch {
        onNativeMessage(e.data);
      }
    };

    const onCustom = (e: Event) => {
      const ce = e as CustomEvent;
      onNativeMessage(ce.detail);
    };

    window.addEventListener("message", onMessage);
    window.addEventListener(
      "BlackSpoonDevNative",
      onCustom as any,
    );

    // ✅ iOS가 보내는 함수 등록: window.BlackSpoonDevNativeReceive
    (window as any).BlackSpoonDevNativeReceive = (payload: any) => {
      console.log('[MainApp] BlackSpoonDevNativeReceive called:', payload);
      onNativeMessage(payload);
    };

    // 기존 방식도 유지 (호환성)
    (window as any).BlackSpoonDevWeb =
      (window as any).BlackSpoonDevWeb || {};
    (window as any).BlackSpoonDevWeb.onNativeMessage = (
      p: any,
    ) => {
      onNativeMessage(p);
    };

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener(
        "BlackSpoonDevNative",
        onCustom as any,
      );
      try {
        // ✅ iOS 함수 정리
        delete (window as any).BlackSpoonDevNativeReceive;
        
        if ((window as any).BlackSpoonDevWeb?.onNativeMessage) {
          delete (window as any).BlackSpoonDevWeb
            .onNativeMessage;
        }
      } catch {}
    };
  }, [onNativeMessage]);

  const getZoneLabel = (zone?: Zone, isForTomorrow?: boolean) => {
    if (zone === "INTEREST") return "이자존";
    if (zone === "INTEREST_WORK") return "이자워크존";
    if (zone === "POWER_WORK") {
      // 내일 투자 존인 경우 nextBalanceRatio 사용
      const ratio = isForTomorrow ? account?.nextBalanceRatio : account?.currentBalanceRatio;
      if (ratio) {
        return `파워워크존 ${ratio}%`;
      }
      return "파워워크존";
    }
    return "이자존";
  };

  // ✅ 로딩 중이면 로딩 UI 표시
  if (isLoading && !account) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                계좌 정보를 불러오는 중...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Zone Setup Modal */}
      {showTomorrowZoneSetup && (
        <TomorrowZoneSetupModal
          zone={setupZoneType}
          onSave={(zone, options) =>
            handleTomorrowZoneSave(zone as Zone, options)
          }
          onCancel={() => setShowTomorrowZoneSetup(false)}
        />
      )}

      {/* ✅ JB 머니(헤더) 고정 + 아래만 스크롤 */}
      <div className="h-[100dvh] overflow-hidden flex flex-col bg-gradient-to-b from-slate-50 to-white">
        {/* ✅ 1) 고정 헤더 영역 - 프리미엄 화이트 */}
        <div className="shrink-0 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
            {/* Premium Vault Card */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 overflow-hidden shadow-2xl border border-slate-700/50 group">
              {/* 배경 패턴 */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '32px 32px'
                }}></div>
              </div>
              
              {/* 금빛 그라데이션 효과 - 애니메이션 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
              
              {/* 반짝이는 라인 효과 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent animate-shimmer"></div>
              </div>
              
              <style>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes countUp {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-5px); }
                }
                .animate-shimmer {
                  animation: shimmer 3s infinite;
                }
                .animate-countUp {
                  animation: countUp 0.6s ease-out forwards;
                }
                .animate-float {
                  animation: float 3s ease-in-out infinite;
                }
              `}</style>
              
              <div className="relative z-10">
                {/* 상단: 금고 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-md opacity-70 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-2.5 rounded-xl shadow-lg animate-float">
                        <Landmark className="w-5 h-5 text-slate-900 stroke-[2.5]" />
                      </div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-amber-400">JB 머니</div>
                      <div className="text-sm text-slate-300 font-bold mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        { account?.UserInMyBoxDto?.accountNo }
                      </div>
                    </div>
                  </div>
                  
                  {/* 지역 & 테마 */}
                  <div className="flex flex-col gap-1.5">
                    {/* 지역 */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/60 rounded-full border border-slate-700/50">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-[11px] text-slate-300 font-semibold">
                        {account?.UserInMyBoxDto?.selectedRegionName || "전북 전주시 덕진구"}
                      </span>
                    </div>
                    
                    {/* 이자워크존 테마 */}
                    {account?.UserInMyBoxDto?.todayZoneType === 'INTEREST_WORK' && account?.UserInMyBoxDto && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                        <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                        <span className="text-[10px] text-orange-400 font-medium">
                          {/*account.extremeTheme*/ '테마'}
                        </span>
                      </div>
                    )}
                    
                    {/* 파워워크존 투자 스타일 & 테마 */}
                    {account?.UserInMyBoxDto?.todayZoneType === 'POWER_WORK' && (
                      <>
                        {/* 투자 스타일 + 원금 비율 */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                          <span className="text-[10px] text-purple-400 font-medium">
                            {account?.currentBalanceRatio === 25 && '안정형'}
                            {account?.currentBalanceRatio === 50 && '균형형'}
                            {account?.currentBalanceRatio === 75 && '공격형'}
                            {account?.currentBalanceRatio && ` · 원금 ${account.currentBalanceRatio}%`}
                          </span>
                        </div>
                        
                        {/* 선택한 테마
                        {account?.extremeTheme && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                            <span className="text-[10px] text-purple-400 font-medium">
                              {account.extremeTheme}
                            </span>
                          </div>
                        )} */}
                      </>
                    )}
                  </div>
                </div>
                
                {/* 총 자산 & 일 수익률 */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2.5 mb-2">
                    <h1 className="text-[32px] font-bold text-white tracking-tight leading-none" style={{ 
                      textShadow: '0 0 20px rgba(251, 191, 36, 0.35)',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em'
                    }}>
                      {((account?.UserInMyBoxDto?.balance || 0) + (account?.UserInMyBoxDto?.investBalance || 0)).toLocaleString()}
                      <span className="text-base text-slate-400 ml-1.5 font-normal">원</span>
                    </h1>
                    
                    <span className="text-base font-bold text-emerald-400 shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {account?.UserInMyBoxDto?.todayProfit || '+0.00'}%
                    </span>
                  </div>
                  
                  {/* 수익금 */}
                  <div className="text-base font-bold text-emerald-400" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    +{(account?.UserInMyBoxDto?.investBalance || 0).toLocaleString()}원
                  </div>
                </div>

                {/* 투자 현황 */}
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-800/20 rounded-2xl px-5 py-4 border border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className={`w-5 h-5 ${
                        account?.UserInMyBoxDto?.todayZoneType === 'INTEREST' ? 'text-blue-400' :
                        account?.UserInMyBoxDto?.todayZoneType === 'INTEREST_WORK' ? 'text-orange-400' :
                        'text-purple-400'
                      }`} />
                      <div>
                        <div className={`text-base font-bold ${
                          account?.UserInMyBoxDto?.todayZoneType === 'INTEREST' || account?.UserInMyBoxDto?.todayZoneType === 'NONE' ? 'text-blue-300' :
                          account?.UserInMyBoxDto?.todayZoneType === 'INTEREST_WORK' ? 'text-orange-300' :
                          'text-purple-300'
                        }`}>
                          {account?.UserInMyBoxDto?.todayZoneType === 'INTEREST' || account?.UserInMyBoxDto?.todayZoneType === 'NONE' && '이자존'}
                          {account?.UserInMyBoxDto?.todayZoneType === 'INTEREST_WORK' && '이자워크존'}
                          {account?.UserInMyBoxDto?.todayZoneType === 'POWER_WORK' && account?.currentBalanceRatio && `파워워크존 ${account.currentBalanceRatio}%`}
                          {account?.UserInMyBoxDto?.todayZoneType === 'POWER_WORK' && !account?.currentBalanceRatio && '파워워크존'}
                        </div>
                        {(account?.UserInMyBoxDto?.todayZoneType=== 'INTEREST_WORK' || account?.UserInMyBoxDto?.todayZoneType === 'POWER_WORK') && account?.extremeTheme && (
                          <div className="text-xs text-slate-400 mt-0.5">{account.extremeTheme}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 mb-0.5 font-medium">원금</div>
                      <div className="text-sm font-bold text-slate-200" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {(account?.UserInMyBoxDto?.balance || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 개발용 토글 */}
            {!realHasRegion && !DEV_FORCE_ZONE_ENABLE && (
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => setTempHasRegion((v) => !v)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    tempHasRegion
                      ? "bg-green-600 text-white border-green-700"
                      : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tempHasRegion
                    ? "임시 지역 ON (해제)"
                    : "임시로 파워워크존 활성화"}
                </button>
                <p className="text-xs text-gray-500">
                  (개발용) regionSelected 연동 전 잠깐 테스트용
                </p>
              </div>
            )}

            {/* 지역 미선택 알림 (개발 강제 활성화면 안 뜨게 됨) */}
            {!hasRegion && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    지역 선택이 필요합니다
                  </p>
                  <p className="text-xs text-yellow-700 mb-2">
                    이자워크존과 파워워크존을 이용하시려면 지역을
                    먼저 선택해주세요.
                  </p>
                  <button
                    onClick={() => {
                      setShowRegionAlert(false);
                      postMoveTab(1, "go region tab");
                    }}
                    className="text-xs font-semibold text-yellow-800 hover:text-yellow-900 underline"
                  >
                    지역 선택하러 가기
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ✅ 2) 아래만 스크롤되는 영역 - 깔끔한 밝은 배경 */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto bs-scroll bg-gradient-to-b from-slate-50 to-white relative"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none", // Firefox 스크롤바 숨김
            msOverflowStyle: "none", // IE/Old Edge 스크롤바 숨김
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Pull-to-Refresh 인디케이터 */}
          <div 
            className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 ease-out z-50"
            style={{
              height: pullDistance,
              opacity: pullDistance > 0 ? 1 : 0,
            }}
          >
            <div className={`flex flex-col items-center ${isRefreshing ? 'animate-pulse' : ''}`}>
              <div 
                className={`bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-2 shadow-lg ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                style={{
                  transform: `rotate(${pullDistance * 3}deg)`,
                }}
              >
                <RefreshCw className="w-4 h-4 text-slate-900" />
              </div>
              {pullDistance >= 60 && !isRefreshing && (
                <span className="text-xs text-slate-600 mt-1 font-medium">놓아서 새로고침</span>
              )}
              {isRefreshing && (
                <span className="text-xs text-slate-600 mt-1 font-medium">새로고침 중...</span>
              )}
            </div>
          </div>

          {/* WebKit(iOS/사파리/크롬) 스크롤바 숨김 */}
          <style>{`
            .bs-scroll::-webkit-scrollbar {
              width: 0 !important;
              height: 0 !important;
              display: none !important;
            }
          `}</style>

          {/* ✅ 여기(안쪽 컨텐츠)에 bottom padding을 크게 줘야 탭바/세이프에어리어 위까지 더 올라옴 */}
          <div
            className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
            style={{
              paddingBottom:
                "calc(env(safe-area-inset-bottom) + 120px)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                {/* ☀️ 내일 투자할 존 */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          🎯 내일 투자할 존
                        </h3>
                        <CountdownTimer />
                      </div>
                    </div>
                    
                    {/* 항상 모든 존 표시 */}
                    <div className="space-y-3">
                      <TomorrowZoneSelector
                        tomorrowZone={account?.UserInMyBoxDto?.tommorrowZoneType || "INTEREST"}
                        onZoneClick={(zone) => {
                          handleTomorrowZoneClick(zone);
                        }}
                        showRegionAlert={() => setShowRegionAlert(true)}
                        hasRegionSelected={
                          DEV_FORCE_ZONE_ENABLE
                            ? true
                            : hasRegion || false
                        }
                        selectedTheme={account?.extremeTheme}
                        selectedRatio={account?.nextBalanceRatio}
                      />
                    </div>
                    
                    <p className="text-[10px] text-gray-500 text-center mt-3">
                      내일 00:00에 선택한 존으로 자동 전환됩니다
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* ☀️ 빠른 메뉴 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                    빠른 메뉴
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate("/charge")}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg shadow-sm">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 text-sm">
                          충전하기
                        </p>
                        <p className="text-[10px] text-gray-600">
                          JB 머니 충전
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate("/notifications")}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 text-sm">
                          알림 설정
                        </p>
                        <p className="text-[10px] text-gray-600">
                          투자 알림 관리
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ☀️ 계좌 정보 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                    계좌 정보
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-600">
                        내일 투자할 존
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getZoneLabel(account?.nextZone, true)}
                      </p>
                    </div>

                    {account?.nextZone === "extreme" &&
                      account?.extremeTheme && (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-orange-50 border border-orange-200/50">
                          <p className="text-xs text-gray-600">
                            선택한 테마
                          </p>
                          <p className="text-sm font-semibold text-orange-600">
                            {account.extremeTheme}
                          </p>
                        </div>
                      )}

                    {account?.nextZone === "balance" &&
                      account?.nextBalanceRatio !== undefined && (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50 border border-purple-200/50">
                          <p className="text-xs text-gray-600">
                            투자 비율
                          </p>
                          <p className="text-sm font-semibold text-purple-600">
                            {account.nextBalanceRatio}%
                          </p>
                        </div>
                      )}

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-[10px] text-gray-500 text-center">
                        내일 00:00에 자동으로 전환됩니다
                      </p>
                    </div>
                  </div>
                </div>

                {/* 아래에 더 내용 있어도 안전하게 스크롤 됨 */}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ 지역 선택 안내 모달 */}
        {showRegionAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  지역 선택이 필요합니다
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  이자워크존과 파워워크존을 이용하시려면
                  <br />
                  먼저 지역을 선택해주세요.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowRegionAlert(false);
                      postMoveTab(1, "go region tab");
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    지역 선택하기
                  </button>
                  <button
                    onClick={() => setShowRegionAlert(false)}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 개발자 도구 패널 */}
      <DevToolsPanel />
    </Layout>
  );
}