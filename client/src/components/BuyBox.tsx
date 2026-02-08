import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, Sparkles, Shield, Award, CheckCircle2, TrendingUp, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/const";
import CountdownTimer from "@/components/CountdownTimer";
import { useState } from "react";

interface BuyBoxProps {
  product?: {
    id: number;
    name: string;
    priceInCents: number;
    compareAtPriceInCents?: number | null;
    imageUrl?: string | null;
  };
  className?: string;
}

export default function BuyBox({ product, className = "" }: BuyBoxProps) {
  const [quantity, setQuantity] = useState(1);
  
  const price = product ? formatPrice(product.priceInCents) : '$39.99';
  const comparePrice = product?.compareAtPriceInCents ? formatPrice(product.compareAtPriceInCents) : '$49.99';
  const discount = product?.compareAtPriceInCents 
    ? Math.round((1 - product.priceInCents / product.compareAtPriceInCents) * 100)
    : 20;

  const incrementQuantity = () => setQuantity(q => Math.min(q + 1, 10));
  const decrementQuantity = () => setQuantity(q => Math.max(q - 1, 1));

  return (
    <Card className={`bg-white dark:bg-[#1E3A5F] border-2 border-[#C9A961]/20 dark:border-[#2D4A77] shadow-2xl rounded-3xl overflow-hidden ${className}`}>
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Product Image */}
        <div className="relative bg-gradient-to-br from-[#F7F4EF] to-white dark:from-[#1E3A5F] dark:to-[#0B1120] rounded-2xl p-8 shadow-lg">
          <div className="relative w-full h-64 sm:h-80 flex items-center justify-center">
            <img 
              src="/product-card-hero-transparent-optimized.png"
              alt="OptiBio Ashwagandha KSM-66 - Premium Blue Bottle"
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))' }}
            />
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 text-center">
            Limited time offer:
          </p>
          <CountdownTimer 
            targetDate={new Date('2026-01-20T23:59:59')} 
            className="justify-center"
          />
        </div>

        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl sm:text-5xl font-bold text-[#1E3A5F] dark:text-[#D4AF37]">
              {price}
            </span>
            <span className="text-2xl text-muted-foreground line-through">
              {comparePrice}
            </span>
            <Badge 
              className="text-white border-0 text-base font-bold px-4 py-1.5 shadow-md"
              style={{ backgroundColor: '#DC2626' }} // Alert Red - Discount badges only (per Design System v3.0)
            >
              Save {discount}%
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-[#C9A961] dark:text-[#D4AF37]" />
            <span className="font-semibold text-[#1E3A5F] dark:text-white">
              Fast Shipping:
            </span>
            <span className="text-muted-foreground dark:text-[#94A3B8]">
              Ships within 1-2 business days
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
            <span className="animate-pulse text-amber-600 dark:text-amber-400">⏱️</span>
            <span className="font-semibold text-amber-900 dark:text-amber-300">
              Free shipping
            </span>
            <span className="text-amber-700 dark:text-amber-400">on orders $75+</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1E3A5F] dark:text-white">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-10 w-10 border-2 border-[#C9A961]/30 dark:border-[#2D4A77]"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                {quantity}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              disabled={quantity >= 10}
              className="h-10 w-10 border-2 border-[#C9A961]/30 dark:border-[#2D4A77]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/product/ashwagandha-ksm-66" className="block">
          <Button 
            size="lg" 
            className="w-full text-lg font-bold py-7 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-2 border-[#2563EB]"
          >
            Shop Now - Save {discount}%
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>

        {/* Trust Badges */}
        <div className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2 flex-wrap pt-2 border-t border-[#C9A961]/20 dark:border-[#2D4A77]">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure checkout
          </span>
          <span className="text-border">•</span>
          <span>Free shipping on 3+ bottles</span>
          <span className="text-border">•</span>
          <span>90-day guarantee</span>
        </div>

        {/* Social Proof */}
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-[#C9A961] text-[#C9A961] dark:fill-[#D4AF37] dark:text-[#D4AF37]" />
            ))}
            <span className="ml-2 text-sm font-bold text-[#1E3A5F] dark:text-white">4.9/5</span>
          </div>
          <p className="text-sm text-center text-muted-foreground dark:text-[#94A3B8]">
            <span className="font-bold text-[#1E3A5F] dark:text-white">5,247</span> happy customers
          </p>
          <p className="text-xs text-center text-green-700 dark:text-green-400 font-semibold">
            ✅ <span className="font-bold">127</span> bottles sold in last 24 hours
          </p>
        </div>

        {/* Urgency Indicators */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg px-3 py-2">
            <span className="animate-pulse">🔥</span>
            <span className="font-semibold">Only 43 left in stock</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
            <span>👀</span>
            <span className="font-semibold">18 people viewing this right now</span>
          </div>
        </div>

        {/* Quality Badges */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#C9A961]/20 dark:border-[#2D4A77]">
          <div className="flex flex-col items-center text-center gap-1">
            <Shield className="w-6 h-6 text-[#C9A961] dark:text-[#D4AF37]" />
            <span className="text-xs font-semibold text-[#1E3A5F] dark:text-white">Third-Party</span>
            <span className="text-xs text-muted-foreground dark:text-[#94A3B8]">Tested</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <Award className="w-6 h-6 text-[#C9A961] dark:text-[#D4AF37]" />
            <span className="text-xs font-semibold text-[#1E3A5F] dark:text-white">GMP</span>
            <span className="text-xs text-muted-foreground dark:text-[#94A3B8]">Certified</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <CheckCircle2 className="w-6 h-6 text-[#C9A961] dark:text-[#D4AF37]" />
            <span className="text-xs font-semibold text-[#1E3A5F] dark:text-white">Non-GMO</span>
            <span className="text-xs text-muted-foreground dark:text-[#94A3B8]">Organic</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <TrendingUp className="w-6 h-6 text-[#C9A961] dark:text-[#D4AF37]" />
            <span className="text-xs font-semibold text-[#1E3A5F] dark:text-white">20+ Studies</span>
            <span className="text-xs text-muted-foreground dark:text-[#94A3B8]">Proven</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
