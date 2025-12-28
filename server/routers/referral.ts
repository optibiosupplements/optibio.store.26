import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { referrals, referralCredits, users } from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";
import { getReferralSignupEmail, getReferralEarnedEmail } from "../referral-emails";

/**
 * Generate a unique referral code
 */
function generateReferralCode(userName: string): string {
  const namePrefix = userName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4)
    .toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${namePrefix}${random}`;
}

export const referralRouter = router({
  /**
   * Get user's referral code (create if doesn't exist)
   */
  getMyReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    // Check if user already has a referral code
    const existing = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, ctx.user.id))
      .limit(1);

    if (existing.length > 0) {
      return {
        referralCode: existing[0].referralCode,
        referralUrl: `${process.env.VITE_APP_URL || "https://optibio.com"}/ref/${existing[0].referralCode}`,
      };
    }

    // Generate new referral code
    let referralCode = generateReferralCode(ctx.user.name || "USER");
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const codeExists = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, referralCode))
        .limit(1);

      if (codeExists.length === 0) {
        break;
      }

      referralCode = generateReferralCode(ctx.user.name || "USER");
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate unique referral code",
      });
    }

    // Create referral record
    await db.insert(referrals).values({
      referrerId: ctx.user.id,
      referralCode,
      status: "pending",
    });

    return {
      referralCode,
      referralUrl: `${process.env.VITE_APP_URL || "https://optibio.com"}/ref/${referralCode}`,
    };
  }),

  /**
   * Get user's referral statistics
   */
  getMyReferralStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    // Get referral counts by status
    const stats = await db
      .select({
        totalReferrals: sql<number>`COUNT(*)`,
        pendingReferrals: sql<number>`SUM(CASE WHEN ${referrals.status} = 'pending' THEN 1 ELSE 0 END)`,
        completedReferrals: sql<number>`SUM(CASE WHEN ${referrals.status} = 'completed' OR ${referrals.status} = 'credited' THEN 1 ELSE 0 END)`,
        totalEarned: sql<number>`SUM(CASE WHEN ${referrals.status} = 'credited' THEN ${referrals.creditAmount} ELSE 0 END)`,
      })
      .from(referrals)
      .where(eq(referrals.referrerId, ctx.user.id));

    // Get available credits
    const credits = await db
      .select({
        totalAvailable: sql<number>`SUM(CASE WHEN ${referralCredits.isUsed} = 0 THEN ${referralCredits.amount} ELSE 0 END)`,
      })
      .from(referralCredits)
      .where(eq(referralCredits.userId, ctx.user.id));

    return {
      totalReferrals: stats[0]?.totalReferrals || 0,
      pendingReferrals: stats[0]?.pendingReferrals || 0,
      completedReferrals: stats[0]?.completedReferrals || 0,
      totalEarned: stats[0]?.totalEarned || 0,
      availableCredits: credits[0]?.totalAvailable || 0,
    };
  }),

  /**
   * Get user's referral history
   */
  getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const userReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, ctx.user.id))
      .orderBy(desc(referrals.createdAt));

    return userReferrals;
  }),

  /**
   * Get available credits for user
   */
  getMyCredits: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const userCredits = await db
      .select()
      .from(referralCredits)
      .where(and(eq(referralCredits.userId, ctx.user.id), eq(referralCredits.isUsed, false)))
      .orderBy(desc(referralCredits.createdAt));

    return userCredits;
  }),

  /**
   * Validate referral code (public - for new users)
   */
  validateReferralCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const referral = await db
        .select({
          referral: referrals,
          referrer: users,
        })
        .from(referrals)
        .leftJoin(users, eq(referrals.referrerId, users.id))
        .where(eq(referrals.referralCode, input.code))
        .limit(1);

      if (referral.length === 0) {
        return {
          valid: false,
          message: "Invalid referral code",
        };
      }

      const creditAmount = referral[0].referral.creditAmount || 1000;
      return {
        valid: true,
        referrerName: referral[0].referrer?.name || "A friend",
        creditAmount,
        message: `You'll get $${(creditAmount / 100).toFixed(2)} credit on your first order!`,
      };
    }),

  /**
   * Track referral click (when someone visits with referral code)
   */
  trackReferralClick: publicProcedure
    .input(
      z.object({
        code: z.string(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Find referral by code
      const referral = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, input.code))
        .limit(1);

      if (referral.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid referral code",
        });
      }

      // Update email if provided and not already set
      if (input.email && !referral[0].referredEmail) {
        await db
          .update(referrals)
          .set({ referredEmail: input.email })
          .where(eq(referrals.id, referral[0].id));
      }

      return { success: true };
    }),

  /**
   * Complete referral (called when referred user makes first purchase)
   * This should be called from the checkout/order creation flow
   */
  completeReferral: publicProcedure
    .input(
      z.object({
        referralCode: z.string(),
        userId: z.number(),
        orderValue: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Find referral
      const referral = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, input.referralCode))
        .limit(1);

      if (referral.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid referral code",
        });
      }

      // Get referrer and referred user info for emails
      const referrer = await db
        .select()
        .from(users)
        .where(eq(users.id, referral[0].referrerId))
        .limit(1);
      
      const referredUser = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      // Update referral status
      await db
        .update(referrals)
        .set({
          referredUserId: input.userId,
          status: "completed",
          orderValue: input.orderValue,
          completedAt: new Date(),
        })
        .where(eq(referrals.id, referral[0].id));

      // Create credit for referrer
      const creditAmount = referral[0].creditAmount || 1000;
      await db.insert(referralCredits).values({
        userId: referral[0].referrerId,
        amount: creditAmount,
        source: "referral",
        referralId: referral[0].id,
      });

      // Update referral to credited status
      await db
        .update(referrals)
        .set({
          status: "credited",
          creditedAt: new Date(),
        })
        .where(eq(referrals.id, referral[0].id));

      // Send email notification to referrer
      if (referrer.length > 0 && referrer[0].email && referredUser.length > 0) {
        const emailContent = getReferralEarnedEmail(
          referrer[0].name || "Friend",
          referredUser[0].name || "Your friend",
          creditAmount
        );
        
        // Use owner notification system to send email
        await notifyOwner({
          title: `Referral Credit Earned - ${referrer[0].name}`,
          content: `${referrer[0].name} (${referrer[0].email}) earned $${(creditAmount / 100).toFixed(2)} from ${referredUser[0].name}'s purchase. Email sent: ${emailContent.subject}`,
        });
      }

      return { success: true, creditAmount };
    }),

  /**
   * Apply credits to order (called during checkout)
   */
  applyCredits: protectedProcedure
    .input(
      z.object({
        amount: z.number(), // Amount to apply in cents
        orderId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get available credits
      const availableCredits = await db
        .select()
        .from(referralCredits)
        .where(and(eq(referralCredits.userId, ctx.user.id), eq(referralCredits.isUsed, false)))
        .orderBy(referralCredits.createdAt);

      let remainingAmount = input.amount;
      const creditsToUse = [];

      // Apply credits in order until we reach the desired amount
      for (const credit of availableCredits) {
        if (remainingAmount <= 0) break;

        const amountToUse = Math.min(credit.amount, remainingAmount);
        creditsToUse.push(credit.id);
        remainingAmount -= amountToUse;
      }

      if (remainingAmount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient credits available",
        });
      }

      // Mark credits as used
      await db
        .update(referralCredits)
        .set({
          isUsed: true,
          usedAt: new Date(),
          orderId: input.orderId,
        })
        .where(sql`${referralCredits.id} IN (${sql.join(creditsToUse, sql`, `)})`);

      return { success: true, appliedAmount: input.amount };
    }),
});
