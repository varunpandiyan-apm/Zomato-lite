import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

type RestaurantStatsRow = {
  name: string;
  cuisine: string;
  area: string;
  average_rating: number | null;
  total_reviews: number;
};

type ReviewRow = {
  id: number;
  rating: number;
  comment: string;
  created_at: string | Date;
};

function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json(
      { error: "Restaurant not found." },
      { status: 404 },
    );
  }

  try {
    const sql = getSql();

    // Facts are stored; the rating, count and latest review are computed now.
    const restaurantRows = (await sql`
      SELECT
        r.name,
        r.cuisine,
        r.area,
        ROUND(AVG(rv.rating)::numeric, 1)::double precision AS average_rating,
        COUNT(rv.id)::int AS total_reviews
      FROM restaurants r
      LEFT JOIN reviews rv ON rv.restaurant_id = r.id
      WHERE r.id = ${restaurantId}
      GROUP BY r.id
    `) as RestaurantStatsRow[];

    if (restaurantRows.length === 0) {
      return NextResponse.json(
        { error: "Restaurant not found." },
        { status: 404 },
      );
    }

    const restaurant = restaurantRows[0];

    const latestRows = (await sql`
      SELECT id, rating, comment, created_at
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
      ORDER BY created_at DESC, id DESC
      LIMIT 1
    `) as ReviewRow[];

    // The latest review is shown separately, so this list starts at the
    // second-newest review. That keeps it from appearing twice on the page.
    const olderRows = (await sql`
      SELECT id, rating, comment, created_at
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
      ORDER BY created_at DESC, id DESC
      OFFSET 1
    `) as ReviewRow[];

    return NextResponse.json({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      area: restaurant.area,
      averageRating: restaurant.average_rating,
      totalReviews: restaurant.total_reviews,
      latestReview: latestRows.length > 0 ? toReview(latestRows[0]) : null,
      reviews: olderRows.map(toReview),
    });
  } catch (error) {
    console.error("Could not load restaurant:", error);
    return NextResponse.json(
      { error: "Something went wrong while loading the restaurant." },
      { status: 500 },
    );
  }
}
