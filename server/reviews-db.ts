import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "./db";
import { reviews, reviewPhotos, reviewVotes, orders, orderItems, type InsertReview, type InsertReviewPhoto, type InsertReviewVote } from "../drizzle/schema";

/**
 * Get all approved reviews for a product with photos and vote counts
 */
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];

  const productReviews = await db
    .select({
      review: reviews,
      photos: sql<string>`GROUP_CONCAT(${reviewPhotos.photoUrl})`.as('photos'),
    })
    .from(reviews)
    .leftJoin(reviewPhotos, eq(reviews.id, reviewPhotos.reviewId))
    .where(and(
      eq(reviews.productId, productId),
      eq(reviews.isApproved, true)
    ))
    .groupBy(reviews.id)
    .orderBy(desc(reviews.createdAt));

  return productReviews.map(row => ({
    ...row.review,
    photos: row.photos ? row.photos.split(',') : [],
  }));
}

/**
 * Get review statistics for a product
 */
export async function getProductReviewStats(productId: number) {
  const db = await getDb();
  if (!db) return null;

  const stats = await db
    .select({
      totalReviews: sql<number>`COUNT(*)`,
      averageRating: sql<number>`AVG(${reviews.rating})`,
      rating5Count: sql<number>`SUM(CASE WHEN ${reviews.rating} = 5 THEN 1 ELSE 0 END)`,
      rating4Count: sql<number>`SUM(CASE WHEN ${reviews.rating} = 4 THEN 1 ELSE 0 END)`,
      rating3Count: sql<number>`SUM(CASE WHEN ${reviews.rating} = 3 THEN 1 ELSE 0 END)`,
      rating2Count: sql<number>`SUM(CASE WHEN ${reviews.rating} = 2 THEN 1 ELSE 0 END)`,
      rating1Count: sql<number>`SUM(CASE WHEN ${reviews.rating} = 1 THEN 1 ELSE 0 END)`,
    })
    .from(reviews)
    .where(and(
      eq(reviews.productId, productId),
      eq(reviews.isApproved, true)
    ));

  return stats[0] || null;
}

/**
 * Create a new review
 */
export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reviews).values(data);
  // Get the last inserted ID
  const inserted = await db.select({ id: reviews.id }).from(reviews).orderBy(desc(reviews.id)).limit(1);
  return inserted[0]?.id || 0;
}

/**
 * Add photos to a review
 */
export async function addReviewPhotos(photos: InsertReviewPhoto[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (photos.length === 0) return;
  await db.insert(reviewPhotos).values(photos);
}

/**
 * Check if user has purchased a product
 */
export async function hasUserPurchasedProduct(userId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const purchase = await db
    .select({ orderId: orders.id })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(and(
      eq(orders.userId, userId),
      eq(orderItems.productId, productId),
      eq(orders.paymentStatus, "paid")
    ))
    .limit(1);

  return purchase.length > 0;
}

/**
 * Check if user has already reviewed a product
 */
export async function hasUserReviewedProduct(userId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const existingReview = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(
      eq(reviews.userId, userId),
      eq(reviews.productId, productId)
    ))
    .limit(1);

  return existingReview.length > 0;
}

/**
 * Vote on a review (helpful/not helpful)
 */
export async function voteOnReview(data: InsertReviewVote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user has already voted
  const existingVote = await db
    .select()
    .from(reviewVotes)
    .where(and(
      eq(reviewVotes.reviewId, data.reviewId),
      eq(reviewVotes.userId, data.userId)
    ))
    .limit(1);

  if (existingVote.length > 0) {
    // Update existing vote
    await db
      .update(reviewVotes)
      .set({ voteType: data.voteType })
      .where(eq(reviewVotes.id, existingVote[0].id));
  } else {
    // Insert new vote
    await db.insert(reviewVotes).values(data);
  }

  // Update review counts
  const voteCounts = await db
    .select({
      helpful: sql<number>`SUM(CASE WHEN ${reviewVotes.voteType} = 'helpful' THEN 1 ELSE 0 END)`,
      notHelpful: sql<number>`SUM(CASE WHEN ${reviewVotes.voteType} = 'not_helpful' THEN 1 ELSE 0 END)`,
    })
    .from(reviewVotes)
    .where(eq(reviewVotes.reviewId, data.reviewId));

  await db
    .update(reviews)
    .set({
      helpfulCount: voteCounts[0]?.helpful || 0,
      notHelpfulCount: voteCounts[0]?.notHelpful || 0,
    })
    .where(eq(reviews.id, data.reviewId));
}

/**
 * Get user's vote on a review
 */
export async function getUserVoteOnReview(userId: number, reviewId: number) {
  const db = await getDb();
  if (!db) return null;

  const vote = await db
    .select()
    .from(reviewVotes)
    .where(and(
      eq(reviewVotes.reviewId, reviewId),
      eq(reviewVotes.userId, userId)
    ))
    .limit(1);

  return vote[0] || null;
}

/**
 * Get user's reviews
 */
export async function getUserReviews(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const userReviews = await db
    .select({
      review: reviews,
      photos: sql<string>`GROUP_CONCAT(${reviewPhotos.photoUrl})`.as('photos'),
    })
    .from(reviews)
    .leftJoin(reviewPhotos, eq(reviews.id, reviewPhotos.reviewId))
    .where(eq(reviews.userId, userId))
    .groupBy(reviews.id)
    .orderBy(desc(reviews.createdAt));

  return userReviews.map(row => ({
    ...row.review,
    photos: row.photos ? row.photos.split(',') : [],
  }));
}
