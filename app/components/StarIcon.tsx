export function StarIcon({
  filled = false,
  className = "",
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2.9l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.7l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2.9z" />
    </svg>
  );
}
