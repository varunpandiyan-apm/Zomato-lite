export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-zred">
            <span className="text-lg font-extrabold leading-none text-white">
              z
            </span>
          </span>
          <span className="text-lg font-extrabold leading-none tracking-[-0.04em] text-zred">
            zomato
          </span>
          <span className="rounded-sm bg-ink px-1 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
            lite
          </span>
        </div>
        <p className="max-w-[440px] text-xs leading-5 text-muted sm:text-right">
          A small restaurant review app. Ratings are computed live from guest
          reviews — never stored twice.
        </p>
      </div>
    </footer>
  );
}
