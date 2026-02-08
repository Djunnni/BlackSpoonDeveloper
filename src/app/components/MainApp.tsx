import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "./Layout";
import { Bell, Wallet, AlertTriangle } from "lucide-react";
import { ZoneCard } from "./ZoneCard";
import { TomorrowZoneSelector } from "./TomorrowZoneSelector";
import { TomorrowZoneSetupModal } from "./TomorrowZoneSetupModal";
import { useAuthStore } from "../../lib/stores/authStore";
import { useAccountStore } from "../../lib/stores/accountStore";

type Zone = "interest" | "extreme" | "balance";

/**
 * ✅ Native -> Web 통신 규약(권장)
 * - 네이티브(iOS/Android)에서 지역 선택 완료 시 아래 payload를 웹으로 전달:
 *   { type: "regionSelected", regionCode: "123456", regionName?: "전주시" }
 *
 * ✅ 수신 방식(여러 방식 동시 지원)
 * 1) window.postMessage(payload, "*")  (Android/일반)
 * 2) window.dispatchEvent(new CustomEvent("BlackSpoonDevNative", { detail: payload }))
 * 3) window.BlackSpoonDevWeb?.onNativeMessage(payload)  // 네이티브가 직접 호출
 */
type NativeMessage =
  | { type: "regionSelected"; regionCode: string; regionName?: string }
  | { type: string; [key: string]: any };

export function MainApp() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { account, fetchAccount, selectZone, isLoading } = useAccountStore();

  const [showTomorrowZoneSetup, setShowTomorrowZoneSetup] = useState(false);
  const [setupZoneType, setSetupZoneType] = useState<"extreme" | "balance">(
    "extreme",
  );
  const [showRegionAlert, setShowRegionAlert] = useState(false);

  // ✅ 지역 선택이 네이티브에서 완료되었는데 authStore의 user가 즉시 갱신되지 않는 환경 대비:
  // - 웹에서 수신한 regionCode를 로컬에서 override 해서 즉시 UI 활성화
  const [regionCodeOverride, setRegionCodeOverride] = useState<string | null>(
    null,
  );

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
      // iOS WKWebView
      (window as any).webkit?.messageHandlers?.BlackSpoonDevHandler?.postMessage?.(
        payload,
      );

      // Android WebView (JavascriptInterface)
      (window as any).BlackSpoonDevHandler?.postMessage?.(JSON.stringify(payload));
    } catch (e) {
      console.error("postMoveTab failed:", e, payload);
    }
  };

  // ✅ 컴포넌트 마운트 시 계좌 정보 로드
  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  // ✅ 현재 지역코드(스토어 user + 로컬 override)
  const effectiveRegionCode = useMemo(() => {
    return regionCodeOverride ?? user?.regionCode ?? null;
  }, [regionCodeOverride, user?.regionCode]);

  // ✅ 지역이 선택되어 있는지 확인
  const hasRegion = useMemo(() => {
    return !!effectiveRegionCode && effectiveRegionCode !== "000000";
  }, [effectiveRegionCode]);

  // ✅ 네이티브에서 regionSelected 메시지 수신 -> 즉시 UI 활성화 + 알림 닫기 + 계좌 갱신
  const handleNativeMessage = useCallback(
    (msg: NativeMessage) => {
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "regionSelected") {
        const code = (msg as any).regionCode as string | undefined;
        if (!code) return;

        setRegionCodeOverride(code);
        setShowRegionAlert(false);

        // 지역 선택 후 계좌/존 정보가 서버/스토어에 반영되는 구조라면 갱신
        // (UI 즉시 활성화 + 다음 단계에서 selectZone 가능)
        fetchAccount();
      }
    },
    [fetchAccount],
  );

  // ✅ 다양한 수신 채널을 모두 붙여서 “지역 탭에서 선택되면 즉시 활성화” 보장
  useEffect(() => {
    // 1) window.postMessage 수신
    const onWindowMessage = (event: MessageEvent) => {
      try {
        // 네이티브가 string으로 주는 경우도 대비
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        handleNativeMessage(data as any);
      } catch {
        // JSON parse 실패면 원본 그대로 시도
        handleNativeMessage(event.data as any);
      }
    };

    // 2) CustomEvent("BlackSpoonDevNative") 수신
    const onCustom = (event: Event) => {
      const ce = event as CustomEvent;
      handleNativeMessage(ce.detail as any);
    };

    window.addEventListener("message", onWindowMessage);
    window.addEventListener("BlackSpoonDevNative", onCustom as any);

    // 3) 네이티브가 직접 호출할 수 있도록 전역 함수도 하나 열어둠
    (window as any).BlackSpoonDevWeb = (window as any).BlackSpoonDevWeb || {};
    (window as any).BlackSpoonDevWeb.onNativeMessage = (payload: any) => {
      handleNativeMessage(payload as any);
    };

    return () => {
      window.removeEventListener("message", onWindowMessage);
      window.removeEventListener("BlackSpoonDevNative", onCustom as any);

      // cleanup: 다른 곳에서 쓰는 경우가 있으면 지우지 않는게 안전하지만,
      // 여기서는 충돌 방지를 위해 함수만 정리
      try {
        if ((window as any).BlackSpoonDevWeb?.onNativeMessage) {
          delete (window as any).BlackSpoonDevWeb.onNativeMessage;
        }
      } catch {}
    };
  }, [handleNativeMessage]);

  const handleTomorrowZoneClick = (zone: Zone) => {
    if (zone === "interest") {
      // 이자존은 바로 선택
      selectZone({ zone: "interest" });
    } else if (zone === "extreme" || zone === "balance") {
      // 지역 선택 확인
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
      // 선택 후 계좌 정보 다시 갱신(선택 결과가 nextZone 등에 반영되는 경우)
      fetchAccount();
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

        {/* 지역 미선택 알림 */}
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

                  // ✅ "지역 탭(1)"으로 네이티브 탭 이동 요청
                  postMoveTab(1, "go region tab");

                  // 웹 단독 fallback이 필요하면 여기서 navigate("/settings") 등을 조건부로
                  // (네이티브 존재 여부 체크 후) 처리하면 됨
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
              // ✅ 여기 때문에 "밸런스존/익스트림존" 카드 활성/비활성이 갈림
              // ✅ 지역탭에서 선택 완료 메시지를 받으면 hasRegion이 true로 바뀌며 즉시 활성화됨
              hasRegionSelected={hasRegion}
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

                    // ✅ 여기서 "지역 탭(1)"으로 네이티브 탭 이동 요청
                    // ✅ 지역탭에서 지역 선택 후, 네이티브가 regionSelected 메시지를 웹으로 보내면
                    // ✅ 이 컴포넌트가 받아서 hasRegion=true -> 밸런스존/익스트림존 즉시 활성화됨
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

              {/* (디버그/확인용) */}
              {/* <div className="mt-4 text-xs text-gray-400">
                effectiveRegionCode: {String(effectiveRegionCode)}
              </div> */}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
