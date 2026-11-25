type IconProps = {
  className?: string;
};

const iconProps = {
  "aria-hidden": true as const,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function PinIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

export function UtensilsIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M7 3v7.5M7 10.5V21M7 10.5H5.2A2.2 2.2 0 0 1 3 8.3V3M7 10.5h1.8A2.2 2.2 0 0 0 11 8.3V3" />
      <path d="M16.5 3c-1.5 1.4-2.2 3.3-2.2 5.6 0 2 .8 3.5 2.2 4.4V21M16.5 3c1.5 1.4 2.2 3.3 2.2 5.6 0 2-.8 3.5-2.2 4.4" />
    </svg>
  );
}

export function UserIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.5 3.4-5.5 7-5.5s6.2 2 7 5.5" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="m14 6-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function PenIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
      <path d="m13.5 7.5 3 3" />
    </svg>
  );
}

export function InfoIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 7.8v.1" />
    </svg>
  );
}
