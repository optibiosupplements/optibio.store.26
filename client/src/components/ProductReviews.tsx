import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, ThumbsUp, ThumbsDown, Camera, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { isAuthenticated, user } = useAuth();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<Array<{ data: string; mimeType: string; preview: string }>>([]);

  const { data: reviews, refetch: refetchReviews } = trpc.reviews.getByProduct.useQuery({ productId });
  const { data: stats, refetch: refetchStats } = trpc.reviews.getStats.useQuery({ productId });
  const { data: canReviewData } = trpc.reviews.canReview.useQuery(
    { productId },
    { enabled: isAuthenticated }
  );

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setIsReviewDialogOpen(false);
      resetForm();
      refetchReviews();
      refetchStats();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const voteOnReview = trpc.reviews.vote.useMutation({
    onSuccess: () => {
      refetchReviews();
    },
  });

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
    setPhotos([]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxPhotos = 5;
    if (photos.length + files.length > maxPhotos) {
      toast.error(`You can upload a maximum of ${maxPhotos} photos`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotos((prev) => [
          ...prev,
          {
            data: base64,
            mimeType: file.type,
            preview: base64,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    createReview.mutate({
      productId,
      rating,
      title: title || undefined,
      comment: comment || undefined,
      photos: photos.length > 0 ? photos : undefined,
    });
  };

  const handleVote = (reviewId: number, voteType: "helpful" | "not_helpful") => {
    if (!isAuthenticated) {
      toast.error("Please log in to vote on reviews");
      return;
    }
    voteOnReview.mutate({ reviewId, voteType });
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= (interactive ? (hoverRating || rating) : count)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  const averageRating = stats?.averageRating ? Number(stats.averageRating.toFixed(1)) : 0;
  const totalReviews = stats?.totalReviews || 0;

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-6 md:w-64">
          <div className="text-5xl font-bold mb-2">{averageRating}</div>
          {renderStars(Math.round(averageRating))}
          <div className="text-sm text-muted-foreground mt-2">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((starCount) => {
            const count = stats?.[`rating${starCount}Count` as keyof typeof stats] as number || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={starCount} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium">{starCount}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground w-12 text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="flex justify-between items-center border-t pt-6">
        <h3 className="text-2xl font-bold">Customer Reviews</h3>
        {isAuthenticated ? (
          canReviewData?.canReview ? (
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button>Write a Review</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Write Your Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this product
                    {canReviewData.hasPurchased && (
                      <span className="flex items-center gap-1 text-green-600 mt-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified Purchase
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Rating */}
                  <div>
                    <Label>Rating *</Label>
                    <div className="mt-2">{renderStars(rating, true)}</div>
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="review-title">Review Title (Optional)</Label>
                    <Input
                      id="review-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sum up your experience"
                      maxLength={255}
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <Label htmlFor="review-comment">Your Review (Optional)</Label>
                    <Textarea
                      id="review-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us what you think about this product"
                      rows={5}
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <Label>Add Photos (Optional)</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload">
                        <Button type="button" variant="outline" asChild>
                          <span className="cursor-pointer">
                            <Camera className="mr-2 h-4 w-4" />
                            Upload Photos (Max 5)
                          </span>
                        </Button>
                      </label>

                      {photos.length > 0 && (
                        <div className="grid grid-cols-5 gap-2 mt-4">
                          {photos.map((photo, index) => (
                            <div key={index} className="relative aspect-square">
                              <img
                                src={photo.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removePhoto(index)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsReviewDialogOpen(false)}
                      disabled={createReview.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={createReview.isPending || rating === 0}
                    >
                      {createReview.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="text-sm text-muted-foreground">
              {canReviewData?.hasReviewed
                ? "You've already reviewed this product"
                : "Purchase this product to leave a review"}
            </div>
          )
        ) : (
          <Button asChild>
            <a href={getLoginUrl()}>Log In to Write a Review</a>
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    {renderStars(review.rating)}
                    {review.title && (
                      <h4 className="font-semibold mt-2">{review.title}</h4>
                    )}
                  </div>
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>

                {review.comment && (
                  <p className="text-muted-foreground mb-4">{review.comment}</p>
                )}

                {/* Review Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {review.photos.map((photoUrl, index) => (
                      <img
                        key={index}
                        src={photoUrl}
                        alt={`Review photo ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(photoUrl, "_blank")}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                  <div>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex items-center gap-4">
                    <span>Was this helpful?</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(review.id, "helpful")}
                      className="gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {(review.helpfulCount || 0) > 0 && review.helpfulCount}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(review.id, "not_helpful")}
                      className="gap-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      {(review.notHelpfulCount || 0) > 0 && review.notHelpfulCount}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
}
