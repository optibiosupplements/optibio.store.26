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
          {/* Left Side - Product Image */}
          <div className="relative bg-gradient-to-br from-[#F7F4EF] to-white p-8 md:p-12 flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <img 
                src="/product-card-hero-transparent-optimized.png"
                alt="OptiBio Ashwagandha KSM-66 - Premium Blue Bottle"
                className="w-full h-auto object-contain"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))' }}
              />
            </div>
          </div>

          {/* Right Side - Purchase Details */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Countdown Timer - Peach Gradient per v3 */}
            <div 
              className="rounded-xl p-4"
              style={{
                background: 'linear-gradient(135deg, #FEF9F3 0%, #FFF5E8 100%)',
                border: '1px solid #FED7AA',
                boxShadow: '0 4px 12px rgba(194, 65, 12, 0.1)'
              }}
            >
              <p 
                className="text-sm font-semibold mb-2 text-center"
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
            <div className="space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span 
                  className="text-4xl sm:text-5xl font-bold"
                  style={{ color: '#1E3A5F' }}
                >
                  {price}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  {comparePrice}
                </span>
                <Badge 
                  className="border-0 text-base font-bold px-4 py-1.5 shadow-md text-white"
                  style={{ background: '#DC2626' }}
                >
                  Save {discount}%
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4" style={{ color: '#C9A961' }} />
                <span className="font-semibold" style={{ color: '#1E3A5F' }}>
                  Pre-Order Special:
                </span>
                <span className="text-gray-600">
                  Ships Jan 20-27, 2026
                </span>
              </div>

              <div 
                className="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
                style={{ 
                  background: '#FEF3C7',
                  border: '1px solid #FCD34D'
                }}
              >
                <span className="animate-pulse">⏱️</span>
                <span className="font-semibold" style={{ color: '#92400E' }}>
                  Free shipping
                </span>
                <span style={{ color: '#B45309' }}>on orders $75+</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 border-2"
                  style={{ borderColor: 'rgba(201, 169, 97, 0.3)' }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
                    {quantity}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= 10}
                  className="h-10 w-10 border-2"
                  style={{ borderColor: 'rgba(201, 169, 97, 0.3)' }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* CTA Button - Electric Blue per v3 */}
            <Link href="/product/ashwagandha-ksm-66" className="block">
              <Button 
                size="lg" 
                className="w-full text-lg font-bold py-7 transition-all duration-300 hover:scale-[1.02] text-white border-0"
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
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            {/* Trust Badges */}
            <div 
              className="text-xs text-center text-gray-600 flex items-center justify-center gap-2 flex-wrap pt-2 border-t"
              style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}
            >
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" style={{ color: '#16A34A' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure checkout
              </span>
              <span className="text-gray-300">•</span>
              <span>Free shipping on $75+</span>
              <span className="text-gray-300">•</span>
              <span>90-day guarantee</span>
            </div>

            {/* Social Proof - Green Gradient per v3 */}
            <div 
              className="rounded-xl p-4 space-y-3"
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
                    className="w-5 h-5" 
                    style={{ fill: '#FBBF24', color: '#FBBF24' }}
                  />
                ))}
                <span className="ml-2 text-sm font-bold" style={{ color: '#1E3A5F' }}>
                  4.9/5
                </span>
              </div>
              <p className="text-sm text-center text-gray-600">
                <span className="font-bold" style={{ color: '#1E3A5F' }}>5,247</span> happy customers
              </p>
              <p 
                className="text-xs text-center font-semibold"
                style={{ color: '#16A34A' }}
              >
                ✅ <span className="font-bold">127</span> bottles sold in last 24 hours
              </p>
            </div>

            {/* Urgency Indicators */}
            <div className="space-y-2">
              <div 
                className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
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
                className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1E40AF'
                }}
              >
                <span>👀</span>
                <span className="font-semibold">18 people viewing this right now</span>
              </div>
            </div>

            {/* Quality Badges */}
            <div 
              className="grid grid-cols-2 gap-3 pt-4 border-t"
              style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}
            >
              <div className="flex flex-col items-center text-center gap-1">
                <Shield className="w-6 h-6" style={{ color: '#C9A961' }} />
                <span className="text-xs font-semibold" style={{ color: '#1E3A5F' }}>Third-Party</span>
                <span className="text-xs text-gray-600">Tested</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Award className="w-6 h-6" style={{ color: '#C9A961' }} />
                <span className="text-xs font-semibold" style={{ color: '#1E3A5F' }}>GMP</span>
                <span className="text-xs text-gray-600">Certified</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#C9A961' }} />
                <span className="text-xs font-semibold" style={{ color: '#1E3A5F' }}>Non-GMO</span>
                <span className="text-xs text-gray-600">Organic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <TrendingUp className="w-6 h-6" style={{ color: '#C9A961' }} />
                <span className="text-xs font-semibold" style={{ color: '#1E3A5F' }}>20+ Studies</span>
                <span className="text-xs text-gray-600">Proven</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
