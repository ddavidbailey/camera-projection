import Link from "next/link";
import { Wrap } from "./Wrap";

function Logomark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="10" y="6" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 20 L4 36 L36 36 L30 20 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="13" r="3" stroke="var(--color-primary)" strokeWidth="1.5" />
      <line x1="20" y1="20" x2="20" y2="36" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="1.5 2.5" />
    </svg>
  );
}

export function Header() {
  return (
    <header
      className="sticky top-0 z-10 backdrop-blur-sm saturate-[1.1] border-b"
      style={{
        background: "color-mix(in oklab, var(--color-background), transparent 18%)",
        borderColor: "color-mix(in oklab, var(--color-border), transparent 40%)",
      }}
    >
      <Wrap className="flex items-center justify-between h-16 gap-6">
        <Link href="/" className="inline-flex items-center gap-2.5 no-underline text-(--color-foreground)">
          <Logomark />
          <span className="font-heading text-[22px] tracking-[-0.01em]">Tracelight</span>
          <span className="font-code text-[10px] uppercase tracking-[0.14em] text-(--color-muted) px-[7px] py-[3px] border border-(--color-border) rounded-full ml-1">
            beta
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {(["#how", "#workshops", "#docs"] as const).map((href, i) => (
            <a
              key={href}
              href={href}
              className="font-code text-[11px] tracking-[0.14em] uppercase text-(--color-muted) no-underline hover:text-(--color-foreground) transition-colors duration-180"
            >
              {["How it works", "For workshops", "Docs"][i]}
            </a>
          ))}
        </nav>

        <div className="inline-flex items-center gap-2.5">
          <Link
            href="/auth?mode=in"
            className="font-code text-[11px] tracking-[0.14em] uppercase text-(--color-muted) no-underline py-2 hover:text-(--color-foreground) transition-colors duration-180"
          >
            Sign in
          </Link>
          <Link
            href="/auth?mode=up"
            className="group font-code text-[11px] font-medium tracking-[0.14em] uppercase no-underline px-4 py-[9px] bg-(--color-foreground) text-(--color-surface) border border-(--color-foreground) rounded-[10px] inline-flex items-center gap-2 hover:-translate-y-px transition-transform duration-180"
          >
            Sign up <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </Wrap>
    </header>
  );
}
