import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, Sparkles, Shield, Award, CheckCircle2, TrendingUp, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/const";
import CountdownTimer from "@/components/CountdownTimer";
import { useState } from "react";

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
  const [quantity, setQuantity] = useState(1);
  
  const price = product ? formatPrice(product.priceInCents) : '$49.99';
  const comparePrice = product?.compareAtPriceInCents ? formatPrice(product.compareAtPriceInCents) : '$69.99';
  const discount = product?.compareAtPriceInCents 
    ? Math.round((1 - product.priceInCents / product.compareAtPriceInCents) * 100)
    : 29;

  const incrementQuantity = () => setQuantity(q => Math.min(q + 1, 10));
  const decrementQuantity = () => setQuantity(q => Math.max(q - 1, 1));

  return (
    <Card className={`bg-white border-2 border-[#C9A961]/20 shadow-2xl rounded-3xl overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Content */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-6 flex flex-col justify-center">
            {/* Trust Badge */}
            <Badge 
              className="text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 border-0 shadow-md inline-flex items-center w-fit"
              style={{ background: '#1E3A5F', color: 'white' }}
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Science-Backed • Third-Party Tested
            </Badge>

            {/* Headline */}
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: '#1E3A5F' }}
            >
              Feel Like{" "}
              <span className="text-gradient-optibio">
                Yourself
              </span>
              {" "}Again
            </h2>

            {/* Subheadline */}
            <p 
              className="text-base sm:text-lg leading-relaxed font-medium"
              style={{ color: '#1E3A5F' }}
            >
              Clinically-proven ashwagandha for the stress, overwhelm, and exhaustion of modern life. Wake up calm. Work with focus. Sleep deeply.
            </p>

            {/* Trust Indicators Row */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#C9A961' }} />
                <div className="flex flex-col">
                  <span className="font-bold text-xs sm:text-sm" style={{ color: '#1E3A5F' }}>Third-Party Tested</span>
                  <span className="text-[10px] sm:text-xs text-gray-600">Verified</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#C9A961' }} />
                <div className="flex flex-col">
                  <span className="font-bold text-xs sm:text-sm" style={{ color: '#1E3A5F' }}>GMP Certified</span>
                  <span className="text-[10px] sm:text-xs text-gray-600">Verified</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#C9A961' }} />
                <div className="flex flex-col">
                  <span className="font-bold text-xs sm:text-sm" style={{ color: '#1E3A5F' }}>Non-GMO & Organic</span>
                  <span className="text-[10px] sm:text-xs text-gray-600">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Product Card */}
          <div className="relative bg-gradient-to-br from-[#F7F4EF] to-[#EBE8E0] p-6 sm:p-8 lg:p-10 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Product Image */}
              <div className="relative w-full flex items-center justify-center">
                <img 
                  src="/bottle-hero.png"
                  alt="OptiBio Ashwagandha KSM-66 - Premium Blue Bottle"
                  className="w-full max-w-[280px] sm:max-w-[320px] h-auto object-contain"
                  style={{ filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12))' }}
                />
              </div>

              {/* Purchase Details */}
              <div className="space-y-4">
                {/* Countdown Timer - Peach Gradient per v3 */}
                <div 
                  className="rounded-xl p-3 sm:p-4"
                  style={{
                    background: 'linear-gradient(135deg, #FEF9F3 0%, #FFF5E8 100%)',
                    border: '1px solid #FED7AA',
                    boxShadow: '0 4px 12px rgba(194, 65, 12, 0.1)'
                  }}
                >
                  <p 
                    className="text-xs sm:text-sm font-semibold mb-2 text-center"
                    style={{ color: '#991B1B' }}
                  >
                    Pre-orders close in:
                  </p>
                  <CountdownTimer 
                    targetDate={new Date('2026-01-20T23:59:59')} 
                    className="justify-center"
                  />
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                    <span 
                      className="text-3xl sm:text-4xl font-bold"
                      style={{ color: '#1E3A5F' }}
                    >
                      {price}
                    </span>
                    <span className="text-xl sm:text-2xl text-gray-400 line-through">
                      {comparePrice}
                    </span>
                    <Badge 
                      className="border-0 text-sm font-bold px-3 py-1 shadow-md text-white"
                      style={{ background: '#DC2626' }}
                    >
                      Save {discount}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#C9A961' }} />
                    <span className="font-semibold" style={{ color: '#1E3A5F' }}>
                      Pre-Order Special:
                    </span>
                    <span className="text-gray-600">
                      Ships Jan 20-27
                    </span>
                  </div>

                  <div 
                    className="flex items-center gap-2 text-xs sm:text-sm rounded-lg px-3 py-2"
                    style={{ 
                      background: '#FEF3C7',
                      border: '1px solid #FCD34D'
                    }}
                  >
                    <span className="animate-pulse">⏱️</span>
                    <span className="font-semibold" style={{ color: '#92400E' }}>
                      Free shipping
                    </span>
                    <span style={{ color: '#B45309' }}>on $75+</span>
                  </div>
                </div>

                {/* Quantity Selector - Removed for cleaner hero */}

                {/* CTA Button - Electric Blue per v3 */}
                <Link href="/product/ashwagandha-ksm-66" className="block">
                  <Button 
                    size="lg" 
                    className="w-full text-base sm:text-lg font-bold py-6 sm:py-7 transition-all duration-300 hover:scale-[1.02] text-white border-0"
                    style={{
                      background: '#2563EB',
                      boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1D4ED8';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#2563EB';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.3)';
                    }}
                  >
                    Pre-Order Now - Save {discount}%
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div 
                  className="text-[10px] sm:text-xs text-center text-gray-600 flex items-center justify-center gap-2 flex-wrap pt-2 border-t"
                  style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: '#16A34A' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure checkout
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>Free shipping $75+</span>
                  <span className="text-gray-300">•</span>
                  <span>90-day guarantee</span>
                </div>

                {/* Social Proof - Green Gradient per v3 */}
                <div 
                  className="rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3"
                  style={{
                    background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                    border: '1px solid #BBF7D0',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 sm:w-5 sm:h-5" 
                        style={{ fill: '#FBBF24', color: '#FBBF24' }}
                      />
                    ))}
                    <span className="ml-2 text-xs sm:text-sm font-bold" style={{ color: '#1E3A5F' }}>
                      4.9/5
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-center text-gray-600">
                    <span className="font-bold" style={{ color: '#1E3A5F' }}>5,247</span> happy customers
                  </p>
                  <p 
                    className="text-[10px] sm:text-xs text-center font-semibold"
                    style={{ color: '#16A34A' }}
                  >
                    ✅ <span className="font-bold">127</span> bottles sold in last 24 hours
                  </p>
                </div>

                {/* Urgency Indicators */}
                <div className="space-y-2">
                  <div 
                    className="flex items-center gap-2 text-[10px] sm:text-xs rounded-lg px-2 sm:px-3 py-1.5 sm:py-2"
                    style={{
                      background: '#FFF7ED',
                      border: '1px solid #FED7AA',
                      color: '#9A3412'
                    }}
                  >
                    <span className="animate-pulse">🔥</span>
                    <span className="font-semibold">Only 43 left in stock</span>
                  </div>
                  <div 
                    className="flex items-center gap-2 text-[10px] sm:text-xs rounded-lg px-2 sm:px-3 py-1.5 sm:py-2"
                    style={{
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      color: '#1E40AF'
                    }}
                  >
                    <span>👀</span>
                    <span className="font-semibold">18 people viewing right now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
