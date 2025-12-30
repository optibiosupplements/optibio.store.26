export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = "/optibio-logo-transparent.png";

// E-commerce constants
export const SHIPPING_THRESHOLD_CENTS = 7500; // Free shipping over $75
export const STANDARD_SHIPPING_CENTS = 595; // $5.95 standard shipping
export const TAX_RATE = 0.08; // 8% sales tax (adjust based on location)

// Format price in cents to dollar string
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Calculate discount price
export function calculateDiscountPrice(priceInCents: number, discountPercentage: number): number {
  return Math.round(priceInCents * (1 - discountPercentage / 100));
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// ============================================================================
// OPTIBIO BRAND COLORS - VERSION 66b1d787 (LOCKED & APPROVED)
// ============================================================================
// 
// CRITICAL: These colors are LOCKED and APPROVED for Light Mode (Day Mode).
// DO NOT MODIFY without explicit user approval.
// 
// GOVERNANCE:
// - Primary Source: /home/ubuntu/projects/optibio-supplements-4f3cb533/OPTIBIO_UNIFIED_DESIGN_SYSTEM_v3.md
// - Brand Constants: client/src/brand.ts (TypeScript constants)
// - CSS Variables: client/src/index.css (CSS custom properties)
// - Guidelines: /home/ubuntu/optibio-ecommerce/BRAND_GUIDELINES.md
//
// Last Updated: December 30, 2025
// Focus: Light Mode (Day Mode) Design Only
//
// ============================================================================

export const OPTIBIO_COLORS = {
  // PRIMARY BRAND COLORS (Midnight Sophistication)
  // Deep Navy - Professional, Trustworthy, Premium
  navy: '#1E3A5F',
  navyDark: '#152B45',
  
  // Antique Gold - Sophisticated, Valuable, Premium
  gold: '#C9A961',
  goldDark: '#B89651',
  
  // LIGHT MODE BACKGROUNDS
  // Warm Ivory - Elegant, Premium, Warm
  ivory: '#F7F4EF',
  ivoryLight: '#EDE9E3',
  
  // Soft White - Clean, Premium, Organized
  softWhite: '#FAFAF9',
  white: '#FFFFFF',
  
  // TEXT COLORS
  // Charcoal - Primary text, high contrast
  charcoal: '#2D2D2D',
  
  // Light Gray - Secondary text, captions
  lightGray: '#666666',
  
  // UTILITY COLORS
  success: '#5FA865',
  
  // SKY BLUE GRADIENT COMPONENTS (Light Mode Hero)
  skyCloudWhite: '#F8FCFE',
  skyMist: '#EBF5FB',
  skyPowderBlue: '#D6EAF8',
} as const;

// Ready-to-use gradient strings (LIGHT MODE ONLY)
export const OPTIBIO_GRADIENTS = {
  // Sky Blue Radial Gradient - Hero Sections (Light Mode)
  // Psychology: Calming, wellness, airy, clinical
  skyBlueRadial: 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)',
  
  // Navy to Navy - Depth and Authority
  navyDepth: 'linear-gradient(135deg, #1E3A5F 0%, #152B45 100%)',
  
  // Gold Shimmer - Premium Accent
  goldShimmer: 'linear-gradient(90deg, #C9A961 0%, #D4B76E 50%, #C9A961 100%)',
  
  // Ivory Hero - Elegant Transition
  ivoryHero: 'linear-gradient(135deg, #F7F4EF 0%, #EDE9E3 100%)',
  
  // Navy to Gold - Premium CTA
  navyToGold: 'linear-gradient(135deg, #1E3A5F 0%, #C9A961 100%)',
  
  // Navy to Ivory - Professional to Approachable
  navyToIvory: 'linear-gradient(180deg, #1E3A5F 0%, #F7F4EF 100%)',
} as const;

// Helper function for sky blue gradient background
export const getSkyBlueBackground = () => ({
  background: OPTIBIO_GRADIENTS.skyBlueRadial,
});

// ============================================================================
// SHADOW SYSTEM (Light Mode)
// ============================================================================

export const OPTIBIO_SHADOWS = {
  premium: '0 25px 50px -12px rgba(30, 58, 95, 0.25)',
  navy: '0 10px 25px rgba(30, 58, 95, 0.3)',
  glowNavy: '0 0 40px rgba(30, 58, 95, 0.4)',
  glowGold: '0 0 40px rgba(201, 169, 97, 0.4)',
  ivory: '0 4px 20px rgba(247, 244, 239, 0.3)',
} as const;

// ============================================================================
// COLOR VALIDATION (Prevent Accidental Changes)
// ============================================================================

/**
 * Verify that a color is in the approved palette.
 * Use this to prevent accidental color changes.
 */
export function isApprovedColor(color: string): boolean {
  const approvedColors = Object.values(OPTIBIO_COLORS);
  return approvedColors.includes(color as any);
}

/**
 * Get all approved colors for validation.
 */
export function getAllApprovedColors(): string[] {
  return Object.values(OPTIBIO_COLORS);
}
