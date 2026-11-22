"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StarIcon } from "@/app/components/StarIcon";

export function ReviewForm({ restaurantId }: { restaurantId: number }) {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRestaurantName() {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Could not load this restaurant.");
          return;
        }

        setRestaurantName(data.name);
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") {
          setError("Could not reach the server. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingName(false);
        }
      }
    }

    loadRestaurantName();

    return () => controller.abort();
  }, [restaurantId]);

  const canSubmit =
    rating !== null && comment.trim().length > 0 && !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === null || comment.trim().length === 0) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          rating,
          comment,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Show the backend's own explanation. Do not replace it with a
        // friendlier client-side message.
        setError(data.error ?? "Could not submit the review.");
        setSubmitting(false);
        return;
      }

      router.push(`/restaurant/${restaurantId}`);
    } catch {
      setError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  const activeRating = hoveredRating ?? rating;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[560px] px-6 py-10 sm:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
        Zomato Lite
      </p>

      <div className="mt-12">
        <Link
          href={`/restaurant/${restaurantId}`}
          className="text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
        >
          Back to restaurant
        </Link>

        <header className="mt-8 border-b border-line pb-8">
          <p className="text-sm text-muted">Write a review</p>
          <h1 className="mt-2 text-[2.25rem] font-medium leading-[1.08] tracking-[-0.045em] sm:text-[2.75rem]">
            {loadingName ? "Ludhiana Burrito" : restaurantName}
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="mt-9">
          <fieldset>
            <legend className="text-sm font-medium">Your rating</legend>
            <p className="mt-1 text-sm text-muted">
              {rating === null
                ? "Choose 1 to 5 stars."
                : `${rating} of 5 selected.`}
            </p>

            <div
              className="mt-4 flex items-center gap-1"
              onMouseLeave={() => setHoveredRating(null)}
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive =
                  activeRating !== null && value <= activeRating;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                    aria-pressed={rating === value}
                    onMouseEnter={() => setHoveredRating(value)}
                    onFocus={() => setHoveredRating(value)}
                    onBlur={() => setHoveredRating(null)}
                    onClick={() => setRating(value)}
                    className={`rounded-md p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isActive ? "text-accent" : "text-line hover:text-accent"
                    }`}
                  >
                    <StarIcon filled={isActive} className="h-10 w-10" />
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8">
            <label htmlFor="comment" className="text-sm font-medium">
              Your review
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={5}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What did you order? How was it?"
              className="mt-3 w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 text-[15px] leading-7 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-accent/25 bg-accent/5 px-4 py-3 text-sm leading-6 text-accent"
            >
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>
            <Link
              href={`/restaurant/${restaurantId}`}
              className="inline-flex min-h-12 items-center justify-center px-4 text-sm text-muted transition-colors hover:text-ink"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
