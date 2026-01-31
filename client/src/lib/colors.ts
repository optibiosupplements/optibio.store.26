/**
 * ============================================
 * OPTIBIO BRAND COLORS - LOCKED SYSTEM
 * ============================================
 * 
 * ⚠️ CRITICAL: DO NOT MODIFY THESE VALUES ⚠️
 * 
 * These colors are locked per Master Brand Guidelines v2.0
 * Any changes must be approved by brand team and documented
 * 
 * Last Updated: Dec 30, 2025
 * Authority: OptiBio Brand Style Guide
 * ============================================
 */

/**
 * CORE BRAND COLORS (IMMUTABLE)
 * These are the foundation of OptiBio's visual identity
 */
export const OPTIBIO_COLORS = {
  // PRIMARY BRAND COLORS
  navy: {
    primary: '#1E3A5F',    // Deep Navy - Headlines, primary text
    dark: '#152B45',       // Navy Dark - Hover states
    depth: '#0D1B2A',      // Navy Depth - Footer gradient
  },
  ivory: {
    primary: '#F7F4EF',    // Warm Ivory - Section backgrounds
  },
  gold: {
    primary: '#C9A961',    // Antique Gold - Accents, badges
    dark: '#B89651',       // Gold Dark - Hover states
  },
  white: {
    pure: '#FFFFFF',       // Pure White - Cards, clean spaces
  },
  
  // SUPPORTING COLORS
  text: {
    charcoal: '#2D2D2D',   // Charcoal - Primary body text
    slate: '#475569',      // Slate Grey - Secondary body text
  },
  accent: {
    electric: '#2563EB',   // Electric Blue - Links, hover states
    success: '#5FA865',    // Success Green - Checkmarks
  },
  
  // SKY BLUE GRADIENT (Hero/Page Backgrounds)
  sky: {
    light: '#F8FCFE',      // Sky gradient start
    mid: '#EBF5FB',        // Sky gradient middle
    deep: '#D6EAF8',       // Sky gradient end
  },
  
  // DARK MODE COLORS
  dark: {
    abyssal: '#0B1120',    // Abyssal Navy - Dark mode bg
    slate: '#0F172A',      // Dark Slate - Dark mode sections
    navyCard: '#15233E',   // Navy Card - Dark mode cards
    luminousGold: '#D4AF37', // Luminous Gold - Dark mode accent
    skyGrey: '#94A3B8',    // Sky Grey - Dark mode secondary text
    border: '#2D4A77',     // Navy 700 - Dark mode borders
  },
} as const;

/**
 * SEMANTIC COLOR ALIASES
 * Use these in components for consistent theming
 */
export const SEMANTIC_COLORS = {
  // Backgrounds
  bg: {
    page: OPTIBIO_COLORS.white.pure,
    section: OPTIBIO_COLORS.ivory.primary,
    sectionAlt: OPTIBIO_COLORS.white.pure,
    card: OPTIBIO_COLORS.white.pure,
    footer: OPTIBIO_COLORS.navy.primary,
    cta: OPTIBIO_COLORS.navy.primary,
    ctaHover: OPTIBIO_COLORS.accent.electric,
  },
  
  // Text
  text: {
    primary: OPTIBIO_COLORS.text.charcoal,
    secondary: OPTIBIO_COLORS.text.slate,
    headline: OPTIBIO_COLORS.navy.primary,
    accent: OPTIBIO_COLORS.gold.primary,
    link: OPTIBIO_COLORS.accent.electric,
    success: OPTIBIO_COLORS.accent.success,
  },
  
  // Borders
  border: {
    default: '#E2E8F0',
    accent: OPTIBIO_COLORS.gold.primary,
    navy: OPTIBIO_COLORS.navy.primary,
  },
  
  // Buttons
  button: {
    primary: {
      bg: OPTIBIO_COLORS.accent.electric,
      text: OPTIBIO_COLORS.white.pure,
    },
    secondary: {
      bg: OPTIBIO_COLORS.white.pure,
      text: OPTIBIO_COLORS.navy.primary,
    },
  },
  
  // Badges
  badge: {
    bg: OPTIBIO_COLORS.gold.primary,
    text: OPTIBIO_COLORS.white.pure,
  },
} as const;

/**
 * GRADIENT DEFINITIONS
 * Pre-defined gradients for consistent usage
 */
export const GRADIENTS = {
  skyBlueRadial: `radial-gradient(ellipse at top, ${OPTIBIO_COLORS.sky.light} 0%, ${OPTIBIO_COLORS.sky.mid} 50%, ${OPTIBIO_COLORS.sky.deep} 100%)`,
  navyDepth: `linear-gradient(to bottom right, ${OPTIBIO_COLORS.navy.primary}, ${OPTIBIO_COLORS.navy.depth})`,
  goldShimmer: `linear-gradient(135deg, ${OPTIBIO_COLORS.gold.primary}, ${OPTIBIO_COLORS.gold.dark})`,
} as const;

/**
 * COLOR VALIDATION UTILITIES
 * Runtime checks to prevent color drift
 */

/**
 * Validates if a hex color matches approved brand colors
 */
export function isApprovedColor(hexColor: string): boolean {
  const normalizedColor = hexColor.toUpperCase();
  const approvedColors = getAllApprovedColors();
  return approvedColors.includes(normalizedColor);
}

/**
 * Gets all approved brand colors as flat array
 */
export function getAllApprovedColors(): string[] {
  return [
    // Primary brand colors
    OPTIBIO_COLORS.navy.primary.toUpperCase(),
    OPTIBIO_COLORS.navy.dark.toUpperCase(),
    OPTIBIO_COLORS.navy.depth.toUpperCase(),
    OPTIBIO_COLORS.ivory.primary.toUpperCase(),
    OPTIBIO_COLORS.gold.primary.toUpperCase(),
    OPTIBIO_COLORS.gold.dark.toUpperCase(),
    OPTIBIO_COLORS.white.pure.toUpperCase(),
    
    // Supporting colors
    OPTIBIO_COLORS.text.charcoal.toUpperCase(),
    OPTIBIO_COLORS.text.slate.toUpperCase(),
    OPTIBIO_COLORS.accent.electric.toUpperCase(),
    OPTIBIO_COLORS.accent.success.toUpperCase(),
    
    // Sky gradient
    OPTIBIO_COLORS.sky.light.toUpperCase(),
    OPTIBIO_COLORS.sky.mid.toUpperCase(),
    OPTIBIO_COLORS.sky.deep.toUpperCase(),
    
    // Dark mode
    OPTIBIO_COLORS.dark.abyssal.toUpperCase(),
    OPTIBIO_COLORS.dark.slate.toUpperCase(),
    OPTIBIO_COLORS.dark.navyCard.toUpperCase(),
    OPTIBIO_COLORS.dark.luminousGold.toUpperCase(),
    OPTIBIO_COLORS.dark.skyGrey.toUpperCase(),
    OPTIBIO_COLORS.dark.border.toUpperCase(),
    
    // Border default
    '#E2E8F0',
  ];
}

/**
 * Validates color usage and logs warning if unapproved
 */
export function validateColorUsage(hexColor: string, context: string): void {
  if (!isApprovedColor(hexColor)) {
    console.warn(
      `⚠️ UNAPPROVED COLOR DETECTED: ${hexColor} in ${context}\n` +
      `Only approved OptiBio brand colors should be used.\n` +
      `See client/src/lib/colors.ts for approved colors.`
    );
  }
}

/**
 * TYPE DEFINITIONS
 * TypeScript types for type-safe color usage
 */

export type NavyShade = keyof typeof OPTIBIO_COLORS.navy;
export type GoldShade = keyof typeof OPTIBIO_COLORS.gold;
export type SkyShade = keyof typeof OPTIBIO_COLORS.sky;
export type DarkModeColor = keyof typeof OPTIBIO_COLORS.dark;

export type SemanticBgColor = keyof typeof SEMANTIC_COLORS.bg;
export type SemanticTextColor = keyof typeof SEMANTIC_COLORS.text;
export type SemanticBorderColor = keyof typeof SEMANTIC_COLORS.border;

/**
 * USAGE EXAMPLES
 * 
 * // Import colors
 * import { OPTIBIO_COLORS, SEMANTIC_COLORS, GRADIENTS } from '@/lib/colors';
 * 
 * // Use in inline styles
 * <div style={{ backgroundColor: OPTIBIO_COLORS.navy.primary }}>
 * 
 * // Use semantic colors
 * <h1 style={{ color: SEMANTIC_COLORS.text.headline }}>
 * 
 * // Use gradients
 * <div style={{ background: GRADIENTS.skyBlueRadial }}>
 * 
 * // Validate colors
 * validateColorUsage('#1E3A5F', 'Hero section background');
 * 
 * // Check if color is approved
 * if (isApprovedColor('#1E3A5F')) {
 *   // Color is approved
 * }
 */

/**
 * TAILWIND CSS INTEGRATION
 * These colors are also available as CSS variables in index.css
 * 
 * Use CSS variables in Tailwind classes:
 * - bg-[var(--optibio-navy)]
 * - text-[var(--optibio-gold)]
 * - border-[var(--optibio-navy)]
 * 
 * Or use semantic aliases:
 * - bg-[var(--color-bg-page)]
 * - text-[var(--color-text-headline)]
 * - border-[var(--color-border-accent)]
 */

// Freeze objects to prevent modification
Object.freeze(OPTIBIO_COLORS);
Object.freeze(SEMANTIC_COLORS);
Object.freeze(GRADIENTS);
