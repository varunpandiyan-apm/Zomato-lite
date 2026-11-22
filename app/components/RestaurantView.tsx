"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  ClockIcon,
  InfoIcon,
  PenIcon,
  PinIcon,
  QuoteIcon,
  UtensilsIcon,
} from "@/app/components/Icons";
import { RatingStars } from "@/app/components/RatingStars";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { StarIcon } from "@/app/components/StarIcon";
import type { RestaurantResponse } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function ScoreCard({ restaurant }: { restaurant: RestaurantResponse }) {
  return (
    <aside
      aria-label="Guest rating summary"
      className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-paper sm:p-7"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-10 select-none font-display text-[10rem] leading-none text-paper/5"
      >
        Z
      </span>

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-paper/70">
            Guest rating
          </p>
          <StarIcon filled className="h-4 w-4 text-accent" />
        </div>

        <div className="mt-7 flex items-end gap-2">
          {/* The API computed this value. This screen only prints it. */}
          <p className="font-display text-[6.5rem] leading-[0.72] tracking-[-0.06em] tabular-nums">
            {restaurant.averageRating === null ? "—" : restaurant.averageRating}
          </p>
          <span className="pb-2 text-xs text-paper/60">/ 5</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {restaurant.averageRating === null ? (
            <span className="text-xs text-paper/70">No ratings yet</span>
          ) : (
            <RatingStars rating={restaurant.averageRating} size="large" />
          )}
          <span className="text-[10px] uppercase tracking-[0.14em] text-paper/70">
            {restaurant.totalReviews}{" "}
            {restaurant.totalReviews === 1 ? "note" : "notes"}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 border-t border-paper/20 pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-paper/60">
              Reviews
            </p>
            <p className="mt-1 font-display text-3xl tabular-nums">
              {restaurant.totalReviews}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-paper/60">
              Latest score
            </p>
            <p className="mt-1 font-display text-3xl tabular-nums">
              {restaurant.latestReview?.rating ?? "—"}
            </p>
          </div>
        </div>

        <p className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-paper/60">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Computed live from the reviews
        </p>
      </div>
    </aside>
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
      <main className="flex min-h-screen flex-col">
        <SiteHeader restaurantId={restaurantId} action="write" />
        <div className="flex flex-1 items-center justify-center px-6 py-24">
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 animate-pulse place-items-center rounded-full border border-line bg-surface font-display text-2xl">
              Z
            </span>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted">
              Setting the table...
            </p>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  if (error || !restaurant) {
    return (
      <main className="flex min-h-screen flex-col">
        <SiteHeader restaurantId={restaurantId} action="write" />
        <div className="flex flex-1 items-center justify-center px-6 py-24">
          <div className="max-w-[420px] text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-accent">
              <InfoIcon className="h-5 w-5" />
            </div>
            <h1 className="mt-5 font-display text-4xl leading-tight">
              We couldn&apos;t open this table.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              {error || "Restaurant not found."}
            </p>
            <Link
              href="/restaurant/1"
              className="mt-6 inline-flex min-h-10 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Back to Ludhiana Burrito
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const hasReviews = restaurant.totalReviews > 0;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader restaurantId={restaurantId} action="write" />

      <div className="mx-auto w-full max-w-[900px] flex-1 px-6 pb-16 sm:px-8">
        <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              The restaurant / 01
            </p>
            <h1 className="mt-5 max-w-[560px] text-balance font-display text-[3.75rem] leading-[0.88] tracking-[-0.04em] sm:text-[5.5rem]">
              {restaurant.name}
            </h1>
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="meta-chip">
                <UtensilsIcon className="h-3.5 w-3.5" />
                {restaurant.cuisine}
              </span>
              <span className="meta-chip">
                <PinIcon className="h-3.5 w-3.5" />
                {restaurant.area}
              </span>
            </div>
            <p className="mt-6 max-w-[440px] text-sm leading-6 text-muted">
              Ludhiana-style burritos in Sector 32. The score is computed from
              every guest note each time this page loads.
            </p>
          </div>

          <ScoreCard restaurant={restaurant} />
        </section>

        {!hasReviews && (
          <section className="mt-12 rounded-[2rem] border border-line bg-surface p-8 text-center sm:p-12">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-line text-accent">
              <PenIcon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-display text-4xl leading-tight">
              The first note is yours.
            </h2>
            <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-muted">
              No one has reviewed this table yet. Tell the next guest what to
              order.
            </p>
            <Link
              href={`/review/${restaurantId}`}
              className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Write the first review
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </section>
        )}

        {restaurant.latestReview && (
          <section className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-8">
              <div>
                <p className="eyebrow">Latest note / 02</p>
                <h2 className="mt-2 font-display text-4xl tracking-[-0.02em]">
                  The latest word.
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted">
                <ClockIcon className="h-3.5 w-3.5 text-accent" />
                Newest
              </span>
            </div>

            <article className="relative mt-6 overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:p-8">
              <QuoteIcon className="h-8 w-8 text-accent/40" />
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <RatingStars rating={restaurant.latestReview.rating} />
                <span className="h-1 w-1 rounded-full bg-line" />
                <time
                  dateTime={restaurant.latestReview.createdAt}
                  className="text-xs text-muted"
                >
                  {formatDate(restaurant.latestReview.createdAt)}
                </time>
              </div>
              <p className="mt-6 max-w-[720px] font-display text-[2rem] leading-[1.12] tracking-[-0.02em] sm:text-[2.75rem]">
                {restaurant.latestReview.comment}
              </p>
              <div className="mt-7 flex items-center gap-2 border-t border-line pt-4 text-[10px] uppercase tracking-[0.16em] text-muted">
                <ClockIcon className="h-3.5 w-3.5 text-accent" />
                Most recent guest note
              </div>
            </article>
          </section>
        )}

        {restaurant.reviews.length > 0 && (
          <section className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-8">
              <div>
                <p className="eyebrow">The guestbook / 03</p>
                <h2 className="mt-2 font-display text-4xl tracking-[-0.02em]">
                  Earlier notes.
                </h2>
              </div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                {restaurant.reviews.length}{" "}
                {restaurant.reviews.length === 1 ? "note" : "notes"}
              </p>
            </div>

            <ol className="mt-2 divide-y divide-line border-t border-line">
              {restaurant.reviews.map((review, index) => (
                <li
                  key={review.id}
                  className="group grid grid-cols-[2.25rem_1fr] gap-4 py-6 sm:gap-6"
                >
                  <div className="pt-1">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-line font-mono text-[10px] tabular-nums text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <RatingStars rating={review.rating} />
                      <time
                        dateTime={review.createdAt}
                        className="text-xs text-muted"
                      >
                        {formatDate(review.createdAt)}
                      </time>
                    </div>
                    <p className="mt-3 font-display text-2xl leading-8 tracking-[-0.01em] sm:text-[1.75rem]">
                      {review.comment}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {hasReviews && (
          <div className="mt-12 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[340px] text-sm leading-6 text-muted">
              Had a meal here? Add your note to the guestbook.
            </p>
            <Link
              href={`/review/${restaurantId}`}
              className="group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-accent px-6 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Write a review
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
