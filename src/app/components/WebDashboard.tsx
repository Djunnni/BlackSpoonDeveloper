import { useState } from "react";
import {
  ArrowUpRight,
  Shield,
  TrendingUp,
  Scale,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Wallet,
  Settings as SettingsIcon,
} from "lucide-react";
import { ZoneCard } from "./ZoneCard";
import { InterestZone } from "./InterestZone";
import { ExtremeZone } from "./ExtremeZone";
import { BalanceZone } from "./BalanceZone";
import { ChargeMoney } from "./ChargeMoney";
import { TomorrowZoneSelectorWeb } from "./TomorrowZoneSelectorWeb";
import { TomorrowZoneSetupWeb } from "./TomorrowZoneSetupWeb";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Zone = "interest" | "extreme" | "balance";

const DAILY_CHART_DATA = [
  { date: "01/29", balance: 15180000, interest: 21500 },
  { date: "01/30", balance: 15210000, interest: 21500 },
  { date: "01/31", balance: 15230000, interest: 21500 },
  { date: "02/01", balance: 15240000, interest: 21500 },
  { date: "02/02", balance: 15250000, interest: 21500 },
  { date: "02/03", balance: 15260000, interest: 21500 },
  { date: "02/04", balance: 15750000, interest: 21500 },
];

const ZONE_DISTRIBUTION = [
  { name: "이자존", value: 60, color: "#3b82f6" },
  { name: "익스트림존", value: 15, color: "#f97316" },
  { name: "밸런스존", value: 25, color: "#9333ea" },
];

export function WebDashboard() {
  const [todayZone, setTodayZone] = useState<Zone>("interest");
  const [tomorrowZone, setTomorrowZone] = useState<Zone>("interest");
  const [showTomorrowZoneSetup, setShowTomorrowZoneSetup] = useState(false);
  const [setupZoneType, setSetupZoneType] = useState<"extreme" | "balance">(
    "extreme",
  );

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
  const [selectedView, setSelectedView] = useState<
    "overview" | "zone" | "map" | "charge" | "notifications"
  >("overview");

  const totalBalance = 15750000;
  const totalProfit = 21500;
  const totalReturn = 2.3;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Zone Setup Modal */}
      {showTomorrowZoneSetup && (
        <TomorrowZoneSetupWeb
          zone={setupZoneType}
          onSave={handleTomorrowZoneSave}
          onCancel={() => setShowTomorrowZoneSetup(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">JB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  JB머니 Dashboard
                </h1>
                <p className="text-sm text-gray-600">스마트 금고 관리</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedView("charge")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>충전하기</span>
              </button>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <p className="text-sm text-blue-100 mb-2">JB 머니</p>
              <h2 className="text-3xl font-bold mb-6">
                {totalBalance.toLocaleString()}원
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                  <span className="text-sm text-blue-100">오늘 발생 이자</span>
                  <span className="font-semibold text-green-300">
                    +{totalProfit.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">일 수익률</span>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4 text-green-300" />
                    <span className="font-semibold text-green-300">
                      +{totalReturn}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today Zone */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">
                  오늘 투자중인 존
                </h3>
              </div>
              <div
                className={`p-4 rounded-xl border-2 ${
                  todayZone === "interest"
                    ? "bg-blue-50 border-blue-500"
                    : todayZone === "extreme"
                      ? "bg-orange-50 border-orange-500"
                      : "bg-purple-50 border-purple-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  {todayZone === "interest" && (
                    <>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">이자존</p>
                        <p className="text-sm text-blue-700">원금 100% 보호</p>
                      </div>
                    </>
                  )}
                  {todayZone === "extreme" && (
                    <>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-orange-900">
                          익스트림존
                        </p>
                        <p className="text-sm text-orange-700">이자만 투자</p>
                      </div>
                    </>
                  )}
                  {todayZone === "balance" && (
                    <>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Scale className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">
                          밸런스존
                        </p>
                        <p className="text-sm text-purple-700">
                          원금 일부 투자
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tomorrow Zone */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <TomorrowZoneSelectorWeb
                tomorrowZone={tomorrowZone}
                onZoneClick={handleTomorrowZoneClick}
              />
            </div>

            {/* Zone Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">존 분포 현황</h3>
              <ResponsiveContainer width="100%" height={180}>
                <RePieChart>
                  <Pie
                    data={ZONE_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {ZONE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {ZONE_DISTRIBUTION.map((zone, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <span className="text-gray-700">{zone.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {zone.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedView("overview")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedView === "overview"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">개요</span>
                </button>
                <button
                  onClick={() => setSelectedView("zone")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedView === "zone"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <PieChart className="w-5 h-5" />
                  <span className="font-medium">존 상세</span>
                </button>
                <button
                  onClick={() => setSelectedView("map")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedView === "map"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">지역별 현황</span>
                </button>
                <button
                  onClick={() => setSelectedView("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedView === "notifications"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">알림 설정</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {selectedView === "overview" && (
              <div className="space-y-6">
                {/* Charts */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      잔액 추이
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={DAILY_CHART_DATA}>
                        <defs>
                          <linearGradient
                            id="colorBalance"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          stroke="#9ca3af"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="balance"
                          stroke="#3b82f6"
                          fill="url(#colorBalance)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      일별 이자 발생
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={DAILY_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          stroke="#9ca3af"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="interest"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: "#10b981", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Zone Cards */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">존 선택</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <ZoneCard
                      type="interest"
                      isActive={todayZone === "interest"}
                      onClick={() => setTodayZone("interest")}
                    />
                    <ZoneCard
                      type="extreme"
                      isActive={todayZone === "extreme"}
                      onClick={() => setTodayZone("extreme")}
                    />
                    <ZoneCard
                      type="balance"
                      isActive={todayZone === "balance"}
                      onClick={() => setTodayZone("balance")}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">
                      이번 달 누적 이자
                    </p>
                    <p className="text-xl font-bold text-gray-900">86,000원</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">평균 일 수익률</p>
                    <p className="text-xl font-bold text-green-600">+2.15%</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">총 투자 금액</p>
                    <p className="text-xl font-bold text-gray-900">
                      3,937,500원
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">전날 대비</p>
                    <p className="text-xl font-bold text-purple-600">
                      ▲ 12,300원
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedView === "zone" && (
              <div>
                {todayZone === "interest" && <InterestZone />}
                {todayZone === "extreme" && <ExtremeZone />}
                {todayZone === "balance" && <BalanceZone />}
              </div>
            )}

            {selectedView === "charge" && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <ChargeMoney />
              </div>
            )}

            {selectedView === "notifications" && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  알림 설정
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        일일 이자 발생 알림
                      </p>
                      <p className="text-sm text-gray-600">매일 오전 9시</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl">
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
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">수익률 알림</p>
                      <p className="text-sm text-gray-600">
                        목표 수익률 달성 시
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl">
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
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
