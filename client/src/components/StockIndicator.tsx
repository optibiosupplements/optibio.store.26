import { Package, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StockIndicatorProps {
  stockQuantity: number | null;
  threshold?: number; // Show indicator when stock is below this number
}

export default function StockIndicator({ stockQuantity, threshold = 100 }: StockIndicatorProps) {
  // Don't show if no stock data or plenty in stock
  if (!stockQuantity || stockQuantity > threshold) {
    return null;
  }

  // Determine urgency level
  const isVeryLow = stockQuantity <= 20;
  const isLow = stockQuantity <= 50;

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border-2 ${
      isVeryLow 
        ? 'bg-red-50 border-red-300' 
        : isLow 
        ? 'bg-amber-50 border-amber-300'
        : 'bg-orange-50 border-orange-300'
    }`}>
      <AlertCircle className={`w-5 h-5 ${
        isVeryLow 
          ? 'text-red-600' 
          : isLow 
          ? 'text-amber-600'
          : 'text-orange-600'
      }`} />
      <div className="flex-1">
        <p className={`text-sm font-semibold ${
          isVeryLow 
            ? 'text-red-900' 
            : isLow 
            ? 'text-amber-900'
            : 'text-orange-900'
        }`}>
          {isVeryLow && 'Almost Gone!'}
          {isLow && !isVeryLow && 'Low Stock'}
          {!isLow && 'Limited Availability'}
        </p>
        <p className={`text-xs ${
          isVeryLow 
            ? 'text-red-700' 
            : isLow 
            ? 'text-amber-700'
            : 'text-orange-700'
        }`}>
          Only <strong>{stockQuantity}</strong> left in stock
        </p>
      </div>
      {isVeryLow && (
        <Badge variant="destructive" className="text-xs">
          Selling Fast
        </Badge>
      )}
    </div>
  );
}
