import Link from "next/link";
import {
  ArrowLeftIcon,
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
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={`/restaurant/${restaurantId}`}
          className="flex shrink-0 items-center gap-2"
          aria-label="Zomato Lite restaurant page"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-zred shadow-sm">
            <span className="text-[22px] font-extrabold leading-none text-white">
              z
            </span>
          </span>
          <span className="text-[22px] font-extrabold leading-none tracking-[-0.04em] text-zred">
            zomato
          </span>
          <span className="mb-0.5 self-center rounded-sm bg-ink px-1 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
            lite
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted md:inline-flex">
            <PinIcon className="h-3.5 w-3.5 text-zred" />
            Sector 32, Ludhiana
          </span>

          {action === "write" ? (
            <Link
              href={`/review/${restaurantId}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-zred px-3.5 text-sm font-semibold text-white transition-colors hover:bg-zred-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred sm:px-4"
            >
              <PenIcon className="h-3.5 w-3.5" />
              Add review
            </Link>
          ) : (
            <Link
              href={`/restaurant/${restaurantId}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-semibold text-ink transition-colors hover:border-zred hover:text-zred focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zred sm:px-4"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to restaurant</span>
              <span className="sm:hidden">Back</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
