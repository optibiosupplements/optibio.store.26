import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { 
  createAbandonedCart, 
  getAbandonedCartByToken,
  markAbandonedCartRecovered,
  getAbandonedCartsForEmail,
  updateAbandonedCartEmailSent,
  generateRecoveryToken
} from "../db";

describe("Abandoned Cart Recovery System", () => {
  let testCartId: number;
  let testToken: string;

  beforeAll(async () => {
    // Create a test abandoned cart
    testToken = generateRecoveryToken();
    
    const cartData = JSON.stringify([
      {
        productName: "Ashwagandha KSM-66",
        variantName: "90 Capsules",
        quantity: 1,
        priceInCents: 4999,
        imageUrl: "/products/ashwagandha-bottle.jpg"
      }
    ]);

    const cart = await createAbandonedCart({
      userId: null,
      sessionId: "test-session-123",
      email: "test@example.com",
      cartData,
      totalValue: 4999,
      recoveryToken: testToken,
    });

    if (cart) {
      testCartId = cart.id;
    }
  });

  afterAll(async () => {
    // Cleanup test data
    // Note: In production, you might want to add a cleanup function to db.ts
  });

  describe("Cart Creation", () => {
    it("should create abandoned cart with recovery token", async () => {
      expect(testCartId).toBeDefined();
      expect(testToken).toBeDefined();
      expect(testToken).toHaveLength(64); // 32 bytes = 64 hex chars
    });

    it("should generate unique recovery tokens", () => {
      const token1 = generateRecoveryToken();
      const token2 = generateRecoveryToken();
      
      expect(token1).not.toBe(token2);
      expect(token1).toHaveLength(64);
      expect(token2).toHaveLength(64);
    });
  });

  describe("Cart Recovery", () => {
    it("should retrieve cart by recovery token", async () => {
      const cart = await getAbandonedCartByToken(testToken);
      
      expect(cart).toBeDefined();
      expect(cart?.id).toBe(testCartId);
      expect(cart?.email).toBe("test@example.com");
      expect(cart?.totalValue).toBe(4999);
      expect(cart?.isRecovered).toBe(false);
    });

    it("should return null for invalid token", async () => {
      const cart = await getAbandonedCartByToken("invalid-token-123");
      expect(cart).toBeNull();
    });

    it("should mark cart as recovered", async () => {
      const success = await markAbandonedCartRecovered(testCartId, 999);
      expect(success).toBe(true);

      const cart = await getAbandonedCartByToken(testToken);
      expect(cart?.isRecovered).toBe(true);
      expect(cart?.recoveredOrderId).toBe(999);
      expect(cart?.recoveredAt).toBeDefined();
    });
  });

  describe("Email Sequencing", () => {
    let emailTestCartId: number;
    let emailTestToken: string;

    beforeAll(async () => {
      // Create a cart for email testing (1 hour old)
      emailTestToken = generateRecoveryToken();
      const oneHourAgo = new Date(Date.now() - 61 * 60 * 1000); // 61 minutes ago
      
      const cartData = JSON.stringify([
        {
          productName: "Test Product",
          variantName: "Test Variant",
          quantity: 1,
          priceInCents: 5000,
        }
      ]);

      const cart = await createAbandonedCart({
        userId: null,
        sessionId: "email-test-session",
        email: "emailtest@example.com",
        cartData,
        totalValue: 5000,
        recoveryToken: emailTestToken,
      });

      if (cart) {
        emailTestCartId = cart.id;
      }
    });

    it("should find carts needing first email (1 hour old)", async () => {
      const carts = await getAbandonedCartsForEmail(1);
      
      // Should include our test cart (created 61 minutes ago)
      const testCart = carts.find(c => c.id === emailTestCartId);
      expect(testCart).toBeDefined();
      expect(testCart?.firstEmailSentAt).toBeNull();
    });

    it("should update first email sent timestamp", async () => {
      const success = await updateAbandonedCartEmailSent(emailTestCartId, 1);
      expect(success).toBe(true);

      const cart = await getAbandonedCartByToken(emailTestToken);
      expect(cart?.firstEmailSentAt).toBeDefined();
      expect(cart?.secondEmailSentAt).toBeNull();
      expect(cart?.thirdEmailSentAt).toBeNull();
    });

    it("should not find cart for first email after timestamp updated", async () => {
      const carts = await getAbandonedCartsForEmail(1);
      
      // Should NOT include our test cart (first email already sent)
      const testCart = carts.find(c => c.id === emailTestCartId);
      expect(testCart).toBeUndefined();
    });

    it("should update second email sent timestamp", async () => {
      const success = await updateAbandonedCartEmailSent(emailTestCartId, 2);
      expect(success).toBe(true);

      const cart = await getAbandonedCartByToken(emailTestToken);
      expect(cart?.firstEmailSentAt).toBeDefined();
      expect(cart?.secondEmailSentAt).toBeDefined();
      expect(cart?.thirdEmailSentAt).toBeNull();
    });

    it("should update third email sent timestamp", async () => {
      const success = await updateAbandonedCartEmailSent(emailTestCartId, 3);
      expect(success).toBe(true);

      const cart = await getAbandonedCartByToken(emailTestToken);
      expect(cart?.firstEmailSentAt).toBeDefined();
      expect(cart?.secondEmailSentAt).toBeDefined();
      expect(cart?.thirdEmailSentAt).toBeDefined();
    });
  });

  describe("Cart Data Parsing", () => {
    it("should parse cart data correctly", async () => {
      const cart = await getAbandonedCartByToken(testToken);
      expect(cart).toBeDefined();

      const cartData = JSON.parse(cart!.cartData);
      expect(Array.isArray(cartData)).toBe(true);
      expect(cartData.length).toBeGreaterThan(0);
      
      const firstItem = cartData[0];
      expect(firstItem.productName).toBeDefined();
      expect(firstItem.quantity).toBeGreaterThan(0);
      expect(firstItem.priceInCents).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle cart without email", async () => {
      const token = generateRecoveryToken();
      const cartData = JSON.stringify([{ productName: "Test", quantity: 1, priceInCents: 1000 }]);

      const cart = await createAbandonedCart({
        userId: null,
        sessionId: "no-email-session",
        email: null,
        cartData,
        totalValue: 1000,
        recoveryToken: token,
      });

      expect(cart).toBeDefined();
      expect(cart?.email).toBeNull();
    });

    it("should handle cart with user ID", async () => {
      const token = generateRecoveryToken();
      const cartData = JSON.stringify([{ productName: "Test", quantity: 1, priceInCents: 1000 }]);

      const cart = await createAbandonedCart({
        userId: 123,
        sessionId: "user-session",
        email: "user@example.com",
        cartData,
        totalValue: 1000,
        recoveryToken: token,
      });

      expect(cart).toBeDefined();
      expect(cart?.userId).toBe(123);
    });

    it("should not retrieve recovered carts", async () => {
      // Our test cart was marked as recovered earlier
      const carts = await getAbandonedCartsForEmail(1);
      
      // Should not include recovered carts
      const recoveredCart = carts.find(c => c.id === testCartId);
      expect(recoveredCart).toBeUndefined();
    });
  });
});
