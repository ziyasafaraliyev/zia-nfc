"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { submitRestaurantReview } from "@/app/admin/actions";

type Props = {
  restaurantId: string;
  currentRating?: number;
  reviews?: Array<{
    id?: string;
    rating: number;
    comment?: string | null;
    created_at?: Date;
  }>;
};

export default function RestaurantRating({ restaurantId, currentRating, reviews = [] }: Props) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRating) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("restaurant_id", restaurantId);
    formData.set("rating", selectedRating.toString());
    formData.set("comment", comment);

    try {
      await submitRestaurantReview(formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayRating = currentRating ?? 0;
  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 >= 0.5;

  if (submitted) {
    return (
      <div className="mt-6 lux-card rounded-[1.75rem] p-5 text-center">
        <div className="flex justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={24}
              className="fill-amber-400 text-amber-400"
            />
          ))}
        </div>
        <h3 className="text-lg font-black text-gray-800 mb-2">Rəyiniz üçün təşəkkür edirik!</h3>
        <p className="text-sm text-gray-500">Rəyiniz qəbul edildi.</p>
      </div>
    );
  }

  return (
    <section className="mt-6">
      {/* Rating Display */}
      <div className="lux-card rounded-[1.75rem] p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={20}
                className={`transition-colors ${
                  i <= fullStars
                    ? "fill-amber-400 text-amber-400"
                    : i === fullStars + 1 && hasHalfStar
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xl font-black text-gray-800">
            {displayRating.toFixed(1)}
          </span>
          <span className="text-sm font-semibold text-gray-500">
            ({reviews.length} rəy)
          </span>
        </div>
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="lux-card rounded-[1.75rem] p-5 mb-4">
        <h3 className="text-sm font-black text-gray-800 mb-3 uppercase tracking-wide">
          Rəy yaz
        </h3>

        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedRating(i)}
              onMouseEnter={() => setHoveredRating(i)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={`transition-colors ${
                  i <= (hoveredRating || selectedRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Rəyinizi yazın..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/10"
          rows={3}
        />

        <button
          type="submit"
          disabled={!selectedRating || isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#29AEEE] px-4 py-3 text-sm font-black text-white shadow-md shadow-[#29AEEE]/20 transition-all duration-200 hover:bg-[#1a9ad4] hover:shadow-lg active:scale-[0.97] disabled:bg-gray-300 disabled:shadow-none"
        >
          <Send size={16} />
          {isSubmitting ? "Göndərilir..." : "Rəyini göndər"}
        </button>
      </form>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="lux-card rounded-[1.75rem] p-4">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              {review.comment && (
                <p className="text-sm text-gray-700">{review.comment}</p>
              )}
              {review.created_at && (
                <p className="mt-2 text-[10px] font-semibold text-gray-400">
                  {new Date(review.created_at).toLocaleDateString("az-AZ")}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
