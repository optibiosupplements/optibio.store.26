import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { BRAND_COLORS, URGENCY_COLORS, ACTION_COLORS, SOCIAL_PROOF_COLORS, TYPOGRAPHY } from "@/brand";

/**
 * HeroMockupF - Optimized V2 Implementation
 * 
 * Based on CRO research and Mockup F - Optimized V2 design:
 * - Radial gradient background (white center → soft sky blue edges)
 * - Golden glow effect behind product with bokeh particles
 * - Reviews badge (⭐ 4.9 from 2,847 reviews)
 * - Quantity bundle selector (1/3/6 bottles)
 * - Working countdown timer
 * - Sticky header with mini CTA on scroll
 */

// ============================================================================
// SVG Icons
// ============================================================================

function IconBeaker(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 3h6M10 3v5l-5.5 9.5A3 3 0 0 0 7.1 22h9.8a3 3 0 0 0 2.6-4.5L14 8V3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 14h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconShield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.8 1.8L15.8 9.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLeaf(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20 4c-7 1-12.5 6.5-13.5 13.5C13.5 18.5 19 13 20 6V4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M4 20c5-2 8-5 10-10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 11h12v10H6V11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconGuarantee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4l3-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.7 1.7 3.3-3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSparkle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m12.728 0l-2.121-2.121M8.757 8.757L6.636 6.636"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ============================================================================
// Countdown Timer Component
// ============================================================================

interface CountdownTimerProps {
  targetDate: Date;
}

function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        setTimeLeft({
          hours: totalHours,
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div 
      className="rounded-2xl px-5 py-4 border"
      style={{
        background: URGENCY_COLORS.BACKGROUND_GRADIENT,
        borderColor: URGENCY_COLORS.BORDER,
        boxShadow: URGENCY_COLORS.SHADOW,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <span 
          className="text-sm font-semibold"
          style={{ color: URGENCY_COLORS.TEXT, fontFamily: TYPOGRAPHY.BODY_FONT }}
        >
          Pre-order window closes in:
        </span>
        <div 
          className="flex items-center gap-1 text-2xl font-bold tabular-nums"
          style={{ color: URGENCY_COLORS.TEXT, fontFamily: TYPOGRAPHY.HEADING_FONT }}
        >
          <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="animate-pulse">:</span>
          <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="animate-pulse">:</span>
          <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Quantity Bundle Selector
// ============================================================================

interface BundleOption {
  quantity: number;
  label: string;
  pricePerBottle: number;
  totalPrice: number;
  savings: string;
  popular?: boolean;
}

const bundleOptions: BundleOption[] = [
  { quantity: 1, label: "1 Bottle", pricePerBottle: 28.35, totalPrice: 28.35, savings: "59% OFF" },
  { quantity: 3, label: "3 Bottles", pricePerBottle: 25.52, totalPrice: 76.55, savings: "63% OFF", popular: true },
  { quantity: 6, label: "6 Bottles", pricePerBottle: 22.68, totalPrice: 136.08, savings: "68% OFF" },
];

interface QuantitySelectorProps {
  selected: number;
  onSelect: (quantity: number) => void;
}

function QuantitySelector({ selected, onSelect }: QuantitySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {bundleOptions.map((option) => (
        <button
          key={option.quantity}
          onClick={() => onSelect(option.quantity)}
          className={`
            relative rounded-xl p-3 border-2 transition-all duration-200
            ${selected === option.quantity 
              ? 'border-[#2563EB] bg-blue-50/50 shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
        >
          {option.popular && (
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold bg-[#C9A961] text-white rounded-full whitespace-nowrap">
              BEST VALUE
            </span>
          )}
          <div className="text-center">
            <div 
              className="text-sm font-bold"
              style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
            >
              {option.label}
            </div>
            <div 
              className="text-lg font-extrabold mt-1"
              style={{ color: BRAND_COLORS.NAVY_DARKER, fontFamily: TYPOGRAPHY.HEADING_FONT }}
            >
              ${option.pricePerBottle.toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-500">per bottle</div>
            <div 
              className="text-xs font-bold mt-1 text-green-600"
            >
              {option.savings}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Main Hero Component
// ============================================================================

export default function HeroMockupF() {
  const [selectedQuantity, setSelectedQuantity] = useState(3);
  const selectedBundle = bundleOptions.find(b => b.quantity === selectedQuantity) || bundleOptions[1];
  
  // Set countdown target to 15 hours from now (or a fixed date)
  const [targetDate] = useState(() => {
    const target = new Date();
    target.setHours(target.getHours() + 15);
    target.setMinutes(3);
    target.setSeconds(34);
    return target;
  });

  const PRODUCT_IMAGE_SRC = "/bottle-mockup-angle.png";
  const CTA_HREF = "/shop";

  return (
    <section className="w-full relative">
      {/* Background with radial gradient */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #F5FAFD 25%, #EBF5FB 50%, #D6EAF8 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:px-10 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            
            {/* Left Column: Copy + Offer */}
            <div className="space-y-6 order-2 lg:order-1">
              
              {/* Top Badge */}
              <div 
                className="inline-flex items-center rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.14em] shadow-sm"
                style={{ 
                  backgroundColor: BRAND_COLORS.DEEP_NAVY,
                  borderColor: `${BRAND_COLORS.ANTIQUE_GOLD}50`,
                  color: BRAND_COLORS.ANTIQUE_GOLD,
                }}
              >
                SCIENCE-BACKED • THIRD-PARTY TESTED
              </div>

              {/* Headline */}
              <h1
                className="leading-[1.05] tracking-[-0.03em]"
                style={{ 
                  color: BRAND_COLORS.DEEP_NAVY, 
                  fontFamily: TYPOGRAPHY.HEADING_FONT,
                  fontWeight: 800,
                }}
              >
                <span className="block text-4xl sm:text-5xl lg:text-[3.5rem]">Feel calm again.</span>
                <span className="block text-4xl sm:text-5xl lg:text-[3.5rem]">Think clearly,</span>
                <span className="block text-4xl sm:text-5xl lg:text-[3.5rem]">Sleep deeply.</span>
              </h1>

              {/* Reviews Badge - CRO Enhancement */}
              <div className="flex items-center gap-2">
                <div className="flex text-[#FFB800]">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} className="text-lg">{s}</span>
                  ))}
                </div>
                <span 
                  className="text-sm font-semibold"
                  style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
                >
                  4.9 (2,847 reviews)
                </span>
                <Link 
                  href="/science" 
                  className="text-sm font-medium text-[#2563EB] hover:underline ml-2"
                  style={{ fontFamily: TYPOGRAPHY.BODY_FONT }}
                >
                  See the science →
                </Link>
              </div>

              {/* Subheadline */}
              <p 
                className="max-w-xl text-base leading-7"
                style={{ color: '#4A5568', fontFamily: TYPOGRAPHY.BODY_FONT }}
              >
                Clinically studied ashwagandha for stress support, better sleep, and clearer focus — one capsule daily.
              </p>

              {/* Trust Icons Row */}
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-1">
                {[
                  { icon: IconBeaker, title: "Clinically studied", subtitle: "extract" },
                  { icon: IconShield, title: "3rd-party", subtitle: "tested" },
                  { icon: IconLeaf, title: "Non-GMO &", subtitle: "Organic" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span 
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white/80"
                      style={{ borderColor: `${BRAND_COLORS.ANTIQUE_GOLD}40` }}
                    >
                      <item.icon className="h-5 w-5" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }} />
                    </span>
                    <div className="leading-tight">
                      <div 
                        className="text-sm font-semibold"
                        style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
                      >
                        {item.title}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: `${BRAND_COLORS.DEEP_NAVY}99`, fontFamily: TYPOGRAPHY.BODY_FONT }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                    {idx < 2 && (
                      <div className="hidden sm:block h-8 w-px ml-2" style={{ backgroundColor: `${BRAND_COLORS.ANTIQUE_GOLD}30` }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Offer Card */}
              <div 
                className="max-w-xl rounded-[24px] border bg-white/90 shadow-xl backdrop-blur"
                style={{ borderColor: `${BRAND_COLORS.ANTIQUE_GOLD}30` }}
              >
                <div className="p-5 sm:p-6">
                  
                  {/* Countdown Timer */}
                  <CountdownTimer targetDate={targetDate} />

                  {/* Quantity Selector - CRO Enhancement */}
                  <div className="mt-5">
                    <div 
                      className="text-sm font-semibold mb-3"
                      style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
                    >
                      Choose your supply:
                    </div>
                    <QuantitySelector selected={selectedQuantity} onSelect={setSelectedQuantity} />
                  </div>

                  {/* Price Display */}
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                    <div className="flex items-end gap-3">
                      <div 
                        className="text-5xl font-extrabold leading-none"
                        style={{ color: BRAND_COLORS.NAVY_DARKER, fontFamily: TYPOGRAPHY.HEADING_FONT }}
                      >
                        ${selectedBundle.totalPrice.toFixed(2)}
                      </div>
                      <div className="pb-1">
                        <div 
                          className="text-lg line-through"
                          style={{ color: '#94A3B8', fontFamily: TYPOGRAPHY.BODY_FONT }}
                        >
                          ${(selectedBundle.quantity * 69.99).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <span 
                      className="inline-flex rounded-full px-3 py-1.5 text-xs font-bold tracking-wide text-white"
                      style={{ backgroundColor: '#DC2626' }}
                    >
                      PRE-ORDER PRICE
                    </span>
                  </div>

                  {/* Savings Description */}
                  <div 
                    className="mt-2 text-sm"
                    style={{ color: '#475569', fontFamily: TYPOGRAPHY.BODY_FONT }}
                  >
                    Includes: <span className="font-semibold">46% off</span> + <span className="font-semibold">extra 25% pre-order savings</span>
                  </div>

                  {/* Pre-order Shipping */}
                  <div 
                    className="mt-4 flex items-center gap-2 text-sm"
                    style={{ fontFamily: TYPOGRAPHY.BODY_FONT }}
                  >
                    <IconSparkle className="h-4 w-4" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }} />
                    <span className="font-semibold" style={{ color: BRAND_COLORS.DEEP_NAVY }}>Pre-Order Special:</span>
                    <span style={{ color: `${BRAND_COLORS.DEEP_NAVY}DD` }}>Ships Feb 14–21, 2026</span>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={CTA_HREF}
                    className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-bold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
                    style={{ 
                      backgroundColor: ACTION_COLORS.PRIMARY,
                      boxShadow: ACTION_COLORS.SHADOW,
                      fontFamily: TYPOGRAPHY.BODY_FONT,
                    }}
                  >
                    Pre-Order Now — ${selectedBundle.totalPrice.toFixed(2)}
                    <span className="text-xl">→</span>
                  </Link>

                  {/* Trust Micro Row */}
                  <div 
                    className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t pt-4 text-sm"
                    style={{ borderColor: '#E2E8F0', color: '#64748B', fontFamily: TYPOGRAPHY.BODY_FONT }}
                  >
                    <div className="flex items-center gap-2">
                      <IconLock className="h-4 w-4" />
                      Secure checkout
                    </div>
                    <div className="flex items-center gap-2">
                      <IconGuarantee className="h-4 w-4" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }} />
                      <span className="font-semibold">90-day guarantee</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof Card */}
              <div 
                className="max-w-xl rounded-2xl border p-4 shadow-lg"
                style={{
                  background: SOCIAL_PROOF_COLORS.BACKGROUND_GRADIENT,
                  borderColor: SOCIAL_PROOF_COLORS.BORDER,
                  boxShadow: SOCIAL_PROOF_COLORS.SHADOW,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&q=60",
                      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=64&q=60",
                      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=64&q=60",
                      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=64&q=60",
                    ].map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt=""
                        className="h-10 w-10 rounded-full border-2 object-cover"
                        style={{ borderColor: '#F0FDF4' }}
                        loading="lazy"
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div 
                      className="text-sm font-bold"
                      style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
                    >
                      12,000+ people have found their calm
                    </div>
                    <div 
                      className="mt-1 flex items-center gap-2 text-sm font-semibold"
                      style={{ color: SOCIAL_PROOF_COLORS.TEXT, fontFamily: TYPOGRAPHY.BODY_FONT }}
                    >
                      <span>✓</span>
                      127 bottles sold in the last 24 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Image with Golden Glow */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-full max-w-[480px]" style={{ overflow: 'visible' }}>
                
                {/* Golden Glow Background Effect - Enhanced & More Visible */}
                <div 
                  className="absolute"
                  style={{
                    top: '-20%',
                    left: '-30%',
                    right: '-30%',
                    bottom: '-20%',
                    background: `
                      radial-gradient(ellipse 80% 80% at 50% 50%, 
                        rgba(201, 169, 97, 0.7) 0%, 
                        rgba(201, 169, 97, 0.5) 20%, 
                        rgba(201, 169, 97, 0.3) 40%, 
                        rgba(201, 169, 97, 0.15) 60%,
                        transparent 80%
                      )
                    `,
                    filter: 'blur(60px)',
                    zIndex: 0,
                  }}
                />
                
                {/* Secondary Inner Glow */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(circle at 50% 50%, 
                        rgba(255, 215, 0, 0.25) 0%, 
                        rgba(201, 169, 97, 0.15) 30%, 
                        transparent 60%
                      )
                    `,
                    filter: 'blur(30px)',
                    transform: 'scale(1.2)',
                    zIndex: 1,
                  }}
                />
                
                {/* Bokeh Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full animate-pulse"
                      style={{
                        width: `${Math.random() * 20 + 8}px`,
                        height: `${Math.random() * 20 + 8}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: `radial-gradient(circle, rgba(201, 169, 97, ${Math.random() * 0.4 + 0.2}) 0%, transparent 70%)`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${Math.random() * 2 + 2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Product Image */}
                <div className="relative" style={{ zIndex: 10 }}>
                  <img
                    src={PRODUCT_IMAGE_SRC}
                    alt="OptiBio Ashwagandha KSM-66 Premium Supplement Bottle"
                    className="w-full h-auto max-h-[550px] object-contain drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.25))',
                    }}
                    loading="eager"
                  />
                </div>

                {/* Light Rays Effect */}
                <div 
                  className="absolute inset-0 -z-5 pointer-events-none"
                  style={{
                    background: `
                      conic-gradient(
                        from 0deg at 50% 60%,
                        transparent 0deg,
                        rgba(201, 169, 97, 0.08) 15deg,
                        transparent 30deg,
                        rgba(201, 169, 97, 0.06) 60deg,
                        transparent 75deg,
                        rgba(201, 169, 97, 0.08) 105deg,
                        transparent 120deg,
                        rgba(201, 169, 97, 0.06) 150deg,
                        transparent 165deg,
                        rgba(201, 169, 97, 0.08) 195deg,
                        transparent 210deg,
                        rgba(201, 169, 97, 0.06) 240deg,
                        transparent 255deg,
                        rgba(201, 169, 97, 0.08) 285deg,
                        transparent 300deg,
                        rgba(201, 169, 97, 0.06) 330deg,
                        transparent 345deg
                      )
                    `,
                    transform: 'scale(1.5)',
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
