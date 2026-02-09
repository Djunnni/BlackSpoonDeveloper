import { useState } from "react";
import { TrendingUp, Scale, Check, X, Sparkles, MessageCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Zone = "interest" | "extreme" | "balance";

const THEMES = [
  { id: "us-tech", name: "미국 테크", icon: "🇺🇸", description: "나스닥100, S&P500 IT 섹터" },
  { id: "china-ev", name: "중국 전기차", icon: "🚗", description: "BYD, NIO 등 전기차" },
  { id: "semiconductor", name: "반도체", icon: "💾", description: "글로벌 반도체 산업" },
  { id: "bio", name: "바이오/제약", icon: "💊", description: "헬스케어 & 바이오" },
  { id: "energy", name: "에너지", icon: "⚡", description: "원유, 천연가스, 신재생" },
  { id: "battery", name: "2차전지", icon: "🔋", description: "배터리 소재 & 완제품" },
  { id: "ai", name: "AI/클라우드", icon: "🤖", description: "인공지능 & 클라우드" },
  { id: "finance", name: "금융", icon: "🏦", description: "은행, 증권, 보험" },
  { id: "reits", name: "리츠", icon: "🏢", description: "부동산 투자신탁" },
  { id: "commodity", name: "원자재", icon: "⛏️", description: "금, 은, 구리 등" },
];

const RATIO_OPTIONS = [
  {
    value: 25,
    label: "안정형",
    principal: 25,
    interest: 100,
    headline: "원금 25% + 이자 100%",
    note: "(포인트 이자로 자동 전환)",
  },
  {
    value: 50,
    label: "균형형",
    principal: 50,
    interest: 100,
    headline: "원금 50% + 이자 100%",
    note: "(포인트 이자로 자동 전환)",
  },
  {
    value: 75,
    label: "공격형",
    principal: 75,
    interest: 100,
    headline: "원금 75% + 이자 100%",
    note: "(포인트 이자로 자동 전환)",
  },
];

interface AIRecommendation {
  themeId?: string;
  ratioValue?: number;
  reason: string;
  marketAnalysis: string;
}

interface TomorrowZoneSetupModalProps {
  zone: "extreme" | "balance";
  onSave: (zone: Zone, options?: { theme?: string; ratio?: number }) => void;
  onCancel: () => void;
}

function pickRandomThemeId(): string {
  const idx = Math.floor(Math.random() * THEMES.length);
  return THEMES[idx]?.id ?? "us-tech";
}

function buildThemeRecommendation(themeId: string): Pick<AIRecommendation, "reason" | "marketAnalysis"> {
  const map: Record<string, { reason: string; marketAnalysis: string }> = {
    "us-tech": {
      reason: "미국 테크는 대형 우량주 중심으로 시장 충격에 비교적 강하고, 장기 성장 스토리가 뚜렷합니다.",
      marketAnalysis:
        "AI·클라우드 투자와 소프트웨어 구독 매출 비중이 높아 실적 안정성이 상대적으로 좋습니다. 다만 금리/규제 이슈로 단기 변동성이 생길 수 있어 분할 접근이 유리합니다.",
    },
    "china-ev": {
      reason: "중국 전기차는 정책·보급 확대의 영향이 크고, 가격 경쟁력을 바탕으로 점유율 변화가 빠릅니다.",
      marketAnalysis:
        "보조금/규제/수출 환경 변화에 민감해 변동성이 클 수 있습니다. 다만 원가 절감과 신모델 주기에서 모멘텀이 발생하면 단기간 탄력이 커질 수 있습니다.",
    },
    semiconductor: {
      reason: "반도체는 경기 순환을 타지만, AI·데이터센터 수요로 고부가 영역 성장성이 큽니다.",
      marketAnalysis:
        "메모리 사이클과 공급 조절, HBM·AI 가속기 수요가 핵심 변수입니다. 업황 전환 구간에서는 급등락이 가능하므로 리스크 관리가 중요합니다.",
    },
    bio: {
      reason: "바이오/제약은 신약 모멘텀과 실적 방어력이 공존해 분산 투자 관점에서 매력적입니다.",
      marketAnalysis:
        "임상 결과·규제 승인 등 이벤트 드리븐 변동성이 존재합니다. 대형 제약/헬스케어 중심으로 접근하면 리스크를 일부 완화할 수 있습니다.",
    },
    energy: {
      reason: "에너지는 인플레이션·지정학 리스크 구간에서 방어적 성격이 나타나기 쉽습니다.",
      marketAnalysis:
        "원유/가스 가격과 OPEC 정책, 수요 둔화가 주요 변수입니다. 신재생 비중이 커질수록 정책·금리 환경도 함께 확인하는 것이 좋습니다.",
    },
    battery: {
      reason: "2차전지는 전기차/ESS 확산의 수혜를 받으며, 소재·공정 혁신에 따라 밸류체인이 함께 움직입니다.",
      marketAnalysis:
        "메탈 가격(리튬/니켈)과 수요 둔화, 고객사 증설 속도에 따라 변동성이 큽니다. 구조적으로는 장기 성장 테마로 평가받습니다.",
    },
    ai: {
      reason: "AI/클라우드는 생산성 혁신의 중심에 있어 성장 기대가 크고, 시장 관심이 집중되는 구간입니다.",
      marketAnalysis:
        "모멘텀은 강하지만 밸류에이션 부담과 단기 과열이 동시에 나타날 수 있습니다. 뉴스/실적에 민감하므로 비중 조절과 손익 관리가 중요합니다.",
    },
    finance: {
      reason: "금융은 금리 환경과 경기 흐름에 따라 실적 가시성이 비교적 높은 편입니다.",
      marketAnalysis:
        "금리 인하/인상 국면, 대손 비용, 규제 변화가 핵심입니다. 배당/자사주 등 주주환원 정책이 강화되면 방어력에 도움이 됩니다.",
    },
    reits: {
      reason: "리츠는 배당 기반의 현금흐름을 기대할 수 있어 안정적인 투자 성향에 적합합니다.",
      marketAnalysis:
        "금리와 공실률, 임대료 지표가 중요합니다. 금리 부담이 완화되면 평가가 개선될 수 있으나, 섹터별(오피스/물류/리테일) 차이가 큽니다.",
    },
    commodity: {
      reason: "원자재는 인플레이션·공급망 이슈에 대한 헤지 수단으로 활용되기도 합니다.",
      marketAnalysis:
        "달러 강세/약세, 공급 쇼크, 수요 사이클에 따라 변동성이 큽니다. 단기 트레이딩 성격이 강할 수 있어 포지션 관리가 필요합니다.",
    },
  };

  return (
    map[themeId] ?? {
      reason: "선택된 테마는 현재 시장 흐름에서 주목도가 높아 포트폴리오 분산에 도움이 될 수 있습니다.",
      marketAnalysis:
        "단기 변동성은 존재할 수 있으나, 주요 지표(실적/정책/수요)를 함께 점검하면 리스크를 줄일 수 있습니다.",
    }
  );
}

export function TomorrowZoneSetupModal({ zone, onSave, onCancel }: TomorrowZoneSetupModalProps) {
  const [selectedTheme, setSelectedTheme] = useState("us-tech");
  const [selectedRatio, setSelectedRatio] = useState(25);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [extremeRatioSelected] = useState(true);

  const handleAIRecommendation = async () => {
    setIsLoadingAI(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (zone === "extreme") {
      const themeId = "ai";
      const copy = buildThemeRecommendation(themeId);

      const mockRecommendation: AIRecommendation = {
        themeId,
        reason: copy.reason,
        marketAnalysis: copy.marketAnalysis,
      };

      setAiRecommendation(mockRecommendation);
      setSelectedTheme(themeId);
    } else {
      setSelectedRatio(25);

      const themeId = pickRandomThemeId();
      const copy = buildThemeRecommendation(themeId);

      const mockRecommendation: AIRecommendation = {
        themeId,
        reason: copy.reason,
        marketAnalysis: copy.marketAnalysis,
      };

      setAiRecommendation(mockRecommendation);
      setSelectedTheme(themeId);
    }

    setShowAIRecommendation(true);
    setIsLoadingAI(false);
  };

  const handleSave = () => {
    if (zone === "extreme") {
      const selectedThemeData = THEMES.find((t) => t.id === selectedTheme);
      onSave(zone, { theme: selectedThemeData?.name });
    } else {
      const selectedThemeData = THEMES.find((t) => t.id === selectedTheme);
      onSave(zone, { ratio: selectedRatio, theme: selectedThemeData?.name });
    }
  };

  const recommendedTheme = aiRecommendation?.themeId
    ? THEMES.find((t) => t.id === aiRecommendation.themeId)
    : null;

  if (zone === "extreme") {
    return (
      <>
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            duration: 2000,
            style: {
              background: '#fff',
              color: '#1f2937',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid #f3f4f6',
              marginBottom: '100px', // 네이티브 탭바 위로 올리기
            },
          }} 
        />
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">이자워크존 설정</h2>
                <p className="text-xs sm:text-sm text-gray-600">이자만으로 투자 · 중위험 중수익</p>
              </div>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-6">
              {/* AI Recommendation Button */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-gray-100">
                <button
                  onClick={handleAIRecommendation}
                  disabled={isLoadingAI}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  {isLoadingAI ? "AI 분석 중..." : "AI를 통한 테마 추천받기"}
                </button>
                <p className="mt-3 text-[11px] text-gray-500 text-center leading-relaxed whitespace-nowrap">
                  💡 인기 테마 기반 AI 추천입니다. 투자 결정은 신중히 하세요.
                </p>
              </div>

              {/* AI Recommendation Result */}
              {showAIRecommendation && aiRecommendation && (
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">AI 추천</h4>
                    </div>

                    {recommendedTheme && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-purple-200 rounded-full">
                        <span className="text-base">{recommendedTheme.icon}</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">
                          {recommendedTheme.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {recommendedTheme && (
                    <div className="mb-3 p-3 bg-white/80 rounded-lg border border-purple-100">
                      <p className="text-xs text-gray-500 mb-1">추천 테마</p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        {recommendedTheme.name}
                      </p>
                      <p className="text-xs text-gray-600 leading-snug mt-1">
                        {recommendedTheme.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="p-3 bg-white/80 rounded-lg border border-purple-100">
                      <p className="text-xs font-semibold text-purple-700 mb-2">추천 이유</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{aiRecommendation.reason}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        toast.dismiss();
                        toast.success("AI 상담 기능은 준비 중입니다", { id: 'ai-consult' });
                      }}
                      className="w-full p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">AI 상담사와 대화하기</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 투자 비율 - 고정 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">투자 비율</h3>
                <p className="text-sm text-gray-600 mb-3">
                  이자워크존은 이자만으로 투자하여 원금을 100% 보호합니다
                </p>
                
                <div className={`w-full p-4 rounded-xl border-2 transition-all ${
                  extremeRatioSelected
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 mb-0.5">안정형 이자 투자</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-orange-600">이자 100%</span>
                          <span className="text-xs text-gray-500">·</span>
                          <span className="text-sm font-medium text-blue-600">원금 보호</span>
                        </div>
                      </div>
                    </div>

                    {extremeRatioSelected && (
                      <div className="p-1.5 bg-orange-500 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 테마 선택 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">테마 선택</h3>
                <p className="text-sm text-gray-600 mb-4">투자할 테마를 선택하세요</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      toast.dismiss();
                      toast.success(`${theme.icon} ${theme.name} 테마가 선택되었어요`, { id: 'theme-select' });
                    }}
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
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{theme.name}</h4>
                    <p className="text-xs text-gray-600 leading-tight">{theme.description}</p>
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
              이자워크존으로 설정
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Balance Zone (파워워크존)
  return (
    <>
      <Toaster 
        position="bottom-center" 
        toastOptions={{
          duration: 2000,
          style: {
            background: '#fff',
            color: '#1f2937',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #f3f4f6',
            marginBottom: '100px', // 네이티브 탭바 위로 올리기
          },
        }} 
      />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">파워워크존 설정</h2>
              <p className="text-xs sm:text-sm text-gray-600">원금 일부 투자 · 고위험 고수익</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* AI Recommendation Button */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-gray-100">
              <button
                onClick={handleAIRecommendation}
                disabled={isLoadingAI}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                {isLoadingAI ? "AI 분석 중..." : "AI를 통한 테마 추천받기"}
              </button>
              <p className="mt-3 text-[11px] text-gray-500 text-center leading-relaxed whitespace-nowrap">
                💡 인기 테마 기반 AI 추천입니다. 투자 결정은 신중히 하세요.
              </p>
            </div>

            {/* AI Recommendation Result */}
            {showAIRecommendation && aiRecommendation && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">AI 추천</h4>
                  </div>

                  {recommendedTheme && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-purple-200 rounded-full">
                      <span className="text-base">{recommendedTheme.icon}</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {recommendedTheme.name}
                      </span>
                    </div>
                  )}
                </div>

                {recommendedTheme && (
                  <div className="mb-3 p-3 bg-white/80 rounded-lg border border-purple-100">
                    <p className="text-xs text-gray-500 mb-1">추천 테마</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">
                      {recommendedTheme.name}
                    </p>
                    <p className="text-xs text-gray-600 leading-snug mt-1">
                      {recommendedTheme.description}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="p-3 bg-white/80 rounded-lg border border-purple-100">
                    <p className="text-xs font-semibold text-purple-700 mb-2">추천 이유</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiRecommendation.reason}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      toast.dismiss();
                      toast.success("AI 상담 기능은 준비 중입니다", { id: 'ai-consult' });
                    }}
                    className="w-full p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">AI 상담사와 대화하기</span>
                  </button>
                </div>
              </div>
            )}

            {/* 투자 비율 선택 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">투자 비율 선택</h3>
              <p className="text-sm text-gray-600 mb-4">
                원금 투자 비율을 선택하세요
                <br />
                <span className="text-xs text-gray-500">이자 투자 100% 고정 · 포인트 이자로 자동 전환</span>
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
                        <p className="font-semibold text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-700 leading-snug">{option.headline}</p>
                        <p className="text-xs text-gray-500 leading-snug">{option.note}</p>
                      </div>
                    </div>

                    {selectedRatio === option.value && (
                      <div className="p-1 bg-purple-500 rounded-full">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs sm:text-sm text-gray-600">원금 투자</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {option.principal}%
                        </p>
                      </div>
                      <div className="relative h-2.5 sm:h-3 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-purple-500"
                          style={{ width: `${option.principal}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs sm:text-sm text-gray-600">이자 투자 (고정)</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {option.interest}%
                        </p>
                      </div>
                      <div className="relative h-2.5 sm:h-3 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-orange-500"
                          style={{ width: `${option.interest}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 테마 선택 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">테마 선택</h3>
              <p className="text-sm text-gray-600 mb-4">투자할 테마를 선택하세요</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    toast.dismiss();
                    toast.success(`${theme.icon} ${theme.name} 테마가 선택되었어요`, { id: 'theme-select' });
                  }}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTheme === theme.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl sm:text-3xl">{theme.icon}</span>
                    {selectedTheme === theme.id && (
                      <div className="p-0.5 bg-purple-500 rounded-full">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{theme.name}</h4>
                  <p className="text-xs text-gray-600 leading-tight">{theme.description}</p>
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
            파워워크존으로 설정
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
