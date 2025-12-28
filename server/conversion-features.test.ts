import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { newsletterSubscribers, referrals, referralCredits } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const mockUser = {
  id: 999,
  openId: "test-openid-999",
  name: "Test User",
  email: "test@example.com",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
  loginMethod: "oauth",
  founderTier: null,
  lifetimeDiscountPercent: null,
};

describe("Conversion Optimization Features", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  describe("Newsletter Subscription", () => {
    it("should subscribe a new email and generate discount code", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const testEmail = `test-${Date.now()}@example.com`;
      const result = await caller.newsletter.subscribe({ email: testEmail });

      expect(result.success).toBe(true);
      expect(result.discountCode).toBeDefined();
      expect(result.discountCode).toMatch(/^WELCOME[A-Z0-9]{6}$/);

      // Verify in database
      if (db) {
        const subscriber = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.email, testEmail))
          .limit(1);

        expect(subscriber.length).toBe(1);
        expect(subscriber[0].discountCode).toBe(result.discountCode);
        expect(subscriber[0].discountPercent).toBe(10);
        expect(subscriber[0].isUsed).toBe(false);
      }
    });

    it("should return existing discount code for duplicate email", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const testEmail = `duplicate-${Date.now()}@example.com`;
      
      // Subscribe first time
      const firstResult = await caller.newsletter.subscribe({ email: testEmail });
      
      // Subscribe second time with same email
      const secondResult = await caller.newsletter.subscribe({ email: testEmail });

      expect(secondResult.success).toBe(true);
      expect(secondResult.discountCode).toBe(firstResult.discountCode);
      expect(secondResult.message).toContain("already subscribed");
    });

    it("should validate discount code correctly", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const testEmail = `validate-${Date.now()}@example.com`;
      const { discountCode } = await caller.newsletter.subscribe({ email: testEmail });

      // Validate the code
      const validation = await caller.newsletter.validateCode({ code: discountCode });

      expect(validation.valid).toBe(true);
      expect(validation.discountPercent).toBe(10);
      expect(validation.message).toContain("10% discount applied");
    });

    it("should reject invalid discount code", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const validation = await caller.newsletter.validateCode({ code: "INVALID123" });

      expect(validation.valid).toBe(false);
      expect(validation.message).toContain("Invalid discount code");
    });

    it("should mark discount code as used", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const testEmail = `used-${Date.now()}@example.com`;
      const { discountCode } = await caller.newsletter.subscribe({ email: testEmail });

      // Mark as used
      await caller.newsletter.markCodeUsed({ code: discountCode });

      // Verify in database
      if (db) {
        const subscriber = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.discountCode, discountCode))
          .limit(1);

        expect(subscriber[0].isUsed).toBe(true);
        expect(subscriber[0].usedAt).toBeDefined();
      }

      // Validate should now fail
      const validation = await caller.newsletter.validateCode({ code: discountCode });
      expect(validation.valid).toBe(false);
      expect(validation.message).toContain("already been used");
    });
  });

  describe("Referral Program", () => {

    it("should generate referral code for user", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: mockUser,
      });

      const result = await caller.referral.getMyReferralCode();

      expect(result.referralCode).toBeDefined();
      expect(result.referralCode).toMatch(/^[A-Z]{4}[A-Z0-9]{4}$/);
      expect(result.referralUrl).toContain(result.referralCode);

      // Verify in database
      if (db) {
        const referral = await db
          .select()
          .from(referrals)
          .where(eq(referrals.referralCode, result.referralCode))
          .limit(1);

        expect(referral.length).toBe(1);
        expect(referral[0].referrerId).toBe(mockUser.id);
        expect(referral[0].status).toBe("pending");
      }
    });

    it("should return same referral code on subsequent calls", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { ...mockUser, id: 998 },
      });

      const firstCall = await caller.referral.getMyReferralCode();
      const secondCall = await caller.referral.getMyReferralCode();

      expect(secondCall.referralCode).toBe(firstCall.referralCode);
    });

    it("should validate referral code", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { ...mockUser, id: 997 },
      });

      const { referralCode } = await caller.referral.getMyReferralCode();

      // Validate as public user
      const publicCaller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const validation = await publicCaller.referral.validateReferralCode({ code: referralCode });

      expect(validation.valid).toBe(true);
      // referrerName may be "A friend" if user not found in DB during test
      expect(validation.referrerName).toBeDefined();
      expect(validation.creditAmount).toBe(1000); // $10
      expect(validation.message).toContain("$10.00 credit");
    });

    it("should track referral stats correctly", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { ...mockUser, id: 996 },
      });

      // Generate referral code
      await caller.referral.getMyReferralCode();

      // Get stats
      const stats = await caller.referral.getMyReferralStats();

      // Stats may return strings from SQL aggregation
      expect(Number(stats.totalReferrals)).toBeGreaterThanOrEqual(1);
      expect(Number(stats.pendingReferrals)).toBeGreaterThanOrEqual(1);
      expect(Number(stats.completedReferrals)).toBeGreaterThanOrEqual(0);
      expect(Number(stats.totalEarned)).toBeGreaterThanOrEqual(0);
      expect(Number(stats.availableCredits)).toBeGreaterThanOrEqual(0);
    });

    it("should complete referral and create credit", async () => {
      const referrerUser = { ...mockUser, id: 995 };
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: referrerUser,
      });

      // Generate referral code
      const { referralCode } = await caller.referral.getMyReferralCode();

      // Complete referral (as if referred user made purchase)
      const publicCaller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const result = await publicCaller.referral.completeReferral({
        referralCode,
        userId: 1001,
        orderValue: 5000, // $50
      });

      expect(result.success).toBe(true);
      expect(result.creditAmount).toBe(1000); // $10

      // Verify referral status updated
      if (db) {
        const referral = await db
          .select()
          .from(referrals)
          .where(eq(referrals.referralCode, referralCode))
          .limit(1);

        expect(referral[0].status).toBe("credited");
        expect(referral[0].referredUserId).toBe(1001);
        expect(referral[0].orderValue).toBe(5000);
        expect(referral[0].completedAt).toBeDefined();
        expect(referral[0].creditedAt).toBeDefined();

        // Verify credit created
        const credits = await db
          .select()
          .from(referralCredits)
          .where(eq(referralCredits.userId, referrerUser.id));

        expect(credits.length).toBeGreaterThan(0);
        const latestCredit = credits[credits.length - 1];
        expect(latestCredit.amount).toBe(1000);
        expect(latestCredit.source).toBe("referral");
        expect(latestCredit.isUsed).toBe(false);
      }
    });

    it("should get referral history", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { ...mockUser, id: 994 },
      });

      // Generate referral code
      await caller.referral.getMyReferralCode();

      // Get history
      const history = await caller.referral.getMyReferrals();

      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThanOrEqual(1);
      expect(history[0]).toHaveProperty("referralCode");
      expect(history[0]).toHaveProperty("status");
      expect(history[0]).toHaveProperty("createdAt");
    });

    it("should get available credits", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { ...mockUser, id: 993 },
      });

      const credits = await caller.referral.getMyCredits();

      expect(Array.isArray(credits)).toBe(true);
      // Credits array may be empty if no referrals completed yet
      if (credits.length > 0) {
        expect(credits[0]).toHaveProperty("amount");
        expect(credits[0]).toHaveProperty("source");
        expect(credits[0].isUsed).toBe(false);
      }
    });
  });

  describe("Integration Tests", () => {
    it("should handle newsletter subscription workflow end-to-end", async () => {
      const caller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const email = `integration-${Date.now()}@example.com`;

      // 1. Subscribe
      const subscription = await caller.newsletter.subscribe({ email });
      expect(subscription.success).toBe(true);

      // 2. Validate code
      const validation = await caller.newsletter.validateCode({ 
        code: subscription.discountCode 
      });
      expect(validation.valid).toBe(true);

      // 3. Mark as used
      await caller.newsletter.markCodeUsed({ code: subscription.discountCode });

      // 4. Verify can't be used again
      const secondValidation = await caller.newsletter.validateCode({ 
        code: subscription.discountCode 
      });
      expect(secondValidation.valid).toBe(false);
    });

    it("should handle referral workflow end-to-end", async () => {
      const referrerUser = { ...mockUser, id: 992, name: "Referrer User" };
      const referrerCaller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: referrerUser,
      });

      // 1. Get referral code
      const { referralCode } = await referrerCaller.referral.getMyReferralCode();
      expect(referralCode).toBeDefined();

      // 2. Validate code (as new user)
      const publicCaller = appRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });
      const validation = await publicCaller.referral.validateReferralCode({ 
        code: referralCode 
      });
      expect(validation.valid).toBe(true);

      // 3. Complete referral (new user makes purchase)
      const completion = await publicCaller.referral.completeReferral({
        referralCode,
        userId: 1002,
        orderValue: 6900,
      });
      expect(completion.success).toBe(true);

      // 4. Check referrer's stats
      const stats = await referrerCaller.referral.getMyReferralStats();
      expect(Number(stats.completedReferrals)).toBeGreaterThan(0);
      expect(Number(stats.availableCredits)).toBeGreaterThan(0);

      // 5. Check referrer's credits
      const credits = await referrerCaller.referral.getMyCredits();
      expect(credits.length).toBeGreaterThan(0);
      expect(credits.some(c => c.amount === 1000)).toBe(true);
    });
  });
});
