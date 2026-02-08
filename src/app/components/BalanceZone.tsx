import { useEffect, useMemo, useRef, useState } from 'react';
import { Scale, Info, Shield, Zap, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

// ✅ 익스트림존 테마 10개를 그대로 "샘플 데이터"로 사용 (추후 서버 데이터로 대체)
const THEMES = [
  { id: 'us-tech', name: '미국 테크', icon: '🇺🇸', description: '나스닥100, S&P500 IT 섹터', color: 'bg-blue-500' },
  { id: 'china-ev', name: '중국 전기차', icon: '🚗', description: 'BYD, NIO 등 전기차', color: 'bg-green-500' },
  { id: 'semiconductor', name: '반도체', icon: '💾', description: '글로벌 반도체 산업', color: 'bg-purple-500' },
  { id: 'bio', name: '바이오/제약', icon: '💊', description: '헬스케어 & 바이오', color: 'bg-pink-500' },
  { id: 'energy', name: '에너지', icon: '⚡', description: '원유, 천연가스, 신재생', color: 'bg-yellow-500' },
  { id: 'battery', name: '2차전지', icon: '🔋', description: '배터리 소재 & 완제품', color: 'bg-orange-500' },
  { id: 'ai', name: 'AI/클라우드', icon: '🤖', description: '인공지능 & 클라우드', color: 'bg-indigo-500' },
  { id: 'finance', name: '금융', icon: '🏦', description: '은행, 증권, 보험', color: 'bg-cyan-500' },
  { id: 'reits', name: '리츠', icon: '🏢', description: '부동산 투자신탁', color: 'bg-teal-500' },
  { id: 'commodity', name: '원자재', icon: '⛏️', description: '금, 은, 구리 등', color: 'bg-amber-500' },
] as const;

type ThemeId = (typeof THEMES)[number]['id'];

function pickRandomTheme(): ThemeId {
  const idx = Math.floor(Math.random() * THEMES.length);
  return THEMES[idx].id;
}

export function BalanceZone() {
  const [extremeRatio, setExtremeRatio] = useState(25); // 오늘 익스트림존 비율
  const [tomorrowExtremeRatio, setTomorrowExtremeRatio] = useState(25); // 내일 적용될 익스트림 비율

  const totalBalance = 15247800;
  const interestRatio = 100 - extremeRatio;
  const extremeAmount = totalBalance * (extremeRatio / 100);
  const interestAmount = totalBalance * (interestRatio / 100);
  const dailyInterest = 1245;
  const investmentReturn = 3.2;

  const ratioOptions = [
    { value: 25, label: '안정형', extreme: 25, interest: 75, description: '익스트림 25% · 이자 75%', color: 'blue' },
    { value: 50, label: '균형형', extreme: 50, interest: 50, description: '익스트림 50% · 이자 50%', color: 'purple' },
    { value: 75, label: '공격형', extreme: 75, interest: 25, description: '익스트림 75% · 이자 25%', color: 'orange' },
  ] as const;

  const tomorrowLabel = useMemo(() => {
    return ratioOptions.find(r => r.value === tomorrowExtremeRatio)?.label ?? '선택';
  }, [tomorrowExtremeRatio]);

  // =========================
  // ✅ AI 테마 추천 (샘플)
  // =========================
  const [aiThemeId, setAiThemeId] = useState<ThemeId | null>(null);
  const [aiOpen, setAiOpen] = useState<boolean>(true);

  const aiSectionRef = useRef<HTMLDivElement | null>(null);

  const selectedTheme = useMemo(() => {
    return THEMES.find(t => t.id === aiThemeId) ?? null;
  }, [aiThemeId]);

  useEffect(() => {
    if (!aiThemeId) return;
    // ✅ 추천 생성되면 자동 스크롤
    aiSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [aiThemeId]);

  const handleAiRecommend = () => {
    const next = pickRandomTheme();
    setAiThemeId(next);
    setAiOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">밸런스존</h2>
            <p className="text-purple-100 text-sm">익스트림과 이자의 균형</p>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-purple-100">총 잔액</span>
            <span className="text-2xl font-bold">{totalBalance.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-100">오늘 발생</span>
            <span className="text-xl font-semibold text-green-300">
              +{(dailyInterest + (extremeAmount * investmentReturn / 100)).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* Current Ratio */}
      <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-purple-900">오늘 투자 비율</h3>
          <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full">2026.02.04</span>
        </div>
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              {ratioOptions.find(r => r.value === extremeRatio)?.label}
            </span>
            <span className="text-sm text-gray-600">
              {ratioOptions.find(r => r.value === extremeRatio)?.description}
            </span>
          </div>
          <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 flex items-center justify-center transition-all duration-300"
              style={{ width: `${interestRatio}%` }}
            >
              {interestRatio > 15 && (
                <div className="flex items-center gap-2 text-white">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">이자존 {interestRatio}%</span>
                </div>
              )}
            </div>
            <div
              className="absolute right-0 top-0 h-full bg-orange-500 flex items-center justify-center transition-all duration-300"
              style={{ width: `${extremeRatio}%` }}
            >
              {extremeRatio > 15 && (
                <div className="flex items-center gap-2 text-white">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">익스트림 {extremeRatio}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tomorrow Ratio Selection */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">내일 투자 비율 선택</h3>
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">2026.02.05</span>
        </div>
        <p className="text-xs text-gray-600 mb-4">내일 00:00에 선택한 비율로 자동 전환됩니다</p>

        <div className="space-y-3">
          {ratioOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTomorrowExtremeRatio(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                tomorrowExtremeRatio === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      option.color === 'blue'
                        ? 'bg-blue-100'
                        : option.color === 'purple'
                        ? 'bg-purple-100'
                        : 'bg-orange-100'
                    }`}
                  >
                    <Scale
                      className={`w-5 h-5 ${
                        option.color === 'blue'
                          ? 'text-blue-600'
                          : option.color === 'purple'
                          ? 'text-purple-600'
                          : 'text-orange-600'
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                {tomorrowExtremeRatio === option.value && (
                  <div className="p-1 bg-purple-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 flex items-center justify-center"
                  style={{ width: `${option.interest}%` }}
                >
                  {option.interest > 15 && <span className="text-xs font-medium text-white">{option.interest}%</span>}
                </div>
                <div
                  className="absolute right-0 top-0 h-full bg-orange-500 flex items-center justify-center"
                  style={{ width: `${option.extreme}%` }}
                >
                  {option.extreme > 15 && <span className="text-xs font-medium text-white">{option.extreme}%</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ AI 추천: 추천 이유/시장분석 완전 삭제(테마만 보여줌) */}
      <div ref={aiSectionRef} className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">AI 추천</h3>

          {/* ✅ AI 추천 옆에 랜덤 테마(아이콘+이름) */}
          {selectedTheme ? (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${selectedTheme.color} text-white`}>
              {selectedTheme.icon} {selectedTheme.name}
            </span>
          ) : (
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">미선택</span>
          )}
        </div>

        {/* ✅ 버튼: AI를 통한 테마 추천받기 */}
        <button
          onClick={handleAiRecommend}
          className="w-full rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white p-4 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm text-white/80">내일 투자 비율: {tomorrowLabel}</p>
                <p className="text-lg font-bold">AI를 통한 테마 추천받기</p>
              </div>
            </div>

            {/* 버튼 우측에도 동일하게 테마 배지 */}
            {selectedTheme ? (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${selectedTheme.color} text-white`}>
                {selectedTheme.icon} {selectedTheme.name}
              </span>
            ) : (
              <span className="text-xs font-semibold bg-white/15 px-3 py-1 rounded-full">AI 추천</span>
            )}
          </div>
        </button>

        {/* ✅ 펼치기/접기 UI는 남기되, 내용(추천이유/시장분석)은 제거 */}
        {selectedTheme && (
          <div className="mt-3 rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    AI 추천
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${selectedTheme.color} text-white`}>
                    {selectedTheme.icon} {selectedTheme.name}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">· {selectedTheme.description}</span>
                </div>

                <button
                  onClick={() => setAiOpen(v => !v)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  {aiOpen ? (
                    <>
                      접기 <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      펼치기 <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* ✅ 내용 제거: 배지(비율/자동적용)만 남김 */}
              <div className={`transition-all ${aiOpen ? 'mt-4 opacity-100' : 'mt-0 opacity-0 h-0 overflow-hidden'}`}>
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      이자존 비율 {100 - tomorrowExtremeRatio}%
                    </span>
                    <span className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                      익스트림존 비율 {tomorrowExtremeRatio}%
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      내일 00:00 자동 적용
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  ※ 현재는 서버 미구현으로 샘플 데이터(10개 테마)에서 랜덤 추천됩니다.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Amount Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900 font-medium">이자존 비율</span>
          </div>
          <p className="text-xl font-bold text-blue-600">{interestAmount.toLocaleString()}원</p>
          <p className="text-xs text-blue-700 mt-1">원금 보호 + 안정적 이자</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-900 font-medium">익스트림존 비율</span>
          </div>
          <p className="text-xl font-bold text-orange-600">{extremeAmount.toLocaleString()}원</p>
          <p className="text-xs text-orange-700 mt-1">고위험 고수익 투자</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">밸런스존 특징</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>익스트림존과 이자존의 비율을 선택 (25%, 50%, 75%)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>이자존 비율만큼 원금이 100% 보호됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>익스트림존 비율만큼 고수익 투자에 활용됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>23:59까지 내일 비율 변경 가능</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>자신의 투자 성향에 맞게 선택하세요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
