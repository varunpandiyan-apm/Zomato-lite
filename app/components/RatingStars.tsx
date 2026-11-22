import { StarIcon } from "@/app/components/StarIcon";

export function RatingStars({
  rating,
  size = "small",
}: {
  rating: number;
  size?: "small" | "large";
}) {
  const iconSize = size === "large" ? "h-7 w-7" : "h-4 w-4";

  return (
    <div
      className={`flex items-center gap-1 text-accent ${
        size === "large" ? "gap-1.5" : ""
      }`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <StarIcon
          key={value}
          filled={value <= rating}
          className={`${iconSize} ${value <= rating ? "" : "text-line"}`}
        />
      ))}
    </div>
  );
}
