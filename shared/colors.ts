/**
 * OptiBio Brand Color Schema
 * 
 * Centralized color constants for the OptiBio brand.
 * Use these constants throughout the application for consistency.
 * 
 * Last Updated: December 28, 2025
 * Version: 2.0 (Lighter Sky Blue Gradient)
 */

// ============================================================================
// PRIMARY BRAND COLORS
// ============================================================================

export const BRAND_COLORS = {
  // Deep Navy - Primary brand color
  navy: '#1E3A5F',
  navyDark: '#152B45',
  
  // Antique Gold - Secondary brand color
  gold: '#C9A961',
  goldDark: '#B89651',
  
  // Warm Ivory - Background/Canvas
  ivory: '#F7F4EF',
  ivoryLight: '#EDE9E3',
  
  // Neutrals
  charcoal: '#2D2D2D',
  white: '#FFFFFF',
  softWhite: '#FAFAF9',
  
  // Semantic
  success: '#5FA865',
} as const;

// ============================================================================
// SKY BLUE GRADIENT COLORS (Updated Dec 28, 2025)
// ============================================================================

export const SKY_GRADIENT_COLORS = {
  // Radial gradient stops - Light, airy wellness aesthetic
  cloudWhite: '#F8FCFE',   // 0% - Almost pure white (center)
  skyMist: '#EBF5FB',      // 40% - Very light sky blue (mid)
  powderBlue: '#D6EAF8',   // 100% - Light blue (edges)
} as const;

// ============================================================================
// GRADIENT STRINGS (Ready to use in CSS/inline styles)
// ============================================================================

export const GRADIENTS = {
  // Primary background gradient (Updated Dec 28, 2025)
  skyBlueRadial: `radial-gradient(ellipse at center, ${SKY_GRADIENT_COLORS.cloudWhite} 0%, ${SKY_GRADIENT_COLORS.skyMist} 40%, ${SKY_GRADIENT_COLORS.powderBlue} 100%)`,
  
  // Navy gradients
  navyDepth: `linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, ${BRAND_COLORS.navyDark} 100%)`,
  navyReverse: `linear-gradient(135deg, ${BRAND_COLORS.navyDark} 0%, ${BRAND_COLORS.navy} 100%)`,
  
  // Gold gradients
  goldShimmer: `linear-gradient(90deg, ${BRAND_COLORS.gold} 0%, #D4B76E 50%, ${BRAND_COLORS.gold} 100%)`,
  
  // Ivory gradients
  ivoryHero: `linear-gradient(135deg, ${BRAND_COLORS.ivory} 0%, ${BRAND_COLORS.ivoryLight} 100%)`,
  
  // Navy to Ivory
  navyToIvory: `linear-gradient(180deg, ${BRAND_COLORS.navy} 0%, ${BRAND_COLORS.ivory} 100%)`,
} as const;

// ============================================================================
// TEXT GRADIENTS (for gradient text effects)
// ============================================================================

export const TEXT_GRADIENTS = {
  navy: `linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, ${BRAND_COLORS.navyDark} 100%)`,
  gold: `linear-gradient(135deg, ${BRAND_COLORS.gold} 0%, ${BRAND_COLORS.goldDark} 100%)`,
  premium: `linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, ${BRAND_COLORS.gold} 100%)`,
} as const;

// ============================================================================
// OKLCH COLOR VALUES (for CSS variables)
// ============================================================================

export const OKLCH_COLORS = {
  navy: 'oklch(0.32 0.08 240)',
  navyDark: 'oklch(0.28 0.08 240)',
  gold: 'oklch(0.72 0.08 75)',
  ivory: 'oklch(0.97 0.01 60)',
  charcoal: 'oklch(0.22 0 0)',
  mutedGray: 'oklch(0.42 0 0)', // WCAG AA compliant
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the sky blue radial gradient background style object
 * Ready to spread into React inline styles
 */
export const getSkyBlueGradientStyle = () => ({
  background: GRADIENTS.skyBlueRadial,
});

/**
 * Get RGB values from hex color
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

/**
 * Add alpha channel to hex color
 */
export const hexWithAlpha = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

// ============================================================================
// COLOR USAGE GUIDELINES
// ============================================================================

/**
 * USAGE GUIDELINES:
 * 
 * 1. PRIMARY ACTIONS: Use BRAND_COLORS.navy for main CTAs and buttons
 * 2. ACCENTS: Use BRAND_COLORS.gold for highlights and premium indicators
 * 3. BACKGROUNDS: Use GRADIENTS.skyBlueRadial for main page backgrounds
 * 4. TEXT: Use BRAND_COLORS.charcoal for body text on light backgrounds
 * 5. CARDS: Use BRAND_COLORS.ivory or softWhite for card backgrounds
 * 
 * ACCESSIBILITY:
 * - All text colors meet WCAG AA standards (4.5:1 contrast)
 * - Muted gray is specifically tuned for accessibility
 * - Test contrast when using gold on light backgrounds
 * 
 * EXAMPLES:
 * 
 * // React inline style
 * <div style={getSkyBlueGradientStyle()}>...</div>
 * 
 * // Tailwind with custom color
 * <div style={{ backgroundColor: BRAND_COLORS.navy }}>...</div>
 * 
 * // CSS-in-JS
 * const styles = {
 *   background: GRADIENTS.skyBlueRadial,
 *   color: BRAND_COLORS.charcoal,
 * };
 */

// Export all color groups as default
export default {
  BRAND_COLORS,
  SKY_GRADIENT_COLORS,
  GRADIENTS,
  TEXT_GRADIENTS,
  OKLCH_COLORS,
  getSkyBlueGradientStyle,
  hexToRgb,
  hexWithAlpha,
};
