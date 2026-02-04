import { z } from "zod";
import { eq, desc, sql, and, like, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  loyaltyAccounts,
  loyaltyTransactions,
  loyaltyRewards,
  users,
} from "../../drizzle/schema";

export const adminLoyaltyRouter = router({
  // Get loyalty program stats
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const [accountStats] = await db
      .select({
        totalAccounts: sql<number>`count(*)`,
        totalPointsIssued: sql<number>`COALESCE(sum(${loyaltyAccounts.lifetimePoints}), 0)`,
        totalPointsBalance: sql<number>`COALESCE(sum(${loyaltyAccounts.pointsBalance}), 0)`,
        bronzeCount: sql<number>`sum(case when ${loyaltyAccounts.tier} = 'bronze' then 1 else 0 end)`,
        silverCount: sql<number>`sum(case when ${loyaltyAccounts.tier} = 'silver' then 1 else 0 end)`,
        goldCount: sql<number>`sum(case when ${loyaltyAccounts.tier} = 'gold' then 1 else 0 end)`,
        platinumCount: sql<number>`sum(case when ${loyaltyAccounts.tier} = 'platinum' then 1 else 0 end)`,
      })
      .from(loyaltyAccounts);

    const [rewardStats] = await db
      .select({
        totalRewards: sql<number>`count(*)`,
        activeRewards: sql<number>`sum(case when ${loyaltyRewards.isActive} = true then 1 else 0 end)`,
        totalRedemptions: sql<number>`COALESCE(sum(${loyaltyRewards.timesRedeemed}), 0)`,
      })
      .from(loyaltyRewards);

    return {
      accounts: {
        total: accountStats?.totalAccounts || 0,
        pointsIssued: accountStats?.totalPointsIssued || 0,
        pointsBalance: accountStats?.totalPointsBalance || 0,
        byTier: {
          bronze: accountStats?.bronzeCount || 0,
          silver: accountStats?.silverCount || 0,
          gold: accountStats?.goldCount || 0,
          platinum: accountStats?.platinumCount || 0,
        },
      },
      rewards: {
        total: rewardStats?.totalRewards || 0,
        active: rewardStats?.activeRewards || 0,
        redemptions: rewardStats?.totalRedemptions || 0,
      },
    };
  }),

  // List all rewards
  listRewards: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    return db.select().from(loyaltyRewards).orderBy(desc(loyaltyRewards.createdAt));
  }),

  // Create a new reward
  createReward: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        pointsCost: z.number().min(1),
        rewardType: z.enum(["discount_percent", "discount_fixed", "free_shipping", "free_product", "exclusive_access"]),
        rewardValue: z.number().min(0),
        minTier: z.enum(["bronze", "silver", "gold", "platinum"]).optional(),
        limitPerUser: z.number().optional(),
        totalLimit: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.insert(loyaltyRewards).values({
        name: input.name,
        description: input.description || null,
        pointsCost: input.pointsCost,
        rewardType: input.rewardType,
        rewardValue: input.rewardValue,
        minTier: input.minTier || "bronze",
        limitPerUser: input.limitPerUser || null,
        totalLimit: input.totalLimit || null,
        isActive: true,
      });

      return { success: true };
    }),

  // Update a reward
  updateReward: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        pointsCost: z.number().min(1).optional(),
        rewardType: z.enum(["discount_percent", "discount_fixed", "free_shipping", "free_product", "exclusive_access"]).optional(),
        rewardValue: z.number().min(0).optional(),
        minTier: z.enum(["bronze", "silver", "gold", "platinum"]).optional(),
        limitPerUser: z.number().nullable().optional(),
        totalLimit: z.number().nullable().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { id, ...updates } = input;
      
      // Filter out undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      if (Object.keys(cleanUpdates).length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No updates provided" });
      }

      await db.update(loyaltyRewards).set(cleanUpdates).where(eq(loyaltyRewards.id, id));

      return { success: true };
    }),

  // Delete a reward
  deleteReward: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.delete(loyaltyRewards).where(eq(loyaltyRewards.id, input.id));

      return { success: true };
    }),

  // List loyalty accounts with search
  listAccounts: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        tier: z.enum(["bronze", "silver", "gold", "platinum"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Build conditions
      const conditions = [];
      if (input.tier) {
        conditions.push(eq(loyaltyAccounts.tier, input.tier));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const accounts = await db
        .select({
          id: loyaltyAccounts.id,
          userId: loyaltyAccounts.userId,
          pointsBalance: loyaltyAccounts.pointsBalance,
          lifetimePoints: loyaltyAccounts.lifetimePoints,
          tier: loyaltyAccounts.tier,
          referralCode: loyaltyAccounts.referralCode,
          createdAt: loyaltyAccounts.createdAt,
          userName: users.name,
          userEmail: users.email,
        })
        .from(loyaltyAccounts)
        .leftJoin(users, eq(loyaltyAccounts.userId, users.id))
        .where(whereClause)
        .orderBy(desc(loyaltyAccounts.lifetimePoints))
        .limit(input.limit)
        .offset(input.offset);

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(loyaltyAccounts)
        .where(whereClause);

      return {
        accounts,
        total: countResult?.count || 0,
      };
    }),

  // Award bonus points to a user
  awardBonusPoints: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        points: z.number().min(1),
        description: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Get account
      const [account] = await db
        .select()
        .from(loyaltyAccounts)
        .where(eq(loyaltyAccounts.userId, input.userId))
        .limit(1);

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Loyalty account not found" });
      }

      // Update balance
      await db
        .update(loyaltyAccounts)
        .set({
          pointsBalance: account.pointsBalance + input.points,
          lifetimePoints: account.lifetimePoints + input.points,
        })
        .where(eq(loyaltyAccounts.id, account.id));

      // Record transaction
      await db.insert(loyaltyTransactions).values({
        loyaltyAccountId: account.id,
        userId: input.userId,
        type: "bonus",
        points: input.points,
        description: input.description,
      });

      return { success: true };
    }),

  // Get recent transactions
  getRecentTransactions: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const transactions = await db
        .select({
          id: loyaltyTransactions.id,
          userId: loyaltyTransactions.userId,
          type: loyaltyTransactions.type,
          points: loyaltyTransactions.points,
          description: loyaltyTransactions.description,
          createdAt: loyaltyTransactions.createdAt,
          userName: users.name,
          userEmail: users.email,
        })
        .from(loyaltyTransactions)
        .leftJoin(users, eq(loyaltyTransactions.userId, users.id))
        .orderBy(desc(loyaltyTransactions.createdAt))
        .limit(input.limit);

      return transactions;
    }),
});
