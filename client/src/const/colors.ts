/**
 * 🔒 OPTIBIO BRAND COLOR CONSTANTS - PRODUCTION LOCKED
 * 
 * ⚠️ CRITICAL RULES:
 * 1. Light Mode = Day Mode = Brand Default (NEVER CHANGES)
 * 2. Dark Mode = Optional Override (User Preference Only)
 * 3. DO NOT MODIFY without explicit brand team approval
 * 
 * Last Updated: December 30, 2025
 * Status: PRODUCTION LOCKED
 * Authority: Brand Guidelines v1.0
 * 
 * 📚 REQUIRED READING:
 * - COLORS_LOCKED.md - Full color system documentation
 * - COLOR_USAGE_GUIDE.md - Developer guidelines
 * - OptiBio Brand Style Guide.pdf - Brand guidelines
 * 
 * 🚨 BEFORE MODIFYING COLORS:
 * 1. Read COLORS_LOCKED.md completely
 * 2. Get brand team approval
 * 3. Test WCAG contrast ratios
 * 4. Update documentation
 * 5. Run visual regression tests
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
  ivoryLight: '#EDE9E3', // NEW: Hover states, subtle separators
  softWhite: '#FAFAF9',
  white: '#FFFFFF',
  skyMist: '#F0F9FF', // NEW: Timeline sections, subtle blue tint
  
  // Text Colors
  charcoal: '#2D2D2D',
  slate: '#475569', // NEW: Secondary body text
  lightGray: '#666666',
  mutedGray: '#A0A0A0', // NEW: Placeholder text, hints
  
  // Interactive Colors
  electricBlue: '#2563EB', // NEW: Links, hover states
  
  // Utility
  success: '#5FA865',
  error: '#DC2626',
  
  // Logo Gradient Colors
  logoLightBlue: '#87CEEB', // NEW: OPTI gradient start
  logoGold: '#FFD700', // NEW: OPTI gradient end
  logoNavy: '#1E3ABA', // NEW: bio gradient start
  logoAmber: '#F59E0B', // NEW: bio gradient end
  
  // CONVERSION & UTILITY PALETTE (v3.0) - E-commerce colors
  
  // Urgency Warmth System (Countdown Timers) - Warm Peach/Ivory for luxury urgency
  timerBgStart: '#FEF9F3', // Warm Peach Start - Timer gradient start
  timerBgEnd: '#FFF5E8', // Warm Peach End - Timer gradient end
  timerBorder: '#FED7AA', // Timer Border - Pale Orange/Peach
  timerText: '#7C2D12', // Deep Timer Brown - Countdown numbers and labels
  
  // Alert Red System (Discount Badges ONLY) - Bright red for immediate attention
  alertRed: '#DC2626', // Alert Red - "Save 46%" badges ONLY
  redMuted: '#991B1B', // Muted Red - Optional label text
  
  // Social Proof Green System
  mintBg: '#F0FDF4', // Review card background
  successGreen: '#16A34A', // "Bottles sold" text
  starGold: '#FBBF24', // Review stars (brighter than Antique Gold)
  
  // Action Blue System
  blueHover: '#1D4ED8', // CTA hover state
} as const;

// ============================================
// LIGHT MODE THEME (DAY MODE - DEFAULT - NEVER CHANGES)
// ============================================
// ⚠️ WARNING: Light mode is the brand default (80%+ of users)
// These colors follow brand guidelines exactly
// DO NOT modify without explicit brand approval

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
// DARK MODE THEME (OPTIONAL OVERRIDE - USER PREFERENCE)
// ============================================
// ℹ️ NOTE: Dark mode is optional, not the default
// These colors override light mode for accessibility
// Must maintain brand recognition (navy, gold, ivory)

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
