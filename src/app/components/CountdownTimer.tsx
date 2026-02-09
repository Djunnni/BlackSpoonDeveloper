import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  const [hoursLeft, setHoursLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setHoursLeft(hours);
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // 남은 시간에 따라 색상 결정
  const getColorClasses = () => {
    if (hoursLeft >= 8) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        text: 'text-green-700',
      };
    } else if (hoursLeft >= 4) {
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        text: 'text-yellow-700',
      };
    } else if (hoursLeft >= 2) {
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        text: 'text-orange-700',
      };
    } else {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        text: 'text-red-700',
      };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 ${colors.bg} rounded-lg border ${colors.border}`}>
      <Clock className={`w-3.5 h-3.5 ${colors.icon}`} />
      <span className={`text-xs font-semibold ${colors.text} tabular-nums`}>
        {timeLeft}
      </span>
    </div>
  );
}
