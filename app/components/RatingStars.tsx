import { StarIcon } from "@/app/components/StarIcon";

export function RatingStars({
  rating,
  size = "small",
  className = "",
}: {
  rating: number;
  size?: "small" | "large" | "xl";
  className?: string;
}) {
  const iconSize = {
    small: "h-4 w-4",
    large: "h-6 w-6",
    xl: "h-8 w-8",
  }[size];

  const gap = size === "small" ? "gap-1" : "gap-1.5";

  return (
    <div
      className={`flex items-center text-accent ${gap} ${className}`}
      role="img"
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
