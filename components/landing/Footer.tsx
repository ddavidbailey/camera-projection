import { Wrap } from "./Wrap";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-(--color-border) py-6 sm:py-8">
      <Wrap className="flex items-center justify-between gap-6 font-code text-[10.5px] tracking-widest uppercase text-(--color-muted) flex-wrap">
        <span>↳ tracelight · v0.1 · beta</span>
        <span>privacy · terms · status</span>
        <span>en-US · 20 / 05 / 2026</span>
      </Wrap>
    </footer>
  );
}
