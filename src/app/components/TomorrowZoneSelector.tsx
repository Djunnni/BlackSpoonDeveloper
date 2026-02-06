import { Shield, TrendingUp, Scale } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

type Zone = "interest" | "extreme" | "balance";

interface TomorrowZoneSelectorProps {
  tomorrowZone: Zone;
  onZoneClick: (zone: Zone) => void;
}

export function TomorrowZoneSelector({
  tomorrowZone,
  onZoneClick,
}: TomorrowZoneSelectorProps) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900">내일 투자할 존 선택</h3>
      </div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs text-gray-600 flex-1">
          내일 00:00에 선택한 존으로 자동 전환됩니다
        </p>
        <CountdownTimer />
      </div>
      <div className="space-y-2">
        <button
          onClick={() => onZoneClick("interest")}
          className={`w-full p-4 rounded-2xl border-2 transition-all ${
            tomorrowZone === "interest"
              ? "bg-blue-50 border-blue-500"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">이자존</h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    위험도 0
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                원금 100% 보호 · 안정적 이자
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onZoneClick("extreme")}
          className={`w-full p-4 rounded-2xl border-2 transition-all ${
            tomorrowZone === "extreme"
              ? "bg-orange-50 border-orange-500"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-100">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">익스트림존</h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                    위험도 5
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">이자로만 투자 · 고위험</p>
              <p className="text-xs text-red-600 mt-0.5">⚠️ 이자 손실 가능</p>
              {tomorrowZone === "extreme" && (
                <p className="text-xs text-orange-600 mt-1">
                  테마: 미국 테크 선택됨
                </p>
              )}
            </div>
          </div>
        </button>

        <button
          onClick={() => onZoneClick("balance")}
          className={`w-full p-4 rounded-2xl border-2 transition-all ${
            tomorrowZone === "balance"
              ? "bg-purple-50 border-purple-500"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100">
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">밸런스존</h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                    위험도 3
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">원금 일부 투자 · 중위험</p>
              <p className="text-xs text-orange-600 mt-0.5">
                ⚠️ 원금 일부 손실 가능
              </p>
              {tomorrowZone === "balance" && (
                <p className="text-xs text-purple-600 mt-1">
                  안정형 (25% / 75%) 선택됨
                </p>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
