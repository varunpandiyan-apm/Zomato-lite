export function BurritoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 300"
      fill="none"
      className={className}
    >
      <circle
        cx="180"
        cy="150"
        r="116"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="180"
        cy="150"
        r="84"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M98 164c17-42 55-74 99-77 32-2 59 13 65 37 7 28-17 54-57 67-39 13-82 8-99-6-8-6-11-14-8-21Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M119 156c27 14 70 14 106-2 27-12 41-30 37-47"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path
        d="M132 145c18 8 40 10 61 6"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M158 130c11-15 28-25 47-27"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M217 115c9 4 15 11 18 20"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M88 175c-10 11-14 22-11 31 13 2 26-5 35-16"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M148 61c4-12 12-22 23-28M181 54c5-10 13-17 23-21M215 60c5-8 12-13 21-16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
