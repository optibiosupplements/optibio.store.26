/**
 * Stripe Products Configuration
 * 
 * This file defines the mapping between our database products and Stripe products/prices.
 * Products and prices should be created in Stripe Dashboard first, then IDs added here.
 */

export const STRIPE_PRODUCTS = {
  // OptiBio Ashwagandha KSM-66 - One-time purchases
  ASHWAGANDHA_90CAP: {
    name: "OptiBio Ashwagandha KSM-66 - 90 Capsules",
    priceInCents: 5999, // $59.99
    stripePriceId: process.env.STRIPE_PRICE_90CAP || "price_test_90cap", // Replace with actual Stripe Price ID
  },
  ASHWAGANDHA_180CAP: {
    name: "OptiBio Ashwagandha KSM-66 - 180 Capsules",
    priceInCents: 9999, // $99.99
    stripePriceId: process.env.STRIPE_PRICE_180CAP || "price_test_180cap",
  },
  ASHWAGANDHA_270CAP: {
    name: "OptiBio Ashwagandha KSM-66 - 270 Capsules",
    priceInCents: 13999, // $139.99
    stripePriceId: process.env.STRIPE_PRICE_270CAP || "price_test_270cap",
  },
  
  // Subscription plans (recurring)
  SUBSCRIPTION_MONTHLY: {
    name: "OptiBio Ashwagandha KSM-66 - Monthly Subscription",
    priceInCents: 4999, // $49.99/month
    stripePriceId: process.env.STRIPE_PRICE_MONTHLY || "price_test_monthly",
    interval: "month" as const,
  },
  SUBSCRIPTION_QUARTERLY: {
    name: "OptiBio Ashwagandha KSM-66 - Quarterly Subscription",
    priceInCents: 13499, // $134.99/quarter (save 10%)
    stripePriceId: process.env.STRIPE_PRICE_QUARTERLY || "price_test_quarterly",
    interval: "month" as const,
    intervalCount: 3,
  },
  SUBSCRIPTION_ANNUAL: {
    name: "OptiBio Ashwagandha KSM-66 - Annual Subscription",
    priceInCents: 47999, // $479.99/year (save 20%)
    stripePriceId: process.env.STRIPE_PRICE_ANNUAL || "price_test_annual",
    interval: "year" as const,
  },
};

/**
 * Get Stripe price ID for a product variant
 */
export function getStripePriceId(variantName: string, isSubscription: boolean = false): string | null {
  if (isSubscription) {
    if (variantName.includes("Monthly")) return STRIPE_PRODUCTS.SUBSCRIPTION_MONTHLY.stripePriceId;
    if (variantName.includes("Quarterly")) return STRIPE_PRODUCTS.SUBSCRIPTION_QUARTERLY.stripePriceId;
    if (variantName.includes("Annual")) return STRIPE_PRODUCTS.SUBSCRIPTION_ANNUAL.stripePriceId;
  } else {
    if (variantName.includes("90")) return STRIPE_PRODUCTS.ASHWAGANDHA_90CAP.stripePriceId;
    if (variantName.includes("180")) return STRIPE_PRODUCTS.ASHWAGANDHA_180CAP.stripePriceId;
    if (variantName.includes("270")) return STRIPE_PRODUCTS.ASHWAGANDHA_270CAP.stripePriceId;
  }
  return null;
}
