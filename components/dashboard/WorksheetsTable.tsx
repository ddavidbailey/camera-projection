"use client";

import { Thumb } from "./Thumb";
import { SourceMark } from "./icons";
import { CropMark } from "./CropMark";
import { SOURCES, type Worksheet, type SourceFilter } from "./data";
import { Logomark } from "@/components/tempLink/Logomark";
import { DriveMark, DropMark } from "./icons";

const actBase = "appearance-none bg-transparent border border-(--color-border) px-[10px] py-[6px] font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-foreground) cursor-pointer rounded-[2px] inline-flex items-center gap-[6px] transition-[border-color,color,background] duration-[0.18s] hover:border-(--color-primary) hover:text-(--color-primary)";
const actPrimary = "appearance-none bg-(--color-foreground) text-(--color-surface) border border-(--color-foreground) px-[10px] py-[6px] font-code text-[9.5px] tracking-[0.14em] uppercase cursor-pointer rounded-[2px] inline-flex items-center gap-[6px] transition-[background,color,border-color] duration-[0.18s] hover:bg-(--color-surface) hover:text-(--color-foreground)";
const actIcon  = "appearance-none w-[28px] h-[28px] inline-grid place-items-center bg-transparent border border-(--color-border) rounded-[2px] cursor-pointer text-(--color-muted) transition-[border-color,color] duration-[0.18s] hover:border-(--color-primary) hover:text-(--color-primary)";

function EmptyState({ source }: { source: SourceFilter }) {
  const icon =
    source === "drive"   ? <DriveMark size={22} /> :
    source === "dropbox" ? <DropMark  size={22} /> :
                           <Logomark  size={22} />;

  const label =
    source === "drive"   ? "Drive" :
    source === "dropbox" ? "Dropbox" :
                           "any source";

  return (
    <div className="py-[60px] px-[30px] text-center text-(--color-muted)">
      <div className="mx-auto mb-[16px] w-[56px] h-[56px] border border-dashed border-(--color-border) rounded-[4px] grid place-items-center">
        {icon}
      </div>
      <h3 className="font-heading text-[22px] text-(--color-foreground) m-0 mb-[8px]">
        Nothing in <em className="italic text-(--color-primary)">{label}</em> yet.
      </h3>
      <p className="m-0 font-code text-[10.5px] tracking-[0.14em] uppercase">
        Drop a PDF or image into the watched folder.
      </p>
    </div>
  );
}

export function WorksheetsTable({
  rows,
  source,
  selected,
  onToggle,
}: {
  rows: Worksheet[];
  source: SourceFilter;
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="relative bg-(--color-surface) border border-(--color-border)">
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />

      {rows.length === 0 ? (
        <EmptyState source={source} />
      ) : (
        <>
          {/* Header row */}
          <div className="dash-row dash-thead border-b border-(--color-border) font-code text-[10px] tracking-[0.16em] uppercase text-(--color-muted)">
            <span className="w-[18px] flex-shrink-0" />
            <span className="w-[33px] flex-shrink-0" />
            <span className="flex-1 min-w-0 inline-flex items-center gap-[6px] text-(--color-foreground) cursor-pointer">
              Worksheet <span className="opacity-60">↓</span>
            </span>
            <span className="dash-col-source flex-shrink-0 w-[110px]">Source</span>
            <span className="dash-col-modified flex-shrink-0 w-[90px]">Modified</span>
            <span className="dash-col-actions flex-shrink-0 ml-auto">Actions</span>
          </div>

          {/* Data rows */}
          {rows.map((r, i) => {
            const S = SOURCES[r.source];
            return (
              <div
                key={r.id}
                className={`dash-row transition-[background] duration-[0.15s] hover:bg-[color-mix(in_oklab,var(--color-background),white_2%)] ${i < rows.length - 1 ? "border-b border-dashed border-[color-mix(in_oklab,var(--color-border),transparent_25%)]" : ""}`}
              >
                {/* Checkbox */}
                <div className="w-[18px] flex-shrink-0 flex items-center justify-center">
                  <label className="relative w-[14px] h-[14px] block flex-shrink-0 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selected.has(r.id)}
                      onChange={() => onToggle(r.id)}
                      aria-label={`Select ${r.name}`}
                      className="sr-only peer"
                    />
                    {/* Box */}
                    <span className="absolute inset-0 rounded-[3px] border transition-[background,border-color,box-shadow] duration-[0.15s] border-(--color-border) bg-(--color-background) group-hover:border-(--color-primary) peer-checked:bg-(--color-primary) peer-checked:border-(--color-primary) peer-focus-visible:[box-shadow:0_0_0_2px_color-mix(in_oklab,var(--color-primary),transparent_60%)]" />
                    {/* Tick */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-[0.15s]"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path d="M3 7.2l2.8 2.8 5.2-5.2" stroke="var(--color-surface)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </label>
                </div>

                {/* Thumbnail */}
                <div className="w-[33px] flex-shrink-0 aspect-[210/297] bg-(--color-background) border border-(--color-border) rounded-[1px] overflow-hidden relative">
                  <Thumb variant={r.thumb} />
                  <span className="absolute -bottom-px -right-px font-code text-[7px] tracking-[0.04em] px-[3px] py-[1px] bg-(--color-surface) border border-(--color-border) rounded-tl-[1px] text-(--color-muted)">
                    {r.pages}p
                  </span>
                </div>

                {/* Name + path */}
                <div className="flex-1 min-w-0">
                  <div className="font-ui text-[14.5px] font-medium tracking-[-0.005em] text-(--color-foreground) leading-[1.25] whitespace-nowrap overflow-hidden text-ellipsis">
                    {r.name}
                  </div>
                  <div className="mt-[3px] font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted) whitespace-nowrap overflow-hidden text-ellipsis">
                    {r.path}
                  </div>
                </div>

                {/* Source badge */}
                <div className="dash-col-source flex-shrink-0 w-[110px]">
                  <span
                    className="inline-flex items-center gap-[7px] font-code text-[10px] tracking-[0.14em] uppercase text-(--color-foreground) px-[6px] py-[4px] pr-[9px] border border-(--color-border) rounded-full whitespace-nowrap"
                    style={{ background: "color-mix(in oklab, var(--color-background), white 2%)" }}
                  >
                    <span className="w-[14px] h-[14px] inline-grid place-items-center">
                      <SourceMark id={r.source} />
                    </span>
                    {S.short}
                  </span>
                </div>

                {/* Modified */}
                <div className="dash-col-modified flex-shrink-0 w-[90px] font-code text-[10.5px] tracking-[0.14em] uppercase text-(--color-muted) tabular-nums">
                  {r.modified}
                </div>

                {/* Actions */}
                <div className="dash-col-actions flex-shrink-0 ml-auto inline-flex items-center gap-[6px]">
                  <button type="button" className={actBase}>Open</button>
<button type="button" className={actIcon} aria-label="More">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <circle cx="3" cy="7" r="1.2" />
                      <circle cx="7" cy="7" r="1.2" />
                      <circle cx="11" cy="7" r="1.2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
