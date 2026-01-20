import { eq, and, lt, isNull, isNotNull, desc, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { randomBytes } from "crypto";
import { 
  InsertUser, 
  users, 
  products, 
  productVariants,
  subscriptionPlans,
  cartItems,
  orders,
  orderItems,
  discountCodes,
  subscriptions,
  abandonedCarts,
  InsertAbandonedCart,
  AbandonedCart,
  postPurchaseEmails,
  PostPurchaseEmail,
  InsertPostPurchaseEmail
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(products).where(eq(products.isActive, true));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(productVariants)
    .where(and(
      eq(productVariants.productId, productId),
      eq(productVariants.isActive, true)
    ))
    .orderBy(productVariants.sortOrder);
}

export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
}

// Cart queries
// Import for cart queries
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db.select({
    id: cartItems.id,
    userId: cartItems.userId,
    productId: cartItems.productId,
    variantId: cartItems.variantId,
    quantity: cartItems.quantity,
    isSubscription: cartItems.isSubscription,
    subscriptionPlanId: cartItems.subscriptionPlanId,
    priceInCents: sql<number>`COALESCE(${productVariants.priceInCents}, ${products.priceInCents})`,
    productName: products.name,
    productSlug: products.slug,
    productImage: products.imageUrl,
    variantName: productVariants.name,
  })
  .from(cartItems)
  .leftJoin(products, eq(cartItems.productId, products.id))
  .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
  .where(eq(cartItems.userId, userId));
  
  return items;
}

export async function addToCart(item: typeof cartItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(cartItems).values(item);
}

export async function updateCartItem(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
}

export async function removeCartItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// Order queries
export async function createOrder(order: typeof orders.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orders).values(order);
}

export async function createOrderItems(items: typeof orderItems.$inferInsert[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orderItems).values(items);
}

export async function getOrdersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// Discount code queries
export async function getDiscountCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(discountCodes)
    .where(and(
      eq(discountCodes.code, code),
      eq(discountCodes.isActive, true)
    ))
    .limit(1) as any;
    
  return result.length > 0 ? result[0] : null;
}

export async function incrementDiscountCodeUsage(codeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const code = await db.select().from(discountCodes).where(eq(discountCodes.id, codeId)).limit(1) as any;
  if (code.length === 0) throw new Error("Discount code not found");
  
  const currentCount = code[0]?.usedCount ?? 0;
  return db.update(discountCodes)
    .set({ usedCount: currentCount + 1 })
    .where(eq(discountCodes.id, codeId));
}

// Product batch queries
export async function getBatchByLotNumber(lotNumber: string) {
  const db = await getDb();
  if (!db) return null;
  
  const { productBatches } = await import("../drizzle/schema");
  const result = await db.select().from(productBatches)
    .where(and(
      eq(productBatches.lotNumber, lotNumber),
      eq(productBatches.isActive, true)
    ))
    .limit(1) as any;
    
  return result.length > 0 ? result[0] : null;
}

// Subscription queries
export async function createSubscription(data: {
  userId: number;
  planId: number;
  productId: number;
  variantId?: number;
  priceInCents: number;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  nextBillingDate: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(subscriptions).values({
    userId: data.userId,
    planId: data.planId,
    productId: data.productId,
    variantId: data.variantId,
    priceInCents: data.priceInCents,
    stripeSubscriptionId: data.stripeSubscriptionId,
    stripeCustomerId: data.stripeCustomerId,
    stripePriceId: data.stripePriceId,
    nextBillingDate: data.nextBillingDate,
    status: "active",
  });
  
  return result;
}

export async function getSubscriptionsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);
    
  return result.length > 0 ? result[0] : null;
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: "active" | "paused" | "cancelled" | "expired"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(subscriptions)
    .set({ 
      status,
      ...(status === "cancelled" ? { cancelledAt: new Date() } : {}),
      ...(status === "paused" ? { pausedAt: new Date() } : {}),
    })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}

export async function updateUserFounderTier(
  userId: number,
  founderTier: "founders" | "early_adopter" | "pre_launch" | "regular",
  lifetimeDiscountPercent: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Only update if user doesn't already have a founder tier
  // (first purchase locks in the tier)
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user.length === 0) throw new Error("User not found");
  
  if (!user[0].founderTier) {
    return db.update(users)
      .set({ 
        founderTier,
        lifetimeDiscountPercent,
      })
      .where(eq(users.id, userId));
  }
  
  return null;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateSubscriptionBillingDates(
  stripeSubscriptionId: string,
  lastBillingDate: Date,
  nextBillingDate: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(subscriptions)
    .set({ 
      lastBillingDate,
      nextBillingDate,
    })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}


/**
 * Abandoned Cart Helper Functions
 */

/**
 * Generate a unique recovery token for cart recovery links
 */
export function generateRecoveryToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Create an abandoned cart record
 */
export async function createAbandonedCart(data: InsertAbandonedCart): Promise<AbandonedCart | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create abandoned cart: database not available");
    return null;
  }

  try {
    const result = await db.insert(abandonedCarts).values(data);
    const insertId = result[0].insertId;
    
    // Fetch and return the created record
    const created = await db.select().from(abandonedCarts).where(eq(abandonedCarts.id, insertId)).limit(1);
    return created[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create abandoned cart:", error);
    return null;
  }
}

/**
 * Get abandoned cart by recovery token
 */
export async function getAbandonedCartByToken(token: string): Promise<AbandonedCart | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(abandonedCarts)
      .where(eq(abandonedCarts.recoveryToken, token))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get abandoned cart by token:", error);
    return null;
  }
}

/**
 * Update abandoned cart email sent timestamps
 */
export async function updateAbandonedCartEmailSent(
  id: number,
  emailNumber: 1 | 2 | 3
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const field = emailNumber === 1 ? "firstEmailSentAt" :
                  emailNumber === 2 ? "secondEmailSentAt" :
                  "thirdEmailSentAt";
    
    await db.update(abandonedCarts)
      .set({ [field]: new Date() })
      .where(eq(abandonedCarts.id, id));
    
    return true;
  } catch (error) {
    console.error("[Database] Failed to update abandoned cart email sent:", error);
    return false;
  }
}

/**
 * Mark abandoned cart as recovered
 */
export async function markAbandonedCartRecovered(
  id: number,
  orderId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.update(abandonedCarts)
      .set({
        isRecovered: true,
        recoveredAt: new Date(),
        recoveredOrderId: orderId,
      })
      .where(eq(abandonedCarts.id, id));
    
    return true;
  } catch (error) {
    console.error("[Database] Failed to mark abandoned cart as recovered:", error);
    return false;
  }
}

/**
 * Get abandoned carts that need email follow-ups
 * Returns carts where:
 * - Not recovered
 * - Email not sent yet based on time elapsed
 */
export async function getAbandonedCartsForEmail(emailNumber: 1 | 2 | 3): Promise<AbandonedCart[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const now = new Date();
    const hoursAgo = emailNumber === 1 ? 1 : emailNumber === 2 ? 24 : 48;
    const cutoffTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

    // Build conditions based on which email we're sending
    let conditions = [
      eq(abandonedCarts.isRecovered, false),
      lt(abandonedCarts.createdAt, cutoffTime)
    ];

    if (emailNumber === 1) {
      conditions.push(isNull(abandonedCarts.firstEmailSentAt));
    } else if (emailNumber === 2) {
      conditions.push(isNotNull(abandonedCarts.firstEmailSentAt));
      conditions.push(isNull(abandonedCarts.secondEmailSentAt));
    } else {
      conditions.push(isNotNull(abandonedCarts.secondEmailSentAt));
      conditions.push(isNull(abandonedCarts.thirdEmailSentAt));
    }

    return await db.select().from(abandonedCarts)
      .where(and(...conditions));
  } catch (error) {
    console.error("[Database] Failed to get abandoned carts for email:", error);
    return [];
  }
}


// ============================================================================
// POST-PURCHASE EMAIL HELPERS
// ============================================================================

/**
 * Create post-purchase email tracking record
 * Called when an order is completed
 */
export async function createPostPurchaseEmailTracking(data: {
  orderId: number;
  userId: number | null;
  email: string;
  productId: number;
  purchaseDate: Date;
}): Promise<PostPurchaseEmail | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create post-purchase email tracking: database not available");
    return null;
  }

  try {
    await db.insert(postPurchaseEmails).values({
      orderId: data.orderId,
      userId: data.userId,
      email: data.email,
      productId: data.productId,
      purchaseDate: data.purchaseDate,
    });

    // MySQL doesn't support returning(), query the record separately
    const [record] = await db.select().from(postPurchaseEmails)
      .where(eq(postPurchaseEmails.orderId, data.orderId))
      .limit(1);

    return record || null;
  } catch (error) {
    console.error("[Database] Failed to create post-purchase email tracking:", error);
    return null;
  }
}

/**
 * Get orders needing specific day email (7, 21, 60, or 90)
 * Returns records where email hasn't been sent and enough days have passed
 */
export async function getOrdersNeedingPostPurchaseEmail(
  dayNumber: 7 | 21 | 60 | 90
): Promise<PostPurchaseEmail[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const now = new Date();
    const daysAgo = dayNumber;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Build conditions based on which email we're sending
    let conditions = [
      lt(postPurchaseEmails.purchaseDate, cutoffDate),
      eq(postPurchaseEmails.hasReordered, false), // Don't send if they already reordered
    ];

    if (dayNumber === 7) {
      conditions.push(isNull(postPurchaseEmails.day7EmailSentAt));
    } else if (dayNumber === 21) {
      conditions.push(isNotNull(postPurchaseEmails.day7EmailSentAt));
      conditions.push(isNull(postPurchaseEmails.day21EmailSentAt));
    } else if (dayNumber === 60) {
      conditions.push(isNotNull(postPurchaseEmails.day21EmailSentAt));
      conditions.push(isNull(postPurchaseEmails.day60EmailSentAt));
    } else {
      conditions.push(isNotNull(postPurchaseEmails.day60EmailSentAt));
      conditions.push(isNull(postPurchaseEmails.day90EmailSentAt));
      conditions.push(eq(postPurchaseEmails.hasSubscribed, false)); // Only send if not subscribed
    }

    return await db.select().from(postPurchaseEmails)
      .where(and(...conditions));
  } catch (error) {
    console.error("[Database] Failed to get orders needing post-purchase email:", error);
    return [];
  }
}

/**
 * Update email sent timestamp for specific day
 */
export async function updatePostPurchaseEmailSent(
  id: number,
  dayNumber: 7 | 21 | 60 | 90
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const now = new Date();
    const updateData: any = {};

    if (dayNumber === 7) {
      updateData.day7EmailSentAt = now;
    } else if (dayNumber === 21) {
      updateData.day21EmailSentAt = now;
    } else if (dayNumber === 60) {
      updateData.day60EmailSentAt = now;
    } else {
      updateData.day90EmailSentAt = now;
    }

    await db.update(postPurchaseEmails)
      .set(updateData)
      .where(eq(postPurchaseEmails.id, id));

    return true;
  } catch (error) {
    console.error("[Database] Failed to update post-purchase email sent:", error);
    return false;
  }
}

/**
 * Mark customer as reordered
 * Called when customer makes a repeat purchase
 */
export async function markCustomerReordered(
  orderId: number,
  reorderOrderId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.update(postPurchaseEmails)
      .set({
        hasReordered: true,
        reorderDate: new Date(),
        reorderOrderId,
      })
      .where(eq(postPurchaseEmails.orderId, orderId));

    return true;
  } catch (error) {
    console.error("[Database] Failed to mark customer as reordered:", error);
    return false;
  }
}

/**
 * Mark customer as subscribed
 * Called when customer converts to subscription
 */
export async function markCustomerSubscribed(orderId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.update(postPurchaseEmails)
      .set({
        hasSubscribed: true,
        subscribedAt: new Date(),
      })
      .where(eq(postPurchaseEmails.orderId, orderId));

    return true;
  } catch (error) {
    console.error("[Database] Failed to mark customer as subscribed:", error);
    return false;
  }
}

/**
 * Mark customer as reviewed
 * Called when customer leaves a review
 */
export async function markCustomerReviewed(orderId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.update(postPurchaseEmails)
      .set({
        hasReviewed: true,
        reviewedAt: new Date(),
      })
      .where(eq(postPurchaseEmails.orderId, orderId));

    return true;
  } catch (error) {
    console.error("[Database] Failed to mark customer as reviewed:", error);
    return false;
  }
}


// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

/**
 * Track a page view
 */
export async function trackPageView(data: {
  sessionId: string;
  userId?: number;
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  countryCode?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Cannot track page view: database not available");
    return;
  }

  try {
    const { pageViews } = await import("../drizzle/schema");
    await db.insert(pageViews).values(data);
  } catch (error) {
    console.error("[Analytics] Failed to track page view:", error);
  }
}

/**
 * Track an analytics event
 */
export async function trackEvent(data: {
  sessionId: string;
  userId?: number;
  eventType: string;
  eventCategory: string;
  eventLabel?: string;
  pagePath: string;
  eventData?: string; // JSON string
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Cannot track event: database not available");
    return;
  }

  try {
    const { analyticsEvents } = await import("../drizzle/schema");
    await db.insert(analyticsEvents).values(data);
  } catch (error) {
    console.error("[Analytics] Failed to track event:", error);
  }
}

/**
 * Get or create conversion funnel record for a session
 */
export async function getOrCreateConversionFunnel(sessionId: string, userId?: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { conversionFunnel } = await import("../drizzle/schema");
    const existing = await db.select().from(conversionFunnel)
      .where(eq(conversionFunnel.sessionId, sessionId))
      .limit(1);
    
    if (existing.length > 0) {
      return existing[0];
    }

    // Create new funnel record
    const [result] = await db.insert(conversionFunnel).values({
      sessionId,
      userId,
    });
    
    return result;
  } catch (error) {
    console.error("[Analytics] Failed to get/create conversion funnel:", error);
    return null;
  }
}

/**
 * Update conversion funnel step
 */
export async function updateConversionFunnelStep(
  sessionId: string,
  step: 'viewedHomepage' | 'viewedProduct' | 'addedToCart' | 'startedCheckout' | 'completedPurchase',
  data?: { orderId?: number; orderValue?: number }
) {
  const db = await getDb();
  if (!db) return;

  try {
    const { conversionFunnel } = await import("../drizzle/schema");
    const stepField = `${step}At` as const;
    const updateData: any = {
      [step]: true,
      [stepField]: new Date(),
    };

    if (data?.orderId) {
      updateData.orderId = data.orderId;
    }
    if (data?.orderValue) {
      updateData.orderValue = data.orderValue;
    }

    await db.update(conversionFunnel)
      .set(updateData)
      .where(eq(conversionFunnel.sessionId, sessionId));
  } catch (error) {
    console.error("[Analytics] Failed to update conversion funnel:", error);
  }
}

/**
 * Get daily metrics for a specific date
 */
export async function getDailyMetrics(date: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { dailyMetrics } = await import("../drizzle/schema");
    const result = await db.select().from(dailyMetrics)
      .where(eq(dailyMetrics.date, date))
      .limit(1);
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Analytics] Failed to get daily metrics:", error);
    return null;
  }
}

/**
 * Get analytics dashboard data for a date range
 */
export async function getAnalyticsDashboard(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { dailyMetrics } = await import("../drizzle/schema");

    // Get daily metrics for the range
    const metrics = await db.select().from(dailyMetrics)
      .where(and(
        gte(dailyMetrics.date, startDate),
        lte(dailyMetrics.date, endDate)
      ))
      .orderBy(dailyMetrics.date);

    // Calculate totals
    const totals = {
      uniqueVisitors: 0,
      totalPageViews: 0,
      totalSessions: 0,
      addToCartEvents: 0,
      checkoutStartedEvents: 0,
      purchasesCompleted: 0,
      totalRevenueInCents: 0,
      averageOrderValueInCents: 0,
      mobileViews: 0,
      tabletViews: 0,
      desktopViews: 0,
    };

    metrics.forEach(metric => {
      totals.uniqueVisitors += metric.uniqueVisitors || 0;
      totals.totalPageViews += metric.totalPageViews || 0;
      totals.totalSessions += metric.totalSessions || 0;
      totals.addToCartEvents += metric.addToCartEvents || 0;
      totals.checkoutStartedEvents += metric.checkoutStartedEvents || 0;
      totals.purchasesCompleted += metric.purchasesCompleted || 0;
      totals.totalRevenueInCents += metric.totalRevenueInCents || 0;
      totals.mobileViews += metric.mobileViews || 0;
      totals.tabletViews += metric.tabletViews || 0;
      totals.desktopViews += metric.desktopViews || 0;
    });

    // Calculate conversion rates
    const conversionRate = totals.totalPageViews > 0 
      ? ((totals.purchasesCompleted / totals.totalPageViews) * 100).toFixed(2)
      : '0.00';

    const cartToCheckoutRate = totals.addToCartEvents > 0
      ? ((totals.checkoutStartedEvents / totals.addToCartEvents) * 100).toFixed(2)
      : '0.00';

    return {
      metrics,
      totals,
      conversionRate: parseFloat(conversionRate),
      cartToCheckoutRate: parseFloat(cartToCheckoutRate),
      averageOrderValue: totals.purchasesCompleted > 0 
        ? Math.round(totals.totalRevenueInCents / totals.purchasesCompleted)
        : 0,
    };
  } catch (error) {
    console.error("[Analytics] Failed to get dashboard data:", error);
    return null;
  }
}

/**
 * Get traffic sources for a date range
 */
export async function getTrafficSources(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { trafficSources } = await import("../drizzle/schema");
    return await db.select().from(trafficSources)
      .where(and(
        gte(trafficSources.date, startDate),
        lte(trafficSources.date, endDate)
      ))
      .orderBy(desc(trafficSources.revenue));
  } catch (error) {
    console.error("[Analytics] Failed to get traffic sources:", error);
    return [];
  }
}

/**
 * Get conversion funnel data
 */
export async function getConversionFunnelData(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { conversionFunnel } = await import("../drizzle/schema");
    const funnels = await db.select().from(conversionFunnel)
      .where(and(
        gte(conversionFunnel.createdAt, new Date(startDate)),
        lte(conversionFunnel.createdAt, new Date(endDate))
      )) as any;

    return {
      totalSessions: funnels.length,
      viewedHomepage: funnels.filter((f: any) => f.viewedHomepage).length,
      viewedProduct: funnels.filter((f: any) => f.viewedProduct).length,
      addedToCart: funnels.filter((f: any) => f.addedToCart).length,
      startedCheckout: funnels.filter((f: any) => f.startedCheckout).length,
      completedPurchase: funnels.filter((f: any) => f.completedPurchase).length,
    };
  } catch (error) {
    console.error("[Analytics] Failed to get conversion funnel data:", error);
    return null;
  }
}


// Analytics event tracking
export async function trackAnalyticsEvent(data: {
  sessionId: string;
  userId?: number;
  eventType: string;
  eventCategory: string;
  eventLabel?: string;
  pagePath: string;
  eventData?: Record<string, any>;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Database not available for event tracking");
    return null;
  }

  try {
    const { analyticsEvents } = await import("../drizzle/schema");
    
    const result = await db.insert(analyticsEvents).values({
      sessionId: data.sessionId,
      userId: data.userId,
      eventType: data.eventType,
      eventCategory: data.eventCategory,
      eventLabel: data.eventLabel,
      pagePath: data.pagePath,
      eventData: data.eventData ? JSON.stringify(data.eventData) : null,
      createdAt: new Date(),
    });

    console.log("[Analytics] Event tracked:", data.eventType);
    return result;
  } catch (error) {
    console.error("[Analytics] Failed to track event:", error);
    return null;
  }
}

// Track conversion funnel step
export async function updateConversionFunnel(data: {
  sessionId: string;
  userId?: number;
  step: 'homepage' | 'product' | 'cart' | 'checkout' | 'purchase';
  orderId?: number;
  orderValue?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Database not available for funnel tracking");
    return null;
  }

  try {
    const { conversionFunnel } = await import("../drizzle/schema");
    
    // Check if funnel entry exists
    const existing = await db
      .select()
      .from(conversionFunnel)
      .where(eq(conversionFunnel.sessionId, data.sessionId))
      .limit(1);

    const now = new Date();
    const updateData: any = {};

    // Set the appropriate step
    switch (data.step) {
      case 'homepage':
        updateData.viewedHomepage = true;
        updateData.homepageViewedAt = now;
        break;
      case 'product':
        updateData.viewedProduct = true;
        updateData.productViewedAt = now;
        break;
      case 'cart':
        updateData.addedToCart = true;
        updateData.addedToCartAt = now;
        break;
      case 'checkout':
        updateData.startedCheckout = true;
        updateData.checkoutStartedAt = now;
        break;
      case 'purchase':
        updateData.completedPurchase = true;
        updateData.purchaseCompletedAt = now;
        if (data.orderId) updateData.orderId = data.orderId;
        if (data.orderValue) updateData.orderValue = data.orderValue;
        break;
    }

    if (existing.length > 0) {
      // Update existing entry
      await db
        .update(conversionFunnel)
        .set(updateData)
        .where(eq(conversionFunnel.sessionId, data.sessionId));
    } else {
      // Create new entry
      const insertData: any = {
        sessionId: data.sessionId,
        userId: data.userId,
        createdAt: now,
        updatedAt: now,
        ...updateData,
      };
      await db.insert(conversionFunnel).values(insertData);
    }

    console.log("[Analytics] Funnel step tracked:", data.step);
    return true;
  } catch (error) {
    console.error("[Analytics] Failed to track funnel step:", error);
    return null;
  }
}

// Get events for a session
export async function getSessionEvents(sessionId: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { analyticsEvents } = await import("../drizzle/schema");
    return db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.sessionId, sessionId))
      .orderBy(analyticsEvents.createdAt);
  } catch (error) {
    console.error("[Analytics] Failed to get session events:", error);
    return [];
  }
}

// Get conversion funnel for a session
export async function getSessionFunnel(sessionId: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { conversionFunnel } = await import("../drizzle/schema");
    const result = await db
      .select()
      .from(conversionFunnel)
      .where(eq(conversionFunnel.sessionId, sessionId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Analytics] Failed to get session funnel:", error);
    return null;
  }
}
