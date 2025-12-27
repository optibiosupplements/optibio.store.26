import { useState, useEffect } from "react";
import { Package, Eye, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UrgencyIndicatorsProps {
  productId: number;
  variantId?: number;
  className?: string;
}

export default function UrgencyIndicators({ 
  productId, 
  variantId,
  className = "" 
}: UrgencyIndicatorsProps) {
  // Simulated inventory (in production, fetch from database)
  const [stockLevel, setStockLevel] = useState<number>(0);
  const [viewingCount, setViewingCount] = useState<number>(0);
  const [recentPurchases, setRecentPurchases] = useState<number>(0);

  useEffect(() => {
    // Simulate realistic inventory levels based on variant
    const baseStock = variantId === 1 ? 23 : variantId === 2 ? 47 : variantId === 3 ? 31 : 18;
    setStockLevel(baseStock);

    // Simulate realistic viewing count (15-85 people)
    const baseViewing = Math.floor(Math.random() * 70) + 15;
    setViewingCount(baseViewing);

    // Simulate recent purchases (5-28 in last 24 hours)
    const basePurchases = Math.floor(Math.random() * 24) + 5;
    setRecentPurchases(basePurchases);

    // Update viewing count every 8-15 seconds to simulate real-time
    const viewingInterval = setInterval(() => {
      setViewingCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const newCount = Math.max(15, Math.min(85, prev + change));
        return newCount;
      });
    }, Math.random() * 7000 + 8000); // 8-15 seconds

    return () => clearInterval(viewingInterval);
  }, [productId, variantId]);

  // Determine urgency level based on stock
  const isLowStock = stockLevel <= 30;
  const isCriticalStock = stockLevel <= 15;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stock Level Indicator */}
      {isLowStock && (
        <div className={`flex items-center gap-2 p-3 rounded-lg border ${
          isCriticalStock 
            ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' 
            : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'
        }`}>
          <Package className={`h-5 w-5 ${
            isCriticalStock ? 'text-red-600' : 'text-amber-600'
          }`} />
          <div className="flex-1">
            <p className={`text-sm font-semibold ${
              isCriticalStock ? 'text-red-900 dark:text-red-100' : 'text-amber-900 dark:text-amber-100'
            }`}>
              {isCriticalStock ? '⚠️ Almost Sold Out!' : 'Low Stock Alert'}
            </p>
            <p className={`text-xs ${
              isCriticalStock ? 'text-red-700 dark:text-red-200' : 'text-amber-700 dark:text-amber-200'
            }`}>
              Only <span className="font-bold">{stockLevel} bottles</span> left in stock
            </p>
          </div>
        </div>
      )}

      {/* Viewing Counter */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
        <Eye className="h-5 w-5 text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            High Demand
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-200">
            <span className="font-bold">{viewingCount} people</span> viewing this product right now
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100">
          Live
        </Badge>
      </div>

      {/* Recent Purchases */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-900 dark:text-green-100">
            Trending Product
          </p>
          <p className="text-xs text-green-700 dark:text-green-200">
            <span className="font-bold">{recentPurchases} bottles</span> sold in the last 24 hours
          </p>
        </div>
        <Clock className="h-4 w-4 text-green-600" />
      </div>

      {/* Founder Pricing Urgency */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-[#C9A961]/10 to-[#1E3A5F]/10 border border-[#C9A961]/30">
        <Sparkles className="h-5 w-5 text-[#C9A961]" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#1E3A5F] dark:text-[#F7F4EF]">
            Founder Pricing Ends Soon
          </p>
          <p className="text-xs text-[#1E3A5F]/70 dark:text-[#F7F4EF]/70">
            Lock in your <span className="font-bold">lifetime discount</span> before prices increase
          </p>
        </div>
      </div>
    </div>
  );
}
