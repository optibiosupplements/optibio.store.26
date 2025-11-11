import { eq, desc, and } from "drizzle-orm";
import { getDb } from "./db";
import { 
  waitlist, 
  presaleReservations, 
  presaleCampaign,
  type InsertWaitlistEntry,
  type InsertPresaleReservation
} from "../drizzle/schema";

/**
 * Add someone to the waitlist
 */
export async function addToWaitlist(data: InsertWaitlistEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already on waitlist
  const existing = await db.select().from(waitlist).where(eq(waitlist.email, data.email)).limit(1);
  if (existing.length > 0) {
    return existing[0];
  }

  const [result] = await db.insert(waitlist).values(data);
  return result;
}

/**
 * Get waitlist count
 */
export async function getWaitlistCount() {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select().from(waitlist);
  return result.length;
}

/**
 * Create a presale reservation
 */
export async function createReservation(data: { email: string; name: string; tier: "founders" | "early_adopter" | "pre_launch"; price: string; referredBy?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get current position (total reservations + 1)
  const allReservations = await db.select().from(presaleReservations);
  const position = allReservations.length + 1;

  // Generate unique referral code
  const referralCode = generateReferralCode(data.email);

  // Determine lifetime discount based on tier
  let lifetimeDiscount = 10;
  let founderBadge = false;
  let earlyAccess = false;

  if (data.tier === "founders") {
    lifetimeDiscount = 25;
    founderBadge = true;
    earlyAccess = true;
  } else if (data.tier === "early_adopter") {
    lifetimeDiscount = 15;
    earlyAccess = true;
  }

  const reservation: InsertPresaleReservation = {
    ...data,
    position,
    referralCode,
    lifetimeDiscount,
    founderBadge,
    earlyAccess,
  };

  const [result] = await db.insert(presaleReservations).values(reservation);

  // Update campaign stats
  await updateCampaignStats();

  // Update tier remaining counts
  if (data.tier === "founders") {
    await decrementFoundersRemaining();
  } else if (data.tier === "early_adopter") {
    await decrementEarlyAdopterRemaining();
  }

  return result;
}

/**
 * Generate a unique referral code from email
 */
function generateReferralCode(email: string): string {
  const hash = email.split("").reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const code = Math.abs(hash).toString(36).toUpperCase().substring(0, 8);
  return `OB${code}`;
}

/**
 * Get reservation by referral code
 */
export async function getReservationByReferralCode(code: string) {
  const db = await getDb();
  if (!db) return null;

  const [result] = await db.select().from(presaleReservations).where(eq(presaleReservations.referralCode, code)).limit(1);
  return result || null;
}

/**
 * Track a referral (when someone uses a referral code)
 */
export async function trackReferral(referralCode: string, newReservationId: number) {
  const db = await getDb();
  if (!db) return;

  // Find the referrer
  const referrer = await getReservationByReferralCode(referralCode);
  if (!referrer) return;

  // Increment their referral count and credits
  await db.update(presaleReservations)
    .set({
      referralCount: (referrer.referralCount || 0) + 1,
      referralCredits: ((parseFloat(referrer.referralCredits?.toString() || "0") + 10)).toFixed(2)
    })
    .where(eq(presaleReservations.id, referrer.id));
}

/**
 * Get campaign settings
 */
export async function getCampaign() {
  const db = await getDb();
  if (!db) return null;

  const [campaign] = await db.select().from(presaleCampaign).limit(1);
  return campaign || null;
}

/**
 * Initialize campaign if it doesn't exist
 */
export async function initializeCampaign() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getCampaign();
  if (existing) return existing;

  const launchDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 90); // 90 days from now

  const productShipDate = new Date();
  productShipDate.setDate(productShipDate.getDate() + 90);

  const [campaign] = await db.insert(presaleCampaign).values({
    launchDate,
    endDate,
    productShipDate,
  });

  return campaign;
}

/**
 * Update campaign stats (total reservations, revenue)
 */
async function updateCampaignStats() {
  const db = await getDb();
  if (!db) return;

  const allReservations = await db.select().from(presaleReservations).where(eq(presaleReservations.paymentStatus, "paid"));
  
  const totalReservations = allReservations.length;
  const totalRevenue = allReservations.reduce((sum, r) => sum + parseFloat(r.price?.toString() || "0"), 0);

  const campaign = await getCampaign();
  if (!campaign) return;

  await db.update(presaleCampaign)
    .set({
      totalReservations,
      totalRevenue: totalRevenue.toFixed(2),
    })
    .where(eq(presaleCampaign.id, campaign.id));
}

/**
 * Decrement founders remaining count
 */
async function decrementFoundersRemaining() {
  const db = await getDb();
  if (!db) return;

  const campaign = await getCampaign();
  if (!campaign) return;

  const newRemaining = Math.max(0, (campaign.foundersRemaining || 500) - 1);

  await db.update(presaleCampaign)
    .set({ foundersRemaining: newRemaining })
    .where(eq(presaleCampaign.id, campaign.id));
}

/**
 * Decrement early adopter remaining count
 */
async function decrementEarlyAdopterRemaining() {
  const db = await getDb();
  if (!db) return;

  const campaign = await getCampaign();
  if (!campaign) return;

  const newRemaining = Math.max(0, (campaign.earlyAdopterRemaining || 2000) - 1);

  await db.update(presaleCampaign)
    .set({ earlyAdopterRemaining: newRemaining })
    .where(eq(presaleCampaign.id, campaign.id));
}

/**
 * Get all reservations (for admin)
 */
export async function getAllReservations() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(presaleReservations).orderBy(desc(presaleReservations.createdAt));
}

/**
 * Get reservation count
 */
export async function getReservationCount() {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select().from(presaleReservations);
  return result.length;
}

/**
 * Get top referrers (leaderboard)
 */
export async function getTopReferrers(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(presaleReservations)
    .orderBy(desc(presaleReservations.referralCount))
    .limit(limit);
}
