"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BurritoMark } from "@/app/components/BurritoMark";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  InfoIcon,
  PinIcon,
  UtensilsIcon,
} from "@/app/components/Icons";
import { RatingBadge } from "@/app/components/RatingBadge";
import { RatingStars } from "@/app/components/RatingStars";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { StarIcon } from "@/app/components/StarIcon";
import type { RestaurantResponse } from "@/lib/types";

const RATING_LABELS = [
  "",
  "Very poor",
  "Poor",
  "Average",
  "Good",
  "Excellent",
];

const dotPattern = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)",
  backgroundSize: "20px 20px",
} as const;

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
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader restaurantId={restaurantId} action="back" />

      <div className="border-b border-line bg-surface">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex w-full max-w-[1000px] items-center gap-1.5 px-4 py-3 text-xs font-medium text-muted sm:px-6"
        >
          <Link
            href={`/restaurant/${restaurantId}`}
            className="transition-colors hover:text-zred"
          >
            {restaurantName}
          </Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-ink">Write a review</span>
        </nav>
      </div>

      <div className="mx-auto w-full max-w-[1000px] flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Write a review
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              Share your dining experience at{" "}
              <span className="font-semibold text-ink">{restaurantName}</span>.
            </p>

            <form
              onSubmit={handleSubmit}
              aria-busy={submitting}
              className="mt-6 rounded-xl border border-line bg-white"
            >
              <div className="border-b border-line p-5 sm:p-6">
                <fieldset>
                  <legend className="text-base font-bold">Your rating</legend>
                  <p className="mt-1 text-xs text-muted">
                    How was your overall experience?
                  </p>

                  <div
                    className="mt-4 flex items-center gap-1 sm:gap-2"
                    onMouseLeave={() => setHoveredRating(null)}
                  >
                    {[1, 2, 3, 4, 5].map((value) => {
                      const isActive =
                        activeRating !== null && value <= activeRating;

                      return (
                        <button
                          key={value}
                          type="button"
                          aria-label={`${value} ${
                            value === 1 ? "star" : "stars"
                          } — ${RATING_LABELS[value]}`}
                          aria-pressed={rating === value}
                          onMouseEnter={() => setHoveredRating(value)}
                          onFocus={() => setHoveredRating(value)}
                          onBlur={() => setHoveredRating(null)}
                          onClick={() => setRating(value)}
                          className="group flex flex-col items-center gap-1 rounded-lg p-1.5 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred"
                        >
                          <StarIcon
                            filled={isActive}
                            className={`h-9 w-9 transition-colors sm:h-11 sm:w-11 ${
                              isActive
                                ? "text-star"
                                : "text-line group-hover:text-star/70"
                            }`}
                          />
                          <span
                            className={`text-[10px] font-semibold tabular-nums ${
                              isActive ? "text-ink" : "text-muted"
                            }`}
                          >
                            {value}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p
                    className="mt-3 text-sm font-medium text-ink"
                    aria-live="polite"
                  >
                    {rating === null
                      ? "Select a rating from 1 to 5."
                      : `${RATING_LABELS[rating]} · ${rating} of 5`}
                  </p>
                </fieldset>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <label htmlFor="comment" className="text-base font-bold">
                    Your review
                  </label>
                  <span className="text-xs text-muted">
                    {comment.length}{" "}
                    {comment.length === 1 ? "character" : "characters"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Tell us what stood out — the food, the service, or the vibe.
                </p>
                <textarea
                  id="comment"
                  name="comment"
                  rows={5}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="What did you order? How was it?"
                  className="mt-3 w-full resize-y rounded-lg border border-line bg-white px-3.5 py-3 text-sm leading-6 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-zred focus:ring-2 focus:ring-zred/20"
                />

                {error && (
                  <div
                    role="alert"
                    className="mt-4 flex gap-2.5 rounded-lg border border-zred/20 bg-zred-soft p-3.5 text-sm leading-6 text-zred-dark"
                  >
                    <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <InfoIcon className="h-3.5 w-3.5 shrink-0 text-zred" />
                  Your review will be visible to everyone.
                </p>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-zred px-6 text-sm font-semibold text-white transition-colors hover:bg-zred-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:w-auto"
                >
                  {submitting ? "Submitting…" : "Submit review"}
                </button>
              </div>
            </form>
          </div>

          <aside className="lg:sticky lg:top-20">
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="relative h-28 overflow-hidden bg-gradient-to-br from-zred to-zred-dark">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={dotPattern}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -top-10 text-white/25"
                >
                  <BurritoMark className="h-40 w-48" />
                </div>
                <span className="absolute bottom-3 left-4 rounded bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  You&apos;re reviewing
                </span>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold leading-tight">
                  {restaurantName}
                </h2>

                {restaurant ? (
                  <>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <UtensilsIcon className="h-3.5 w-3.5 text-zred" />
                        {restaurant.cuisine}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-line" />
                      <span className="flex items-center gap-1">
                        <PinIcon className="h-3.5 w-3.5 text-zred" />
                        {restaurant.area}, Ludhiana
                      </span>
                    </p>

                    <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                      {restaurant.averageRating === null ? (
                        <span className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-muted">
                          New
                        </span>
                      ) : (
                        <RatingBadge rating={restaurant.averageRating} />
                      )}
                      <div>
                        <RatingStars
                          rating={restaurant.averageRating ?? 0}
                          size="large"
                        />
                        <p className="mt-1 text-xs text-muted">
                          {restaurant.totalReviews}{" "}
                          {restaurant.totalReviews === 1 ? "review" : "reviews"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/restaurant/${restaurantId}`}
                      className="mt-4 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-line px-4 text-sm font-semibold text-ink transition-colors hover:border-zred hover:text-zred focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      Back to restaurant
                    </Link>
                  </>
                ) : (
                  <p className="mt-3 rounded-lg bg-surface p-3 text-xs leading-5 text-muted">
                    {loadingRestaurant
                      ? "Loading restaurant details…"
                      : loadError || "Restaurant details are unavailable."}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
