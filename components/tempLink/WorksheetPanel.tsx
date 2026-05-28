"use client";

import { WorksheetThumb } from "./WorksheetThumb";
import { CropMark } from "./CropMark";

export interface Worksheet {
  id: string;
  file: string;
  pages: number;
}

export interface WorksheetPanelProps {
  worksheet: Worksheet | null;
  pageIndex: number;
  setPageIndex: (v: number) => void;
}

const pagerBtn =
  "bg-transparent border border-(--color-border) w-[26px] h-[26px] rounded-[2px] inline-grid place-items-center cursor-pointer text-(--color-foreground) transition-[border-color,color] duration-[0.18s] hover:border-(--color-primary) hover:text-(--color-primary) disabled:opacity-35 disabled:cursor-default";

export function WorksheetPanel({ worksheet, pageIndex, setPageIndex }: WorksheetPanelProps) {
  if (!worksheet) return null;

  return (
    <section className="relative bg-(--color-surface) border border-(--color-border) p-[18px] pb-[16px]" aria-label="Worksheet">
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />

      <div className="flex items-center gap-[10px] mb-[14px]">
        <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-primary)">01</span>
        <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-muted)">Worksheet</span>
      </div>

      <div className="relative aspect-[210/297] bg-(--color-background) border border-(--color-border) rounded-[2px] overflow-hidden mb-[12px]">
        <WorksheetThumb pageIndex={pageIndex} />
      </div>

      <div className="flex items-center gap-[10px] font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted)">
        <span className="text-(--color-foreground) flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {worksheet.file}
        </span>
        <span className="text-(--color-primary)">{worksheet.pages}pp</span>
      </div>

      <div className="flex items-center gap-[6px] mt-[10px] font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted)">
        <button
          type="button"
          className={pagerBtn}
          onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0}
          aria-label="Previous page"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M6.5 2L3 5l3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          className={pagerBtn}
          onClick={() => setPageIndex(Math.min(worksheet.pages - 1, pageIndex + 1))}
          disabled={pageIndex >= worksheet.pages - 1}
          aria-label="Next page"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3.5 2L7 5l-3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="px-[6px]">
          <strong className="text-(--color-foreground) font-medium">
            {String(pageIndex + 1).padStart(2, "0")}
          </strong>
          <span className="opacity-55"> / {String(worksheet.pages).padStart(2, "0")}</span>
        </span>
        <span className="flex-1" />
        <span className="opacity-55">page</span>
      </div>
    </section>
  );
}
