import Link from "next/link";
import { Wrap } from "./Wrap";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-(--color-border) py-6 sm:py-8">
      <Wrap className="flex items-center justify-between gap-6 font-code text-[10.5px] tracking-widest uppercase text-(--color-muted) flex-wrap">
        <span>↳ tracelight · v0.1 · beta</span>
        <span className="flex items-center gap-[10px]">
          <Link href="/privacy" className="hover:text-(--color-foreground) transition-colors no-underline">privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-(--color-foreground) transition-colors no-underline">terms</Link>
          <span>·</span>
          <span>status</span>
        </span>
      </Wrap>
    </footer>
  );
}
