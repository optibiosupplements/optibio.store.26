import { useState, useEffect } from "react";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PreLaunchBanner() {
  // Calculate 90 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 90);
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = launchDate.getTime() - new Date().getTime();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#152B45] via-[#152B45] to-slate-900 text-white py-4 px-4 sticky top-0 z-50 shadow-lg border-b-2 border-yellow-400/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Pre-Launch Message */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <div>
              <p className="text-sm md:text-base font-bold">
                🔥 LIMITED TIME: Founder Pricing Ends in {timeLeft.days} Days
              </p>
              <p className="text-xs text-slate-300 hidden md:block">
                Lock in 25% off for life • Only 100 Founder spots available
              </p>
            </div>
          </div>

          {/* Center: Countdown Timer */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <Clock className="w-4 h-4 text-yellow-400" />
            <div className="flex gap-3 text-center font-mono">
              <div>
                <div className="text-lg md:text-xl font-bold text-yellow-400">{timeLeft.days}</div>
                <div className="text-[10px] text-slate-300 uppercase">Days</div>
              </div>
              <div className="text-yellow-400">:</div>
              <div>
                <div className="text-lg md:text-xl font-bold text-yellow-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-300 uppercase">Hrs</div>
              </div>
              <div className="text-yellow-400">:</div>
              <div>
                <div className="text-lg md:text-xl font-bold text-yellow-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-300 uppercase">Min</div>
              </div>
              <div className="text-yellow-400 hidden md:block">:</div>
              <div className="hidden md:block">
                <div className="text-lg md:text-xl font-bold text-yellow-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-300 uppercase">Sec</div>
              </div>
            </div>
          </div>

          {/* Right: CTA Button */}
          <Link href="/shop">
            <Button
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 py-2 shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              Shop Founder Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
