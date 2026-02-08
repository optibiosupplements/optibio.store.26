/**
 * Stripe Products Configuration
 * 
 * SINGLE SOURCE OF TRUTH for all pricing.
 * All prices approved Feb 7, 2026.
 * 
 * MSRP: $39.99 per bottle (90 capsules, 45-day supply)
 * Compare-at: $49.99 per bottle
 * Subscription: 15% off + free shipping
 * Shipping: $5.99 for single one-time, FREE for 3+ bottles and all subscriptions
 */

export const PRICING = {
  // Compare-at (strikethrough) price per bottle
  compareAtPerBottle: 4999, // $49.99

  // One-time purchase tiers
  oneTime: {
    single: {
      bottles: 1,
      pricePerBottle: 3999, // $39.99
      total: 3999, // $39.99
      compareAt: 4999, // $49.99
      savingsPercent: 20,
      shipping: 599, // $5.99
      freeShipping: false,
      label: "Starter",
      supply: "45-Day Supply",
    },
    threepack: {
      bottles: 3,
      pricePerBottle: 3333, // $33.33
      total: 9999, // $99.99
      compareAt: 14997, // $149.97
      savingsPercent: 33,
      shipping: 0,
      freeShipping: true,
      label: "MOST POPULAR",
      supply: "135-Day Supply",
      isDefault: true,
    },
    sixpack: {
      bottles: 6,
      pricePerBottle: 3000, // $30.00
      total: 17999, // $179.99
      compareAt: 29994, // $299.94
      savingsPercent: 40,
      shipping: 0,
      freeShipping: true,
      label: "BEST VALUE",
      supply: "270-Day Supply",
    },
  },

  // Subscribe & Save tiers (15% off + free shipping on all)
  subscription: {
    discountPercent: 15,
    single: {
      bottles: 1,
      pricePerBottle: 3399, // $33.99
      total: 3399, // $33.99
      compareAt: 4999, // $49.99
      savingsPercent: 32,
      shipping: 0,
      freeShipping: true,
      frequency: 45, // days
      frequencyLabel: "Every 45 days",
      supply: "45-Day Supply",
    },
    threepack: {
      bottles: 3,
      pricePerBottle: 2833, // $28.33
      total: 8499, // $84.99
      compareAt: 14997, // $149.97
      savingsPercent: 43,
      shipping: 0,
      freeShipping: true,
      frequency: 135, // days
      frequencyLabel: "Every 135 days",
      supply: "135-Day Supply",
      isDefault: true,
    },
    sixpack: {
      bottles: 6,
      pricePerBottle: 2550, // $25.50
      total: 15299, // $152.99
      compareAt: 29994, // $299.94
      savingsPercent: 49,
      shipping: 0,
      freeShipping: true,
      frequency: 270, // days
      frequencyLabel: "Every 270 days",
      supply: "270-Day Supply",
    },
  },

  // Coupon codes
  coupons: {
    launch: {
      code: "WELCOME20",
      discountPercent: 20,
      appliesTo: "one-time", // not subscriptions
      stacksWithBundles: true,
      durationDays: 30,
      maxUses: 1000,
      perCustomerLimit: 1,
    },
    postLaunch: {
      code: "WELCOME10",
      discountPercent: 10,
      appliesTo: "one-time",
      stacksWithBundles: true,
      perCustomerLimit: 1,
    },
  },

  // Product details
  product: {
    name: "OptiBio Ashwagandha KSM-66® Root Extract",
    capsules: 90,
    mgPerCapsule: 300,
    servingSize: "1-2 capsules daily",
    clinicalDose: "600mg (2 capsules)",
    supplyDays: 45,
    guarantee: 90, // days
    guaranteeLabel: "90-Day Money-Back Guarantee",
  },
};

// Stripe product/price IDs (to be created in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
  // One-time purchases
  ASHWAGANDHA_1BOTTLE: {
    name: "OptiBio Ashwagandha KSM-66 - 1 Bottle (90 Capsules)",
    priceInCents: PRICING.oneTime.single.total,
    stripePriceId: process.env.STRIPE_PRICE_1BOTTLE || "price_test_1bottle",
  },
  ASHWAGANDHA_3BOTTLES: {
    name: "OptiBio Ashwagandha KSM-66 - 3 Bottles (270 Capsules)",
    priceInCents: PRICING.oneTime.threepack.total,
    stripePriceId: process.env.STRIPE_PRICE_3BOTTLES || "price_test_3bottles",
  },
  ASHWAGANDHA_6BOTTLES: {
    name: "OptiBio Ashwagandha KSM-66 - 6 Bottles (540 Capsules)",
    priceInCents: PRICING.oneTime.sixpack.total,
    stripePriceId: process.env.STRIPE_PRICE_6BOTTLES || "price_test_6bottles",
  },

  // Subscription plans
  SUBSCRIPTION_1BOTTLE: {
    name: "OptiBio Ashwagandha KSM-66 - 1 Bottle Subscription",
    priceInCents: PRICING.subscription.single.total,
    stripePriceId: process.env.STRIPE_PRICE_SUB_1BOTTLE || "price_test_sub_1bottle",
    interval: "day" as const,
    intervalCount: 45,
  },
  SUBSCRIPTION_3BOTTLES: {
    name: "OptiBio Ashwagandha KSM-66 - 3 Bottles Subscription",
    priceInCents: PRICING.subscription.threepack.total,
    stripePriceId: process.env.STRIPE_PRICE_SUB_3BOTTLES || "price_test_sub_3bottles",
    interval: "day" as const,
    intervalCount: 135,
  },
  SUBSCRIPTION_6BOTTLES: {
    name: "OptiBio Ashwagandha KSM-66 - 6 Bottles Subscription",
    priceInCents: PRICING.subscription.sixpack.total,
    stripePriceId: process.env.STRIPE_PRICE_SUB_6BOTTLES || "price_test_sub_6bottles",
    interval: "day" as const,
    intervalCount: 270,
  },
};

/**
 * Helper to format cents to dollar string
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Get Stripe price ID for a product variant
 */
export function getStripePriceId(bottles: number, isSubscription: boolean = false): string | null {
  if (isSubscription) {
    switch (bottles) {
      case 1: return STRIPE_PRODUCTS.SUBSCRIPTION_1BOTTLE.stripePriceId;
      case 3: return STRIPE_PRODUCTS.SUBSCRIPTION_3BOTTLES.stripePriceId;
      case 6: return STRIPE_PRODUCTS.SUBSCRIPTION_6BOTTLES.stripePriceId;
      default: return null;
    }
  } else {
    switch (bottles) {
      case 1: return STRIPE_PRODUCTS.ASHWAGANDHA_1BOTTLE.stripePriceId;
      case 3: return STRIPE_PRODUCTS.ASHWAGANDHA_3BOTTLES.stripePriceId;
      case 6: return STRIPE_PRODUCTS.ASHWAGANDHA_6BOTTLES.stripePriceId;
      default: return null;
    }
  }
}

/**
 * Get pricing tier details
 */
export function getPricingTier(bottles: number, isSubscription: boolean = false) {
  const tiers = isSubscription ? PRICING.subscription : PRICING.oneTime;
  switch (bottles) {
    case 1: return tiers.single;
    case 3: return tiers.threepack;
    case 6: return tiers.sixpack;
    default: return tiers.single;
  }
}
