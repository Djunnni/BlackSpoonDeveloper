import { useState } from "react";
import { TrendingUp, Scale, Check, X } from "lucide-react";

type Zone = "interest" | "extreme" | "balance";

const THEMES = [
  {
    id: "us-tech",
    name: "미국 테크",
    icon: "🇺🇸",
    description: "나스닥100, S&P500 IT 섹터",
  },
  {
    id: "china-ev",
    name: "중국 전기차",
    icon: "🚗",
    description: "BYD, NIO 등 전기차",
  },
  {
    id: "semiconductor",
    name: "반도체",
    icon: "💾",
    description: "글로벌 반도체 산업",
  },
  {
    id: "bio",
    name: "바이오/제약",
    icon: "💊",
    description: "헬스케어 & 바이오",
  },
  {
    id: "energy",
    name: "에너지",
    icon: "⚡",
    description: "원유, 천연가스, 신재생",
  },
  {
    id: "battery",
    name: "2차전지",
    icon: "🔋",
    description: "배터리 소재 & 완제품",
  },
  {
    id: "ai",
    name: "AI/클라우드",
    icon: "🤖",
    description: "인공지능 & 클라우드",
  },
  { id: "finance", name: "금융", icon: "🏦", description: "은행, 증권, 보험" },
  { id: "reits", name: "리츠", icon: "🏢", description: "부동산 투자신탁" },
  {
    id: "commodity",
    name: "원자재",
    icon: "⛏️",
    description: "금, 은, 구리 등",
  },
];

const RATIO_OPTIONS = [
  {
    value: 25,
    label: "안정형",
    extreme: 25,
    interest: 75,
    description: "익스트림 25% · 이자 75%",
  },
  {
    value: 50,
    label: "균형형",
    extreme: 50,
    interest: 50,
    description: "익스트림 50% · 이자 50%",
  },
  {
    value: 75,
    label: "공격형",
    extreme: 75,
    interest: 25,
    description: "익스트림 75% · 이자 25%",
  },
];

interface TomorrowZoneSetupModalProps {
  zone: "extreme" | "balance";
  onSave: (zone: Zone) => void;
  onCancel: () => void;
}

export function TomorrowZoneSetupModal({
  zone,
  onSave,
  onCancel,
}: TomorrowZoneSetupModalProps) {
  const [selectedTheme, setSelectedTheme] = useState("us-tech");
  const [selectedRatio, setSelectedRatio] = useState(25);

  const handleSave = () => {
    onSave(zone);
  };

  if (zone === "extreme") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[75vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  익스트림존 설정
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  이자만으로 투자 · 고위험 고수익
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">테마 선택</h3>
                <p className="text-sm text-gray-600 mb-4">
                  투자할 테마를 선택하세요
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${
                      selectedTheme === theme.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl sm:text-3xl">{theme.icon}</span>
                      {selectedTheme === theme.id && (
                        <div className="p-0.5 bg-orange-500 rounded-full">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {theme.name}
                    </h4>
                    <p className="text-xs text-gray-600 leading-tight">
                      {theme.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-4 sm:p-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm sm:text-base"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-sm sm:text-base"
            >
              익스트림존으로 설정
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Balance Zone
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[70vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                밸런스존 설정
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                원금 일부 투자 · 중위험 중수익
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                투자 비율 선택
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                익스트림존과 이자존의 비율을 선택하세요
              </p>
            </div>

            <div className="space-y-3">
              {RATIO_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedRatio(option.value)}
                  className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all ${
                    selectedRatio === option.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-purple-600" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    {selectedRatio === option.value && (
                      <div className="p-1 bg-purple-500 rounded-full">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="relative h-6 sm:h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-blue-500 flex items-center justify-center"
                      style={{ width: `${option.interest}%` }}
                    >
                      {option.interest > 15 && (
                        <span className="text-xs sm:text-sm font-medium text-white">
                          {option.interest}%
                        </span>
                      )}
                    </div>
                    <div
                      className="absolute right-0 top-0 h-full bg-orange-500 flex items-center justify-center"
                      style={{ width: `${option.extreme}%` }}
                    >
                      {option.extreme > 15 && (
                        <span className="text-xs sm:text-sm font-medium text-white">
                          {option.extreme}%
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm sm:text-base"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm sm:text-base"
          >
            밸런스존으로 설정
          </button>
        </div>
      </div>
    </div>
  );
}
