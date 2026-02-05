import { Shield, TrendingUp, Scale, ChevronRight } from 'lucide-react';

interface ZoneCardProps {
  zone: 'interest' | 'extreme' | 'balance';
  isActive: boolean;
  onClick: () => void;
  isToday?: boolean;
}

export function ZoneCard({ zone, isActive, onClick, isToday }: ZoneCardProps) {
  const configs = {
    interest: {
      icon: Shield,
      title: '이자존',
      subtitle: '원금 100% 보호 · 안정적 이자',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
    },
    extreme: {
      icon: TrendingUp,
      title: '익스트림존',
      subtitle: '이자로만 투자 · 고위험 고수익',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50',
    },
    balance: {
      icon: Scale,
      title: '밸런스존',
      subtitle: '원금 일부 투자 · 중위험 중수익',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50',
    },
  };

  const config = configs[zone];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border-2 transition-all ${
        isActive
          ? `${config.bgColor} ${config.borderColor}`
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${config.iconBg}`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-gray-900">
            {config.title}
          </h3>
          <p className="text-sm text-gray-600">{config.subtitle}</p>
        </div>
        {!isToday && <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
    </button>
  );
}
