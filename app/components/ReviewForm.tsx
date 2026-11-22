"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  ClockIcon,
  InfoIcon,
  PinIcon,
  UtensilsIcon,
} from "@/app/components/Icons";
import { RatingStars } from "@/app/components/RatingStars";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { StarIcon } from "@/app/components/StarIcon";
import type { RestaurantResponse } from "@/lib/types";

const RATING_LABELS = [
  "",
  "Not for me",
  "It was okay",
  "Solid",
  "Really good",
  "Unmissable",
];

export function ReviewForm({ restaurantId }: { restaurantId: number }) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<RestaurantResponse | null>(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRestaurant() {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          setLoadError(data.error ?? "Could not load this restaurant.");
          return;
        }

        setRestaurant(data);
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") {
          setLoadError("Could not reach the server. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingRestaurant(false);
        }
      }
    }

    loadRestaurant();

    return () => controller.abort();
  }, [restaurantId]);

  const restaurantName = restaurant?.name ?? "Ludhiana Burrito";
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
    <main className="flex min-h-screen flex-col">
      <SiteHeader restaurantId={restaurantId} action="back" />

      <div className="mx-auto w-full max-w-[900px] flex-1 px-6 pb-16 sm:px-8">
        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Guest note / 01
            </p>
            <h1 className="mt-4 max-w-[560px] text-balance font-display text-[4rem] leading-[0.88] tracking-[-0.04em] sm:text-[5rem]">
              Write a review.
            </h1>
            <p className="mt-5 max-w-[440px] text-sm leading-6 text-muted">
              For <span className="font-medium text-ink">{restaurantName}</span>{" "}
              in {restaurant?.area ?? "Sector 32"}. Tell the next guest what to
              order, how the service felt, and whether you would go back.
            </p>
          </div>

          <aside className="rounded-[2rem] border border-line bg-surface p-6 lg:sticky lg:top-6">
            <p className="eyebrow">You&apos;re reviewing</p>
            <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em]">
              {restaurantName}
            </h2>

            {restaurant ? (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="meta-chip">
                    <UtensilsIcon className="h-3.5 w-3.5" />
                    {restaurant.cuisine}
                  </span>
                  <span className="meta-chip">
                    <PinIcon className="h-3.5 w-3.5" />
                    {restaurant.area}
                  </span>
                </div>

                <div className="mt-6 border-t border-line pt-5">
                  <div className="flex items-end gap-2">
                    {/* This is printed from the API; it is not calculated here. */}
                    <span className="font-display text-5xl leading-none tabular-nums">
                      {restaurant.averageRating ?? "—"}
                    </span>
                    <span className="pb-1 text-[10px] text-muted">/ 5</span>
                  </div>
                  {restaurant.averageRating === null ? (
                    <p className="mt-3 text-xs text-muted">No ratings yet</p>
                  ) : (
                    <RatingStars
                      rating={restaurant.averageRating}
                      className="mt-3"
                    />
                  )}
                  <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-muted">
                    {restaurant.totalReviews}{" "}
                    {restaurant.totalReviews === 1 ? "guest note" : "guest notes"}
                  </p>
                </div>
              </>
            ) : (
              <p className="mt-4 text-xs leading-5 text-muted">
                {loadingRestaurant
                  ? "Loading restaurant details..."
                  : loadError || "Restaurant details are unavailable."}
              </p>
            )}
          </aside>
        </section>

        <form
          onSubmit={handleSubmit}
          aria-busy={submitting}
          className="mt-10 rounded-[2rem] border border-line bg-surface p-6 sm:p-8"
        >
          <fieldset>
            <legend className="sr-only">Your rating</legend>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Score / 01</p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.02em]">
                  How was the table?
                </h2>
              </div>
              <span className="rounded-full border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted tabular-nums">
                {rating === null ? "Not rated" : `${rating} / 5`}
              </span>
            </div>

            <div
              className="mt-6 grid grid-cols-5 gap-2"
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
                    className={`group flex flex-col items-center gap-2 rounded-2xl border px-1 py-3 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isActive
                        ? "border-accent bg-accent-soft/60 text-accent"
                        : "border-line bg-paper/50 text-muted hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                    }`}
                  >
                    <StarIcon
                      filled={isActive}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    />
                    <span className="text-[10px] font-medium tabular-nums">
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>

            <p
              className="mt-4 text-sm text-muted"
              aria-live="polite"
            >
              {rating === null
                ? "Choose a score from 1 to 5."
                : `${RATING_LABELS[rating]} — ${rating} out of 5`}
            </p>
          </fieldset>

          <div className="my-8 h-px bg-line" />

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Note / 02</p>
                <label
                  htmlFor="comment"
                  className="mt-2 block font-display text-3xl tracking-[-0.02em]"
                >
                  Your note
                </label>
              </div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                Plain text
              </span>
            </div>
            <textarea
              id="comment"
              name="comment"
              rows={5}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What did you order? How was it?"
              className="mt-4 w-full resize-y rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[15px] leading-7 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <p className="mt-2 text-xs text-muted">
              A sentence or two is plenty.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 flex gap-3 rounded-2xl border border-accent/25 bg-accent-soft/50 p-4 text-sm leading-6 text-accent"
            >
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs leading-5 text-muted">
              <ClockIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
              Your note appears at the top of the guestbook.
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
            >
              {submitting ? "Submitting..." : "Submit review"}
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </form>
      </div>

      <SiteFooter />
    </main>
  );
}
