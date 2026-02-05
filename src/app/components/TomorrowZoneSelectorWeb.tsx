import { Shield, TrendingUp, Scale } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

type Zone = 'interest' | 'extreme' | 'balance';

interface TomorrowZoneSelectorWebProps {
  tomorrowZone: Zone;
  onZoneClick: (zone: Zone) => void;
}

export function TomorrowZoneSelectorWeb({ tomorrowZone, onZoneClick }: TomorrowZoneSelectorWebProps) {

  return (
    <div>
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900">내일 투자할 존</h3>
      </div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs text-gray-600 flex-1">내일 00:00에 자동 전환됩니다</p>
        <CountdownTimer />
      </div>
      <div className="space-y-2">
        <button
          onClick={() => onZoneClick('interest')}
          className={`w-full p-3 rounded-xl border-2 transition-all ${
            tomorrowZone === 'interest'
              ? 'bg-blue-50 border-blue-500'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">이자존</span>
          </div>
        </button>
        <button
          onClick={() => onZoneClick('extreme')}
          className={`w-full p-3 rounded-xl border-2 transition-all ${
            tomorrowZone === 'extreme'
              ? 'bg-orange-50 border-orange-500'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-left flex-1">
              <span className="text-sm font-medium text-gray-900">익스트림존</span>
              {tomorrowZone === 'extreme' && (
                <p className="text-xs text-orange-600">테마: 미국 테크</p>
              )}
            </div>
          </div>
        </button>
        <button
          onClick={() => onZoneClick('balance')}
          className={`w-full p-3 rounded-xl border-2 transition-all ${
            tomorrowZone === 'balance'
              ? 'bg-purple-50 border-purple-500'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Scale className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-left flex-1">
              <span className="text-sm font-medium text-gray-900">밸런스존</span>
              {tomorrowZone === 'balance' && (
                <p className="text-xs text-purple-600">안정형 (25%/75%)</p>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
