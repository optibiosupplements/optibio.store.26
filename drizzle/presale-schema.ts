import { int, mysqlTable, text, timestamp, varchar, decimal, boolean, mysqlEnum } from "drizzle-orm/mysql-core";

/**
 * Pre-Sale Reservations Table
 * Tracks all pre-sale orders with tier, pricing, and referral information
 */
export const presaleReservations = mysqlTable("presale_reservations", {
  id: int("id").autoincrement().primaryKey(),
  
  // Customer Information
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  
  // Tier Information
  tier: mysqlEnum("tier", ["founders", "early_adopter", "pre_launch"]).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Amount paid
  
  // Waitlist Position
  position: int("position").notNull(), // Their position in line (auto-incremented)
  
  // Referral Information
  referralCode: varchar("referral_code", { length: 20 }).unique(), // Their unique referral code
  referredBy: varchar("referred_by", { length: 20 }), // Who referred them (if anyone)
  referralCount: int("referral_count").default(0).notNull(), // How many people they've referred
  referralCredits: decimal("referral_credits", { precision: 10, scale: 2 }).default("0.00").notNull(), // $10 per referral
  
  // Payment Information
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  paymentStatus: mysqlEnum("payment_status", ["pending", "paid", "refunded"]).default("pending").notNull(),
  
  // Perks and Benefits
  lifetimeDiscount: int("lifetime_discount").notNull(), // 25%, 15%, or 10% based on tier
  founderBadge: boolean("founder_badge").default(false).notNull(),
  earlyAccess: boolean("early_access").default(false).notNull(),
  
  // Conversion Tracking
  convertedToOrder: boolean("converted_to_order").default(false).notNull(),
  orderId: int("order_id"), // Reference to actual order when converted
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PresaleReservation = typeof presaleReservations.$inferSelect;
export type InsertPresaleReservation = typeof presaleReservations.$inferInsert;

/**
 * Pre-Sale Campaign Settings
 * Stores campaign configuration and real-time stats
 */
export const presaleCampaign = mysqlTable("presale_campaign", {
  id: int("id").autoincrement().primaryKey(),
  
  // Campaign Timing
  launchDate: timestamp("launch_date").notNull(), // When pre-sale started
  endDate: timestamp("end_date").notNull(), // 90 days from launch
  productShipDate: timestamp("product_ship_date"), // Expected ship date
  
  // Tier Limits
  foundersLimit: int("founders_limit").default(500).notNull(),
  foundersRemaining: int("founders_remaining").default(500).notNull(),
  earlyAdopterLimit: int("early_adopter_limit").default(2000).notNull(),
  earlyAdopterRemaining: int("early_adopter_remaining").default(2000).notNull(),
  
  // Pricing
  foundersPrice: decimal("founders_price", { precision: 10, scale: 2 }).default("89.00").notNull(),
  earlyAdopterPrice: decimal("early_adopter_price", { precision: 10, scale: 2 }).default("69.00").notNull(),
  preLaunchPrice: decimal("pre_launch_price", { precision: 10, scale: 2 }).default("59.00").notNull(),
  regularPrice: decimal("regular_price", { precision: 10, scale: 2 }).default("99.00").notNull(),
  
  // Campaign Stats (updated in real-time)
  totalReservations: int("total_reservations").default(0).notNull(),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0.00").notNull(),
  
  // Campaign Status
  isActive: boolean("is_active").default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PresaleCampaign = typeof presaleCampaign.$inferSelect;
export type InsertPresaleCampaign = typeof presaleCampaign.$inferInsert;

/**
 * Waitlist Table (for people who sign up before pre-sale opens)
 */
export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  source: varchar("source", { length: 100 }), // Where they came from (reddit, linkedin, etc.)
  notified: boolean("notified").default(false).notNull(), // Have we emailed them about pre-sale?
  convertedToReservation: boolean("converted_to_reservation").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = typeof waitlist.$inferInsert;
