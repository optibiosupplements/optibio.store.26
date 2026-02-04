import { z } from "zod";
import { eq, desc, and, sql, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  loyaltyAccounts,
  loyaltyTransactions,
  loyaltyRewards,
  orders,
  users,
  LoyaltyAccount,
  LoyaltyTransaction,
  LoyaltyReward,
} from "../../drizzle/schema";

// Tier thresholds (lifetime points)
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 5000,
};

// Points earning rates
const POINTS_PER_DOLLAR = 1; // 1 point per $1 spent
const REFERRAL_BONUS = 100; // Points for successful referral
const SIGNUP_BONUS = 50; // Points for creating account
const REVIEW_BONUS = 25; // Points for leaving a review

// Tier multipliers for earning points
const TIER_MULTIPLIERS = {
  bronze: 1,
  silver: 1.25,
  gold: 1.5,
  platinum: 2,
};

// Generate unique referral code
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "OPT";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Calculate tier based on lifetime points
function calculateTier(lifetimePoints: number): "bronze" | "silver" | "gold" | "platinum" {
  if (lifetimePoints >= TIER_THRESHOLDS.platinum) return "platinum";
  if (lifetimePoints >= TIER_THRESHOLDS.gold) return "gold";
  if (lifetimePoints >= TIER_THRESHOLDS.silver) return "silver";
  return "bronze";
}

export const loyaltyRouter = router({
  // Get or create loyalty account for current user
  getAccount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Check if account exists
    const existing = await db
      .select()
      .from(loyaltyAccounts)
      .where(eq(loyaltyAccounts.userId, ctx.user.id))
      .limit(1);

    if (existing.length > 0) {
      const account = existing[0];
      const nextTier = calculateNextTier(account.lifetimePoints);
      return {
        ...account,
        nextTier,
        tierMultiplier: TIER_MULTIPLIERS[account.tier],
        tierThresholds: TIER_THRESHOLDS,
      };
    }

    // Create new account with signup bonus
    const referralCode = generateReferralCode();
    await db.insert(loyaltyAccounts).values({
      userId: ctx.user.id,
      pointsBalance: SIGNUP_BONUS,
      lifetimePoints: SIGNUP_BONUS,
      tier: "bronze",
      referralCode,
    });

    // Record signup bonus transaction
    const [newAccount] = await db
      .select()
      .from(loyaltyAccounts)
      .where(eq(loyaltyAccounts.userId, ctx.user.id))
      .limit(1);

    await db.insert(loyaltyTransactions).values({
      loyaltyAccountId: newAccount.id,
      userId: ctx.user.id,
      type: "bonus",
      points: SIGNUP_BONUS,
      description: "Welcome bonus for joining OptiBio Rewards!",
    });

    return {
      ...newAccount,
      nextTier: calculateNextTier(SIGNUP_BONUS),
      tierMultiplier: TIER_MULTIPLIERS.bronze,
      tierThresholds: TIER_THRESHOLDS,
    };
  }),

  // Get transaction history
  getTransactions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const transactions = await db
        .select()
        .from(loyaltyTransactions)
        .where(eq(loyaltyTransactions.userId, ctx.user.id))
        .orderBy(desc(loyaltyTransactions.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(loyaltyTransactions)
        .where(eq(loyaltyTransactions.userId, ctx.user.id));

      return {
        transactions,
        total: countResult?.count || 0,
      };
    }),

  // Get available rewards
  getRewards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Get user's account to check tier
    const [account] = await db
      .select()
      .from(loyaltyAccounts)
      .where(eq(loyaltyAccounts.userId, ctx.user.id))
      .limit(1);

    const tierOrder = ["bronze", "silver", "gold", "platinum"];
    const userTierIndex = account ? tierOrder.indexOf(account.tier) : 0;

    const rewards = await db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.isActive, true))
      .orderBy(loyaltyRewards.pointsCost);

    // Mark which rewards are available to user
    return rewards.map((reward) => {
      const rewardTierIndex = tierOrder.indexOf(reward.minTier || "bronze");
      const isAvailable = userTierIndex >= rewardTierIndex;
      const canAfford = account ? account.pointsBalance >= reward.pointsCost : false;
      return {
        ...reward,
        isAvailable,
        canAfford,
        canRedeem: isAvailable && canAfford,
      };
    });
  }),

  // Redeem a reward
  redeemReward: protectedProcedure
    .input(z.object({ rewardId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Get user's account
      const [account] = await db
        .select()
        .from(loyaltyAccounts)
        .where(eq(loyaltyAccounts.userId, ctx.user.id))
        .limit(1);

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Loyalty account not found" });
      }

      // Get reward
      const [reward] = await db
        .select()
        .from(loyaltyRewards)
        .where(eq(loyaltyRewards.id, input.rewardId))
        .limit(1);

      if (!reward || !reward.isActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reward not found or inactive" });
      }

      // Check tier requirement
      const tierOrder = ["bronze", "silver", "gold", "platinum"];
      if (tierOrder.indexOf(account.tier) < tierOrder.indexOf(reward.minTier || "bronze")) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Your tier is not high enough for this reward" });
      }

      // Check points balance
      if (account.pointsBalance < reward.pointsCost) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient points balance" });
      }

      // Check redemption limits
      if (reward.totalLimit && (reward.timesRedeemed ?? 0) >= reward.totalLimit) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This reward is no longer available" });
      }

      // Deduct points
      await db
        .update(loyaltyAccounts)
        .set({
          pointsBalance: account.pointsBalance - reward.pointsCost,
        })
        .where(eq(loyaltyAccounts.id, account.id));

      // Record transaction
      await db.insert(loyaltyTransactions).values({
        loyaltyAccountId: account.id,
        userId: ctx.user.id,
        type: "redeem",
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.name}`,
      });

      // Update reward redemption count
      await db
        .update(loyaltyRewards)
        .set({
          timesRedeemed: sql`${loyaltyRewards.timesRedeemed} + 1`,
        })
        .where(eq(loyaltyRewards.id, reward.id));

      // Generate reward code/coupon based on type
      let rewardCode = "";
      if (reward.rewardType === "discount_percent" || reward.rewardType === "discount_fixed") {
        // Generate a unique discount code
        rewardCode = `LOYALTY${Date.now().toString(36).toUpperCase()}`;
      }

      return {
        success: true,
        rewardCode,
        reward,
        newBalance: account.pointsBalance - reward.pointsCost,
      };
    }),

  // Apply referral code
  applyReferralCode: protectedProcedure
    .input(z.object({ code: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Get user's account
      const [account] = await db
        .select()
        .from(loyaltyAccounts)
        .where(eq(loyaltyAccounts.userId, ctx.user.id))
        .limit(1);

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Loyalty account not found" });
      }

      // Check if already referred
      if (account.referredBy) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You have already used a referral code" });
      }

      // Find referrer by code
      const [referrer] = await db
        .select()
        .from(loyaltyAccounts)
        .where(eq(loyaltyAccounts.referralCode, input.code.toUpperCase()))
        .limit(1);

      if (!referrer) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid referral code" });
      }

      // Can't refer yourself
      if (referrer.userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot use your own referral code" });
      }

      // Update user's account with referrer
      await db
        .update(loyaltyAccounts)
        .set({
          referredBy: referrer.userId,
          pointsBalance: account.pointsBalance + REFERRAL_BONUS,
          lifetimePoints: account.lifetimePoints + REFERRAL_BONUS,
        })
        .where(eq(loyaltyAccounts.id, account.id));

      // Record transaction for referred user
      await db.insert(loyaltyTransactions).values({
        loyaltyAccountId: account.id,
        userId: ctx.user.id,
        type: "referral",
        points: REFERRAL_BONUS,
        description: "Referral bonus for using a friend's code",
      });

      // Award referrer
      await db
        .update(loyaltyAccounts)
        .set({
          pointsBalance: referrer.pointsBalance + REFERRAL_BONUS,
          lifetimePoints: referrer.lifetimePoints + REFERRAL_BONUS,
        })
        .where(eq(loyaltyAccounts.id, referrer.id));

      // Record transaction for referrer
      await db.insert(loyaltyTransactions).values({
        loyaltyAccountId: referrer.id,
        userId: referrer.userId,
        type: "referral",
        points: REFERRAL_BONUS,
        description: "Referral bonus for inviting a friend",
      });

      // Update tiers if needed
      const newUserTier = calculateTier(account.lifetimePoints + REFERRAL_BONUS);
      const newReferrerTier = calculateTier(referrer.lifetimePoints + REFERRAL_BONUS);

      if (newUserTier !== account.tier) {
        await db.update(loyaltyAccounts).set({ tier: newUserTier }).where(eq(loyaltyAccounts.id, account.id));
      }
      if (newReferrerTier !== referrer.tier) {
        await db.update(loyaltyAccounts).set({ tier: newReferrerTier }).where(eq(loyaltyAccounts.id, referrer.id));
      }

      return {
        success: true,
        pointsEarned: REFERRAL_BONUS,
        newBalance: account.pointsBalance + REFERRAL_BONUS,
      };
    }),

  // Award points for purchase (called after successful order)
  awardPurchasePoints: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        orderTotal: z.number(), // In cents
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Get or create loyalty account
      let [account] = await db
        .select()
        .from(loyaltyAccounts)
        .where(eq(loyaltyAccounts.userId, ctx.user.id))
        .limit(1);

      if (!account) {
        const referralCode = generateReferralCode();
        await db.insert(loyaltyAccounts).values({
          userId: ctx.user.id,
          pointsBalance: 0,
          lifetimePoints: 0,
          tier: "bronze",
          referralCode,
        });
        [account] = await db
          .select()
          .from(loyaltyAccounts)
          .where(eq(loyaltyAccounts.userId, ctx.user.id))
          .limit(1);
      }

      // Calculate points (with tier multiplier)
      const basePoints = Math.floor((input.orderTotal / 100) * POINTS_PER_DOLLAR);
      const multiplier = TIER_MULTIPLIERS[account.tier];
      const earnedPoints = Math.floor(basePoints * multiplier);

      // Update account
      const newLifetimePoints = account.lifetimePoints + earnedPoints;
      const newTier = calculateTier(newLifetimePoints);

      await db
        .update(loyaltyAccounts)
        .set({
          pointsBalance: account.pointsBalance + earnedPoints,
          lifetimePoints: newLifetimePoints,
          tier: newTier,
        })
        .where(eq(loyaltyAccounts.id, account.id));

      // Record transaction
      await db.insert(loyaltyTransactions).values({
        loyaltyAccountId: account.id,
        userId: ctx.user.id,
        type: "earn",
        points: earnedPoints,
        description: `Purchase reward (${multiplier}x multiplier)`,
        orderId: input.orderId,
      });

      const tierUpgraded = newTier !== account.tier;

      return {
        success: true,
        pointsEarned: earnedPoints,
        newBalance: account.pointsBalance + earnedPoints,
        tierUpgraded,
        newTier: tierUpgraded ? newTier : null,
      };
    }),

  // Get tier benefits info
  getTierBenefits: publicProcedure.query(() => {
    return {
      tiers: [
        {
          name: "Bronze",
          key: "bronze",
          threshold: TIER_THRESHOLDS.bronze,
          multiplier: TIER_MULTIPLIERS.bronze,
          benefits: ["1 point per $1 spent", "Access to member-only sales", "Birthday bonus points"],
        },
        {
          name: "Silver",
          key: "silver",
          threshold: TIER_THRESHOLDS.silver,
          multiplier: TIER_MULTIPLIERS.silver,
          benefits: [
            "1.25x points on all purchases",
            "Early access to new products",
            "Free shipping on orders $50+",
            "Exclusive Silver rewards",
          ],
        },
        {
          name: "Gold",
          key: "gold",
          threshold: TIER_THRESHOLDS.gold,
          multiplier: TIER_MULTIPLIERS.gold,
          benefits: [
            "1.5x points on all purchases",
            "Free shipping on all orders",
            "Priority customer support",
            "Exclusive Gold rewards",
            "Quarterly bonus points",
          ],
        },
        {
          name: "Platinum",
          key: "platinum",
          threshold: TIER_THRESHOLDS.platinum,
          multiplier: TIER_MULTIPLIERS.platinum,
          benefits: [
            "2x points on all purchases",
            "Free expedited shipping",
            "Dedicated account manager",
            "Exclusive Platinum rewards",
            "Monthly bonus points",
            "VIP access to limited editions",
          ],
        },
      ],
      pointsPerDollar: POINTS_PER_DOLLAR,
      referralBonus: REFERRAL_BONUS,
      signupBonus: SIGNUP_BONUS,
      reviewBonus: REVIEW_BONUS,
    };
  }),
});

// Helper function to calculate next tier info
function calculateNextTier(lifetimePoints: number) {
  if (lifetimePoints >= TIER_THRESHOLDS.platinum) {
    return { tier: null, pointsNeeded: 0, progress: 100 };
  }
  if (lifetimePoints >= TIER_THRESHOLDS.gold) {
    return {
      tier: "platinum",
      pointsNeeded: TIER_THRESHOLDS.platinum - lifetimePoints,
      progress: Math.floor(((lifetimePoints - TIER_THRESHOLDS.gold) / (TIER_THRESHOLDS.platinum - TIER_THRESHOLDS.gold)) * 100),
    };
  }
  if (lifetimePoints >= TIER_THRESHOLDS.silver) {
    return {
      tier: "gold",
      pointsNeeded: TIER_THRESHOLDS.gold - lifetimePoints,
      progress: Math.floor(((lifetimePoints - TIER_THRESHOLDS.silver) / (TIER_THRESHOLDS.gold - TIER_THRESHOLDS.silver)) * 100),
    };
  }
  return {
    tier: "silver",
    pointsNeeded: TIER_THRESHOLDS.silver - lifetimePoints,
    progress: Math.floor((lifetimePoints / TIER_THRESHOLDS.silver) * 100),
  };
}
