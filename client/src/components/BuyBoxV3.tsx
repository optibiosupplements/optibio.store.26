import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, Sparkles, Award, CheckCircle2, Lock, Truck, Shield, Leaf, Zap } from "lucide-react";
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
  // 29% discount (49.99 vs 69.99)
  const discount = 29;

  // Gold circular badge icons
  const badges = [
    { icon: CheckCircle2, label: "Third-Party Tested" },
    { icon: Award, label: "GMP Certified" },
    { icon: Leaf, label: "Non-GMO & Organic" },
    { icon: Zap, label: "Clinically Proven" },
    { icon: Shield, label: "90-Day Guarantee" }
  ];

  return (
    <div className={`grid md:grid-cols-[1fr_1fr] gap-6 lg:gap-12 items-center ${className}`}>
      {/* Left Side - All Content (50% width on desktop) */}
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
          className="text-5xl sm:text-6xl lg:text-6xl font-bold leading-tight"
          style={{ color: '#1E3A5F' }}
        >
          Feel Like<br />
          Yourself<br />
          Again
        </h1>

        {/* Subheadline */}
        <p 
          className="text-lg leading-relaxed max-w-md"
          style={{ color: '#475569' }}
        >
          Clinically-proven ashwagandha for the stress, overwhelm, and exhaustion of modern life. Wake up calm. Work with focus. Sleep deeply.
        </p>

        {/* Trust Indicators Row */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: '#C9A961' }} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>Third-Party Tested</span>
              <span className="text-xs" style={{ color: '#64748B' }}>Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: '#C9A961' }} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>GMP Certified</span>
              <span className="text-xs" style={{ color: '#64748B' }}>Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: '#C9A961' }} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>Non-GMO & Organic</span>
              <span className="text-xs" style={{ color: '#64748B' }}>Verified</span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div 
          className="rounded-lg p-4 max-w-md"
          style={{
            background: 'white',
            border: '2px solid #FFE4CC'
          }}
        >
          <p 
            className="text-sm font-bold mb-3 text-center"
            style={{ color: '#B91C1C' }}
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
          <div className="flex items-baseline gap-3 flex-wrap">
            <span 
              className="text-5xl sm:text-6xl font-bold"
              style={{ color: '#1E3A5F' }}
            >
              {price}
            </span>
            <span className="text-xl line-through" style={{ color: '#94A3B8' }}>
              {comparePrice}
            </span>
            <Badge 
              className="border-0 text-sm font-bold px-3 py-1 text-white"
              style={{ background: '#DC2626' }}
            >
              SAVE {discount}%
            </Badge>
          </div>
          <p className="text-sm flex items-center gap-1.5" style={{ color: '#475569' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#C9A961' }} />
            <span className="font-semibold">Pre-Order Special:</span> Ships Jan 20-27
          </p>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="w-full max-w-md text-base font-bold py-6 border-0 shadow-lg hover:shadow-xl transition-all"
          style={{ 
            background: '#2563EB',
            color: 'white'
          }}
        >
          Pre-Order Now • Save {discount}% <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        {/* Trust Badges Below Button */}
        <div className="flex items-center justify-center gap-4 text-xs max-w-md flex-wrap" style={{ color: '#64748B' }}>
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure checkout</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Free shipping on $75+</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>90-day guarantee</span>
          </div>
        </div>

        {/* Social Proof */}
        <div 
          className="rounded-lg p-4 max-w-md"
          style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-current"
                    style={{ color: '#EAB308' }}
                  />
                ))}
              </div>
              <span className="text-lg font-bold" style={{ color: '#1E3A5F' }}>
                4.63
              </span>
            </div>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#475569' }}>
            1,247 happy customers
          </p>
          <p className="text-sm flex items-center gap-1.5" style={{ color: '#16A34A' }}>
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold">83,423 bottles sold last 24 hours</span>
          </p>
        </div>

        {/* Gold Circular Icon Badges - Bottom */}
        <div className="flex flex-wrap gap-3 justify-start pt-4">
          {badges.map((badge, idx) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-1"
                title={badge.label}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    background: 'linear-gradient(135deg, #C9A961 0%, #B89651 100%)',
                    color: '#1E3A5F'
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-xs text-center font-medium" style={{ color: '#1E3A5F', maxWidth: '60px' }}>
                  {badge.label.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side - Product Image ONLY (50% width on desktop) */}
      <div className="flex justify-center items-center">
        <Card 
          className="overflow-hidden border-0 shadow-2xl w-full max-w-md"
          style={{ background: 'white' }}
        >
          <CardContent className="p-6 sm:p-8">
            {/* Product Image with Beige Background */}
            <div 
              className="relative w-full flex items-center justify-center rounded-xl p-8"
              style={{ background: '#F5F1EB' }}
            >
              <img 
                src="/bottlemockbluegold_beigebg.png"
                alt="OptiBio Ashwagandha KSM-66 - Premium Blue Bottle"
                className="w-full max-w-[280px] h-auto object-contain"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08))' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
