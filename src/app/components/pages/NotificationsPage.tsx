import { useState } from "react";
import { Layout } from "../Layout";
import { Bell, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { HistoryBackButton } from "../components/HistoryBackButton";

export function NotificationsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [interestAlert, setInterestAlert] = useState(true);
  const [profitAlert, setProfitAlert] = useState(true);
  const [lossAlert, setLossAlert] = useState(false);
  const [zoneChangeAlert, setZoneChangeAlert] = useState(true);

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 상단 헤더 */}
        <div className="space-y-2">
          <div className="relative flex items-center h-12">
            {/* 뒤로가기 */}
            <div className="absolute left-0">
              <HistoryBackButton />
            </div>

            {/* 타이틀 중앙 정렬 */}
            <h1 className="w-full text-center text-lg font-bold text-gray-900">
              알림 설정
            </h1>
          </div>
        </div>

        {/* Push Notification */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">푸시 알림</p>
                <p className="text-sm text-gray-600">모든 알림 수신</p>
              </div>
            </div>
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                pushEnabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  pushEnabled ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Types */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Interest Alert */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">이자 발생 알림</p>
                <p className="text-sm text-gray-600">매일 이자 발생 시</p>
              </div>
            </div>
            <button
              onClick={() => setInterestAlert(!interestAlert)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                interestAlert ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  interestAlert ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Profit Alert */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">수익 알림</p>
                <p className="text-sm text-gray-600">투자 수익 발생 시</p>
              </div>
            </div>
            <button
              onClick={() => setProfitAlert(!profitAlert)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                profitAlert ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  profitAlert ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Loss Alert */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">손실 알림</p>
                <p className="text-sm text-gray-600">투자 손실 발생 시</p>
              </div>
            </div>
            <button
              onClick={() => setLossAlert(!lossAlert)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                lossAlert ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  lossAlert ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Zone Change Alert */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">존 변경 알림</p>
                <p className="text-sm text-gray-600">00:00 존 전환 시</p>
              </div>
            </div>
            <button
              onClick={() => setZoneChangeAlert(!zoneChangeAlert)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                zoneChangeAlert ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  zoneChangeAlert ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
