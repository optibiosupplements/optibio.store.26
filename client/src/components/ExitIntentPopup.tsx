import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";

/**
 * Exit-Intent Popup Component
 * 
 * Detects when user is about to leave the site and shows a popup
 * to encourage them to complete their purchase.
 * 
 * Triggers:
 * - Mouse moves to top of viewport (desktop)
 * - After 30 seconds on product/cart page (mobile fallback)
 * 
 * Only shows once per session to avoid annoyance.
 */

interface ExitIntentPopupProps {
  /** Minimum cart value to show popup (default: 0 - always show) */
  minCartValue?: number;
  /** Discount code to offer (optional) */
  discountCode?: string;
  /** Discount percentage to display */
  discountPercent?: number;
}

export default function ExitIntentPopup({
  minCartValue = 0,
  discountCode = "SAVE10",
  discountPercent = 10,
}: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Don't show if already shown in this session
    const shown = sessionStorage.getItem("exitIntentShown");
    if (shown) {
      setHasShown(true);
      return;
    }

    // Only show on product and cart pages
    const shouldShow =
      location.includes("/product/") ||
      location.includes("/cart") ||
      location.includes("/shop");

    if (!shouldShow) return;

    let timeoutId: NodeJS.Timeout;

    // Desktop: Detect mouse leaving viewport
    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse is moving towards top of page (leaving)
      if (e.clientY <= 10 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    // Mobile fallback: Show after 30 seconds on page
    timeoutId = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    }, 30000); // 30 seconds

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [location, hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContinueShopping = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#1E3A5F] to-[#0F1F3F] border-2 border-[#C9A961] text-[#F7F4EF]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#F7F4EF]">
            Wait! Don't Leave Yet 👋
          </DialogTitle>
          <DialogDescription className="text-[#F7F4EF]/80 text-base">
            You're so close to feeling calmer, sleeping better, and having more energy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Offer */}
          <div className="bg-[#C9A961]/10 border border-[#C9A961]/30 rounded-lg p-4 text-center">
            <p className="text-sm text-[#F7F4EF]/70 mb-2">Special Offer Just For You</p>
            <p className="text-3xl font-bold text-[#C9A961] mb-1">
              {discountPercent}% OFF
            </p>
            <p className="text-xs text-[#F7F4EF]/60 mb-3">Your First Order</p>
            <div className="bg-[#1E3A5F] border border-[#C9A961] rounded px-4 py-2 inline-block">
              <code className="text-[#C9A961] font-mono font-bold tracking-wider">
                {discountCode}
              </code>
            </div>
          </div>

          {/* Benefits Reminder */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#F7F4EF]">
              Why Optibio Customers Love Us:
            </p>
            <ul className="space-y-1 text-sm text-[#F7F4EF]/80">
              <li>✓ 90-Day Money-Back Guarantee</li>
              <li>✓ Free Shipping on Orders Over $75</li>
              <li>✓ Clinically Proven KSM-66® Formula</li>
              <li>✓ Ships in 1-2 Business Days</li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleContinueShopping}
              className="w-full bg-gradient-to-r from-[#C9A961] to-[#F7F4EF]0 hover:from-[#F7F4EF]0 hover:to-[#C9A961] text-[#1E3A5F] font-bold shadow-gold"
              size="lg"
            >
              Claim My {discountPercent}% Discount
            </Button>
            <button
              onClick={handleClose}
              className="w-full text-sm text-[#F7F4EF]/60 hover:text-[#F7F4EF] transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4 text-[#F7F4EF]" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
