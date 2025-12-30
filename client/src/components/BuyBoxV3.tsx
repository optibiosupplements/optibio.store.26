import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, Sparkles, Shield, Award, CheckCircle2 } from "lucide-react";
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
  const price = product ? formatPrice(product.priceInCents) : '$49.99';
  const comparePrice = product?.compareAtPriceInCents ? formatPrice(product.compareAtPriceInCents) : '$69.99';
  const discount = product?.compareAtPriceInCents 
    ? Math.round((1 - product.priceInCents / product.compareAtPriceInCents) * 100)
    : 29;

  return (
    <div className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${className}`}>
      {/* Left Side - Content */}
      <div className="space-y-6">
        {/* Trust Badge */}
        <Badge 
          className="text-sm font-semibold px-4 py-2 border-0 inline-flex items-center w-fit"
          style={{ background: '#1E3A5F', color: 'white' }}
        >
          Science-Backed • Third-Party Tested
        </Badge>

        {/* Headline */}
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
          style={{ color: '#1E3A5F' }}
        >
          Feel Like{" "}
          <br className="hidden sm:block" />
          Yourself Again
        </h1>

        {/* Subheadline */}
        <p 
          className="text-lg sm:text-xl leading-relaxed"
          style={{ color: '#475569' }}
        >
          Clinically-proven ashwagandha for the stress, overwhelm, and exhaustion of modern life. Wake up calm. Work with focus. Sleep deeply.
        </p>

        {/* Trust Indicators Row */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" style={{ color: '#C9A961' }} />
            <div className="flex flex-col">
              <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>Third-Party Tested</span>
              <span className="text-xs" style={{ color: '#94A3B8' }}>Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6" style={{ color: '#C9A961' }} />
            <div className="flex flex-col">
              <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>GMP Certified</span>
              <span className="text-xs" style={{ color: '#94A3B8' }}>Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" style={{ color: '#C9A961' }} />
            <div className="flex flex-col">
              <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>Non-GMO & Organic</span>
              <span className="text-xs" style={{ color: '#94A3B8' }}>Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Product Card */}
      <div>
        <Card 
          className="overflow-hidden border-0 shadow-2xl"
          style={{ background: 'white' }}
        >
          <CardContent className="p-8 space-y-6">
            {/* Product Image */}
            <div className="relative w-full flex items-center justify-center -mt-4">
              <img 
                src="/bottlemockbluegold_beigebg.png"
                alt="OptiBio Ashwagandha KSM-66 - Premium Blue Bottle"
                className="w-full max-w-[280px] h-auto object-contain"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08))' }}
              />
            </div>

            {/* Countdown Timer */}
            <div 
              className="rounded-xl p-4"
              style={{
                background: 'linear-gradient(135deg, #FEF9F3 0%, #FFF5E8 100%)',
                border: '1px solid #FED7AA'
              }}
            >
              <p 
                className="text-sm font-semibold mb-3 text-center"
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
                  className="text-5xl font-bold"
                  style={{ color: '#1E3A5F' }}
                >
                  {price}
                </span>
                <span className="text-2xl line-through" style={{ color: '#94A3B8' }}>
                  {comparePrice}
                </span>
                <Badge 
                  className="border-0 text-sm font-bold px-3 py-1.5 text-white"
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
                <span style={{ color: '#475569' }}>
                  Ships Jan 20-27
                </span>
              </div>
            </div>

            {/* CTA Button */}
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
                Pre-Order Now • Save {discount}%
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            {/* Trust Badges */}
            <div 
              className="text-xs text-center flex items-center justify-center gap-2 flex-wrap pt-3 border-t"
              style={{ borderColor: 'rgba(201, 169, 97, 0.2)', color: '#475569' }}
            >
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" style={{ color: '#16A34A' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure checkout
              </span>
              <span style={{ color: '#D1D5DB' }}>•</span>
              <span>Free shipping on $75+</span>
              <span style={{ color: '#D1D5DB' }}>•</span>
              <span>90-day guarantee</span>
            </div>

            {/* Social Proof */}
            <div 
              className="rounded-xl p-4 space-y-3"
              style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                border: '1px solid #BBF7D0'
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
                  4.63
                </span>
              </div>
              <p className="text-sm text-center" style={{ color: '#475569' }}>
                <span className="font-bold" style={{ color: '#1E3A5F' }}>1,247</span> happy customers
              </p>
              <p 
                className="text-xs text-center font-semibold"
                style={{ color: '#16A34A' }}
              >
                ✅ <span className="font-bold">83,423</span> bottles sold in last 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
