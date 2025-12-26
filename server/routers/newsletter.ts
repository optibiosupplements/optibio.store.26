import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { newsletterSubscribers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Generate a random discount code
 */
function generateDiscountCode(): string {
  const prefix = "WELCOME";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${random}`;
}

export const newsletterRouter = router({
  /**
   * Subscribe to newsletter and get 10% discount code
   */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
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

      // Check if email already exists
      const existing = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        // Return existing discount code
        return {
          success: true,
          discountCode: existing[0].discountCode,
          message: "You're already subscribed! Here's your discount code.",
        };
      }

      // Generate unique discount code
      let discountCode = generateDiscountCode();
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const codeExists = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.discountCode, discountCode))
          .limit(1);

        if (codeExists.length === 0) {
          break;
        }

        discountCode = generateDiscountCode();
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate unique discount code",
        });
      }

      // Insert new subscriber
      await db.insert(newsletterSubscribers).values({
        email: input.email,
        discountCode,
        discountPercent: 10,
      });

      return {
        success: true,
        discountCode,
        message: "Welcome! Check your email for your discount code.",
      };
    }),

  /**
   * Validate and mark discount code as used
   */
  validateCode: publicProcedure
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

      const subscriber = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.discountCode, input.code))
        .limit(1);

      if (subscriber.length === 0) {
        return {
          valid: false,
          message: "Invalid discount code",
        };
      }

      if (subscriber[0].isUsed) {
        return {
          valid: false,
          message: "This discount code has already been used",
        };
      }

      return {
        valid: true,
        discountPercent: subscriber[0].discountPercent,
        message: `${subscriber[0].discountPercent}% discount applied!`,
      };
    }),

  /**
   * Mark discount code as used
   */
  markCodeUsed: publicProcedure
    .input(
      z.object({
        code: z.string(),
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

      await db
        .update(newsletterSubscribers)
        .set({
          isUsed: true,
          usedAt: new Date(),
        })
        .where(eq(newsletterSubscribers.discountCode, input.code));

      return { success: true };
    }),
});
