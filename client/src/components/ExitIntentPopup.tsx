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
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[var(--optibio-navy)] to-[var(--optibio-navy-depth)] border-2 border-[var(--optibio-gold)] text-[var(--optibio-ivory)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[var(--optibio-ivory)]">
            Wait! Don't Leave Yet 👋
          </DialogTitle>
          <DialogDescription className="text-[var(--optibio-ivory)]/80 text-base">
            You're so close to feeling calmer, sleeping better, and having more energy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Offer */}
          <div className="bg-[var(--optibio-gold)]/10 border border-[var(--optibio-gold)]/30 rounded-lg p-4 text-center">
            <p className="text-sm text-[var(--optibio-ivory)]/70 mb-2">Special Offer Just For You</p>
            <p className="text-3xl font-bold text-[var(--optibio-gold)] mb-1">
              {discountPercent}% OFF
            </p>
            <p className="text-xs text-[var(--optibio-ivory)]/60 mb-3">Your First Order</p>
            <div className="bg-[var(--optibio-navy)] border border-[var(--optibio-gold)] rounded px-4 py-2 inline-block">
              <code className="text-[var(--optibio-gold)] font-mono font-bold tracking-wider">
                {discountCode}
              </code>
            </div>
          </div>

          {/* Benefits Reminder */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--optibio-ivory)]">
              Why Optibio Customers Love Us:
            </p>
            <ul className="space-y-1 text-sm text-[var(--optibio-ivory)]/80">
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
              className="w-full bg-gradient-to-r from-[var(--optibio-gold)] to-[var(--optibio-ivory)]0 hover:from-[var(--optibio-ivory)]0 hover:to-[var(--optibio-gold)] text-[var(--optibio-navy)] font-bold shadow-gold"
              size="lg"
            >
              Claim My {discountPercent}% Discount
            </Button>
            <button
              onClick={handleClose}
              className="w-full text-sm text-[var(--optibio-ivory)]/60 hover:text-[var(--optibio-ivory)] transition-colors"
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
          <X className="h-4 w-4 text-[var(--optibio-ivory)]" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
