import { eq, sql, and, gte, lte } from "drizzle-orm";
import { getDb } from "./db";
import { subscriptions, orders, users } from "../drizzle/schema";

/**
 * Analytics database queries for admin dashboard
 */

export interface AnalyticsMetrics {
  mrr: number; // Monthly Recurring Revenue in cents
  activeSubscriptions: number;
  churnRate: number; // Percentage
  totalRevenue: number; // All-time revenue in cents
}

export interface TierMetrics {
  tier: string;
  count: number;
  mrr: number;
  avgLTV: number;
}

export interface ConversionMetrics {
  totalOrders: number;
  subscriptionOrders: number;
  conversionRate: number;
}

/**
 * Get Monthly Recurring Revenue (MRR)
 */
export async function getMRR(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({
      total: sql<number>`SUM(${subscriptions.priceInCents})`,
    })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));

  return result[0]?.total || 0;
}

/**
 * Get active subscriptions count
 */
export async function getActiveSubscriptionsCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));

  return result[0]?.count || 0;
}

/**
 * Get churn rate (cancelled subscriptions / total subscriptions in last 30 days)
 */
export async function getChurnRate(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Count subscriptions that were active 30 days ago
  const totalResult = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(subscriptions)
    .where(gte(subscriptions.createdAt, thirtyDaysAgo));

  const total = totalResult[0]?.count || 0;
  if (total === 0) return 0;

  // Count subscriptions cancelled in last 30 days
  const cancelledResult = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.status, "cancelled"),
        gte(subscriptions.updatedAt, thirtyDaysAgo)
      )
    );

  const cancelled = cancelledResult[0]?.count || 0;

  return (cancelled / total) * 100;
}

/**
 * Get total revenue (all-time)
 */
export async function getTotalRevenue(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({
      total: sql<number>`SUM(${orders.totalInCents})`,
    })
    .from(orders);

  return result[0]?.total || 0;
}

/**
 * Get metrics by founder tier
 */
export async function getMetricsByTier(): Promise<TierMetrics[]> {
  const db = await getDb();
  if (!db) return [];

  // Join subscriptions with users to get founder tier
  const result = await db
    .select({
      tier: users.founderTier,
      count: sql<number>`COUNT(DISTINCT ${subscriptions.id})`,
      mrr: sql<number>`SUM(${subscriptions.priceInCents})`,
      totalSpent: sql<number>`SUM(${orders.totalInCents})`,
      orderCount: sql<number>`COUNT(${orders.id})`,
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.userId, users.id))
    .leftJoin(orders, eq(orders.userId, users.id))
    .where(eq(subscriptions.status, "active"))
    .groupBy(users.founderTier);

  return result.map((row) => ({
    tier: row.tier || "regular",
    count: row.count || 0,
    mrr: row.mrr || 0,
    avgLTV: row.orderCount > 0 ? (row.totalSpent || 0) / row.orderCount : 0,
  }));
}

/**
 * Get conversion rate (one-time to subscription)
 */
export async function getConversionMetrics(): Promise<ConversionMetrics> {
  const db = await getDb();
  if (!db) return { totalOrders: 0, subscriptionOrders: 0, conversionRate: 0 };

  // Count total unique customers with orders
  const totalResult = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${orders.userId})`,
    })
    .from(orders);

  const total = totalResult[0]?.count || 0;

  // Count unique customers with subscriptions
  const subscriptionResult = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${subscriptions.userId})`,
    })
    .from(subscriptions);

  const withSubscription = subscriptionResult[0]?.count || 0;

  return {
    totalOrders: total,
    subscriptionOrders: withSubscription,
    conversionRate: total > 0 ? (withSubscription / total) * 100 : 0,
  };
}

/**
 * Get revenue breakdown by tier and type
 */
export interface RevenueBreakdown {
  tier: string;
  subscriptionRevenue: number;
  oneTimeRevenue: number;
  totalRevenue: number;
}

export async function getRevenueBreakdown(): Promise<RevenueBreakdown[]> {
  const db = await getDb();
  if (!db) return [];

  // Get subscription revenue by tier
  const subscriptionRevenue = await db
    .select({
      tier: users.founderTier,
      revenue: sql<number>`SUM(${subscriptions.priceInCents} * 12)`, // Annualized
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.userId, users.id))
    .where(eq(subscriptions.status, "active"))
    .groupBy(users.founderTier);

  // Get one-time order revenue by tier
  const oneTimeRevenue = await db
    .select({
      tier: users.founderTier,
      revenue: sql<number>`SUM(${orders.totalInCents})`,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .groupBy(users.founderTier);

  // Combine results
  const tiers = ["founders", "early_adopter", "pre_launch", "regular"];
  return tiers.map((tier) => {
    const subRev =
      subscriptionRevenue.find((r) => r.tier === tier)?.revenue || 0;
    const oneRev = oneTimeRevenue.find((r) => r.tier === tier)?.revenue || 0;

    return {
      tier,
      subscriptionRevenue: subRev,
      oneTimeRevenue: oneRev,
      totalRevenue: subRev + oneRev,
    };
  });
}
