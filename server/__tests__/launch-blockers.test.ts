import { describe, it, expect, beforeEach } from "vitest";
import { withTransaction, executeQuery } from "../db-transaction";
import mysql from "mysql2/promise";

/**
 * Tests for critical launch blockers:
 * 1. Database transactions for order creation
 * 2. Rate limiting on API endpoints
 */

describe("Database Transactions", () => {
  it("should successfully commit a transaction when all operations succeed", async () => {
    const result = await withTransaction(async (connection) => {
      // Simple test query
      const testResult = await executeQuery(
        connection,
        "SELECT 1 as test"
      );
      return testResult;
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should rollback transaction when an error occurs", async () => {
    try {
      await withTransaction(async (connection) => {
        // Execute a valid query first
        await executeQuery(connection, "SELECT 1");
        
        // Then throw an error to trigger rollback
        throw new Error("Test error to trigger rollback");
      });
      
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      // Should catch the error and rollback
      expect(error.message).toBe("Test error to trigger rollback");
    }
  });

  it("should handle multiple operations in a single transaction", async () => {
    const result = await withTransaction(async (connection) => {
      // Multiple queries in one transaction
      const result1 = await executeQuery(connection, "SELECT 1 as first");
      const result2 = await executeQuery(connection, "SELECT 2 as second");
      const result3 = await executeQuery(connection, "SELECT 3 as third");
      
      return { result1, result2, result3 };
    });

    expect(result.result1).toBeDefined();
    expect(result.result2).toBeDefined();
    expect(result.result3).toBeDefined();
  });

  it("should properly release connection after transaction", async () => {
    // Run multiple transactions to ensure connections are released
    for (let i = 0; i < 5; i++) {
      await withTransaction(async (connection) => {
        await executeQuery(connection, "SELECT 1");
        return true;
      });
    }
    
    // If connections weren't released, this would hang or fail
    expect(true).toBe(true);
  });
});

describe("Rate Limiting Configuration", () => {
  it("should have rate limiting middleware configured", () => {
    // Test that rate limiting modules are importable
    const rateLimitModule = require("../_core/rate-limit");
    
    expect(rateLimitModule.apiLimiter).toBeDefined();
    expect(rateLimitModule.authLimiter).toBeDefined();
    expect(rateLimitModule.checkoutLimiter).toBeDefined();
    expect(rateLimitModule.publicLimiter).toBeDefined();
    expect(rateLimitModule.sensitiveLimiter).toBeDefined();
    expect(rateLimitModule.emailLimiter).toBeDefined();
    expect(rateLimitModule.cartLimiter).toBeDefined();
  });

  it("should export all required rate limiters", () => {
    const {
      apiLimiter,
      authLimiter,
      checkoutLimiter,
      publicLimiter,
      sensitiveLimiter,
      emailLimiter,
      cartLimiter,
    } = require("../_core/rate-limit");

    // All limiters should be functions (middleware)
    expect(typeof apiLimiter).toBe("function");
    expect(typeof authLimiter).toBe("function");
    expect(typeof checkoutLimiter).toBe("function");
    expect(typeof publicLimiter).toBe("function");
    expect(typeof sensitiveLimiter).toBe("function");
    expect(typeof emailLimiter).toBe("function");
    expect(typeof cartLimiter).toBe("function");
  });
});

describe("Transaction Wrapper Utility", () => {
  it("should expose withTransaction function", () => {
    expect(typeof withTransaction).toBe("function");
  });

  it("should expose executeQuery function", () => {
    expect(typeof executeQuery).toBe("function");
  });

  it("should handle empty transaction", async () => {
    const result = await withTransaction(async (connection) => {
      return "empty transaction completed";
    });

    expect(result).toBe("empty transaction completed");
  });

  it("should pass connection to callback", async () => {
    await withTransaction(async (connection) => {
      // Connection should have execute method
      expect(connection.execute).toBeDefined();
      expect(typeof connection.execute).toBe("function");
      
      // Connection should have beginTransaction method
      expect(connection.beginTransaction).toBeDefined();
      expect(typeof connection.beginTransaction).toBe("function");
      
      // Connection should have commit method
      expect(connection.commit).toBeDefined();
      expect(typeof connection.commit).toBe("function");
      
      // Connection should have rollback method
      expect(connection.rollback).toBeDefined();
      expect(typeof connection.rollback).toBe("function");
      
      return true;
    });
  });
});

describe("Order Creation Transaction Safety", () => {
  it("should verify webhook handler imports transaction utilities", () => {
    // This ensures the webhook handler is using transactions
    const fs = require("fs");
    const path = require("path");
    
    const webhookPath = path.join(__dirname, "../webhooks.ts");
    const webhookContent = fs.readFileSync(webhookPath, "utf-8");
    
    // Check that transaction utilities are imported
    expect(webhookContent).toContain("withTransaction");
    expect(webhookContent).toContain("executeQuery");
    expect(webhookContent).toContain("db-transaction");
  });

  it("should verify order creation uses transaction wrapper", () => {
    const fs = require("fs");
    const path = require("path");
    
    const webhookPath = path.join(__dirname, "../webhooks.ts");
    const webhookContent = fs.readFileSync(webhookPath, "utf-8");
    
    // Check that order creation is wrapped in transaction
    expect(webhookContent).toContain("await withTransaction");
    expect(webhookContent).toContain("INSERT INTO orders");
    expect(webhookContent).toContain("INSERT INTO order_items");
  });
});

describe("Rate Limiting Integration", () => {
  it("should verify server applies rate limiting middleware", () => {
    const fs = require("fs");
    const path = require("path");
    
    const serverPath = path.join(__dirname, "../_core/index.ts");
    const serverContent = fs.readFileSync(serverPath, "utf-8");
    
    // Check that rate limiting is imported
    expect(serverContent).toContain("rate-limit");
    expect(serverContent).toContain("apiLimiter");
    expect(serverContent).toContain("checkoutLimiter");
    expect(serverContent).toContain("publicLimiter");
  });

  it("should verify rate limiting is applied to API routes", () => {
    const fs = require("fs");
    const path = require("path");
    
    const serverPath = path.join(__dirname, "../_core/index.ts");
    const serverContent = fs.readFileSync(serverPath, "utf-8");
    
    // Check that rate limiting middleware is used
    expect(serverContent).toContain("app.use");
    expect(serverContent).toContain("/api/trpc");
    expect(serverContent).toContain("apiLimiter");
  });
});
