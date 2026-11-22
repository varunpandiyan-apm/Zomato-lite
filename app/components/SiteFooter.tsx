import { SparkIcon } from "@/app/components/Icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-3 px-6 py-6 text-[10px] uppercase tracking-[0.16em] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Zomato Lite / Sector 32</p>
        <p className="flex items-center gap-2">
          <SparkIcon className="h-3.5 w-3.5 text-accent" />
          Facts stored. Answers computed.
        </p>
      </div>
    </footer>
  );
}
