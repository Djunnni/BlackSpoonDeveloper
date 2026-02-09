import { Shield, TrendingUp, Zap, ChevronRight } from 'lucide-react';

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
      gradient: 'from-blue-500/20 to-blue-600/10',
      iconGradient: 'from-blue-400 to-blue-600',
      glowColor: 'shadow-blue-500/20',
      borderColor: 'border-blue-500/50',
      textColor: 'text-blue-400',
    },
    extreme: {
      icon: TrendingUp,
      title: '이자워크존',
      subtitle: '이자로만 투자 · 중위험 중수익',
      gradient: 'from-orange-500/20 to-orange-600/10',
      iconGradient: 'from-orange-400 to-orange-600',
      glowColor: 'shadow-orange-500/20',
      borderColor: 'border-orange-500/50',
      textColor: 'text-orange-400',
    },
    balance: {
      icon: Zap,
      title: '파워워크존',
      subtitle: '원금 일부 투자 · 고위험 고수익',
      gradient: 'from-purple-500/20 to-pink-600/10',
      iconGradient: 'from-purple-400 to-pink-500',
      glowColor: 'shadow-purple-500/20',
      borderColor: 'border-purple-500/50',
      textColor: 'text-purple-400',
    },
  };

  const config = configs[zone];
  const Icon = config.icon;

  const activeStyles = {
    interest: 'bg-blue-50 border-blue-300',
    extreme: 'bg-orange-50 border-orange-300',
    balance: 'bg-purple-50 border-purple-300',
  };

  const iconColors = {
    interest: 'from-blue-500 to-blue-600',
    extreme: 'from-orange-500 to-orange-600',
    balance: 'from-purple-500 to-pink-500',
  };

  const textColors = {
    interest: 'text-blue-600',
    extreme: 'text-orange-600',
    balance: 'text-purple-600',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border transition-all duration-200 ${
        isActive
          ? `${activeStyles[zone]} shadow-md`
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`bg-gradient-to-br ${iconColors[zone]} p-2 rounded-lg shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <h3 className={`font-semibold ${isActive ? textColors[zone] : 'text-gray-700'}`}>
            {config.title}
          </h3>
          <p className={`text-xs ${isActive ? 'text-gray-600' : 'text-gray-500'}`}>{config.subtitle}</p>
        </div>
        {!isToday && <ChevronRight className={`w-5 h-5 ${isActive ? textColors[zone] : 'text-gray-400'}`} />}
      </div>
    </button>
  );
}
