import { useState } from 'react';
import { TrendingUp, AlertTriangle, Info, ArrowUpRight, ArrowDownRight, Zap, ChevronRight, Check } from 'lucide-react';

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
];

const MOCK_ASSETS = [
  { name: 'TIGER 미국나스닥100', ticker: 'NASDAQ 2X', change: 'up', amount: 45000, yesterdayAmount: 42000, type: '2배 레버리지' },
  { name: 'KODEX 미국S&P500선물', ticker: 'S&P500 3X', change: 'down', amount: 32000, yesterdayAmount: 33500, type: '3배 레버리지' },
  { name: 'TIGER 차이나전기차', ticker: 'CHINA EV', change: 'up', amount: 28000, yesterdayAmount: 25000, type: 'ETF' },
  { name: 'ARIRANG 2차전지', ticker: 'BATTERY', change: 'up', amount: 15000, yesterdayAmount: 14200, type: 'ETF' },
];

export function ExtremeZone() {
  const [selectedTheme, setSelectedTheme] = useState('us-tech');
  const [tomorrowTheme, setTomorrowTheme] = useState('us-tech');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const totalInvested = MOCK_ASSETS.reduce((sum, asset) => sum + asset.amount, 0);
  const totalYesterday = MOCK_ASSETS.reduce((sum, asset) => sum + asset.yesterdayAmount, 0);
  const totalReturn = totalInvested - totalYesterday;

  if (showThemeSelector) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">투자 테마 선택</h2>
            <p className="text-sm text-gray-600 mt-1">내일 23:59까지 선택한 테마로 투자됩니다</p>
          </div>
          <button
            onClick={() => setShowThemeSelector(false)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
          >
            닫기
          </button>
        </div>

        {/* Current Theme */}
        <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-orange-900">오늘 투자중인 테마</h3>
            <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">2026.02.04</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{THEMES.find(t => t.id === selectedTheme)?.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{THEMES.find(t => t.id === selectedTheme)?.name}</p>
              <p className="text-sm text-gray-600">{THEMES.find(t => t.id === selectedTheme)?.description}</p>
            </div>
          </div>
        </div>

        {/* Tomorrow Theme Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">내일 투자할 테마</h3>
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">2026.02.05</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTomorrowTheme(theme.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  tomorrowTheme === theme.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{theme.icon}</span>
                  {tomorrowTheme === theme.id && (
                    <div className="p-1 bg-orange-500 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{theme.name}</h4>
                <p className="text-xs text-gray-600">{theme.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => {
            setSelectedTheme(tomorrowTheme);
            setShowThemeSelector(false);
          }}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Check className="w-5 h-5" />
          <span>테마 선택 완료</span>
        </button>

        {/* Info */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">테마 투자 안내</h4>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>• 선택한 테마는 내일 00:00에 자동 적용됩니다</li>
            <li>• 23:59까지 언제든 변경 가능합니다</li>
            <li>• 각 테마는 2~5배 레버리지 ETF로 구성됩니다</li>
            <li>• 이자만으로 투자하므로 원금은 100% 보호됩니다</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900 mb-1">원금은 투자되지 않습니다</p>
            <p className="text-sm text-red-700">
              이자존에서 발생한 이자만을 사용하여 고위험 자산에 투자합니다. 
              원금은 100% 안전하게 보호됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Selector Button */}
      <button
        onClick={() => setShowThemeSelector(true)}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl p-5 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm text-orange-100">현재 투자 테마</p>
              <p className="text-lg font-bold">{THEMES.find(t => t.id === selectedTheme)?.name}</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6" />
        </div>
      </button>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">익스트림존</h2>
            <p className="text-red-100 text-sm">이자로 고수익 도전</p>
          </div>
        </div>
        
        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-red-100">투자 중인 이자</span>
            <span className="text-2xl font-bold">{totalInvested.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-100">전날 대비</span>
            <div className="flex items-center gap-1">
              {totalReturn > 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-300" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-yellow-300" />
              )}
              <span className={`text-xl font-semibold ${
                totalReturn > 0 ? 'text-green-300' : 'text-yellow-300'
              }`}>
                {totalReturn > 0 ? '+' : ''}{totalReturn.toLocaleString()}원
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-100">보호된 원금</span>
            <span className="text-lg font-medium">15,247,800원</span>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">보유 자산</h3>
        <div className="space-y-3">
          {MOCK_ASSETS.map((asset, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{asset.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{asset.ticker}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      asset.type.includes('레버리지')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {asset.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{asset.amount.toLocaleString()}원</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    {asset.change === 'up' ? (
                      <>
                        <span className="text-xs text-gray-500">전날 대비</span>
                        <span className="text-xs text-green-600">▲ {(asset.amount - asset.yesterdayAmount).toLocaleString()}원</span>
                      </>
                    ) : asset.change === 'down' ? (
                      <>
                        <span className="text-xs text-gray-500">전날 대비</span>
                        <span className="text-xs text-red-600">▼ {(asset.yesterdayAmount - asset.amount).toLocaleString()}원</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">전날과 동일</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">익스트림존 특징</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>원금은 절대 투자되지 않으며 100% 보호됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>이자존에서 발생한 이자만 투자에 사용됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>2~5배 레버리지 ETF 등 고위험 상품 투자 가능</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>실시간 매수·매도 가능 (거래 시간 내)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>손실 발생 시에도 원금은 안전하게 보호</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
