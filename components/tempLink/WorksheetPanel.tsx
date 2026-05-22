"use client";

import { WorksheetThumb } from "./WorksheetThumb";

export interface Worksheet {
  id: string;
  file: string;
  pages: number;
}

export interface WorksheetPanelProps {
  worksheet: Worksheet;
  pageIndex: number;
  setPageIndex: (v: number) => void;
}

export function WorksheetPanel({ worksheet, pageIndex, setPageIndex }: WorksheetPanelProps) {
  return (
    <section className="view-panel" aria-label="Worksheet">
      <span className="crop crop-tl" />
      <span className="crop crop-tr" />
      <span className="crop crop-bl" />
      <span className="crop crop-br" />

      <div className="view-panel-head">
        <span className="view-panel-num">01</span>
        <span className="view-panel-title">Worksheet</span>
      </div>

      <div className="view-sheet">
        <WorksheetThumb pageIndex={pageIndex} />
      </div>

      <div className="view-sheet-meta">
        <span className="filename">{worksheet.file}</span>
        <span className="pages">{worksheet.pages}pp</span>
      </div>

      <div className="view-pager">
        <button
          type="button"
          className="view-pager-btn"
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
          className="view-pager-btn"
          onClick={() => setPageIndex(Math.min(worksheet.pages - 1, pageIndex + 1))}
          disabled={pageIndex >= worksheet.pages - 1}
          aria-label="Next page"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3.5 2L7 5l-3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="view-pager-pos">
          <strong>{String(pageIndex + 1).padStart(2, "0")}</strong>
          <span className="view-pager-of"> / {String(worksheet.pages).padStart(2, "0")}</span>
        </span>
        <span className="view-pager-spacer" />
        <span className="view-pager-of">page</span>
      </div>
    </section>
  );
}
