"use client";

import { WorksheetThumb } from "./WorksheetThumb";
import { CropMark } from "./CropMark";

export interface ShareLinkFile {
  id: string;
  fileId: string;
  provider: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  sortOrder: number;
}

export interface WorksheetPanelProps {
  files: ShareLinkFile[];
  pageIndex: number;
  setPageIndex: (i: number) => void;
}

const pagerBtn =
  "bg-transparent border border-(--color-border) w-[26px] h-[26px] rounded-[2px] inline-grid place-items-center cursor-pointer text-(--color-foreground) transition-[border-color,color] duration-[0.18s] hover:border-(--color-primary) hover:text-(--color-primary) disabled:opacity-35 disabled:cursor-default";

export function WorksheetPanel({ files, pageIndex, setPageIndex }: WorksheetPanelProps) {
  if (files.length === 0) {
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
        <p className="font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted) m-0">No files</p>
      </section>
    );
  }

  const currentFile = files[pageIndex];
  const title = currentFile.fileName.replace(/\.[^.]+$/, "");
  const providerLabel = currentFile.provider === "dropbox" ? "Dropbox" : "Drive";

  return (
    <section className="relative bg-(--color-surface) border border-(--color-border) p-[18px] pb-[16px] min-[880px]:flex-1 min-[880px]:flex min-[880px]:flex-col min-[880px]:min-h-0 min-[880px]:overflow-hidden min-[880px]:p-[14px] min-[880px]:pb-[12px]" aria-label="Worksheet">
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />

      <div className="flex items-center gap-[10px] mb-[14px] min-[880px]:mb-[10px]">
        <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-primary)">01</span>
        <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-muted)">Worksheet</span>
      </div>

      <div className="relative aspect-[210/297] bg-(--color-background) border border-(--color-border) rounded-[2px] overflow-hidden mb-[12px] min-[880px]:flex-1 min-[880px]:aspect-auto min-[880px]:min-h-0 min-[880px]:mb-[8px]">
        <WorksheetThumb pageIndex={pageIndex} />
      </div>

      <div className="flex items-center gap-[10px] font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted)">
        <span className="text-(--color-foreground) flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </span>
        <span className="text-(--color-primary)">{providerLabel}</span>
      </div>

      <div className="flex items-center gap-[6px] mt-[10px] font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted)">
        <button
          type="button"
          className={pagerBtn}
          onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0}
          aria-label="Previous file"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M6.5 2L3 5l3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          className={pagerBtn}
          onClick={() => setPageIndex(Math.min(files.length - 1, pageIndex + 1))}
          disabled={pageIndex >= files.length - 1}
          aria-label="Next file"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3.5 2L7 5l-3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="px-[6px]">
          <strong className="text-(--color-foreground) font-medium">
            {String(pageIndex + 1).padStart(2, "0")}
          </strong>
          <span className="opacity-55"> / {String(files.length).padStart(2, "0")}</span>
        </span>
        <span className="flex-1" />
        <span className="opacity-55">file</span>
      </div>
    </section>
  );
}
