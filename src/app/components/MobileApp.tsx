import { useState } from "react";
import {
  Home,
  Map,
  Settings,
  ArrowUpRight,
  ChevronRight,
  Bell,
  Wallet,
  CreditCard,
} from "lucide-react";
import { ZoneCard } from "./ZoneCard";
import { InterestZone } from "./InterestZone";
import { ExtremeZone } from "./ExtremeZone";
import { BalanceZone } from "./BalanceZone";
import { ChargeMoney } from "./ChargeMoney";
import { TomorrowZoneSelector } from "./TomorrowZoneSelector";
import { TomorrowZoneSetup } from "./TomorrowZoneSetup";

type Zone = "interest" | "extreme" | "balance";
type Tab = "home" | "map" | "settings";
type SettingsView = "menu" | "charge" | "notifications";

export function MobileApp() {
  const [todayZone, setTodayZone] = useState<Zone>("interest");
  const [tomorrowZone, setTomorrowZone] = useState<Zone>("interest");
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [showZoneDetail, setShowZoneDetail] = useState(false);
  const [selectedZoneForDetail, setSelectedZoneForDetail] =
    useState<Zone>("interest");
  const [settingsView, setSettingsView] = useState<SettingsView>("menu");
  const [showTomorrowZoneSetup, setShowTomorrowZoneSetup] = useState(false);
  const [setupZoneType, setSetupZoneType] = useState<"extreme" | "balance">(
    "extreme",
  );

  const totalBalance = 15750000;
  const totalProfit = 21500;
  const totalReturn = 2.3;

  const handleZoneClick = (zone: Zone) => {
    setSelectedZoneForDetail(zone);
    setShowZoneDetail(true);
  };

  const handleTomorrowZoneClick = (zone: Zone) => {
    if (zone === "interest") {
      setTomorrowZone("interest");
    } else if (zone === "extreme") {
      setSetupZoneType("extreme");
      setShowTomorrowZoneSetup(true);
    } else if (zone === "balance") {
      setSetupZoneType("balance");
      setShowTomorrowZoneSetup(true);
    }
  };

  const handleTomorrowZoneSave = (zone: Zone) => {
    setTomorrowZone(zone);
    setShowTomorrowZoneSetup(false);
  };

  const renderSettingsContent = () => {
    if (settingsView === "charge") {
      return (
        <div className="p-6">
          <button
            onClick={() => setSettingsView("menu")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            ← 뒤로
          </button>
          <ChargeMoney />
        </div>
      );
    }

    if (settingsView === "notifications") {
      return (
        <div className="p-6">
          <button
            onClick={() => setSettingsView("menu")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            ← 뒤로
          </button>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            알림 설정
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">일일 이자 발생 알림</p>
                <p className="text-sm text-gray-600">매일 오전 9시</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">존 변경 알림</p>
                <p className="text-sm text-gray-600">매일 자정</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">수익률 알림</p>
                <p className="text-sm text-gray-600">목표 수익률 달성 시</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">마케팅 알림</p>
                <p className="text-sm text-gray-600">이벤트 및 혜택</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">설정</h2>
        <div className="space-y-4">
          <button
            onClick={() => setSettingsView("charge")}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">JB머니 충전</p>
                <p className="text-sm text-gray-600">JB계좌에서 금고로 이체</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => setSettingsView("notifications")}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">알림 설정</p>
                <p className="text-sm text-gray-600">푸시 알림 관리</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">계좌 정보</p>
                <p className="text-sm text-gray-600">계좌 상세 정보</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (showTomorrowZoneSetup) {
      return (
        <TomorrowZoneSetup
          zone={setupZoneType}
          onSave={handleTomorrowZoneSave}
          onCancel={() => setShowTomorrowZoneSetup(false)}
        />
      );
    }

    if (currentTab === "settings") {
      return renderSettingsContent();
    }

    if (showZoneDetail) {
      return (
        <div className="p-6">
          <button
            onClick={() => setShowZoneDetail(false)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            ← 뒤로
          </button>
          {selectedZoneForDetail === "interest" && <InterestZone />}
          {selectedZoneForDetail === "extreme" && <ExtremeZone />}
          {selectedZoneForDetail === "balance" && <BalanceZone />}
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="mb-4">
            <p className="text-sm text-blue-100">JB 머니</p>
          </div>
          <h1 className="text-3xl font-bold mb-6">
            {totalBalance.toLocaleString()}원
          </h1>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs text-blue-100 mb-1">오늘 발생 이자</p>
              <p className="text-lg font-semibold">
                +{totalProfit.toLocaleString()}원
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs text-blue-100 mb-1">일 수익률</p>
              <p className="text-lg font-semibold">+{totalReturn}%</p>
            </div>
          </div>
        </div>

        {/* Today & Tomorrow Zone Selection */}
        <div className="space-y-4">
          {/* Today Zone */}
          <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
            <div className="mb-3">
              <h3 className="font-semibold text-blue-900">오늘 투자중인 존</h3>
            </div>
            <button
              onClick={() => handleZoneClick(todayZone)}
              className="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {todayZone === "interest" && (
                  <>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">이자존</p>
                      <p className="text-sm text-gray-600">원금 100% 보호</p>
                    </div>
                  </>
                )}
                {todayZone === "extreme" && (
                  <>
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">익스트림존</p>
                      <p className="text-sm text-gray-600">이자만 투자</p>
                    </div>
                  </>
                )}
                {todayZone === "balance" && (
                  <>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">밸런스존</p>
                      <p className="text-sm text-gray-600">원금 일부 투자</p>
                    </div>
                  </>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Tomorrow Zone Selection */}
          <TomorrowZoneSelector
            tomorrowZone={tomorrowZone}
            onZoneClick={handleTomorrowZoneClick}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            빠른 메뉴
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50">
              <p className="font-medium text-gray-900">거래내역</p>
            </button>
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50">
              <p className="font-medium text-gray-900">수익 분석</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[430px] mx-auto h-screen bg-gray-50 flex flex-col">
      {/* Status Bar */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-end">
          <span className="text-sm text-gray-600">9:41</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
