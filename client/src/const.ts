export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = "/optibio-logo-v3.png";

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
