import { Scale, Info, Shield, TrendingUp, Zap, Check } from 'lucide-react';
import { useState } from 'react';

export function BalanceZone() {
  const [extremeRatio, setExtremeRatio] = useState(25); // 익스트림존 비율: 25%, 50%, 75%
  const [tomorrowExtremeRatio, setTomorrowExtremeRatio] = useState(25);
  
  const totalBalance = 15247800;
  const interestRatio = 100 - extremeRatio;
  const extremeAmount = totalBalance * (extremeRatio / 100);
  const interestAmount = totalBalance * (interestRatio / 100);
  const dailyInterest = 1245;
  const investmentReturn = 3.2;

  const ratioOptions = [
    { 
      value: 25, 
      label: '안정형', 
      extreme: 25, 
      interest: 75,
      description: '익스트림 25% · 이자 75%',
      color: 'blue'
    },
    { 
      value: 50, 
      label: '균형형', 
      extreme: 50, 
      interest: 50,
      description: '익스트림 50% · 이자 50%',
      color: 'purple'
    },
    { 
      value: 75, 
      label: '공격형', 
      extreme: 75, 
      interest: 25,
      description: '익스트림 75% · 이자 25%',
      color: 'orange'
    },
  ];

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
                  <div className={`p-2 rounded-lg ${
                    option.color === 'blue' ? 'bg-blue-100' :
                    option.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Scale className={`w-5 h-5 ${
                      option.color === 'blue' ? 'text-blue-600' :
                      option.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
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
                  {option.interest > 15 && (
                    <span className="text-xs font-medium text-white">{option.interest}%</span>
                  )}
                </div>
                <div
                  className="absolute right-0 top-0 h-full bg-orange-500 flex items-center justify-center"
                  style={{ width: `${option.extreme}%` }}
                >
                  {option.extreme > 15 && (
                    <span className="text-xs font-medium text-white">{option.extreme}%</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
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
