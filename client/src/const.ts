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
// OPTIBIO BRAND COLORS
// ============================================================================
// Centralized color constants for consistent branding
// Full documentation: /OPTIBIO_COLOR_SCHEMA.md

export const OPTIBIO_COLORS = {
  // Primary Brand Colors
  navy: '#1E3A5F',
  navyDark: '#152B45',
  gold: '#C9A961',
  goldDark: '#B89651',
  ivory: '#F7F4EF',
  ivoryLight: '#EDE9E3',
  charcoal: '#2D2D2D',
  white: '#FFFFFF',
  success: '#5FA865',
  
  // Sky Blue Gradient (Updated Dec 28, 2025)
  skyCloudWhite: '#F8FCFE',
  skyMist: '#EBF5FB',
  skyPowderBlue: '#D6EAF8',
} as const;

// Ready-to-use gradient strings
export const OPTIBIO_GRADIENTS = {
  skyBlueRadial: 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)',
  navyDepth: 'linear-gradient(135deg, #1E3A5F 0%, #152B45 100%)',
  goldShimmer: 'linear-gradient(90deg, #C9A961 0%, #D4B76E 50%, #C9A961 100%)',
  ivoryHero: 'linear-gradient(135deg, #F7F4EF 0%, #EDE9E3 100%)',
} as const;

// Helper function for sky blue gradient background
export const getSkyBlueBackground = () => ({
  background: OPTIBIO_GRADIENTS.skyBlueRadial,
});
