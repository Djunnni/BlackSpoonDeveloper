import { Shield, Info } from 'lucide-react';

export function InterestZone() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">이자존</h2>
            <p className="text-blue-100 text-sm">안전하게 이자를 받으세요</p>
          </div>
        </div>
        
        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-blue-100">현재 잔액</span>
            <span className="text-2xl font-bold">15,247,800원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-100">오늘 발생 이자</span>
            <span className="text-xl font-semibold text-green-300">+1,245원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-100">연 이자율</span>
            <span className="text-lg font-medium">3.5%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">이자존 특징</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>원금 100% 예금자보호 적용</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>매일 오전 9시 이자 자동 지급</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>언제든지 출금 가능 (수수료 없음)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>기본 예금과 동일한 안정성</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">이자 발생 내역 (최근 7일)</h3>
        <div className="space-y-3">
          {[
            { date: '2026-02-04', amount: 21500, change: 'up' },
            { date: '2026-02-03', amount: 21500, change: 'same' },
            { date: '2026-02-02', amount: 21500, change: 'up' },
            { date: '2026-02-01', amount: 21500, change: 'down' },
            { date: '2026-01-31', amount: 21500, change: 'up' },
            { date: '2026-01-30', amount: 21500, change: 'same' },
            { date: '2026-01-29', amount: 21500, change: 'up' },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <span className="text-sm text-gray-600">{item.date}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-600">+{item.amount.toLocaleString()}원</span>
                {item.change === 'up' && <span className="text-xs text-gray-500">▲</span>}
                {item.change === 'down' && <span className="text-xs text-gray-500">▼</span>}
                {item.change === 'same' && <span className="text-xs text-gray-500">-</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
