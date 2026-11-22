import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing. Add it to .env.local first.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const schemaPath = join(process.cwd(), "db", "schema.sql");
const schema = await readFile(schemaPath, "utf8");

// The schema file is split into individual statements because Neon's HTTP
// driver expects one statement per request.
const statements = schema
  .replace(/--.*$/gm, "")
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

let restaurantId;

const existingRestaurants = await sql`
  SELECT id
  FROM restaurants
  WHERE name = 'Ludhiana Burrito'
  LIMIT 1
`;

if (existingRestaurants.length > 0) {
  restaurantId = existingRestaurants[0].id;
  console.log(`Restaurant already exists with id ${restaurantId}.`);
} else {
  const insertedRestaurants = await sql`
    INSERT INTO restaurants (name, cuisine, area)
    VALUES ('Ludhiana Burrito', 'Indian', 'Sector 32')
    RETURNING id
  `;
  restaurantId = insertedRestaurants[0].id;
  console.log(`Created restaurant with id ${restaurantId}.`);
}

const reviewCountRows = await sql`
  SELECT COUNT(*)::int AS count
  FROM reviews
  WHERE restaurant_id = ${restaurantId}
`;

if (reviewCountRows[0].count === 0) {
  await sql`
    INSERT INTO reviews (restaurant_id, rating, comment, created_at)
    VALUES
      (${restaurantId}, 5, 'Paneer burrito is unreal', NOW() - INTERVAL '8 days'),
      (${restaurantId}, 4, 'Good, but slow service', NOW() - INTERVAL '6 days'),
      (${restaurantId}, 4, 'Solid. Would repeat.', NOW() - INTERVAL '2 days')
  `;
  console.log("Seeded three reviews.");
} else {
  console.log("Reviews already exist; seed skipped.");
}

const restaurants = await sql`
  SELECT id, name, cuisine, area
  FROM restaurants
  ORDER BY id
`;

const reviews = await sql`
  SELECT id, restaurant_id, rating, comment, created_at
  FROM reviews
  WHERE restaurant_id = ${restaurantId}
  ORDER BY created_at ASC, id ASC
`;

console.log("\nrestaurants");
console.table(restaurants);

console.log("\nreviews");
console.table(reviews);
