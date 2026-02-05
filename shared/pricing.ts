/**
 * PRICING CONSTANTS - SINGLE SOURCE OF TRUTH
 * 
 * All pricing across the site should reference these constants.
 * Database values should match these exactly.
 * 
 * PRICING STRATEGY:
 * - Regular pricing: $49.99 (from $89.00) - 44% off
 * - Subscribe & Save: 20% additional discount
 * - Pre-order pricing: Currently DISABLED (was $28.35)
 * 
 * Last updated: Feb 4, 2026
 */

// Product Variants (Database source of truth)
export const PRODUCT_PRICING = {
  // 60 Capsules - 30-Day Supply (Default/Featured)
  VARIANT_60: {
    name: "60 Capsules (30-Day Supply)",
    sku: "OPTIBIO-ASH-60",
    priceInCents: 4999,           // $49.99
    compareAtPriceInCents: 8900,  // $89.00
    discountPercentage: 44,       // 44% off
    supplyDays: 30,
  },
  
  // 120 Capsules - 60-Day Supply
  VARIANT_120: {
    name: "120 Capsules (60-Day Supply)",
    sku: "OPTIBIO-ASH-120",
    priceInCents: 8999,           // $89.99
    compareAtPriceInCents: 12999, // $129.99
    discountPercentage: 31,       // 31% off
    supplyDays: 60,
  },
  
  // 180 Capsules - 90-Day Supply
  VARIANT_180: {
    name: "180 Capsules (90-Day Supply)",
    sku: "OPTIBIO-ASH-180",
    priceInCents: 11999,          // $119.99
    compareAtPriceInCents: 17999, // $179.99
    discountPercentage: 33,       // 33% off
    supplyDays: 90,
  },
};

// Subscription Discounts
export const SUBSCRIPTION_DISCOUNT = {
  percentage: 20,  // 20% off regular price
  label: "Subscribe & Save 20%",
};

// Pre-Order Pricing (DISABLED - for future launches)
export const PREORDER_PRICING = {
  enabled: false,
  extraDiscountPercentage: 25,  // Extra 25% off on top of regular discount
  endDate: "2026-02-14",
  shipDate: "Feb 14-21, 2026",
};

// Money-Back Guarantee
export const GUARANTEE = {
  days: 90,
  label: "90-Day Money-Back Guarantee",
};

// Free Shipping Threshold
export const FREE_SHIPPING = {
  thresholdInCents: 7500,  // $75.00
  label: "Free shipping on orders over $75",
};

// Helper functions
export function formatPriceFromCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function calculateSubscriptionPrice(priceInCents: number): number {
  return Math.round(priceInCents * (1 - SUBSCRIPTION_DISCOUNT.percentage / 100));
}

export function getDefaultVariant() {
  return PRODUCT_PRICING.VARIANT_60;
}
