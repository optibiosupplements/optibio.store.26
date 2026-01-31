import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface ProductVariant {
  id: number;
  name: string;
  priceInCents: number;
  compareAtPriceInCents: number | null;
  sortOrder: number;
}

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: number | null;
  onVariantChange: (variantId: number) => void;
}

export function ProductVariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
}: ProductVariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Sort variants by sortOrder
  const sortedVariants = [...variants].sort((a, b) => a.sortOrder - b.sortOrder);

  // Calculate savings percentage
  const calculateSavings = (variant: ProductVariant) => {
    if (!variant.compareAtPriceInCents) return 0;
    return Math.round(
      ((variant.compareAtPriceInCents - variant.priceInCents) / variant.compareAtPriceInCents) * 100
    );
  };

  // Determine which variant is most popular and best value
  const mostPopularIndex = 1; // 3-month supply
  const bestValueIndex = 2; // 6-month supply

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Choose Your Supply:</Label>
      <RadioGroup
        value={selectedVariantId?.toString() || ""}
        onValueChange={(value) => onVariantChange(parseInt(value))}
      >
        {sortedVariants.map((variant, index) => {
          const savings = calculateSavings(variant);
          const isSelected = selectedVariantId === variant.id;
          const isMostPopular = index === mostPopularIndex;
          const isBestValue = index === bestValueIndex;

          return (
            <div key={variant.id} className="relative">
              <Label
                htmlFor={`variant-${variant.id}`}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <RadioGroupItem
                    value={variant.id.toString()}
                    id={`variant-${variant.id}`}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{variant.name}</span>
                      {isMostPopular && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          Most Popular
                        </Badge>
                      )}
                      {isBestValue && (
                        <Badge variant="default" className="bg-green-600 text-white">
                          Best Value
                        </Badge>
                      )}
                    </div>
                    {savings > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Save {savings}% • ${(variant.compareAtPriceInCents! / 100).toFixed(2)} value
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      ${(variant.priceInCents / 100).toFixed(2)}
                    </span>
                    {variant.compareAtPriceInCents && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${(variant.compareAtPriceInCents / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <div className="text-sm font-semibold text-green-600">
                      Save ${((variant.compareAtPriceInCents! - variant.priceInCents) / 100).toFixed(2)}
                    </div>
                  )}
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
