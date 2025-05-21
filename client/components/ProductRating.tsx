"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LockKeyhole } from "lucide-react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
type Rating = {
  id: number;
  comment: string;
  stars: number;
  userId: number;
  productId: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
};

type ProductRatingProps = {
  userId: number;
  productId: number;
};

export default function ProductRating({
  userId,
  productId,
}: ProductRatingProps) {
  const [open, setOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);

  const fetchRatings = () => {
    axios
      .get(`${apiUrl}ratings/product/${productId}`)
      .then((res) => setRatings(res.data))
      .catch((err) => console.error("Failed to fetch ratings", err));
  };

  useEffect(() => {
    fetchRatings();

    axios
      .get(`${apiUrl}users/${userId}/products/${productId}/purchased`)
      .then((res) => setHasPurchased(res.data.hasPurchased))
      .catch((err) => {
        console.error("Failed to check purchase status", err);
        setHasPurchased(false);
      });
  }, [productId, userId]);

  const averageRating = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length).toFixed(1)
    : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((r) => r.stars === star).length;
    const percentage = ratings.length
      ? Math.round((count / ratings.length) * 100)
      : 0;
    return { stars: star, percentage };
  });

  const handleSubmitReview = async () => {
    try {
      await axios.post(`${apiUrl}ratings/user/${userId}/product/${productId}`, {
        userId,
        productId,
        stars: selectedRating,
        comment: reviewText,
      });

      setSelectedRating(0);
      setReviewText("");
      setReviewTitle("");
      setOpen(false);
      fetchRatings();
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-16 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-2">Customer reviews</h2>
          <div className="flex items-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(parseFloat(averageRating))
                    ? "text-black-500"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-lg">{averageRating} out of 5</span>
          </div>
          <p className="text-gray-600 mb-4">{ratings.length} global ratings</p>

          {ratingDistribution.map((rating) => (
            <div key={rating.stars} className="flex items-center mb-2">
              <span className="w-16 text-sm">{rating.stars} star</span>
              <div className="w-48 bg-gray-200 rounded-full h-2.5 mx-2">
                <div
                  className="bg-black h-2.5 rounded-full"
                  style={{ width: `${rating.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {rating.percentage}%
              </span>
            </div>
          ))}

          <div className="mt-10">
            <h3 className="text-lg font-bold mb-4">Review this product</h3>
            <p className="text-gray-600 mb-4">
              Share your thoughts with other customers
            </p>
            {hasPurchased ? (
              <Button
                variant="outline"
                className="w-full border-gray-300"
                onClick={() => setOpen(true)}
              >
                Write a customer review
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Button variant="outline" className="border-gray-300">
                  <LockKeyhole className="w-4 h-4" />
                  Only verified buyers can write a review
                </Button>
              </div>
            )}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with this product
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rating">Overall Rating</Label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-8 h-8 cursor-pointer ${
                          star <= selectedRating
                            ? "text-black"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        onClick={() => setSelectedRating(star)}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2">
                      {selectedRating > 0
                        ? `${selectedRating} stars`
                        : "Select a rating"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="review-title">Add a headline</Label>
                  <input
                    id="review-title"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="What's most important to know?"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="review-text">Write your review</Label>
                  <Textarea
                    id="review-text"
                    placeholder="What did you like or dislike? How did you use this product?"
                    className="min-h-32"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={selectedRating === 0 || !reviewText.trim()}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Top reviews</h2>
          <Button variant="outline" className="mb-4">
            Translate all reviews to English
          </Button>

          <ScrollArea className="h-96 rounded-md border">
            <div className="p-4">
              {ratings.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b pb-4 mb-4 last:border-b-0"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
                    <span className="font-medium">
                      {comment.user?.name || "Anonymous"}
                    </span>
                  </div>

                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= comment.stars
                            ? "text-black-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    Reviewed on{" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-gray-800">{comment.comment}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
