import { useState, useEffect } from "react";
import { Link } from "wouter";
import { BRAND_COLORS, ACTION_COLORS, TYPOGRAPHY } from "@/brand";

/**
 * StickyHeader Component - Enhanced with Laws of UX
 * 
 * UX Laws Applied:
 * - Fitts's Law: Large, accessible CTA button (min 44px touch target)
 * - Jakob's Law: Familiar sticky header pattern users expect
 * - Von Restorff Effect: CTA button stands out with color contrast
 * - Law of Proximity: Price and CTA grouped together
 * - Aesthetic-Usability Effect: Premium glassmorphism design
 */

// Shield icon for trust
function IconShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StickyHeaderProps {
  /** Scroll threshold in pixels before header appears */
  scrollThreshold?: number;
  /** Price to display in CTA */
  price?: number;
  /** Original price for comparison */
  originalPrice?: number;
  /** Link destination for CTA */
  ctaHref?: string;
}

export default function StickyHeader({ 
  scrollThreshold = 400, 
  price = 28.35,
  originalPrice = 69.99,
  ctaHref = "/shop" 
}: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > scrollThreshold);
      setHasScrolledPast(scrollY > scrollThreshold + 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  const savingsPercent = Math.round((1 - price / originalPrice) * 100);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-400 ease-out
        ${isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0 pointer-events-none'
        }
      `}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Main Header Bar - Glassmorphism effect */}
      <div 
        className="backdrop-blur-xl border-b transition-all duration-300"
        style={{ 
          backgroundColor: hasScrolledPast ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: `${BRAND_COLORS.ANTIQUE_GOLD}15`,
          boxShadow: hasScrolledPast 
            ? '0 4px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)' 
            : '0 2px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-[68px]">
            
            {/* Logo - Jakob's Law: Familiar placement */}
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group transition-opacity duration-200 hover:opacity-80"
            >
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${BRAND_COLORS.DEEP_NAVY} 0%, #2D4A77 100%)`,
                  boxShadow: '0 2px 8px rgba(30, 58, 95, 0.3)',
                }}
              >
                <span className="text-white font-bold text-sm" style={{ fontFamily: TYPOGRAPHY.HEADING_FONT }}>
                  OB
                </span>
              </div>
              <div className="hidden sm:block">
                <span 
                  className="text-lg font-bold tracking-tight"
                  style={{ 
                    color: BRAND_COLORS.DEEP_NAVY, 
                    fontFamily: TYPOGRAPHY.HEADING_FONT 
                  }}
                >
                  OptiBio
                </span>
                <span 
                  className="text-[10px] block -mt-0.5 tracking-wide"
                  style={{ color: '#64748B' }}
                >
                  Premium Wellness
                </span>
              </div>
            </Link>

            {/* Center: Trust Badge - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100">
              <IconShieldCheck className="w-4 h-4 text-green-600" />
              <span 
                className="text-xs font-semibold text-green-700"
                style={{ fontFamily: TYPOGRAPHY.BODY_FONT }}
              >
                90-Day Money-Back Guarantee
              </span>
            </div>

            {/* Right Section: Price + CTA - Law of Proximity */}
            <div className="flex items-center gap-4 sm:gap-5">
              
              {/* Price Display - Hidden on very small screens */}
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <span 
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                      color: '#16A34A',
                      fontFamily: TYPOGRAPHY.BODY_FONT 
                    }}
                  >
                    Save {savingsPercent}%
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span 
                    className="text-xl font-bold"
                    style={{ color: BRAND_COLORS.NAVY_DARKER, fontFamily: TYPOGRAPHY.HEADING_FONT }}
                  >
                    ${price.toFixed(2)}
                  </span>
                  <span 
                    className="text-sm line-through opacity-50"
                    style={{ color: '#94A3B8' }}
                  >
                    ${originalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* CTA Button - Fitts's Law: Large touch target, Von Restorff: Stands out */}
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 sm:px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
                style={{ 
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35), 0 2px 6px rgba(37, 99, 235, 0.2)',
                  fontFamily: TYPOGRAPHY.BODY_FONT,
                  minHeight: '44px', // Fitts's Law: Minimum touch target
                }}
              >
                <span className="hidden sm:inline">Pre-Order Now</span>
                <span className="sm:hidden">Order</span>
                <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Urgency Banner - Zeigarnik Effect: Creates sense of incompletion */}
      <div 
        className={`
          hidden md:block border-b py-2 text-center transition-all duration-300
          ${hasScrolledPast ? 'opacity-100' : 'opacity-90'}
        `}
        style={{ 
          background: 'linear-gradient(90deg, #FFFBEB 0%, #FEF3C7 50%, #FFFBEB 100%)',
          borderColor: '#FDE68A',
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <span 
            className="inline-flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: '#92400E', fontFamily: TYPOGRAPHY.BODY_FONT }}
          >
            <span className="text-base">🔥</span>
            Pre-order special: <span className="font-bold">{savingsPercent}% OFF</span> + Free Shipping
          </span>
          <span 
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(146, 64, 14, 0.1)', color: '#92400E' }}
          >
            Limited time
          </span>
        </div>
      </div>
    </div>
  );
}
