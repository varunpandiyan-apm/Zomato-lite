import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

type ReviewPayload = {
  restaurantId?: unknown;
  rating?: unknown;
  comment?: unknown;
};

export async function POST(request: Request) {
  let body: ReviewPayload;

  try {
    body = (await request.json()) as ReviewPayload;
  } catch {
    return NextResponse.json(
      { error: "Send a valid JSON body." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Send a valid JSON body." },
      { status: 400 },
    );
  }

  const { restaurantId, rating, comment } = body;

  // Validation order is intentional: rating, comment, then database lookup.
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 },
    );
  }

  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment cannot be empty." },
      { status: 400 },
    );
  }

  if (
    typeof restaurantId !== "number" ||
    !Number.isInteger(restaurantId) ||
    restaurantId < 1
  ) {
    return NextResponse.json(
      { error: "Restaurant not found." },
      { status: 400 },
    );
  }

  try {
    const sql = getSql();

    const restaurants = await sql`
      SELECT id
      FROM restaurants
      WHERE id = ${restaurantId}
      LIMIT 1
    `;

    if (restaurants.length === 0) {
      return NextResponse.json(
        { error: "Restaurant not found." },
        { status: 400 },
      );
    }

    const insertedReviews = await sql`
      INSERT INTO reviews (restaurant_id, rating, comment)
      VALUES (${restaurantId}, ${rating}, ${comment.trim()})
      RETURNING id
    `;

    return NextResponse.json(
      { success: true, reviewId: insertedReviews[0].id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Could not save review:", error);
    return NextResponse.json(
      { error: "Something went wrong while saving the review." },
      { status: 500 },
    );
  }
}
