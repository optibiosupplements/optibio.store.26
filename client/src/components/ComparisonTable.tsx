import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * KSM-66® vs Generic Ashwagandha Comparison Table
 * 
 * Visual comparison highlighting why KSM-66® is superior to generic ashwagandha.
 * Uses checkmarks and X marks for quick scanning.
 */

export default function ComparisonTable() {
  const comparisons = [
    {
      feature: "Extract Source",
      ksm66: "Root-only extract (traditional Ayurvedic part)",
      generic: "Mixed leaves and roots (inferior quality)",
      ksm66Good: true,
    },
    {
      feature: "Extraction Method",
      ksm66: "Full-spectrum (preserves all compounds)",
      generic: "Isolated compounds only",
      ksm66Good: true,
    },
    {
      feature: "Withanolide Content",
      ksm66: "5% standardized (consistent potency)",
      generic: "Variable content (unpredictable results)",
      ksm66Good: true,
    },
    {
      feature: "Clinical Studies",
      ksm66: "20+ peer-reviewed studies",
      generic: "Limited or no studies",
      ksm66Good: true,
    },
    {
      feature: "Organic Certification",
      ksm66: "USDA Organic & Non-GMO verified",
      generic: "Unknown sourcing",
      ksm66Good: true,
    },
    {
      feature: "Extraction Process",
      ksm66: "Green chemistry (water & milk only)",
      generic: "Chemical solvents often used",
      ksm66Good: true,
    },
    {
      feature: "Third-Party Testing",
      ksm66: "Every batch tested for purity",
      generic: "Rarely tested",
      ksm66Good: true,
    },
    {
      feature: "Bioavailability",
      ksm66: "Optimized for absorption",
      generic: "Variable absorption",
      ksm66Good: true,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30 px-4 py-2 text-base">
          <span className="font-bold">Why Quality Matters</span>
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4">
          Not All Ashwagandha Is Created Equal
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          KSM-66® represents the pinnacle of ashwagandha supplementation. Here's how it compares to generic alternatives.
        </p>
      </div>

      {/* Comparison Table */}
      <Card className="border-2 border-slate-200 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-[#1E3A5F] to-[#152B45] p-6 text-white">
            <div className="text-sm font-semibold uppercase tracking-wide">Feature</div>
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-wide mb-1">KSM-66®</div>
              <Badge className="bg-[#C9A961] text-white border-0 text-xs">Premium</Badge>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-wide mb-1">Generic</div>
              <Badge className="bg-slate-500 text-white border-0 text-xs">Standard</Badge>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-200">
            {comparisons.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-6 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                {/* Feature Name */}
                <div className="font-semibold text-[#2D2D2D] flex items-center">
                  {item.feature}
                </div>

                {/* KSM-66® Column */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-slate-700">{item.ksm66}</span>
                </div>

                {/* Generic Column */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm text-slate-600">{item.generic}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-br from-[#F7F4EF] to-[#EDE9E3] p-8 text-center border-t-2 border-[#C9A961]">
            <p className="text-lg font-bold text-[#2D2D2D] mb-2">
              The Choice Is Clear
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Don't settle for generic when your health deserves the gold standard.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[#1E3A5F]">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-semibold">90-Day Money-Back Guarantee</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Friendly Note */}
      <p className="text-xs text-center text-slate-500 mt-4">
        * All claims backed by peer-reviewed clinical research
      </p>
    </div>
  );
}
