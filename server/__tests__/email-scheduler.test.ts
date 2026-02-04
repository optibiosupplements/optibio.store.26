import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getSchedulerStatus,
  triggerAbandonedCartEmails,
  triggerPostPurchaseEmails,
} from "../email-scheduler";

// Mock the database functions
vi.mock("../db", () => ({
  getAbandonedCartsForEmail: vi.fn().mockResolvedValue([]),
  updateAbandonedCartEmailSent: vi.fn().mockResolvedValue(true),
  getOrdersNeedingPostPurchaseEmail: vi.fn().mockResolvedValue([]),
  updatePostPurchaseEmailSent: vi.fn().mockResolvedValue(true),
}));

// Mock the notification function
vi.mock("../_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the email templates
vi.mock("../abandoned-cart-emails", () => ({
  getFirstAbandonedCartEmail: vi.fn().mockReturnValue("<html>Email 1</html>"),
  getSecondAbandonedCartEmail: vi.fn().mockReturnValue("<html>Email 2</html>"),
  getThirdAbandonedCartEmail: vi.fn().mockReturnValue("<html>Email 3</html>"),
}));

vi.mock("../post-purchase-emails", () => ({
  getDay7Email: vi.fn().mockReturnValue("<html>Day 7</html>"),
  getDay21Email: vi.fn().mockReturnValue("<html>Day 21</html>"),
  getDay60Email: vi.fn().mockReturnValue("<html>Day 60</html>"),
  getDay90Email: vi.fn().mockReturnValue("<html>Day 90</html>"),
}));

describe("Email Scheduler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getSchedulerStatus", () => {
    it("should return scheduler status object", () => {
      const status = getSchedulerStatus();
      
      expect(status).toHaveProperty("isRunning");
      expect(status).toHaveProperty("lastRunTime");
      expect(status).toHaveProperty("stats");
      expect(status.stats).toHaveProperty("abandonedCart");
      expect(status.stats).toHaveProperty("postPurchase");
    });

    it("should have correct stats structure", () => {
      const status = getSchedulerStatus();
      
      expect(status.stats.abandonedCart).toHaveProperty("sent");
      expect(status.stats.abandonedCart).toHaveProperty("failed");
      expect(status.stats.abandonedCart).toHaveProperty("lastRun");
      
      expect(status.stats.postPurchase).toHaveProperty("sent");
      expect(status.stats.postPurchase).toHaveProperty("failed");
      expect(status.stats.postPurchase).toHaveProperty("lastRun");
    });
  });

  describe("triggerAbandonedCartEmails", () => {
    it("should return result object with sent and failed counts", async () => {
      const result = await triggerAbandonedCartEmails();
      
      expect(result).toHaveProperty("sent");
      expect(result).toHaveProperty("failed");
      expect(typeof result.sent).toBe("number");
      expect(typeof result.failed).toBe("number");
    });

    it("should accept specific email number parameter", async () => {
      const result = await triggerAbandonedCartEmails(1);
      
      expect(result).toHaveProperty("sent");
      expect(result).toHaveProperty("failed");
    });

    it("should process all sequences when no parameter provided", async () => {
      const result = await triggerAbandonedCartEmails();
      
      // With empty mock data, should return 0 sent
      expect(result.sent).toBe(0);
    });
  });

  describe("triggerPostPurchaseEmails", () => {
    it("should return result object with sent and failed counts", async () => {
      const result = await triggerPostPurchaseEmails();
      
      expect(result).toHaveProperty("sent");
      expect(result).toHaveProperty("failed");
      expect(typeof result.sent).toBe("number");
      expect(typeof result.failed).toBe("number");
    });

    it("should accept specific day number parameter", async () => {
      const result = await triggerPostPurchaseEmails(7);
      
      expect(result).toHaveProperty("sent");
      expect(result).toHaveProperty("failed");
    });

    it("should process all sequences when no parameter provided", async () => {
      const result = await triggerPostPurchaseEmails();
      
      // With empty mock data, should return 0 sent
      expect(result.sent).toBe(0);
    });
  });
});

describe("Email Scheduler Admin Router", () => {
  // These tests verify the router structure exists
  // Full integration tests would require database setup
  
  it("should export scheduler functions", async () => {
    const scheduler = await import("../email-scheduler");
    
    expect(typeof scheduler.getSchedulerStatus).toBe("function");
    expect(typeof scheduler.triggerAbandonedCartEmails).toBe("function");
    expect(typeof scheduler.triggerPostPurchaseEmails).toBe("function");
    expect(typeof scheduler.startEmailScheduler).toBe("function");
    expect(typeof scheduler.stopEmailScheduler).toBe("function");
  });
});
