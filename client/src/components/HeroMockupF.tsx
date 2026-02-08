import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { BRAND_COLORS, URGENCY_COLORS, ACTION_COLORS, SOCIAL_PROOF_COLORS, TYPOGRAPHY } from "@/brand";

/**
 * HeroMockupF - Optimized V2 with Laws of UX Applied
 * 
 * UX Laws Implemented:
 * - Fitts's Law: Large, accessible CTA buttons with proper touch targets
 * - Hick's Law: Pre-selected best value, limited choices (3 bundles)
 * - Jakob's Law: Familiar e-commerce patterns
 * - Miller's Law: Information chunked into 3-5 groups
 * - Peak-End Rule: Memorable golden glow effect, satisfying interactions
 * - Serial Position Effect: Key info at start (headline) and end (guarantee)
 * - Von Restorff Effect: "BEST VALUE" badge stands out
 * - Aesthetic-Usability Effect: Premium polish throughout
 * - Law of Proximity: Related elements grouped together
 * - Law of Similarity: Consistent styling for related items
 * - Law of Common Region: Cards/containers for grouping
 */

// ============================================================================
// SVG Icons - Premium Refined
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

function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTruck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M1 3h15v13H1V3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 8h4l3 4v4h-7V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

// ============================================================================
// Countdown Timer Component - Enhanced with UX Laws
// Peak-End Rule: Creates memorable urgency moment
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
      className="rounded-2xl px-5 py-4 border transition-all duration-300 hover:shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF8ED 100%)',
        borderColor: 'rgba(201, 169, 97, 0.3)',
        boxShadow: '0 4px 20px rgba(201, 169, 97, 0.15)',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201, 169, 97, 0.15)' }}
          >
            <IconSparkle className="h-4 w-4" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }} />
          </div>
          <span 
            className="text-sm font-semibold"
            style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
          >
            Limited time offer ends in:
          </span>
        </div>
        <div 
          className="flex items-center gap-1"
          style={{ fontFamily: TYPOGRAPHY.HEADING_FONT }}
        >
          {/* Hours */}
          <div className="flex flex-col items-center">
            <span 
              className="text-2xl font-bold tabular-nums px-2 py-1 rounded-lg"
              style={{ 
                color: BRAND_COLORS.DEEP_NAVY,
                background: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-xl font-bold animate-pulse" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }}>:</span>
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span 
              className="text-2xl font-bold tabular-nums px-2 py-1 rounded-lg"
              style={{ 
                color: BRAND_COLORS.DEEP_NAVY,
                background: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-xl font-bold animate-pulse" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }}>:</span>
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <span 
              className="text-2xl font-bold tabular-nums px-2 py-1 rounded-lg"
              style={{ 
                color: BRAND_COLORS.DEEP_NAVY,
                background: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Quantity Bundle Selector - Enhanced with UX Laws
// Hick's Law: Limited to 3 choices with pre-selection
// Von Restorff Effect: "BEST VALUE" badge stands out
// Fitts's Law: Large touch targets (min 48px)
// ============================================================================

interface BundleOption {
  quantity: number;
  label: string;
  pricePerBottle: number;
  totalPrice: number;
  savings: string;
  popular?: boolean;
  supplyDays: string;
}

const bundleOptions: BundleOption[] = [
  { quantity: 1, label: "1 Bottle", pricePerBottle: 39.99, totalPrice: 39.99, savings: "20% OFF", supplyDays: "45-day supply" },
  { quantity: 3, label: "3 Bottles", pricePerBottle: 33.33, totalPrice: 99.99, savings: "33% OFF", popular: true, supplyDays: "135-day supply" },
  { quantity: 6, label: "6 Bottles", pricePerBottle: 30.00, totalPrice: 179.99, savings: "40% OFF", supplyDays: "270-day supply" },
];

interface QuantitySelectorProps {
  selected: number;
  onSelect: (quantity: number) => void;
}

function QuantitySelector({ selected, onSelect }: QuantitySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {bundleOptions.map((option) => {
        const isSelected = selected === option.quantity;
        return (
          <button
            key={option.quantity}
            onClick={() => onSelect(option.quantity)}
            className={`
              relative rounded-2xl p-4 border-2 transition-all duration-300 ease-out
              min-h-[120px] flex flex-col items-center justify-center
              ${isSelected 
                ? 'border-[#2563EB] bg-gradient-to-b from-blue-50 to-white shadow-lg scale-[1.02]' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
              }
            `}
            style={{
              boxShadow: isSelected 
                ? '0 8px 30px rgba(37, 99, 235, 0.2), 0 4px 12px rgba(37, 99, 235, 0.1)' 
                : undefined,
            }}
          >
            {/* Von Restorff Effect: Make BEST VALUE stand out */}
            {option.popular && (
              <span 
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold tracking-wider text-white rounded-full whitespace-nowrap shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, #D4AF37 0%, #C9A961 100%)',
                  boxShadow: '0 4px 12px rgba(201, 169, 97, 0.4)',
                }}
              >
                BEST VALUE
              </span>
            )}
            
            {/* Selection indicator */}
            {isSelected && (
              <div 
                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#2563EB' }}
              >
                <IconCheck className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className="text-center">
              <div 
                className="text-sm font-bold"
                style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
              >
                {option.label}
              </div>
              <div 
                className="text-2xl font-extrabold mt-1"
                style={{ 
                  color: isSelected ? '#2563EB' : BRAND_COLORS.NAVY_DARKER, 
                  fontFamily: TYPOGRAPHY.HEADING_FONT 
                }}
              >
                ${option.pricePerBottle.toFixed(2)}
              </div>
              <div 
                className="text-[10px] mt-0.5"
                style={{ color: '#64748B' }}
              >
                per bottle
              </div>
              <div 
                className="text-xs font-bold mt-2 px-2 py-0.5 rounded-full inline-block"
                style={{ 
                  backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                  color: '#16A34A',
                }}
              >
                {option.savings}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Bokeh Particles - Memoized for Performance
// ============================================================================

function BokehParticles() {
  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      width: Math.random() * 25 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none" style={{ zIndex: 2 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.width}px`,
            height: `${p.width}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: `radial-gradient(circle, rgba(212, 175, 55, ${p.opacity}) 0%, transparent 70%)`,
            animation: `pulse ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Main Hero Component - Premium UX Implementation
// ============================================================================

export default function HeroMockupF() {
  // Hick's Law: Select best value option by default to reduce decision time
  const [selectedQuantity, setSelectedQuantity] = useState(3);
  const selectedBundle = bundleOptions.find(b => b.quantity === selectedQuantity) || bundleOptions[1];
  
  // Set countdown target to 15 hours from now
  const [targetDate] = useState(() => {
    const target = new Date();
    target.setHours(target.getHours() + 15);
    target.setMinutes(3);
    target.setSeconds(34);
    return target;
  });

  const PRODUCT_IMAGE_SRC = "/product-golden-radiance.png";
  const CTA_HREF = "/shop";

  return (
    <section className="w-full relative overflow-hidden">
      {/* Background with premium radial gradient - Aesthetic-Usability Effect */}
      <div
        className="relative w-full"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 20%, 
              #FFFFFF 0%, 
              #F8FBFD 20%,
              #F0F7FB 40%, 
              #E8F4FA 60%,
              #E1F0F8 80%,
              #D6EAF8 100%
            )
          `,
        }}
      >
        {/* Subtle decorative elements */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(201, 169, 97, 0.15) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:px-10 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            
            {/* Left Column: Copy + Offer - Law of Common Region */}
            <div className="space-y-6 order-2 lg:order-1">
              
              {/* Serial Position Effect: Start with trust badge */}
              <div 
                className="inline-flex items-center rounded-full border px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] shadow-sm transition-all duration-300 hover:shadow-md"
                style={{ 
                  backgroundColor: BRAND_COLORS.DEEP_NAVY,
                  borderColor: `${BRAND_COLORS.ANTIQUE_GOLD}50`,
                  color: BRAND_COLORS.ANTIQUE_GOLD,
                }}
              >
                <IconShield className="w-3.5 h-3.5 mr-2" />
                SCIENCE-BACKED • THIRD-PARTY TESTED
              </div>

              {/* Headline - Typography hierarchy for premium feel */}
              <h1
                className="leading-[1.02] tracking-[-0.03em]"
                style={{ 
                  color: BRAND_COLORS.DEEP_NAVY, 
                  fontFamily: TYPOGRAPHY.HEADING_FONT,
                  fontWeight: 800,
                }}
              >
                <span className="block text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4rem]">Feel calm again.</span>
                <span className="block text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4rem]">Think clearly,</span>
                <span className="block text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4rem]">Sleep deeply.</span>
              </h1>

              {/* Reviews Badge - Social Proof with Law of Proximity */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1.5 shadow-sm border border-amber-100">
                  <div className="flex text-[#FFB800]">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} className="text-base">{s}</span>
                    ))}
                  </div>
                  <span 
                    className="text-sm font-bold"
                    style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
                  >
                    4.9
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: '#64748B', fontFamily: TYPOGRAPHY.BODY_FONT }}
                  >
                    (2,847 reviews)
                  </span>
                </div>
                <Link 
                  href="/science" 
                  className="text-sm font-semibold transition-all duration-200 hover:underline flex items-center gap-1 group"
                  style={{ color: '#2563EB', fontFamily: TYPOGRAPHY.BODY_FONT }}
                >
                  See the science 
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
              </div>

              {/* Subheadline - Clear value proposition */}
              <p 
                className="max-w-xl text-lg leading-relaxed"
                style={{ color: '#475569', fontFamily: TYPOGRAPHY.BODY_FONT }}
              >
                Clinically studied ashwagandha for stress support, better sleep, and clearer focus — <span className="font-semibold" style={{ color: BRAND_COLORS.DEEP_NAVY }}>one capsule daily</span>.
              </p>

              {/* Trust Icons Row - Miller's Law: 3 items (within 7±2) */}
              <div className="flex flex-wrap items-center gap-5 lg:gap-8 pt-2">
                {[
                  { icon: IconBeaker, title: "Clinically studied", subtitle: "extract" },
                  { icon: IconShield, title: "3rd-party", subtitle: "tested" },
                  { icon: IconLeaf, title: "Non-GMO &", subtitle: "Organic" },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 group transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span 
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-white shadow-sm transition-all duration-200 group-hover:shadow-md"
                      style={{ borderColor: `${BRAND_COLORS.ANTIQUE_GOLD}40` }}
                    >
                      <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }} />
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
                        style={{ color: '#64748B', fontFamily: TYPOGRAPHY.BODY_FONT }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                    {idx < 2 && (
                      <div className="hidden lg:block h-10 w-px ml-3" style={{ backgroundColor: `${BRAND_COLORS.ANTIQUE_GOLD}25` }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Offer Card - Law of Common Region: Container groups related content */}
              <div 
                className="max-w-xl rounded-3xl border bg-white/95 shadow-2xl backdrop-blur-sm transition-all duration-300"
                style={{ 
                  borderColor: `${BRAND_COLORS.ANTIQUE_GOLD}25`,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="p-6 sm:p-7">
                  
                  {/* Countdown Timer - Zeigarnik Effect */}
                  <CountdownTimer targetDate={targetDate} />

                  {/* Quantity Selector - Hick's Law applied */}
                  <div className="mt-6">
                    <div 
                      className="text-sm font-semibold mb-4 flex items-center gap-2"
                      style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
                    >
                      <span>Choose your supply:</span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16A34A' }}
                      >
                        {selectedBundle.supplyDays}
                      </span>
                    </div>
                    <QuantitySelector selected={selectedQuantity} onSelect={setSelectedQuantity} />
                  </div>

                  {/* Price Display - Law of Proximity: Price elements grouped */}
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex items-end gap-3">
                      <div 
                        className="text-5xl sm:text-[3.5rem] font-extrabold leading-none tracking-tight"
                        style={{ color: BRAND_COLORS.NAVY_DARKER, fontFamily: TYPOGRAPHY.HEADING_FONT }}
                      >
                        ${selectedBundle.totalPrice.toFixed(2)}
                      </div>
                      <div className="pb-1.5">
                        <div 
                          className="text-lg line-through opacity-60"
                          style={{ color: '#94A3B8', fontFamily: TYPOGRAPHY.BODY_FONT }}
                        >
                          ${(selectedBundle.quantity * 49.99).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    {/* Von Restorff Effect: Savings badge stands out */}
                    <span 
                      className="inline-flex items-center rounded-full px-4 py-2 text-xs font-bold tracking-wide text-white shadow-lg transition-transform duration-200 hover:scale-105"
                      style={{ 
                        background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                        boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                      }}
                    >
                      SAVE NOW
                    </span>
                  </div>

                  {/* Savings Description */}
                  <div 
                    className="mt-3 text-sm flex items-center gap-2"
                    style={{ color: '#475569', fontFamily: TYPOGRAPHY.BODY_FONT }}
                  >
                    <IconCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>
                      Includes: <span className="font-semibold">Up to 40% off</span> + <span className="font-semibold">Free shipping on 3+ bottles</span>
                    </span>
                  </div>

                  {/* Pre-order Shipping */}
                  <div 
                    className="mt-4 flex items-center gap-3 text-sm p-3 rounded-xl"
                    style={{ 
                      backgroundColor: 'rgba(201, 169, 97, 0.08)',
                      fontFamily: TYPOGRAPHY.BODY_FONT 
                    }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(201, 169, 97, 0.15)' }}
                    >
                      <IconTruck className="h-4 w-4" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }} />
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: BRAND_COLORS.DEEP_NAVY }}>Fast Shipping:</span>
                      <span className="ml-1" style={{ color: '#475569' }}>Ships within 1-2 business days</span>
                    </div>
                  </div>

                  {/* CTA Button - Fitts's Law: Large, accessible target */}
                  <Link
                    href={CTA_HREF}
                    className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-bold text-white transition-all duration-300 hover:brightness-110 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
                    style={{ 
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      boxShadow: '0 10px 40px rgba(37, 99, 235, 0.4), 0 4px 12px rgba(37, 99, 235, 0.2)',
                      fontFamily: TYPOGRAPHY.BODY_FONT,
                    }}
                  >
                    Shop Now — ${selectedBundle.totalPrice.toFixed(2)}
                    <span className="text-xl transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </Link>

                  {/* Serial Position Effect: End with trust/guarantee */}
                  <div 
                    className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t pt-5 text-sm"
                    style={{ borderColor: '#E2E8F0', color: '#64748B', fontFamily: TYPOGRAPHY.BODY_FONT }}
                  >
                    <div className="flex items-center gap-2 transition-colors duration-200 hover:text-gray-700">
                      <IconLock className="h-4 w-4" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 transition-colors duration-200 hover:text-gray-700">
                      <IconTruck className="h-4 w-4" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }} />
                      <span>Free shipping</span>
                    </div>
                    <div className="flex items-center gap-2 transition-colors duration-200 hover:text-gray-700">
                      <IconGuarantee className="h-4 w-4" style={{ color: BRAND_COLORS.ANTIQUE_GOLD }} />
                      <span className="font-semibold">90-day guarantee</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof Card - Law of Similarity: Consistent card styling */}
              <div 
                className="max-w-xl rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
                  borderColor: 'rgba(34, 197, 94, 0.2)',
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.1)',
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
                        className="h-11 w-11 rounded-full border-3 object-cover shadow-sm transition-transform duration-200 hover:scale-110 hover:z-10"
                        style={{ borderColor: '#F0FDF4', borderWidth: '3px' }}
                        loading="lazy"
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div 
                      className="text-base font-bold"
                      style={{ color: BRAND_COLORS.DEEP_NAVY, fontFamily: TYPOGRAPHY.BODY_FONT }}
                    >
                      12,000+ people have found their calm
                    </div>
                    <div 
                      className="mt-1.5 flex items-center gap-2 text-sm font-semibold"
                      style={{ color: '#16A34A', fontFamily: TYPOGRAPHY.BODY_FONT }}
                    >
                      <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <IconCheck className="w-3 h-3" />
                      </span>
                      127 bottles sold in the last 24 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Image with Golden Glow - Peak-End Rule */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-full max-w-[520px]" style={{ overflow: 'visible' }}>
                
                {/* Golden Glow Background Effect - Enhanced & More Visible */}
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    top: '-25%',
                    left: '-35%',
                    right: '-35%',
                    bottom: '-25%',
                    background: `
                      radial-gradient(ellipse 75% 75% at 50% 50%, 
                        rgba(212, 175, 55, 0.6) 0%, 
                        rgba(201, 169, 97, 0.45) 20%, 
                        rgba(201, 169, 97, 0.25) 40%, 
                        rgba(201, 169, 97, 0.1) 60%,
                        transparent 80%
                      )
                    `,
                    filter: 'blur(50px)',
                    zIndex: 0,
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                
                {/* Secondary Inner Glow - Creates depth */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(circle at 50% 45%, 
                        rgba(255, 215, 0, 0.3) 0%, 
                        rgba(212, 175, 55, 0.15) 30%, 
                        transparent 60%
                      )
                    `,
                    filter: 'blur(25px)',
                    transform: 'scale(1.3)',
                    zIndex: 1,
                  }}
                />
                
                {/* Bokeh Particles - Premium detail */}
                <BokehParticles />

                {/* Product Image */}
                <div className="relative" style={{ zIndex: 10 }}>
                  <img
                    src={PRODUCT_IMAGE_SRC}
                    alt="OptiBio Ashwagandha KSM-66 Premium Supplement Bottle"
                    className="w-full h-auto max-h-[600px] object-contain transition-transform duration-500 hover:scale-[1.02]"
                    style={{
                      filter: 'drop-shadow(0 35px 70px rgba(0, 0, 0, 0.3)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))',
                    }}
                    loading="eager"
                  />
                </div>

                {/* Light Rays Effect - Subtle premium touch */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      conic-gradient(
                        from 0deg at 50% 55%,
                        transparent 0deg,
                        rgba(212, 175, 55, 0.06) 15deg,
                        transparent 30deg,
                        rgba(212, 175, 55, 0.04) 60deg,
                        transparent 75deg,
                        rgba(212, 175, 55, 0.06) 105deg,
                        transparent 120deg,
                        rgba(212, 175, 55, 0.04) 150deg,
                        transparent 165deg,
                        rgba(212, 175, 55, 0.06) 195deg,
                        transparent 210deg,
                        rgba(212, 175, 55, 0.04) 240deg,
                        transparent 255deg,
                        rgba(212, 175, 55, 0.06) 285deg,
                        transparent 300deg,
                        rgba(212, 175, 55, 0.04) 330deg,
                        transparent 345deg
                      )
                    `,
                    transform: 'scale(1.6)',
                    opacity: 0.8,
                    zIndex: 3,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animation for glow pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
}
