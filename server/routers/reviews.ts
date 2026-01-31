import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getProductReviews,
  getProductReviewStats,
  createReview,
  addReviewPhotos,
  hasUserPurchasedProduct,
  hasUserReviewedProduct,
  voteOnReview,
  getUserVoteOnReview,
  getUserReviews,
} from "../reviews-db";
import { storagePut } from "../storage";

export const reviewsRouter = router({
  /**
   * Get all reviews for a product (public)
   */
  getByProduct: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await getProductReviews(input.productId);
    }),

  /**
   * Get review statistics for a product (public)
   */
  getStats: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await getProductReviewStats(input.productId);
    }),

  /**
   * Create a new review (protected)
   */
  create: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        comment: z.string().optional(),
        photos: z.array(z.object({
          data: z.string(), // base64 encoded image
          mimeType: z.string(),
        })).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user has already reviewed this product
      const hasReviewed = await hasUserReviewedProduct(ctx.user.id, input.productId);
      if (hasReviewed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      // Check if user has purchased this product
      const hasPurchased = await hasUserPurchasedProduct(ctx.user.id, input.productId);

      // Create review
      const reviewId = await createReview({
        productId: input.productId,
        userId: ctx.user.id,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        isVerifiedPurchase: hasPurchased,
        isApproved: true, // Auto-approve for now; can add moderation later
      });

      // Upload photos if provided
      if (input.photos && input.photos.length > 0) {
        const photoUploads = await Promise.all(
          input.photos.map(async (photo, index) => {
            // Convert base64 to buffer
            const base64Data = photo.data.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            // Generate unique key
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            const extension = photo.mimeType.split("/")[1];
            const key = `reviews/${reviewId}/${timestamp}-${random}.${extension}`;

            // Upload to S3
            const { url } = await storagePut(key, buffer, photo.mimeType);

            return {
              reviewId,
              photoUrl: url,
              photoKey: key,
              sortOrder: index,
            };
          })
        );

        await addReviewPhotos(photoUploads);
      }

      return { success: true, reviewId };
    }),

  /**
   * Vote on a review (protected)
   */
  vote: protectedProcedure
    .input(
      z.object({
        reviewId: z.number(),
        voteType: z.enum(["helpful", "not_helpful"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await voteOnReview({
        reviewId: input.reviewId,
        userId: ctx.user.id,
        voteType: input.voteType,
      });

      return { success: true };
    }),

  /**
   * Get user's vote on a review (protected)
   */
  getUserVote: protectedProcedure
    .input(z.object({ reviewId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await getUserVoteOnReview(ctx.user.id, input.reviewId);
    }),

  /**
   * Get user's reviews (protected)
   */
  getUserReviews: protectedProcedure
    .query(async ({ ctx }) => {
      return await getUserReviews(ctx.user.id);
    }),

  /**
   * Check if user can review a product (protected)
   */
  canReview: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input, ctx }) => {
      const hasReviewed = await hasUserReviewedProduct(ctx.user.id, input.productId);
      const hasPurchased = await hasUserPurchasedProduct(ctx.user.id, input.productId);

      return {
        canReview: !hasReviewed,
        hasPurchased,
        hasReviewed,
      };
    }),
});
