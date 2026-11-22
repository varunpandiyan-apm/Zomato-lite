# Zomato Lite

A small restaurant review app built to show where an application's logic
actually lives.

- **Frontend:** Next.js 15 App Router, React, TypeScript, Tailwind CSS
- **Backend:** Next.js route handlers with raw SQL
- **Database:** Neon Postgres via `@neondatabase/serverless`
- **Deployment:** Vercel

## Local setup

```bash
npm install
```

Create `.env.local` with your Neon connection string:

```text
DATABASE_URL=postgresql://...
```

Apply the schema and seed the restaurant and reviews:

```bash
npm run db:setup
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Purpose |
| --- | --- |
| `/restaurant/1` | Restaurant details and reviews |
| `/review/1` | Review form |
| `GET /api/restaurants/1` | Restaurant details, computed average, latest and older reviews |
| `POST /api/reviews` | Validate and save one review |

The database stores review facts only. `averageRating`, `totalReviews`, and
`latestReview` are computed on every request; there is no stored average column.
