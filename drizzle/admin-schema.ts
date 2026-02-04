import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Admin Audit Logs - Track all admin actions for compliance and security
 * Records who changed what and when
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Admin user who performed the action
  userName: varchar("userName", { length: 255 }), // Cached for quick display
  userRole: varchar("userRole", { length: 50 }), // Role at time of action
  
  // Action details
  action: mysqlEnum("action", [
    "create", "update", "delete", "view", "export", "import",
    "login", "logout", "password_change", "role_change",
    "refund", "cancel", "ship", "fulfill"
  ]).notNull(),
  
  // Resource being acted upon
  resourceType: mysqlEnum("resourceType", [
    "product", "order", "customer", "discount", "subscription",
    "inventory", "content", "settings", "user", "batch"
  ]).notNull(),
  resourceId: int("resourceId"), // ID of the affected resource
  resourceName: varchar("resourceName", { length: 255 }), // Human-readable name
  
  // Change details
  previousValue: text("previousValue"), // JSON snapshot before change
  newValue: text("newValue"), // JSON snapshot after change
  changeDescription: text("changeDescription"), // Human-readable description
  
  // Request context
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Content Pages - Static pages like About, FAQ, Terms, etc.
 */
export const contentPages = mysqlTable("contentPages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL path
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"), // HTML or Markdown content
  metaTitle: varchar("metaTitle", { length: 255 }), // SEO title
  metaDescription: text("metaDescription"), // SEO description
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  sortOrder: int("sortOrder").default(0),
  
  // Tracking
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentPage = typeof contentPages.$inferSelect;
export type InsertContentPage = typeof contentPages.$inferInsert;

/**
 * Blog Posts - For content marketing and SEO
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"), // Short summary
  content: text("content"), // Full post content
  featuredImage: varchar("featuredImage", { length: 500 }),
  
  // SEO
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  
  // Categorization
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array of tags
  
  // Status
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  
  // Author
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 255 }),
  
  // Engagement
  viewCount: int("viewCount").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * FAQ Items - Frequently Asked Questions
 */
export const faqItems = mysqlTable("faqItems", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }), // e.g., "Shipping", "Product", "Returns"
  sortOrder: int("sortOrder").default(0),
  isPublished: boolean("isPublished").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FaqItem = typeof faqItems.$inferSelect;
export type InsertFaqItem = typeof faqItems.$inferInsert;

/**
 * Inventory Adjustments - Track all stock changes
 */
export const inventoryAdjustments = mysqlTable("inventoryAdjustments", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  
  // Adjustment details
  adjustmentType: mysqlEnum("adjustmentType", [
    "received", "sold", "returned", "damaged", "lost",
    "adjustment", "transfer", "count"
  ]).notNull(),
  
  quantityBefore: int("quantityBefore").notNull(),
  quantityChange: int("quantityChange").notNull(), // Positive or negative
  quantityAfter: int("quantityAfter").notNull(),
  
  // Reference
  referenceType: varchar("referenceType", { length: 50 }), // "order", "purchase_order", "manual"
  referenceId: int("referenceId"),
  
  // Notes
  reason: text("reason"),
  notes: text("notes"),
  
  // Who made the adjustment
  adjustedBy: int("adjustedBy"),
  adjustedByName: varchar("adjustedByName", { length: 255 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InventoryAdjustment = typeof inventoryAdjustments.$inferSelect;
export type InsertInventoryAdjustment = typeof inventoryAdjustments.$inferInsert;

/**
 * Low Stock Alerts - Track products that need reordering
 */
export const lowStockAlerts = mysqlTable("lowStockAlerts", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  
  currentStock: int("currentStock").notNull(),
  threshold: int("threshold").notNull(),
  
  // Alert status
  status: mysqlEnum("status", ["active", "acknowledged", "resolved"]).default("active").notNull(),
  acknowledgedBy: int("acknowledgedBy"),
  acknowledgedAt: timestamp("acknowledgedAt"),
  resolvedAt: timestamp("resolvedAt"),
  
  // Notification tracking
  emailSentAt: timestamp("emailSentAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LowStockAlert = typeof lowStockAlerts.$inferSelect;
export type InsertLowStockAlert = typeof lowStockAlerts.$inferInsert;
