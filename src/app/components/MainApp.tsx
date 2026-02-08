import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "./Layout";
import { Bell, Wallet, AlertTriangle } from "lucide-react";
import { ZoneCard } from "./ZoneCard";
import { TomorrowZoneSelector } from "./TomorrowZoneSelector";
import { TomorrowZoneSetupModal } from "./TomorrowZoneSetupModal";
import { useAuthStore } from "../../lib/stores/authStore";
import { useAccountStore } from "../../lib/stores/accountStore";

type Zone = "interest" | "extreme" | "balance";

export function MainApp() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { account, fetchAccount, selectZone, isLoading } = useAccountStore();

  const [showTomorrowZoneSetup, setShowTomorrowZoneSetup] = useState(false);
  const [setupZoneType, setSetupZoneType] = useState<"extreme" | "balance">(
    "extreme",
  );
  const [showRegionAlert, setShowRegionAlert] = useState(false);

  // ✅ 개발용: 지역 없어도 밸런스/익스트림 활성화 (기본 ON)
  const [tempHasRegion, setTempHasRegion] = useState(true);

  // ✅ Native Bridge: moveTab(0~5)
  // 0홈 1지역 2분석 3분석 4ai상담사 5설정
  const postMoveTab = (tab: 0 | 1 | 2 | 3 | 4 | 5, message?: string) => {
    const payload = {
      type: "moveTab",
      tab,
      message: message ?? "hello from web",
      ts: Date.now(),
    };

    try {
      (window as any).webkit?.messageHandlers?.BlackSpoonDevHandler?.postMessage?.(
        payload,
      );
      (window as any).BlackSpoonDevHandler?.postMessage?.(JSON.stringify(payload));
    } catch (e) {
      console.error("postMoveTab failed:", e, payload);
    }
  };

  // ✅ 컴포넌트 마운트 시 계좌 정보 로드
  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  // ✅ 원래 지역 판단
  const realHasRegion = !!(user?.regionCode && user.regionCode !== "000000");

  // ✅ 최종: 개발용 강제 활성화가 켜져 있으면 지역 없어도 true
  const hasRegion = realHasRegion || tempHasRegion;

  // ✅ (옵션) 네이티브 regionSelected 이벤트도 같이 받으면 개발용 플래그 꺼줌(원하면 유지해도 됨)
  const onNativeRegionSelected = useCallback((payload: any) => {
    if (payload?.type === "regionSelected") {
      // ✅ 실서버/네이티브 연동되면 개발용 강제 모드 OFF로 되돌리고 싶으면 아래 유지
      // setTempHasRegion(false);

      setShowRegionAlert(false);
    }
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        onNativeRegionSelected(data);
      } catch {
        onNativeRegionSelected(e.data);
      }
    };

    const onCustom = (e: Event) => {
      const ce = e as CustomEvent;
      onNativeRegionSelected(ce.detail);
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("BlackSpoonDevNative", onCustom as any);

    (window as any).BlackSpoonDevWeb = (window as any).BlackSpoonDevWeb || {};
    (window as any).BlackSpoonDevWeb.onNativeMessage = (p: any) => {
      onNativeRegionSelected(p);
    };

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("BlackSpoonDevNative", onCustom as any);
      try {
        if ((window as any).BlackSpoonDevWeb?.onNativeMessage) {
          delete (window as any).BlackSpoonDevWeb.onNativeMessage;
        }
      } catch {}
    };
  }, [onNativeRegionSelected]);

  const handleTomorrowZoneClick = (zone: Zone) => {
    if (zone === "interest") {
      selectZone({ zone: "interest" });
    } else if (zone === "extreme" || zone === "balance") {
      // ✅ 개발용: tempHasRegion=true면 무조건 패스
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

  const getZoneLabel = (zone?: Zone) => {
    if (zone === "interest") return "이자존";
    if (zone === "extreme") return "익스트림존";
    if (zone === "balance") return "밸런스존";
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
              <p className="text-gray-600">계좌 정보를 불러오는 중...</p>
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

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6">
          <div className="mb-4">
            <p className="text-sm text-blue-100">JB 머니</p>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">
            {(account?.balance || 0).toLocaleString()}원
          </h1>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-blue-100 mb-1">오늘 발생 이자</p>
              <p className="text-lg font-semibold">
                +{(account?.todayInterest || 0).toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-100 mb-1">일 수익률</p>
              <p
                className={`text-lg font-semibold ${(account?.dailyReturnRate || 0) >= 0 ? "text-green-300" : "text-red-300"}`}
              >
                {(account?.dailyReturnRate || 0) >= 0 ? "+" : ""}
                {((account?.dailyReturnRate || 0) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* ✅ 개발용 토글: 기본 ON 상태로 시작 */}
        {!realHasRegion && (
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => setTempHasRegion((v) => !v)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                tempHasRegion
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tempHasRegion ? "개발모드: 지역체크 OFF (해제)" : "개발모드: 지역체크 OFF (활성)"}
            </button>
            <p className="text-xs text-gray-500">
              (개발용) regionSelected 연동 전 밸런스존/익스트림존 테스트 허용
            </p>
          </div>
        )}

        {/* 지역 미선택 알림 (개발모드 ON이면 안 뜸) */}
        {!hasRegion && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 mb-1">
                지역 선택이 필요합니다
              </p>
              <p className="text-xs text-yellow-700 mb-2">
                익스트림존과 밸런스존을 이용하시려면 지역을 먼저 선택해주세요.
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

        {/* Grid Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Zone */}
            <div>
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">투자중인 존</h3>
              </div>
              <ZoneCard
                zone={account?.currentZone || "interest"}
                isActive={true}
                onClick={() => {}}
                isToday={true}
              />
            </div>

            {/* Tomorrow Zone Selection */}
            <TomorrowZoneSelector
              tomorrowZone={account?.nextZone || "interest"}
              onZoneClick={handleTomorrowZoneClick}
              showRegionAlert={() => {
                setShowRegionAlert(true);
              }}
              hasRegionSelected={hasRegion || false}
            />
          </div>

          {/* Sidebar for Desktop */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">빠른 메뉴</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/charge")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">충전하기</p>
                    <p className="text-xs text-gray-600">JB 머니 충전</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate("/notifications")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">알림 설정</p>
                    <p className="text-xs text-gray-600">투자 알림 관리</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">계좌 정보</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">내일 투자할 존</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {getZoneLabel(account?.nextZone)}
                  </p>
                </div>
                {account?.nextZone === "extreme" && account?.extremeTheme && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">선택한 테마</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {account.extremeTheme}
                    </p>
                  </div>
                )}
                {account?.nextZone === "balance" &&
                  account?.balanceRatio !== undefined && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">투자 비율</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {account.balanceRatio}%
                      </p>
                    </div>
                  )}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    내일 00:00에 자동으로 전환됩니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Region Alert Modal */}
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
                익스트림존과 밸런스존을 이용하시려면
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
    </Layout>
  );
}
