import { Truck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatPrice } from "@/const";

/**
 * Free Shipping Progress Bar Component
 * 
 * Shows customers how close they are to qualifying for free shipping.
 * Encourages higher order values by visualizing progress.
 * 
 * Usage:
 * <FreeShippingProgressBar cartTotal={4999} threshold={7500} />
 * 
 * @param cartTotal - Current cart total in cents
 * @param threshold - Free shipping threshold in cents (default: 7500 = $75)
 */

interface FreeShippingProgressBarProps {
  cartTotal: number;
  threshold?: number;
}

export default function FreeShippingProgressBar({
  cartTotal,
  threshold = 7500, // $75 in cents
}: FreeShippingProgressBarProps) {
  const progress = Math.min((cartTotal / threshold) * 100, 100);
  const remaining = Math.max(threshold - cartTotal, 0);
  const qualified = cartTotal >= threshold;

  return (
    <div className="bg-gradient-to-r from-[var(--optibio-navy)]/5 to-[var(--optibio-gold)]/5 border border-[var(--optibio-gold)]/20 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Truck className={`h-5 w-5 ${qualified ? "text-[var(--optibio-gold)]" : "text-[var(--optibio-navy)]"}`} />
        <p className="text-sm font-semibold">
          {qualified ? (
            <span className="text-[var(--optibio-gold)]">
              🎉 You qualify for FREE shipping!
            </span>
          ) : (
            <span className="text-[var(--optibio-navy)]">
              You're {formatPrice(remaining)} away from FREE shipping
            </span>
          )}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <Progress
          value={progress}
          className="h-2 bg-[var(--optibio-navy)]/10"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(cartTotal)}</span>
          <span>{formatPrice(threshold)}</span>
        </div>
      </div>

      {/* Encouragement Message */}
      {!qualified && remaining < threshold && (
        <p className="text-xs text-muted-foreground">
          💡 Add {formatPrice(remaining)} more to your cart to unlock free shipping!
        </p>
      )}
    </div>
  );
}
