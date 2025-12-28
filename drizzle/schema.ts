import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Founder tier tracking for lifetime discounts
  founderTier: mysqlEnum("founderTier", ["founders", "early_adopter", "pre_launch", "regular"]),
  lifetimeDiscountPercent: int("lifetimeDiscountPercent").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table - main product information
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  longDescription: text("longDescription"),
  // Price in cents to avoid decimal issues
  priceInCents: int("priceInCents").notNull(),
  compareAtPriceInCents: int("compareAtPriceInCents"),
  sku: varchar("sku", { length: 100 }).unique(),
  stockQuantity: int("stockQuantity").default(0).notNull(),
  lowStockThreshold: int("lowStockThreshold").default(10),
  imageUrl: varchar("imageUrl", { length: 500 }),
  galleryImages: text("galleryImages"), // JSON array of image URLs
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  // Product metadata
  servingSize: varchar("servingSize", { length: 100 }),
  servingsPerContainer: int("servingsPerContainer"),
  ingredients: text("ingredients"),
  supplementFacts: text("supplementFacts"), // JSON for structured data
  warnings: text("warnings"),
  directions: text("directions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product variants (different sizes, quantities, etc.)
 */
export const productVariants = mysqlTable("productVariants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "60 Capsules", "120 Capsules"
  sku: varchar("sku", { length: 100 }).unique(),
  priceInCents: int("priceInCents").notNull(),
  compareAtPriceInCents: int("compareAtPriceInCents"),
  stockQuantity: int("stockQuantity").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0),
  stripePriceId: varchar("stripePriceId", { length: 255 }), // Stripe one-time price ID
  stripeSubscriptionPriceId: varchar("stripeSubscriptionPriceId", { length: 255 }), // Stripe subscription price ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;

/**
 * Subscription plans
 */
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  intervalType: mysqlEnum("intervalType", ["monthly", "quarterly", "annual"]).notNull(),
  intervalCount: int("intervalCount").default(1).notNull(), // e.g., every 1 month, every 3 months
  discountPercentage: int("discountPercentage").default(0), // Discount off regular price
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * Customer addresses
 */
export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["shipping", "billing"]).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  company: varchar("company", { length: 255 }),
  address1: varchar("address1", { length: 255 }).notNull(),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zipCode: varchar("zipCode", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull().default("United States"),
  phone: varchar("phone", { length: 20 }),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

/**
 * Orders table
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded"
  ]).default("pending").notNull(),
  // Prices in cents
  subtotalInCents: int("subtotalInCents").notNull(),
  shippingInCents: int("shippingInCents").default(0).notNull(),
  taxInCents: int("taxInCents").default(0).notNull(),
  discountInCents: int("discountInCents").default(0).notNull(),
  totalInCents: int("totalInCents").notNull(),
  // Shipping information
  shippingFirstName: varchar("shippingFirstName", { length: 100 }).notNull(),
  shippingLastName: varchar("shippingLastName", { length: 100 }).notNull(),
  shippingAddress1: varchar("shippingAddress1", { length: 255 }).notNull(),
  shippingAddress2: varchar("shippingAddress2", { length: 255 }),
  shippingCity: varchar("shippingCity", { length: 100 }).notNull(),
  shippingState: varchar("shippingState", { length: 100 }).notNull(),
  shippingZipCode: varchar("shippingZipCode", { length: 20 }).notNull(),
  shippingCountry: varchar("shippingCountry", { length: 100 }).notNull(),
  shippingPhone: varchar("shippingPhone", { length: 20 }),
  // Billing information
  billingFirstName: varchar("billingFirstName", { length: 100 }).notNull(),
  billingLastName: varchar("billingLastName", { length: 100 }).notNull(),
  billingAddress1: varchar("billingAddress1", { length: 255 }).notNull(),
  billingAddress2: varchar("billingAddress2", { length: 255 }),
  billingCity: varchar("billingCity", { length: 100 }).notNull(),
  billingState: varchar("billingState", { length: 100 }).notNull(),
  billingZipCode: varchar("billingZipCode", { length: 20 }).notNull(),
  billingCountry: varchar("billingCountry", { length: 100 }).notNull(),
  // Payment information
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  // Shipping tracking
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  shippingCarrier: varchar("shippingCarrier", { length: 100 }),
  // Notes
  customerNotes: text("customerNotes"),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  paidAt: timestamp("paidAt"),
  shippedAt: timestamp("shippedAt"),
  deliveredAt: timestamp("deliveredAt"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items (products in each order)
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  variantName: varchar("variantName", { length: 255 }),
  sku: varchar("sku", { length: 100 }),
  quantity: int("quantity").notNull(),
  priceInCents: int("priceInCents").notNull(), // Price per unit at time of order
  totalInCents: int("totalInCents").notNull(), // quantity * priceInCents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Customer subscriptions
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planId: int("planId").notNull(),
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  status: mysqlEnum("status", ["active", "paused", "cancelled", "expired"]).default("active").notNull(),
  quantity: int("quantity").default(1).notNull(),
  priceInCents: int("priceInCents").notNull(),
  // Stripe integration fields
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).unique(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  nextBillingDate: timestamp("nextBillingDate").notNull(),
  lastBillingDate: timestamp("lastBillingDate"),
  cancelledAt: timestamp("cancelledAt"),
  pausedAt: timestamp("pausedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Shopping cart items
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 255 }), // For guest users
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  quantity: int("quantity").default(1).notNull(),
  isSubscription: boolean("isSubscription").default(false),
  subscriptionPlanId: int("subscriptionPlanId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Discount codes / Promo codes
 */
export const discountCodes = mysqlTable("discountCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: int("discountValue").notNull(), // Percentage (0-100) or cents
  minPurchaseInCents: int("minPurchaseInCents").default(0),
  maxUsesTotal: int("maxUsesTotal"),
  maxUsesPerCustomer: int("maxUsesPerCustomer").default(1),
  usedCount: int("usedCount").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  startsAt: timestamp("startsAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = typeof discountCodes.$inferInsert;

/**
 * Product batches for batch verification and traceability
 */
export const productBatches = mysqlTable("productBatches", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  lotNumber: varchar("lotNumber", { length: 100 }).notNull().unique(),
  manufactureDate: timestamp("manufactureDate").notNull(),
  expiryDate: timestamp("expiryDate").notNull(),
  coaUrl: varchar("coaUrl", { length: 500 }), // Certificate of Analysis PDF
  heavyMetalsTestUrl: varchar("heavyMetalsTestUrl", { length: 500 }),
  microbialTestUrl: varchar("microbialTestUrl", { length: 500 }),
  potencyTestUrl: varchar("potencyTestUrl", { length: 500 }),
  // Test results as JSON for quick display
  testResults: text("testResults"), // JSON with key test metrics
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductBatch = typeof productBatches.$inferSelect;
export type InsertProductBatch = typeof productBatches.$inferInsert;

/**
 * Product reviews
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId"), // Optional: link to verified purchase
  rating: int("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(false),
  isApproved: boolean("isApproved").default(true), // Admin moderation
  helpfulCount: int("helpfulCount").default(0),
  notHelpfulCount: int("notHelpfulCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Review photos
 */
export const reviewPhotos = mysqlTable("reviewPhotos", {
  id: int("id").autoincrement().primaryKey(),
  reviewId: int("reviewId").notNull(),
  photoUrl: varchar("photoUrl", { length: 500 }).notNull(),
  photoKey: varchar("photoKey", { length: 500 }).notNull(), // S3 key for management
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReviewPhoto = typeof reviewPhotos.$inferSelect;
export type InsertReviewPhoto = typeof reviewPhotos.$inferInsert;

/**
 * Review votes (helpful/not helpful)
 */
export const reviewVotes = mysqlTable("reviewVotes", {
  id: int("id").autoincrement().primaryKey(),
  reviewId: int("reviewId").notNull(),
  userId: int("userId").notNull(),
  voteType: mysqlEnum("voteType", ["helpful", "not_helpful"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReviewVote = typeof reviewVotes.$inferSelect;
export type InsertReviewVote = typeof reviewVotes.$inferInsert;

/**
 * Newsletter subscribers with discount codes
 */
export const newsletterSubscribers = mysqlTable("newsletterSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  discountCode: varchar("discountCode", { length: 50 }).notNull().unique(),
  discountPercent: int("discountPercent").default(10).notNull(),
  isUsed: boolean("isUsed").default(false),
  usedAt: timestamp("usedAt"),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

/**
 * Referral program - tracks referrals and credits
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(), // User who sent the referral
  referralCode: varchar("referralCode", { length: 50 }).notNull().unique(),
  referredUserId: int("referredUserId"), // User who signed up (null until they register)
  referredEmail: varchar("referredEmail", { length: 320 }), // Email of referred person
  status: mysqlEnum("status", ["pending", "completed", "credited"]).default("pending").notNull(),
  orderValue: int("orderValue"), // First order value in cents
  creditAmount: int("creditAmount").default(1000), // Credit amount in cents ($10)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"), // When referred user made first purchase
  creditedAt: timestamp("creditedAt"), // When credit was applied to referrer
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Referral credits - tracks available credits for users
 */
export const referralCredits = mysqlTable("referralCredits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // Credit amount in cents
  source: varchar("source", { length: 100 }).notNull(), // "referral", "promotion", etc.
  referralId: int("referralId"), // Link to referral if from referral program
  isUsed: boolean("isUsed").default(false),
  usedAt: timestamp("usedAt"),
  orderId: int("orderId"), // Order where credit was used
  expiresAt: timestamp("expiresAt"), // Optional expiration date
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReferralCredit = typeof referralCredits.$inferSelect;
export type InsertReferralCredit = typeof referralCredits.$inferInsert;

/**
 * Abandoned carts - tracks carts that were not completed
 * Used for cart recovery email campaigns
 */
export const abandonedCarts = mysqlTable("abandonedCarts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Null for guest users
  sessionId: varchar("sessionId", { length: 255 }), // For guest tracking
  email: varchar("email", { length: 320 }), // Collected email for recovery
  cartData: text("cartData").notNull(), // JSON snapshot of cart items
  totalValue: int("totalValue").notNull(), // Total cart value in cents
  recoveryToken: varchar("recoveryToken", { length: 100 }).unique(), // Unique token for recovery link
  // Email tracking
  firstEmailSentAt: timestamp("firstEmailSentAt"),
  secondEmailSentAt: timestamp("secondEmailSentAt"),
  thirdEmailSentAt: timestamp("thirdEmailSentAt"),
  // Recovery tracking
  isRecovered: boolean("isRecovered").default(false),
  recoveredAt: timestamp("recoveredAt"),
  recoveredOrderId: int("recoveredOrderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AbandonedCart = typeof abandonedCarts.$inferSelect;
export type InsertAbandonedCart = typeof abandonedCarts.$inferInsert;

/**
 * Post-purchase email tracking - nurture customers and drive reorders
 * Tracks 4-email sequence: Day 7, 21, 60, 90
 */
export const postPurchaseEmails = mysqlTable("postPurchaseEmails", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }).notNull(),
  productId: int("productId").notNull(), // Track which product they bought
  purchaseDate: timestamp("purchaseDate").notNull(),
  // Email sequence tracking (Day 7, 21, 60, 90)
  day7EmailSentAt: timestamp("day7EmailSentAt"),
  day21EmailSentAt: timestamp("day21EmailSentAt"),
  day60EmailSentAt: timestamp("day60EmailSentAt"),
  day90EmailSentAt: timestamp("day90EmailSentAt"),
  // Engagement tracking
  hasReordered: boolean("hasReordered").default(false),
  reorderDate: timestamp("reorderDate"),
  reorderOrderId: int("reorderOrderId"),
  hasSubscribed: boolean("hasSubscribed").default(false), // Converted to subscription
  subscribedAt: timestamp("subscribedAt"),
  // Review tracking
  hasReviewed: boolean("hasReviewed").default(false),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PostPurchaseEmail = typeof postPurchaseEmails.$inferSelect;
export type InsertPostPurchaseEmail = typeof postPurchaseEmails.$inferInsert;

// Pre-Sale System Tables
export * from "./presale-schema";
