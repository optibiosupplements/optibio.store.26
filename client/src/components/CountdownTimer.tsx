import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export default function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={`bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-red-900 whitespace-nowrap">
          Pre-orders close in:
        </span>
        <div className="flex gap-1 sm:gap-2 text-red-900 font-bold">
          <div className="flex flex-col items-center min-w-[40px]">
            <span className="text-xl sm:text-2xl leading-none">{timeLeft.days}</span>
            <span className="text-[10px] sm:text-xs uppercase">Days</span>
          </div>
          <span className="text-xl sm:text-2xl">:</span>
          <div className="flex flex-col items-center min-w-[40px]">
            <span className="text-xl sm:text-2xl leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs uppercase">Hrs</span>
          </div>
          <span className="text-xl sm:text-2xl">:</span>
          <div className="flex flex-col items-center min-w-[40px]">
            <span className="text-xl sm:text-2xl leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs uppercase">Min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
