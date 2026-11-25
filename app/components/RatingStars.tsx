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
    large: "h-5 w-5",
    xl: "h-7 w-7",
  }[size];

  const clampedRating = Math.max(0, Math.min(5, rating));
  const fillWidth = `${(clampedRating / 5) * 100}%`;

  return (
    <div
      className={`relative inline-flex ${className}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <div className="flex items-center gap-0.5 text-line">
        {[1, 2, 3, 4, 5].map((value) => (
          <StarIcon key={value} filled className={iconSize} />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: fillWidth }}
      >
        <div className="flex items-center gap-0.5 text-star">
          {[1, 2, 3, 4, 5].map((value) => (
            <StarIcon key={value} filled className={iconSize} />
          ))}
        </div>
      </div>
    </div>
  );
}
