"use client";

import { DriveMark, DropMark } from "./icons";
import type { SourceFilter } from "./data";

interface FilterBarProps {
  source: SourceFilter;
  setSource: (v: SourceFilter) => void;
  counts: { total: number; drive: number; dropbox: number };
  sort: string;
  setSort: (v: string) => void;
}

function SegBtn({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      role="tab"
      type="button"
      className={`appearance-none border-0 px-[14px] py-[7px] font-code text-[10.5px] tracking-[0.14em] uppercase cursor-pointer rounded-full inline-flex items-center gap-[8px] transition-[color,background] duration-[0.18s] ${
        active
          ? "bg-(--color-foreground) text-(--color-surface)"
          : "bg-transparent text-(--color-muted) hover:text-(--color-foreground)"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function FilterBar({ source, setSource, counts, sort, setSort }: FilterBarProps) {
  return (
    <div className="flex items-center gap-[14px] mb-[14px] flex-wrap">
      <div
        className="inline-flex items-stretch p-[3px] border border-(--color-border) rounded-full"
        style={{ background: "color-mix(in oklab, var(--color-surface), transparent 25%)" }}
        role="tablist"
      >
        <SegBtn active={source === "all"} onClick={() => setSource("all")}>
          All <span className="opacity-70 text-[10px] tabular-nums">{counts.total}</span>
        </SegBtn>
        <SegBtn active={source === "drive"} onClick={() => setSource("drive")}>
          <DriveMark size={11} /> Google Drive <span className="opacity-70 text-[10px] tabular-nums">{counts.drive}</span>
        </SegBtn>
        <SegBtn active={source === "dropbox"} onClick={() => setSource("dropbox")}>
          <DropMark size={11} /> Dropbox <span className="opacity-70 text-[10px] tabular-nums">{counts.dropbox}</span>
        </SegBtn>
      </div>

      <span className="flex-1" />

      <button
        type="button"
        className="inline-flex items-center gap-[8px] px-[12px] py-[6px] border border-(--color-border) rounded-full font-code text-[10.5px] tracking-[0.12em] uppercase text-(--color-muted) cursor-pointer hover:text-(--color-foreground) hover:border-[color-mix(in_oklab,var(--color-primary),transparent_50%)] transition-[color,border-color] duration-[0.18s]"
        style={{ background: "color-mix(in oklab, var(--color-surface), transparent 25%)" }}
      >
        Sort: <strong className="text-(--color-foreground) ml-1">{sort}</strong>
        <span className="opacity-50">▾</span>
      </button>
    </div>
  );
}
