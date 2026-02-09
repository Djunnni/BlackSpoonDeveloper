import { Shield, TrendingUp, Zap } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

type Zone = "interest" | "extreme" | "balance";

interface TomorrowZoneSelectorProps {
  tomorrowZone: Zone;
  onZoneClick: (zone: Zone) => void;
  showRegionAlert: () => void;
  hasRegionSelected: boolean;
  selectedTheme?: string;
  selectedRatio?: number;
}

export function TomorrowZoneSelector({
  tomorrowZone,
  onZoneClick,
  hasRegionSelected,
  showRegionAlert,
  selectedTheme,
  selectedRatio,
}: TomorrowZoneSelectorProps) {
  return (
    <div>
      <div className="space-y-2.5">
        {/* 이자존 */}
        <button
          onClick={() => onZoneClick("interest")}
          className={`w-full p-4 rounded-xl border transition-all duration-200 ${
            tomorrowZone === "interest"
              ? "bg-blue-50 border-blue-200/80 shadow-sm"
              : "bg-gray-50 border-gray-200/80 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold ${tomorrowZone === "interest" ? 'text-blue-600' : 'text-gray-700'}`}>이자존</h3>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${tomorrowZone === "interest" ? 'text-blue-600 bg-blue-100' : 'text-gray-500 bg-gray-200'}`}>
                  위험도 0
                </span>
              </div>
              <p className={`text-xs ${tomorrowZone === "interest" ? 'text-gray-600' : 'text-gray-500'}`}>
                원금 100% 보호 · 안정적 이자
              </p>
            </div>
          </div>
        </button>

        {/* 이자워크존 */}
        <button
          onClick={() => {
            if (!hasRegionSelected) {
              showRegionAlert();
              return;
            }
            onZoneClick("extreme");
          }}
          className={`w-full p-4 rounded-xl border transition-all duration-200 ${
            tomorrowZone === "extreme"
              ? "bg-orange-50 border-orange-200/80 shadow-sm"
              : hasRegionSelected
                ? "bg-gray-50 border-gray-200/80 hover:bg-gray-100"
                : "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-br ${hasRegionSelected ? 'from-orange-500 to-orange-600' : 'from-gray-400 to-gray-500'} p-2 rounded-lg shadow-sm`}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold ${tomorrowZone === "extreme" ? 'text-orange-600' : hasRegionSelected ? 'text-gray-700' : 'text-gray-500'}`}>이자워크존</h3>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${tomorrowZone === "extreme" ? 'text-orange-600 bg-orange-100' : hasRegionSelected ? 'text-gray-500 bg-gray-200' : 'text-gray-400 bg-gray-200'}`}>
                  위험도 3
                </span>
              </div>
              <p className={`text-xs ${tomorrowZone === "extreme" ? 'text-gray-600' : hasRegionSelected ? 'text-gray-500' : 'text-gray-400'}`}>
                이자로만 투자 · 중위험 중수익
              </p>
              <p className={`text-[10px] mt-1 ${hasRegionSelected ? 'text-red-600' : 'text-gray-400'}`}>
                {hasRegionSelected ? "⚠️ 이자 손실 가능" : "🔒 지역 선택 필요"}
              </p>
              
              {/* 선택한 테마 표시 */}
              {tomorrowZone === "extreme" && selectedTheme && (
                <div className="mt-2 pt-2 border-t border-orange-200/50">
                  <p className="text-[11px] text-orange-600 font-medium">
                    선택한 테마: {selectedTheme}
                  </p>
                </div>
              )}
            </div>
          </div>
        </button>

        {/* 파워워크존 */}
        <button
          onClick={() => {
            if (!hasRegionSelected) {
              showRegionAlert();
              return;
            }
            onZoneClick("balance");
          }}
          className={`w-full p-4 rounded-xl border transition-all duration-200 ${
            tomorrowZone === "balance"
              ? "bg-purple-50 border-purple-200/80 shadow-sm"
              : hasRegionSelected
                ? "bg-gray-50 border-gray-200/80 hover:bg-gray-100"
                : "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-br ${hasRegionSelected ? 'from-purple-500 to-pink-500' : 'from-gray-400 to-gray-500'} p-2 rounded-lg shadow-sm`}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold ${tomorrowZone === "balance" ? 'text-purple-600' : hasRegionSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                  파워워크존{selectedRatio ? ` ${selectedRatio}%` : ''}
                </h3>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${tomorrowZone === "balance" ? 'text-purple-600 bg-purple-100' : hasRegionSelected ? 'text-gray-500 bg-gray-200' : 'text-gray-400 bg-gray-200'}`}>
                  위험도 5
                </span>
              </div>
              <p className={`text-xs ${tomorrowZone === "balance" ? 'text-gray-600' : hasRegionSelected ? 'text-gray-500' : 'text-gray-400'}`}>
                원금 일부 투자 · 고위험 고수익
              </p>
              <p className={`text-[10px] mt-1 ${hasRegionSelected ? 'text-orange-600' : 'text-gray-400'}`}>
                {hasRegionSelected ? "⚠️ 원금 일부 손실 가능" : "🔒 지역 선택 필요"}
              </p>
              
              {/* 선택한 투자 스타일 & 테마 표시 */}
              {tomorrowZone === "balance" && (selectedRatio || selectedTheme) && (
                <div className="mt-2 pt-2 border-t border-purple-200/50 space-y-1">
                  {selectedRatio && (
                    <p className="text-[11px] text-purple-600 font-medium">
                      선택한 투자: {selectedRatio === 25 && '안정형 원금 25%'}
                      {selectedRatio === 50 && '균형형 원금 50%'}
                      {selectedRatio === 75 && '공격형 원금 75%'}
                    </p>
                  )}
                  {selectedTheme && (
                    <p className="text-[11px] text-purple-600 font-medium">
                      선택한 테마: {selectedTheme}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
