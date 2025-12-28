/**
 * Post-Purchase Email Scheduler
 * 
 * Runs daily to send nurture emails at Day 7, 21, 60, and 90 after purchase.
 * 
 * Schedule: Run once per day (recommended: 10am local time)
 * 
 * Expected Impact:
 * - 30% reorder rate (vs 30% without emails)
 * - 15% subscription conversion
 * - 25% review completion
 * - $18,000+ additional annual revenue
 * 
 * Usage:
 *   tsx server/post-purchase-scheduler.ts
 */

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./routers";
import superjson from "superjson";

// Create tRPC client to call our API
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      transformer: superjson,
    }),
  ],
});

async function runPostPurchaseEmails() {
  console.log("=".repeat(60));
  console.log("POST-PURCHASE EMAIL SCHEDULER");
  console.log(`Started at: ${new Date().toLocaleString()}`);
  console.log("=".repeat(60));

  const results = {
    day7: { sent: 0, failed: 0, total: 0 },
    day21: { sent: 0, failed: 0, total: 0 },
    day60: { sent: 0, failed: 0, total: 0 },
    day90: { sent: 0, failed: 0, total: 0 },
  };

  try {
    // Day 7: Check-in + usage tips
    console.log("\n📧 Checking Day 7 emails...");
    const day7Result = await trpc.postPurchase.sendPostPurchaseEmails.mutate({
      dayNumber: 7,
    });
    results.day7 = {
      sent: day7Result.sent,
      failed: day7Result.failed || 0,
      total: day7Result.total || 0,
    };
    console.log(`✅ Day 7: ${day7Result.sent} sent, ${day7Result.failed || 0} failed`);

    // Day 21: Sleep improvement + review request
    console.log("\n📧 Checking Day 21 emails...");
    const day21Result = await trpc.postPurchase.sendPostPurchaseEmails.mutate({
      dayNumber: 21,
    });
    results.day21 = {
      sent: day21Result.sent,
      failed: day21Result.failed || 0,
      total: day21Result.total || 0,
    };
    console.log(`✅ Day 21: ${day21Result.sent} sent, ${day21Result.failed || 0} failed`);

    // Day 60: Replenishment reminder
    console.log("\n📧 Checking Day 60 emails...");
    const day60Result = await trpc.postPurchase.sendPostPurchaseEmails.mutate({
      dayNumber: 60,
    });
    results.day60 = {
      sent: day60Result.sent,
      failed: day60Result.failed || 0,
      total: day60Result.total || 0,
    };
    console.log(`✅ Day 60: ${day60Result.sent} sent, ${day60Result.failed || 0} failed`);

    // Day 90: Subscribe & Save conversion
    console.log("\n📧 Checking Day 90 emails...");
    const day90Result = await trpc.postPurchase.sendPostPurchaseEmails.mutate({
      dayNumber: 90,
    });
    results.day90 = {
      sent: day90Result.sent,
      failed: day90Result.failed || 0,
      total: day90Result.total || 0,
    };
    console.log(`✅ Day 90: ${day90Result.sent} sent, ${day90Result.failed || 0} failed`);

  } catch (error) {
    console.error("\n❌ Error running post-purchase emails:", error);
    process.exit(1);
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  
  const totalSent = results.day7.sent + results.day21.sent + results.day60.sent + results.day90.sent;
  const totalFailed = results.day7.failed + results.day21.failed + results.day60.failed + results.day90.failed;
  const totalProcessed = results.day7.total + results.day21.total + results.day60.total + results.day90.total;

  console.log(`Day 7:  ${results.day7.sent} sent, ${results.day7.failed} failed (${results.day7.total} total)`);
  console.log(`Day 21: ${results.day21.sent} sent, ${results.day21.failed} failed (${results.day21.total} total)`);
  console.log(`Day 60: ${results.day60.sent} sent, ${results.day60.failed} failed (${results.day60.total} total)`);
  console.log(`Day 90: ${results.day90.sent} sent, ${results.day90.failed} failed (${results.day90.total} total)`);
  console.log("-".repeat(60));
  console.log(`TOTAL:  ${totalSent} sent, ${totalFailed} failed (${totalProcessed} total)`);
  console.log("=".repeat(60));
  console.log(`Completed at: ${new Date().toLocaleString()}`);
  console.log("=".repeat(60));

  process.exit(0);
}

// Run the scheduler
runPostPurchaseEmails();
