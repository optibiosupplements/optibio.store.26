import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, Sparkles, Award, CheckCircle2, Lock, Truck, Shield, Leaf, Package } from "lucide-react";
import { formatPrice } from "@/const";
import CountdownTimer from "@/components/CountdownTimer";

interface BuyBoxV3Props {
  product?: {
    id: number;
    name: string;
    priceInCents: number;
    compareAtPriceInCents?: number | null;
    imageUrl?: string | null;
  };
  className?: string;
}

export default function BuyBoxV3({ product, className = "" }: BuyBoxV3Props) {
  // Pricing: $37.79 (46% off $69.99)
  const currentPrice = "$37.79";
  const originalPrice = "$69.99";
  const discount = 46;
  
  // Dynamic stock urgency (40-50 range)
  const [stockCount, setStockCount] = useState(43);
  useEffect(() => {
    setStockCount(Math.floor(Math.random() * 11) + 40); // 40-50
  }, []);

  // Customer avatars for social proof
  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  ];

  return (
    <div className={`grid lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start ${className}`}>
      {/* LEFT COLUMN - 60% */}
      <div className="space-y-6">
        {/* 1. Navy Pill Badge */}
        <Badge 
          className="text-sm font-semibold px-4 py-2 border-0 inline-flex items-center w-fit rounded-full"
          style={{ background: '#1E3A5F', color: 'white' }}
        >
          SCIENCE-BACKED • THIRD-PARTY TESTED
        </Badge>

        {/* 2. Headline H1 */}
        <h1 
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1]"
          style={{ color: '#1E3A5F' }}
        >
          Feel Like<br />
          Yourself<br />
          Again
        </h1>

        {/* 3. Subheadline */}
        <p 
          className="text-lg leading-relaxed max-w-lg"
          style={{ color: '#2D2D2D' }}
        >
          Our clinically-proven ashwagandha helps you manage stress, sleep deeper, and reclaim the energy you've been missing. Wake up calm. Work with focus. Sleep deeply.
        </p>

        {/* 4. Trust Badge Icons Row */}
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A961' }} />
            <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>Third-Party Tested</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A961' }} />
            <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>GMP Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A961' }} />
            <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>Non-GMO & Organic</span>
          </div>
        </div>

        {/* 5. WHITE OFFER CARD */}
        <Card 
          className="border-2 shadow-xl overflow-hidden max-w-lg"
          style={{ 
            background: 'white', 
            borderColor: 'rgba(201, 169, 97, 0.2)',
            borderRadius: '20px'
          }}
        >
          <CardContent className="p-0">
            {/* Timer Strip - Top of Card */}
            <div 
              className="p-4"
              style={{
                background: 'linear-gradient(to right, #FEF2F2, #FFF7ED)',
                borderBottom: '2px solid #FECACA'
              }}
            >
              <p 
                className="text-sm font-bold mb-2 text-center"
                style={{ color: '#DC2626' }}
              >
                Pre-orders close in:
              </p>
              <CountdownTimer 
                targetDate={new Date('2026-02-14T23:59:59')} 
                className="justify-center"
              />
            </div>

            <div className="p-6 space-y-4">
              {/* Price Row */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span 
                  className="text-4xl sm:text-5xl font-bold"
                  style={{ color: '#1E3A5F' }}
                >
                  {currentPrice}
                </span>
                <span className="text-xl line-through" style={{ color: '#94A3B8' }}>
                  {originalPrice}
                </span>
                <Badge 
                  className="border-0 text-sm font-bold px-3 py-1 text-white"
                  style={{ background: '#DC2626' }}
                >
                  SAVE {discount}%
                </Badge>
              </div>

              {/* Yellow Info Box */}
              <div 
                className="rounded-lg p-4 space-y-2"
                style={{ 
                  background: '#FFFBEB', 
                  border: '1px solid #FDE68A' 
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: '#C9A961' }} />
                  <span className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>Pre-Order Special:</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#475569' }}>
                  <Package className="w-4 h-4" style={{ color: '#C9A961' }} />
                  <span>Ships Feb 14th, 2026</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#475569' }}>
                  <Truck className="w-4 h-4" style={{ color: '#C9A961' }} />
                  <span>Free shipping on orders $75+</span>
                </div>
              </div>

              {/* Bonus Text */}
              <p 
                className="text-center font-semibold text-sm"
                style={{ color: '#16A34A' }}
              >
                ✨ Plus Extra 25% Off at Checkout
              </p>

              {/* CTA Button */}
              <Button
                size="lg"
                className="w-full text-base font-bold py-6 border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                style={{ 
                  background: '#2563EB',
                  color: 'white'
                }}
              >
                Pre-Order Now - Save Extra 25% <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              {/* Trust Footer */}
              <div 
                className="flex items-center justify-center gap-4 text-xs flex-wrap pt-4 border-t"
                style={{ color: '#64748B', borderColor: 'rgba(201, 169, 97, 0.2)' }}
              >
                <div className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure checkout</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>90-day guarantee</span>
                </div>
              </div>

              {/* Stock Urgency */}
              <div 
                className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                style={{ 
                  background: '#FFF7ED', 
                  border: '1px solid #FED7AA',
                  color: '#C2410C'
                }}
              >
                <span className="animate-pulse">🔥</span>
                <span className="font-semibold">Only {stockCount} left in stock</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 6. SOCIAL PROOF CARD - FLOATING OUTSIDE OFFER CARD */}
        <div 
          className="rounded-xl p-4 max-w-lg"
          style={{ 
            background: '#F0FDF4', 
            border: '2px solid #BBF7D0' 
          }}
        >
          <div className="flex items-center gap-4">
            {/* Customer Avatars */}
            <div className="flex -space-x-2">
              {avatars.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt={`Customer ${idx + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            
            {/* Stars and Rating */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-current"
                    style={{ color: '#C9A961' }}
                  />
                ))}
                <span className="ml-1 text-sm font-bold" style={{ color: '#1E3A5F' }}>
                  4.9/5
                </span>
              </div>
              <p className="text-sm" style={{ color: '#475569' }}>
                <span className="font-semibold" style={{ color: '#1E3A5F' }}>5,247</span> happy customers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - 40% - Product Card (Vertically Centered) */}
      <div className="flex justify-center items-center lg:sticky lg:top-24">
        <Card 
          className="overflow-hidden border-2 shadow-2xl w-full max-w-sm"
          style={{ 
            background: 'white',
            borderColor: 'rgba(201, 169, 97, 0.2)',
            borderRadius: '24px'
          }}
        >
          <CardContent className="p-6 sm:p-8">
            {/* Product Image Container - Pure White */}
            <div 
              className="relative w-full flex items-center justify-center rounded-xl p-6"
              style={{ background: '#FFFFFF' }}
            >
              <img 
                src="/bottlemockbluegold_beigebg.png"
                alt="OptiBio Ashwagandha KSM-66 - Premium Blue Bottle"
                className="w-full max-w-[260px] h-auto object-contain"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
