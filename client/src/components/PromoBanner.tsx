import { useState, useEffect } from "react";
import { X, Truck, Clock } from "lucide-react";
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
    <div className="relative bg-gradient-to-r from-primary/90 to-primary text-primary-foreground py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Free Shipping Message */}
        <div className="flex items-center gap-2 text-sm md:text-base flex-1 min-w-0">
          <Truck className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium truncate">
            Free shipping on orders over ${(SHIPPING_THRESHOLD_CENTS / 100).toFixed(0)}
          </span>
        </div>

        {/* Center: Founder Pricing Countdown */}
        <div className="flex items-center gap-2 text-sm md:text-base font-bold">
          <Clock className="w-5 h-5 flex-shrink-0" />
          <span>
            Founder Pricing: <span className="text-accent">{daysRemaining} days left</span>
          </span>
        </div>

        {/* Right: Dismiss Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="h-8 w-8 rounded-full hover:bg-primary-foreground/20 flex-shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
