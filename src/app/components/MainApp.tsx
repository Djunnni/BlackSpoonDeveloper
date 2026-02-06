import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "./Layout";
import { Bell, Wallet } from "lucide-react";
import { ZoneCard } from "./ZoneCard";
import { TomorrowZoneSelector } from "./TomorrowZoneSelector";
import { TomorrowZoneSetupModal } from "./TomorrowZoneSetupModal";

type Zone = "interest" | "extreme" | "balance";

export function MainApp() {
  const navigate = useNavigate();
  const [todayZone, setTodayZone] = useState<Zone>("interest");
  const [tomorrowZone, setTomorrowZone] = useState<Zone>("interest");
  const [showTomorrowZoneSetup, setShowTomorrowZoneSetup] = useState(false);
  const [setupZoneType, setSetupZoneType] = useState<"extreme" | "balance">(
    "extreme",
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null); // "000000" or null means not selected
  const [showRegionAlert, setShowRegionAlert] = useState(false);

  const totalBalance = 15750000;
  const totalProfit = 21500;
  const totalReturn = 2.3;

  const handleTomorrowZoneClick = (zone: Zone) => {
    if (zone === "interest") {
      setTomorrowZone("interest");
    } else if (zone === "extreme" || zone === "balance") {
      // Check if region is selected
      if (!selectedRegion || selectedRegion === "000000") {
        setShowRegionAlert(true);
        return;
      }
      setSetupZoneType(zone);
      setShowTomorrowZoneSetup(true);
    }
  };

  const handleTomorrowZoneSave = (zone: Zone) => {
    setTomorrowZone(zone);
    setShowTomorrowZoneSetup(false);
  };

  const getZoneLabel = (zone: Zone) => {
    if (zone === "interest") return "이자존";
    if (zone === "extreme") return "익스트림존";
    return "밸런스존";
  };

  return (
    <Layout>
      {/* Zone Setup Modal */}
      {showTomorrowZoneSetup && (
        <TomorrowZoneSetupModal
          zone={setupZoneType}
          onSave={handleTomorrowZoneSave}
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
            {totalBalance.toLocaleString()}원
          </h1>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-blue-100 mb-1">오늘 발생 이자</p>
              <p className="text-lg font-semibold">
                +{totalProfit.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-100 mb-1">일 수익률</p>
              <p className="text-lg font-semibold text-green-300">
                +{totalReturn}%
              </p>
            </div>
          </div>
        </div>

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
                zone={todayZone}
                isActive={true}
                onClick={() => {}}
                isToday={true}
              />
            </div>

            {/* Tomorrow Zone Selection */}
            <TomorrowZoneSelector
              tomorrowZone={tomorrowZone}
              onZoneClick={handleTomorrowZoneClick}
              showRegionAlert={() => {
                setShowRegionAlert(true);
              }}
              hasRegionSelected={
                selectedRegion !== null && selectedRegion !== "000000"
              }
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

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">최근 활동</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">이자 발생</p>
                    <p className="text-xs text-gray-600">+21,500원</p>
                  </div>
                  <p className="text-xs text-gray-500">오늘</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">존 변경</p>
                    <p className="text-xs text-gray-600">이자존 → 익스트림존</p>
                  </div>
                  <p className="text-xs text-gray-500">어제</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">투자 수익</p>
                    <p className="text-xs text-gray-600">+48,200원</p>
                  </div>
                  <p className="text-xs text-gray-500">2일 전</p>
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
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
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
                    // TODO: Navigate to region selection or open region modal
                    // For demo, let's set a mock region
                    setSelectedRegion("110000");
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
