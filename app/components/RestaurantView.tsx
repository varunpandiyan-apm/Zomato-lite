"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RatingStars } from "@/app/components/RatingStars";
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
      <main className="mx-auto min-h-screen w-full max-w-[560px] px-6 py-12 sm:py-20">
        <p className="text-sm text-muted">Loading restaurant...</p>
      </main>
    );
  }

  if (error || !restaurant) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-[560px] px-6 py-12 sm:py-20">
        <p className="text-sm leading-6 text-accent">
          {error || "Restaurant not found."}
        </p>
        <Link
          href="/restaurant/1"
          className="mt-6 inline-block text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
        >
          Go to Ludhiana Burrito
        </Link>
      </main>
    );
  }

  const hasReviews = restaurant.totalReviews > 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[560px] px-6 py-10 sm:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
        Zomato Lite
      </p>

      <header className="mt-12 border-b border-line pb-9">
        <h1 className="text-[2.5rem] font-medium leading-[1.05] tracking-[-0.045em] sm:text-[3rem]">
          {restaurant.name}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {restaurant.cuisine} <span aria-hidden="true">·</span>{" "}
          {restaurant.area}
        </p>
      </header>

      <section aria-labelledby="rating-heading" className="border-b border-line py-9">
        <h2 id="rating-heading" className="sr-only">
          Rating
        </h2>
        <div className="flex items-end gap-4">
          <p className="text-[6.25rem] font-medium leading-[0.78] tracking-[-0.075em] sm:text-[7.25rem]">
            {/* The API computed this value. This screen only prints it. */}
            {restaurant.averageRating === null ? "—" : restaurant.averageRating}
          </p>
          <div className="pb-1">
            <p className="text-sm font-medium">stars</p>
            <p className="mt-1 text-sm text-muted">
              {restaurant.totalReviews}{" "}
              {restaurant.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </section>

      {!hasReviews && (
        <section className="mt-10 rounded-2xl border border-line bg-surface p-7 text-center">
          <h2 className="text-xl font-medium tracking-[-0.02em]">
            No reviews yet.
          </h2>
          <p className="mx-auto mt-2 max-w-[340px] text-sm leading-6 text-muted">
            Be the first person to tell everyone what the burritos are like.
          </p>
          <Link
            href={`/review/${restaurantId}`}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Write the first review
          </Link>
        </section>
      )}

      {restaurant.latestReview && (
        <section className="mt-10">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Latest review
          </h2>
          <article className="mt-4 rounded-2xl border border-line border-l-2 border-l-accent bg-surface p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <RatingStars rating={restaurant.latestReview.rating} />
              <time
                dateTime={restaurant.latestReview.createdAt}
                className="text-xs text-muted"
              >
                {formatDate(restaurant.latestReview.createdAt)}
              </time>
            </div>
            <p className="mt-5 text-xl leading-8 tracking-[-0.015em]">
              {restaurant.latestReview.comment}
            </p>
          </article>
        </section>
      )}

      {restaurant.reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Earlier reviews
          </h2>
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {restaurant.reviews.map((review) => (
              <li key={review.id} className="py-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <RatingStars rating={review.rating} />
                  <time dateTime={review.createdAt} className="text-xs text-muted">
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <p className="mt-3 text-[15px] leading-7 text-ink">
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasReviews && (
        <div className="mt-12 border-t border-line pt-8">
          <Link
            href={`/review/${restaurantId}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Write a review
          </Link>
        </div>
      )}
    </main>
  );
}
