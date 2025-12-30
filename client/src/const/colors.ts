/**
 * OptiBio Color Schema - LOCKED & PERMANENT
 * 
 * ⚠️ CRITICAL: This file defines the approved color palette for OptiBio.
 * DO NOT MODIFY without explicit user approval.
 * 
 * Last Updated: December 29, 2025
 * Theme: Clinical Light (Light Mode Primary)
 * Status: APPROVED & PRODUCTION
 */

/**
 * Primary Brand Colors
 * These are the core colors that define OptiBio's visual identity
 */
export const OPTIBIO_COLORS = {
  // Primary Colors
  navy: '#1E3A5F',        // Deep Navy - Headlines, text, primary buttons
  navyDark: '#152B45',    // Navy Dark - Hover states, dark accents
  ivory: '#F7F4EF',       // Warm Ivory - Background
  gold: '#C9A961',        // Antique Gold - Accents, CTA buttons
  goldDark: '#B89651',    // Gold Dark - Hover states on gold elements
  
  // Supporting Colors
  charcoal: '#2D2D2D',    // Body text, high contrast
  white: '#FFFFFF',       // Card backgrounds, overlays
  success: '#5FA865',     // Success states, badges
  
  // Semantic Colors
  error: '#E74C3C',       // Error states
  warning: '#F39C12',     // Warning states
  info: '#3498DB',        // Info states
} as const;

/**
 * Light Mode Theme (DEFAULT - Clinical Light)
 * Sky blue backgrounds with navy text and gold accents
 */
export const LIGHT_THEME = {
  background: OPTIBIO_COLORS.ivory,           // #F7F4EF
  foreground: OPTIBIO_COLORS.charcoal,        // #2D2D2D
  card: OPTIBIO_COLORS.white,                 // #FFFFFF
  cardForeground: OPTIBIO_COLORS.charcoal,    // #2D2D2D
  primary: OPTIBIO_COLORS.navy,               // #1E3A5F
  primaryForeground: OPTIBIO_COLORS.white,    // #FFFFFF
  secondary: OPTIBIO_COLORS.gold,             // #C9A961
  secondaryForeground: OPTIBIO_COLORS.navy,   // #1E3A5F
  accent: OPTIBIO_COLORS.gold,                // #C9A961
  accentForeground: OPTIBIO_COLORS.navy,      // #1E3A5F
  muted: '#E8F4F8',                           // Light Sky Blue
  mutedForeground: '#4A5568',                 // Muted Gray
  border: '#E0E0E0',                          // Light Gray
  input: '#E0E0E0',                           // Light Gray
} as const;

/**
 * Dark Mode Theme (SECONDARY - Not currently active)
 * Deep navy backgrounds with light text and gold accents
 */
export const DARK_THEME = {
  background: '#0F1F30',                      // Very Dark Navy
  foreground: OPTIBIO_COLORS.white,           // #FFFFFF
  card: OPTIBIO_COLORS.navyDark,              // #152B45
  cardForeground: OPTIBIO_COLORS.white,       // #FFFFFF
  primary: '#42A5F5',                         // Light Blue
  primaryForeground: '#0F1F30',               // Very Dark Navy
  secondary: OPTIBIO_COLORS.gold,             // #C9A961
  secondaryForeground: '#0F1F30',             // Very Dark Navy
  accent: OPTIBIO_COLORS.gold,                // #C9A961
  accentForeground: '#0F1F30',                // Very Dark Navy
  muted: '#1E3A5F',                           // Navy
  mutedForeground: '#A0AEC0',                 // Light Gray
  border: 'rgba(255, 255, 255, 0.1)',        // Subtle white border
  input: 'rgba(255, 255, 255, 0.15)',        // Subtle white input
} as const;

/**
 * Gradient Definitions
 * Pre-defined gradients for consistent styling
 */
export const GRADIENTS = {
  // Hero Gradient - Light Mode (soft sky blue)
  heroLight: 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)',
  
  // Navy Gradient - Premium dark sections
  navy: 'linear-gradient(135deg, #1E3A5F 0%, #152B45 100%)',
  
  // Navy Reverse - Alternative direction
  navyReverse: 'linear-gradient(135deg, #152B45 0%, #1E3A5F 100%)',
  
  // Navy-Ivory Gradient - Transitional sections
  navyIvory: 'linear-gradient(180deg, #1E3A5F 0%, #F7F4EF 100%)',
  
  // Premium Text Gradient
  textPremium: 'linear-gradient(135deg, #1E3A5F 0%, #C9A961 100%)',
  
  // Gold Gradient
  gold: 'linear-gradient(135deg, #C9A961 0%, #B89651 100%)',
} as const;

/**
 * Shadow Definitions
 * Premium shadows for depth and hierarchy
 */
export const SHADOWS = {
  premium: '0 25px 50px -12px rgba(30, 58, 95, 0.25)',
  navy: '0 10px 25px rgba(30, 58, 95, 0.3)',
  glowNavy: '0 0 40px rgba(30, 58, 95, 0.4)',
  glowGold: '0 0 40px rgba(201, 169, 97, 0.4)',
  subtle: '0 2px 8px rgba(30, 58, 95, 0.1)',
} as const;

/**
 * Component Color Presets
 * Ready-to-use color combinations for common components
 */
export const COMPONENT_COLORS = {
  // Button Styles
  button: {
    primary: {
      background: OPTIBIO_COLORS.navy,
      foreground: OPTIBIO_COLORS.white,
      hover: OPTIBIO_COLORS.navyDark,
    },
    secondary: {
      background: OPTIBIO_COLORS.gold,
      foreground: OPTIBIO_COLORS.navy,
      hover: OPTIBIO_COLORS.goldDark,
    },
    outline: {
      background: 'transparent',
      foreground: OPTIBIO_COLORS.navy,
      border: OPTIBIO_COLORS.navy,
      hover: OPTIBIO_COLORS.ivory,
    },
  },
  
  // Card Styles
  card: {
    background: OPTIBIO_COLORS.white,
    border: '#E0E0E0',
    text: OPTIBIO_COLORS.charcoal,
    shadow: SHADOWS.subtle,
  },
  
  // Header Styles
  header: {
    background: OPTIBIO_COLORS.white,
    text: OPTIBIO_COLORS.navy,
    hover: OPTIBIO_COLORS.gold,
  },
  
  // Badge Styles
  badge: {
    success: {
      background: OPTIBIO_COLORS.success,
      foreground: OPTIBIO_COLORS.white,
    },
    warning: {
      background: OPTIBIO_COLORS.gold,
      foreground: OPTIBIO_COLORS.navy,
    },
    error: {
      background: '#E74C3C',
      foreground: OPTIBIO_COLORS.white,
    },
  },
} as const;

/**
 * Type-safe color getter
 * Use this to ensure colors are always from the approved palette
 */
export function getColor(colorName: keyof typeof OPTIBIO_COLORS): string {
  return OPTIBIO_COLORS[colorName];
}

/**
 * Type-safe theme getter
 * Use this to get the current theme colors
 */
export function getThemeColors(theme: 'light' | 'dark' = 'light') {
  return theme === 'dark' ? DARK_THEME : LIGHT_THEME;
}

export default {
  OPTIBIO_COLORS,
  LIGHT_THEME,
  DARK_THEME,
  GRADIENTS,
  SHADOWS,
  COMPONENT_COLORS,
  getColor,
  getThemeColors,
};
