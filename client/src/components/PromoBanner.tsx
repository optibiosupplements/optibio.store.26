import { useState, useEffect } from "react";
import { X, Truck, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHIPPING_THRESHOLD_CENTS } from "@/const";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Check if banner was dismissed (stored in localStorage)
  useEffect(() => {
    const dismissed = localStorage.getItem("promoBannerDismissed");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("promoBannerDismissed", "true");
  };

  if (!isVisible) return null;

  // Calculate days remaining for founder pricing (90 days from Nov 10, 2025)
  const launchDate = new Date("2025-11-10");
  const endDate = new Date(launchDate);
  endDate.setDate(endDate.getDate() + 90);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="relative bg-gradient-to-r from-[#7C9885] to-[#6B8775] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          {/* Left: Free Shipping Message */}
          <div className="flex items-center gap-2.5 text-sm md:text-base font-semibold min-w-0">
            <Truck className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" strokeWidth={2.5} />
            <span className="whitespace-nowrap">
              Free shipping on orders over <span className="font-bold">${(SHIPPING_THRESHOLD_CENTS / 100).toFixed(0)}</span>
            </span>
          </div>

          {/* Center: Founder Pricing Countdown */}
          <div className="flex items-center gap-2.5 text-sm md:text-base font-bold bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
            <Sparkles className="w-5 h-5 flex-shrink-0 text-[#F4D06F]" fill="currentColor" />
            <span className="whitespace-nowrap">
              Founder Pricing: <span className="text-[#F4D06F]">{daysRemaining} days left</span>
            </span>
          </div>

          {/* Right: Dismiss Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 rounded-full hover:bg-white/20 flex-shrink-0 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}
