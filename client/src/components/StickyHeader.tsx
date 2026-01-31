import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { BRAND_COLORS, ACTION_COLORS, TYPOGRAPHY } from "@/brand";

/**
 * StickyHeader Component
 * 
 * A sticky header that appears on scroll with:
 * - Brand logo
 * - Mini CTA button
 * - Smooth slide-down animation
 * - Mobile-optimized design
 */

interface StickyHeaderProps {
  /** Scroll threshold in pixels before header appears */
  scrollThreshold?: number;
  /** Price to display in CTA */
  price?: number;
  /** Link destination for CTA */
  ctaHref?: string;
}

export default function StickyHeader({ 
  scrollThreshold = 400, 
  price = 28.35,
  ctaHref = "/shop" 
}: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-out
        ${isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0 pointer-events-none'
        }
      `}
    >
      <div 
        className="bg-white/95 backdrop-blur-md border-b shadow-lg"
        style={{ borderColor: `${BRAND_COLORS.ANTIQUE_GOLD}20` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/optibio-logo.svg" 
                alt="OptiBio" 
                className="h-7 sm:h-8 w-auto"
                onError={(e) => {
                  // Fallback to text if logo doesn't load
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span 
                className="text-lg sm:text-xl font-bold"
                style={{ 
                  color: BRAND_COLORS.DEEP_NAVY, 
                  fontFamily: TYPOGRAPHY.HEADING_FONT 
                }}
              >
                OptiBio
              </span>
            </Link>

            {/* Right Section: Price + CTA */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Price Display - Hidden on very small screens */}
              <div className="hidden sm:flex flex-col items-end">
                <span 
                  className="text-xs"
                  style={{ color: '#64748B', fontFamily: TYPOGRAPHY.BODY_FONT }}
                >
                  Pre-order price
                </span>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-lg font-bold"
                    style={{ color: BRAND_COLORS.NAVY_DARKER, fontFamily: TYPOGRAPHY.HEADING_FONT }}
                  >
                    ${price.toFixed(2)}
                  </span>
                  <span 
                    className="text-sm line-through"
                    style={{ color: '#94A3B8' }}
                  >
                    $69.99
                  </span>
                </div>
              </div>

              {/* Mini CTA Button */}
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: ACTION_COLORS.PRIMARY,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  fontFamily: TYPOGRAPHY.BODY_FONT,
                }}
              >
                <span className="hidden sm:inline">Pre-Order Now</span>
                <span className="sm:hidden">Order Now</span>
                <span className="text-base">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Urgency Banner - Optional, shows on larger screens */}
      <div 
        className="hidden md:block bg-gradient-to-r from-amber-50 to-orange-50 border-b py-1.5 text-center"
        style={{ borderColor: '#FED7AA' }}
      >
        <span 
          className="text-xs font-semibold"
          style={{ color: '#7C2D12', fontFamily: TYPOGRAPHY.BODY_FONT }}
        >
          🔥 Pre-order special: 59% OFF + Free Shipping — Limited time only
        </span>
      </div>
    </div>
  );
}
