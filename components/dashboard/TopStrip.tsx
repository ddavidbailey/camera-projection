"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logomark } from "@/components/tempLink/Logomark";
import { authClient, signOut } from "@/utils/auth-client";

interface TopStripProps {
  search: string;
  setSearch: (v: string) => void;
}

export function TopStrip({ search, setSearch }: TopStripProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const email = session?.user?.email ?? "";
  const initial = email.charAt(0).toUpperCase() || "?";

  async function handleSignOut() {
    await signOut();
    router.push("/auth");
  }
  return (
    <header
      className="sticky top-0 z-10 border-b"
      style={{
        background: "color-mix(in oklab, var(--color-background), transparent 18%)",
        borderColor: "color-mix(in oklab, var(--color-border), transparent 40%)",
        backdropFilter: "blur(8px) saturate(110%)",
      }}
    >
      <div className="w-full max-w-[1480px] mx-auto px-8 max-[720px]:px-[18px] flex items-center gap-[18px] h-[60px]">
        <Link href="/" className="inline-flex items-center gap-[10px] text-(--color-foreground) no-underline">
          <Logomark size={24} />
          <span className="font-heading text-[20px] tracking-[-0.01em]">Tracelight</span>
          <span className="font-code text-[10px] uppercase tracking-[0.14em] text-(--color-muted) px-[7px] py-[3px] border border-(--color-border) rounded-full ml-1">
            beta
          </span>
        </Link>

        <span className="inline-flex items-center gap-[10px] font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted)">
          <span>workspace</span>
          <span className="opacity-45">/</span>
          <span className="text-(--color-foreground)">worksheets</span>
        </span>

        <span className="flex-1" />

        <div
          className="hidden min-[880px]:inline-flex items-center gap-[8px] px-[12px] py-[6px] border border-(--color-border) rounded-full w-[280px] max-w-[30vw]"
          style={{ background: "color-mix(in oklab, var(--color-surface), transparent 30%)" }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <line x1="9.2" y1="9.2" x2="12.3" y2="12.3" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          </svg>
          <input
            type="text"
            className="appearance-none bg-transparent border-0 outline-none font-code text-[11px] tracking-[0.04em] text-(--color-foreground) flex-1 min-w-0 placeholder:text-[color-mix(in_oklab,var(--color-muted),transparent_20%)]"
            placeholder="Search worksheets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span
            className="font-code text-[9.5px] tracking-[0.12em] text-(--color-muted) px-[6px] py-[2px] border border-(--color-border) rounded-[4px]"
            style={{ background: "color-mix(in oklab, var(--color-background), white 1%)" }}
          >
            ⌘K
          </span>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-[9px] pl-[5px] pr-[10px] py-[5px] border border-(--color-border) rounded-full cursor-pointer"
          style={{ background: "color-mix(in oklab, var(--color-surface), transparent 30%)" }}
        >
          <span
            className="w-[22px] h-[22px] rounded-full bg-(--color-primary) text-(--color-surface) inline-grid place-items-center font-heading text-[12px]"
          >
            {initial}
          </span>
          <span className="font-code text-[10.5px] tracking-[0.12em] uppercase text-(--color-muted)">
            {email}
          </span>
        </button>
      </div>
    </header>
  );
}
