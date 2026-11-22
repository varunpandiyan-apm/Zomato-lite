import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  PenIcon,
  PinIcon,
} from "@/app/components/Icons";

export function SiteHeader({
  restaurantId,
  action,
}: {
  restaurantId: number;
  action: "write" | "back";
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4 px-6 py-5 sm:px-8">
        <Link
          href={`/restaurant/${restaurantId}`}
          className="group flex items-center gap-3"
          aria-label="Zomato Lite restaurant page"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-ink/20 bg-surface font-display text-xl leading-none transition-colors group-hover:border-accent group-hover:text-accent">
            Z
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.24em] text-ink sm:inline">
            Zomato Lite
          </span>
        </Link>

        <span className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted md:flex">
          <PinIcon className="h-3.5 w-3.5 text-accent" />
          Sector 32
        </span>

        {action === "write" ? (
          <Link
            href={`/review/${restaurantId}`}
            className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-[10px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <PenIcon className="h-3.5 w-3.5" />
            Write a review
            <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ) : (
          <Link
            href={`/restaurant/${restaurantId}`}
            className="group inline-flex min-h-10 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to restaurant
          </Link>
        )}
      </div>
    </header>
  );
}
