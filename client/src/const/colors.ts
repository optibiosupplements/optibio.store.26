/**
 * OptiBio Brand Color Constants - Version 66b1d787
 * 
 * CRITICAL: These colors are LOCKED and APPROVED.
 * DO NOT MODIFY without explicit user approval.
 * 
 * Focus: Light Mode (Day Mode) Design
 * Last Updated: December 29, 2025
 */

// ============================================
// PRIMARY BRAND COLORS (Midnight Sophistication)
// ============================================

export const OPTIBIO_COLORS = {
  // Deep Navy - Primary Color
  navy: '#1E3A5F',
  navyDark: '#152B45',
  
  // Antique Gold - Accent Color
  gold: '#C9A961',
  goldDark: '#B89651',
  
  // Light Mode Backgrounds
  ivory: '#F7F4EF',
  softWhite: '#FAFAF9',
  white: '#FFFFFF',
  
  // Text Colors
  charcoal: '#2D2D2D',
  lightGray: '#666666',
  
  // Utility
  success: '#5FA865',
  error: '#DC2626',
} as const;

// ============================================
// LIGHT MODE THEME (DAY MODE - APPROVED)
// ============================================

export const LIGHT_THEME = {
  // Primary
  primary: OPTIBIO_COLORS.navy,
  primaryForeground: OPTIBIO_COLORS.white,
  
  // Secondary
  secondary: OPTIBIO_COLORS.gold,
  secondaryForeground: OPTIBIO_COLORS.navy,
  
  // Background
  background: OPTIBIO_COLORS.ivory,
  foreground: OPTIBIO_COLORS.charcoal,
  
  // Cards
  card: OPTIBIO_COLORS.softWhite,
  cardForeground: OPTIBIO_COLORS.charcoal,
  
  // Accents
  accent: OPTIBIO_COLORS.gold,
  accentForeground: OPTIBIO_COLORS.navy,
  
  // Muted
  muted: '#F0F0F0',
  mutedForeground: OPTIBIO_COLORS.lightGray,
  
  // Border
  border: '#E0E0E0',
  
  // Status
  success: OPTIBIO_COLORS.success,
  error: OPTIBIO_COLORS.error,
} as const;

// ============================================
// DARK MODE THEME (NOT FOR LIGHT MODE)
// ============================================

export const DARK_THEME = {
  primary: '#2E4A7F',
  primaryForeground: OPTIBIO_COLORS.white,
  secondary: OPTIBIO_COLORS.gold,
  secondaryForeground: OPTIBIO_COLORS.navy,
  background: '#0F1F30',
  foreground: '#F5F5F5',
  card: '#1E3A5F',
  cardForeground: '#F5F5F5',
  accent: OPTIBIO_COLORS.gold,
  accentForeground: OPTIBIO_COLORS.navy,
  muted: '#2D2D2D',
  mutedForeground: '#999999',
  border: 'rgba(255, 255, 255, 0.1)',
  success: OPTIBIO_COLORS.success,
  error: OPTIBIO_COLORS.error,
} as const;

// ============================================
// GRADIENTS (LIGHT MODE)
// ============================================

export const GRADIENTS = {
  // Sky Blue Radial Gradient - Hero Sections
  heroGradient: 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)',
  
  // Navy to Gold
  navyToGold: 'linear-gradient(135deg, #1E3A5F 0%, #C9A961 100%)',
  
  // Navy to Navy (Depth)
  navyToNavyDark: 'linear-gradient(135deg, #1E3A5F 0%, #152B45 100%)',
  
  // Navy to Ivory
  navyToIvory: 'linear-gradient(180deg, #1E3A5F 0%, #F7F4EF 100%)',
  
  // Gold to Gold Dark
  goldGradient: 'linear-gradient(135deg, #C9A961 0%, #B89651 100%)',
} as const;

// ============================================
// SHADOWS (LIGHT MODE)
// ============================================

export const SHADOWS = {
  premium: '0 25px 50px -12px rgba(30, 58, 95, 0.25)',
  navy: '0 10px 25px rgba(30, 58, 95, 0.3)',
  glowNavy: '0 0 40px rgba(30, 58, 95, 0.4)',
  glowGold: '0 0 40px rgba(201, 169, 97, 0.4)',
  ivory: '0 4px 20px rgba(247, 244, 239, 0.3)',
} as const;

// ============================================
// COMPONENT COLORS
// ============================================

export const COMPONENT_COLORS = {
  // Buttons
  button: {
    primary: {
      background: OPTIBIO_COLORS.navy,
      foreground: OPTIBIO_COLORS.white,
      hover: OPTIBIO_COLORS.gold,
    },
    secondary: {
      background: OPTIBIO_COLORS.gold,
      foreground: OPTIBIO_COLORS.navy,
      hover: OPTIBIO_COLORS.goldDark,
    },
  },
  
  // Cards
  card: {
    background: OPTIBIO_COLORS.softWhite,
    border: '#E0E0E0',
    shadow: SHADOWS.navy,
  },
  
  // Badges
  badge: {
    primary: {
      background: OPTIBIO_COLORS.navy,
      foreground: OPTIBIO_COLORS.white,
    },
    success: {
      background: '#E8F5E9',
      foreground: OPTIBIO_COLORS.success,
    },
    warning: {
      background: '#FFF3E0',
      foreground: '#F57C00',
    },
  },
  
  // Links
  link: {
    color: OPTIBIO_COLORS.navy,
    hover: OPTIBIO_COLORS.gold,
  },
  
  // Inputs
  input: {
    background: OPTIBIO_COLORS.white,
    border: '#E0E0E0',
    focus: OPTIBIO_COLORS.navy,
  },
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get a color from the approved palette
 * @param colorName - Name of the color
 * @returns Hex color code
 */
export function getColor(colorName: keyof typeof OPTIBIO_COLORS): string {
  return OPTIBIO_COLORS[colorName];
}

/**
 * Get theme colors for light mode
 * @returns Light theme color object
 */
export function getLightThemeColors() {
  return LIGHT_THEME;
}

/**
 * Get theme colors for dark mode
 * @returns Dark theme color object
 */
export function getDarkThemeColors() {
  return DARK_THEME;
}

/**
 * Get a gradient from the approved palette
 * @param gradientName - Name of the gradient
 * @returns CSS gradient string
 */
export function getGradient(gradientName: keyof typeof GRADIENTS): string {
  return GRADIENTS[gradientName];
}

/**
 * Get a shadow from the approved palette
 * @param shadowName - Name of the shadow
 * @returns CSS box-shadow string
 */
export function getShadow(shadowName: keyof typeof SHADOWS): string {
  return SHADOWS[shadowName];
}

// ============================================
// TYPE EXPORTS
// ============================================

export type ColorName = keyof typeof OPTIBIO_COLORS;
export type GradientName = keyof typeof GRADIENTS;
export type ShadowName = keyof typeof SHADOWS;
export type ThemeColors = typeof LIGHT_THEME;

// ============================================
// VALIDATION
// ============================================

/**
 * Verify that a color is in the approved palette
 * @param color - Hex color code to verify
 * @returns true if color is approved, false otherwise
 */
export function isApprovedColor(color: string): boolean {
  const approvedColors = Object.values(OPTIBIO_COLORS);
  return approvedColors.includes(color as any);
}

/**
 * Get all approved colors
 * @returns Array of all approved hex colors
 */
export function getAllApprovedColors(): string[] {
  return Object.values(OPTIBIO_COLORS);
}
