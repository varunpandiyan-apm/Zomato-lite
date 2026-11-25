import { StarIcon } from "@/app/components/StarIcon";

function toneClass(rating: number) {
  if (rating >= 4) {
    return "bg-green";
  }

  if (rating >= 3) {
    return "bg-gold";
  }

  return "bg-zred";
}

export function RatingBadge({
  rating,
  size = "md",
  className = "",
}: {
  rating: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const boxSize = {
    sm: "gap-0.5 rounded px-1.5 py-0.5 text-xs",
    md: "gap-1 rounded-md px-2 py-1 text-sm",
    lg: "gap-1.5 rounded-lg px-3 py-2 text-2xl",
    xl: "gap-2 rounded-lg px-4 py-2.5 text-4xl",
  }[size];

  const starSize = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-4 w-4",
    xl: "h-5 w-5",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold text-white tabular-nums ${boxSize} ${toneClass(
        rating,
      )} ${className}`}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {rating}
      <StarIcon filled className={starSize} />
    </span>
  );
}
