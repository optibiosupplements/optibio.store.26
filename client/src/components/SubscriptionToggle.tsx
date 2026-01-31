import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface SubscriptionToggleProps {
  oneTimePrice: number;
  subscriptionPrice: number;
  subscriptionDiscount: number; // percentage
  onSelectionChange?: (isSubscription: boolean) => void;
  defaultSubscription?: boolean;
}

/**
 * Subscription Toggle Component
 * 
 * Prominently displays Subscribe & Save option as default choice
 * with clear value proposition and benefits.
 * 
 * Features:
 * - Subscribe & Save as default selection
 * - Clear savings display
 * - Benefit list for subscription
 * - Easy toggle between options
 * - Mobile responsive
 */
export default function SubscriptionToggle({
  oneTimePrice,
  subscriptionPrice,
  subscriptionDiscount,
  onSelectionChange,
  defaultSubscription = true,
}: SubscriptionToggleProps) {
  const [isSubscription, setIsSubscription] = useState(defaultSubscription);

  const handleToggle = (subscription: boolean) => {
    setIsSubscription(subscription);
    onSelectionChange?.(subscription);
  };

  const savings = oneTimePrice - subscriptionPrice;
  const savingsPercentage = Math.round((savings / oneTimePrice) * 100);

  return (
    <div className="space-y-3">
      {/* Subscribe & Save Option - DEFAULT */}
      <Card
        className={`cursor-pointer transition-all ${
          isSubscription
            ? "border-2 border-[var(--optibio-gold)] bg-[var(--optibio-gold)]/5 shadow-lg"
            : "border border-border hover:border-[var(--optibio-gold)]/50"
        }`}
        onClick={() => handleToggle(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Radio Button */}
            <div className="flex-shrink-0 mt-1">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSubscription
                    ? "border-[var(--optibio-gold)] bg-[var(--optibio-gold)]"
                    : "border-gray-300"
                }`}
              >
                {isSubscription && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg">Subscribe & Save {subscriptionDiscount}%</h3>
                <Badge className="bg-[var(--optibio-gold)] text-[var(--optibio-navy)] font-bold">
                  BEST VALUE
                </Badge>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[var(--optibio-navy)]">
                  ${subscriptionPrice.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${oneTimePrice.toFixed(2)}
                </span>
                <span className="text-sm text-[var(--optibio-gold)] font-semibold">
                  Save ${savings.toFixed(2)}/month
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--optibio-gold)] flex-shrink-0 mt-0.5" />
                  <span>Free shipping on every order</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--optibio-gold)] flex-shrink-0 mt-0.5" />
                  <span>Cancel, pause, or skip anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--optibio-gold)] flex-shrink-0 mt-0.5" />
                  <span>Never run out - automatic deliveries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--optibio-gold)] flex-shrink-0 mt-0.5" />
                  <span>Manage your subscription online anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* One-Time Purchase Option */}
      <Card
        className={`cursor-pointer transition-all ${
          !isSubscription
            ? "border-2 border-[var(--optibio-navy)] bg-[var(--optibio-navy)]/5"
            : "border border-border hover:border-[var(--optibio-navy)]/50"
        }`}
        onClick={() => handleToggle(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Radio Button */}
            <div className="flex-shrink-0 mt-1">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  !isSubscription
                    ? "border-[var(--optibio-navy)] bg-[var(--optibio-navy)]"
                    : "border-gray-300"
                }`}
              >
                {!isSubscription && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg">One-Time Purchase</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[var(--optibio-navy)]">
                  ${oneTimePrice.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Perfect for trying Optibio for the first time. Free shipping on orders $75+.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Subscribe Callout */}
      {isSubscription && (
        <div className="bg-[var(--optibio-gold)]/10 border border-[var(--optibio-gold)]/30 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-[var(--optibio-gold)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--optibio-navy)] mb-1">
                Why 90% of customers choose Subscribe & Save
              </h4>
              <p className="text-sm text-slate-700">
                Ashwagandha works best with consistent use over 8-12 weeks. Subscribers see better results
                because they never miss a dose. Plus, you'll save ${(savings * 3).toFixed(2)} over 3 months
                compared to one-time purchases.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
