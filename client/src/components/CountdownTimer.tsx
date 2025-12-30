import { useState, useEffect } from 'react';
import { Pause, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isPaused, setIsPaused] = useState(false);

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
    
    // Only run timer if not paused (WCAG 2.2.1 compliance)
    if (!isPaused) {
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [targetDate, isPaused]);

  return (
    <div className={`
      bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg px-4 py-3
      dark:from-[#1E3A5F]/80 dark:to-[#0B1120]/80 dark:border-[#D4AF37]/40 dark:bg-[#0B1120]
      transition-colors duration-500
      ${className}
    `}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-900 dark:text-[#D4AF37] countdown-pulse" />
          <span className="text-sm font-semibold text-red-900 dark:text-[#CBD5E1] whitespace-nowrap">
            Pre-orders close in:
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-[#1E3A5F]"
            aria-label={isPaused ? 'Resume countdown timer' : 'Pause countdown timer'}
            title={isPaused ? 'Resume timer' : 'Pause timer'}
          >
            {isPaused ? (
              <Play className="h-3 w-3 text-red-900 dark:text-[#D4AF37]" />
            ) : (
              <Pause className="h-3 w-3 text-red-900 dark:text-[#D4AF37]" />
            )}
          </Button>
        </div>
        <div className="flex gap-1 sm:gap-2 text-red-900 dark:text-[#D4AF37] font-bold">
          <div className="flex flex-col items-center min-w-[40px] countdown-pulse">
            <span className="text-xl sm:text-2xl leading-none countdown-number">{timeLeft.days}</span>
            <span className="text-[10px] sm:text-xs uppercase text-red-800 dark:text-[#CBD5E1]">Days</span>
          </div>
          <span className="text-xl sm:text-2xl">:</span>
          <div className="flex flex-col items-center min-w-[40px] countdown-pulse">
            <span className="text-xl sm:text-2xl leading-none countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs uppercase text-red-800 dark:text-[#CBD5E1]">Hrs</span>
          </div>
          <span className="text-xl sm:text-2xl">:</span>
          <div className="flex flex-col items-center min-w-[40px] countdown-pulse">
            <span className="text-xl sm:text-2xl leading-none countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs uppercase text-red-800 dark:text-[#CBD5E1]">Min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
