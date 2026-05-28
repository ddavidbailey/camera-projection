export function PageHeader() {
  return (
    <div className="mb-[22px]">
      <div>
        <div className="inline-flex items-center gap-[8px] font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted) mb-[10px]">
          <span
            className="w-[6px] h-[6px] rounded-full bg-(--color-success) animate-auth-pulse"
            style={{ boxShadow: "0 0 0 3px color-mix(in oklab, var(--color-success), transparent 80%)" }}
          />
          <span>Drive · Dropbox connected</span>
        </div>

        <h1 className="font-heading font-normal text-[clamp(36px,4.4vw,56px)] leading-[1.04] tracking-[-0.02em] m-0 text-balance text-(--color-foreground)">
          Your worksheets, <em className="italic text-(--color-primary)">in one place.</em>
        </h1>

        <p className="mt-[8px] text-[14.5px] leading-[1.5] text-(--color-muted) max-w-[56ch]">
          Anything in your connected Drive and Dropbox folders shows up here. Pick one, share a temporary link, and your workshop is on.
        </p>
      </div>

    </div>
  );
}
