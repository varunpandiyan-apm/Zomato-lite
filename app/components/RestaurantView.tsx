"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BurritoMark } from "@/app/components/BurritoMark";
import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  InfoIcon,
  PenIcon,
  PinIcon,
  UtensilsIcon,
  UserIcon,
} from "@/app/components/Icons";
import { RatingBadge } from "@/app/components/RatingBadge";
import { RatingStars } from "@/app/components/RatingStars";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { StarIcon } from "@/app/components/StarIcon";
import type { RestaurantResponse, Review } from "@/lib/types";

const dotPattern = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)",
  backgroundSize: "20px 20px",
} as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function SectionHeading({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      {meta && <p className="text-xs font-medium text-muted">{meta}</p>}
    </div>
  );
}

function ReviewCard({ review, latest = false }: { review: Review; latest?: boolean }) {
  return (
    <article className="rounded-xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zred-soft text-zred">
            <UserIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">Guest</p>
              {latest && (
                <span className="rounded-full bg-zred-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zred">
                  Latest
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <RatingBadge rating={review.rating} />
      </div>

      <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-ink/90">
        {review.comment}
      </p>

      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-xs text-muted">
        <UtensilsIcon className="h-3.5 w-3.5 text-zred" />
        Dining review
      </div>
    </article>
  );
}

function RatingSummary({ restaurant }: { restaurant: RestaurantResponse }) {
  return (
    <div className="mt-4 flex flex-col gap-5 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        {restaurant.averageRating === null ? (
          <span className="grid h-16 w-16 place-items-center rounded-lg border border-line bg-white text-xs font-semibold text-muted">
            New
          </span>
        ) : (
          <RatingBadge rating={restaurant.averageRating} size="xl" />
        )}

        <div>
          <p className="text-sm font-semibold">
            {restaurant.averageRating === null
              ? "No ratings yet"
              : `Rated ${restaurant.averageRating} out of 5`}
          </p>
          {restaurant.averageRating !== null && (
            <RatingStars
              rating={restaurant.averageRating}
              className="mt-1.5"
            />
          )}
          <p className="mt-1 text-xs text-muted">
            Based on {restaurant.totalReviews}{" "}
            {restaurant.totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      <div className="hidden h-14 w-px bg-line sm:block" />

      <div className="flex items-center gap-8 sm:ml-auto">
        <div>
          <p className="text-lg font-bold tabular-nums">
            {restaurant.totalReviews}
          </p>
          <p className="text-xs text-muted">Reviews</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">
            {restaurant.latestReview?.rating ?? "—"}
          </p>
          <p className="text-xs text-muted">Latest rating</p>
        </div>
      </div>
    </div>
  );
}

export function RestaurantView({ restaurantId }: { restaurantId: number }) {
  const [restaurant, setRestaurant] = useState<RestaurantResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          setError(data.error ?? "Could not load this restaurant.");
          return;
        }

        setRestaurant(data);
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") {
          setError("Could not reach the server. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRestaurant();

    return () => controller.abort();
  }, [restaurantId]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <SiteHeader restaurantId={restaurantId} action="write" />
        <p className="sr-only" role="status">
          Loading restaurant…
        </p>
        <div className="h-64 animate-pulse bg-surface sm:h-72" />
        <div className="mx-auto -mt-14 w-full max-w-[1100px] px-4 sm:px-6">
          <div className="h-36 animate-pulse rounded-2xl border border-line bg-white shadow-sm" />
        </div>
        <div className="mx-auto grid w-full max-w-[1100px] flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="h-8 w-52 animate-pulse rounded bg-surface" />
            <div className="h-28 animate-pulse rounded-xl bg-surface" />
            <div className="h-44 animate-pulse rounded-xl bg-surface" />
          </div>
          <div className="hidden h-64 animate-pulse rounded-xl bg-surface lg:block" />
        </div>
        <SiteFooter />
      </main>
    );
  }

  if (error || !restaurant) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <SiteHeader restaurantId={restaurantId} action="write" />
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-zred-soft text-zred">
              <InfoIcon className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold">
              Couldn&apos;t load this restaurant
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              {error || "Restaurant not found."}
            </p>
            <Link
              href="/restaurant/1"
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-zred px-5 text-sm font-semibold text-white transition-colors hover:bg-zred-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred"
            >
              Back to Ludhiana Burrito
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const hasReviews = restaurant.totalReviews > 0;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader restaurantId={restaurantId} action="write" />

      <div className="flex-1">
        {/* Cover */}
        <section className="relative overflow-hidden bg-gradient-to-br from-zred via-zred to-zred-dark">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={dotPattern}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 text-white/20 sm:block"
          >
            <BurritoMark className="h-[300px] w-[360px]" />
          </div>

          <div className="relative mx-auto w-full max-w-[1100px] px-4 pb-24 pt-8 sm:px-6 sm:pb-28 sm:pt-12">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-xs font-medium text-white/90"
            >
              <span>Zomato Lite</span>
              <ChevronRightIcon className="h-3 w-3" />
              <span>Sector 32</span>
              <ChevronRightIcon className="h-3 w-3" />
              <span className="text-white">{restaurant.name}</span>
            </nav>

            <h1 className="mt-4 max-w-[760px] text-balance text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-[4rem]">
              {restaurant.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white">
              <span className="flex items-center gap-1.5">
                <UtensilsIcon className="h-4 w-4" />
                {restaurant.cuisine}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/50" />
              <span className="flex items-center gap-1.5">
                <PinIcon className="h-4 w-4" />
                {restaurant.area}, Ludhiana
              </span>
              <span className="h-1 w-1 rounded-full bg-white/50" />
              <span className="flex items-center gap-1.5">
                <StarIcon filled className="h-4 w-4 text-white" />
                {restaurant.totalReviews}{" "}
                {restaurant.totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>
        </section>

        {/* Floating info card */}
        <div className="relative z-10 mx-auto -mt-14 w-full max-w-[1100px] px-4 sm:px-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 shadow-[0_10px_40px_rgba(28,28,28,0.12)] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {restaurant.averageRating === null ? (
                <span className="grid h-16 w-16 place-items-center rounded-lg border border-line bg-surface text-xs font-semibold text-muted">
                  New
                </span>
              ) : (
                <RatingBadge
                  rating={restaurant.averageRating}
                  size="lg"
                  className="h-16 min-w-16 justify-center"
                />
              )}
              <div>
                <p className="text-sm font-bold">Dining rating</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <RatingStars
                    rating={restaurant.averageRating ?? 0}
                    size="large"
                  />
                  <span className="text-xs text-muted">
                    {restaurant.totalReviews}{" "}
                    {restaurant.totalReviews === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden h-12 w-px bg-line lg:block" />

            <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Cuisine</dt>
                <dd className="mt-0.5 font-semibold">{restaurant.cuisine}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Location</dt>
                <dd className="mt-0.5 font-semibold">
                  {restaurant.area}, Ludhiana
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Reviews</dt>
                <dd className="mt-0.5 font-semibold">
                  {restaurant.totalReviews}
                </dd>
              </div>
            </dl>

            <Link
              href={`/review/${restaurantId}`}
              className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-lg bg-zred px-5 text-sm font-semibold text-white transition-colors hover:bg-zred-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred"
            >
              <PenIcon className="h-4 w-4" />
              Write a review
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto grid w-full max-w-[1100px] gap-8 px-4 py-9 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="min-w-0">
            <section>
              <SectionHeading
                title="Ratings & reviews"
                meta={`${restaurant.totalReviews} ${
                  restaurant.totalReviews === 1 ? "review" : "reviews"
                }`}
              />
              <RatingSummary restaurant={restaurant} />
            </section>

            {restaurant.latestReview && (
              <section className="mt-9">
                <SectionHeading title="Latest review" meta="Most recent" />
                <div className="mt-4">
                  <ReviewCard review={restaurant.latestReview} latest />
                </div>
              </section>
            )}

            {restaurant.reviews.length > 0 && (
              <section className="mt-9">
                <SectionHeading
                  title="More reviews"
                  meta={`${restaurant.reviews.length} ${
                    restaurant.reviews.length === 1 ? "review" : "reviews"
                  }`}
                />
                <div className="mt-4 space-y-4">
                  {restaurant.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            )}

            {!hasReviews && (
              <section className="mt-9 rounded-xl border border-dashed border-line bg-surface p-8 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-zred-soft text-zred">
                  <PenIcon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-bold">No reviews yet</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted">
                  Be the first to tell other guests what to order at{" "}
                  {restaurant.name}.
                </p>
                <Link
                  href={`/review/${restaurantId}`}
                  className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-zred px-5 text-sm font-semibold text-white transition-colors hover:bg-zred-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred"
                >
                  Write the first review
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </section>
            )}

            {hasReviews && (
              <section className="mt-9 flex flex-col items-start gap-4 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zred-soft text-zred">
                    <PenIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold">Had a meal here?</h2>
                    <p className="text-xs leading-5 text-muted">
                      Share your experience with other guests.
                    </p>
                  </div>
                </div>
                <Link
                  href={`/review/${restaurantId}`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-zred px-5 text-sm font-semibold text-white transition-colors hover:bg-zred-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred"
                >
                  Write a review
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <section
              aria-labelledby="restaurant-info"
              className="rounded-xl border border-line p-5"
            >
              <h2 id="restaurant-info" className="text-base font-bold">
                Restaurant info
              </h2>
              <dl className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zred-soft text-zred">
                    <UtensilsIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="text-xs text-muted">Cuisine</dt>
                    <dd className="text-sm font-semibold">
                      {restaurant.cuisine}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zred-soft text-zred">
                    <PinIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="text-xs text-muted">Location</dt>
                    <dd className="text-sm font-semibold">
                      {restaurant.area}, Ludhiana
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zred-soft text-zred">
                    <StarIcon filled className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="text-xs text-muted">Guest reviews</dt>
                    <dd className="text-sm font-semibold">
                      {restaurant.totalReviews}{" "}
                      {restaurant.totalReviews === 1 ? "review" : "reviews"}
                    </dd>
                  </div>
                </div>
              </dl>
            </section>

            <section className="overflow-hidden rounded-xl border border-line">
              <div className="relative h-24 overflow-hidden bg-gradient-to-br from-zred to-zred-dark">
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
                <p className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                  Rate your experience
                </p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-3">
                  {restaurant.averageRating === null ? (
                    <span className="rounded-md border border-line px-2 py-1 text-xs font-semibold text-muted">
                      New
                    </span>
                  ) : (
                    <RatingBadge rating={restaurant.averageRating} />
                  )}
                  <RatingStars
                    rating={restaurant.averageRating ?? 0}
                    size="large"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Tell other guests what you loved and what could be better.
                </p>
                <Link
                  href={`/review/${restaurantId}`}
                  className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-zred px-4 text-sm font-semibold text-white transition-colors hover:bg-zred-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred"
                >
                  Write a review
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
