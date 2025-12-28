import { Shield, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Prominent 90-Day Money-Back Guarantee Badge
 * 
 * Large, trust-building component to reduce purchase anxiety.
 * Can be placed on product pages, cart, and checkout.
 */

interface MoneyBackBadgeProps {
  /** Display variant */
  variant?: "default" | "compact" | "inline";
  /** Optional className for positioning */
  className?: string;
}

export default function MoneyBackBadge({ variant = "default", className = "" }: MoneyBackBadgeProps) {
  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Shield className="w-5 h-5 text-green-600" />
        <span className="font-semibold text-slate-700">90-Day Money-Back Guarantee</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-base">90-Day Guarantee</p>
            <p className="text-sm text-slate-600">Love it or your money back</p>
          </div>
        </div>
      </div>
    );
  }

  // Default: Full prominent version
  return (
    <Card className={`border-3 border-green-300 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 shadow-xl ${className}`}>
      <CardContent className="p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          90-Day Money-Back Guarantee
        </h3>

        {/* Description */}
        <p className="text-lg text-slate-700 mb-6 max-w-md mx-auto">
          Try Optibio risk-free. If you don't feel calmer, sleep better, and have more energy, we'll refund every penny—no questions asked.
        </p>

        {/* Benefits */}
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="flex items-center gap-3 text-left">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Full refund</strong> within 90 days
            </span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>No questions asked</strong> return policy
            </span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Keep the bottle</strong> even if you return it
            </span>
          </div>
        </div>

        {/* Fine print */}
        <p className="text-xs text-slate-500 mt-6">
          We stand behind our product because we know it works. Over 5,247 happy customers agree.
        </p>
      </CardContent>
    </Card>
  );
}
