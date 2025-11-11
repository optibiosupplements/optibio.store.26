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
