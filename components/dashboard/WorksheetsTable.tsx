"use client";

import { useRef, useState, useEffect } from "react";
import { Thumb } from "./Thumb";
import { SourceMark } from "./icons";
import { CropMark } from "./CropMark";
import { SOURCES, type Worksheet, type SourceFilter } from "./data";
import { Logomark } from "@/components/tempLink/Logomark";
import { DriveMark, DropMark } from "./icons";

function truncateName(name: string, max = 16): string {
  if (name.length <= max) return name;
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex > 0 ? name.slice(dotIndex + 1) : "";
  return `${name.slice(0, max)}...${ext}`;
}

const actBase = "appearance-none bg-transparent border border-(--color-border) px-[10px] py-[6px] font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-foreground) cursor-pointer rounded-[2px] inline-flex items-center gap-[6px] transition-[border-color,color,background] duration-[0.18s] hover:border-(--color-primary) hover:text-(--color-primary)";
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

function OverflowMenu({
  row,
  onRename,
  onDelete,
}: {
  row: Worksheet;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) { setConfirmDelete(false); return; }
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={actIcon}
        aria-label="More"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="3" cy="7" r="1.2" />
          <circle cx="7" cy="7" r="1.2" />
          <circle cx="11" cy="7" r="1.2" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[148px] border border-(--color-border) rounded-[10px] overflow-hidden"
          style={{
            background: "color-mix(in oklab, var(--color-surface), transparent 4%)",
            boxShadow: "var(--shadow-card)",
            backdropFilter: "blur(12px) saturate(120%)",
          }}
        >
          <div className="p-[5px] flex flex-col gap-[2px]">
            <button
              type="button"
              className="w-full flex items-center gap-[8px] px-[10px] py-[7px] rounded-[6px] font-code text-[10px] tracking-[0.1em] uppercase text-(--color-muted) hover:text-(--color-foreground) cursor-pointer bg-transparent border-0 text-left transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in oklab, var(--color-border), transparent 40%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => {
                setOpen(false);
                onRename(row.id, row.name);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9.5 2.5a1.414 1.414 0 0 1 2 2L4 12H2v-2L9.5 2.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Rename
            </button>

            <div className="h-px mx-[6px] bg-(--color-border) opacity-50" />

            {confirmDelete ? (
              <div className="px-[10px] py-[7px] flex flex-col gap-[6px]">
                <span className="font-code text-[9.5px] tracking-[0.1em] uppercase text-(--color-muted)">
                  Delete this file?
                </span>
                <div className="flex gap-[6px]">
                  <button
                    type="button"
                    className="flex-1 px-[6px] py-[4px] rounded-[5px] font-code text-[9.5px] tracking-[0.1em] uppercase text-(--color-surface) bg-(--color-foreground) border-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => { setOpen(false); onDelete(row.id); }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-[6px] py-[4px] rounded-[5px] font-code text-[9.5px] tracking-[0.1em] uppercase text-(--color-muted) bg-transparent border border-(--color-border) cursor-pointer hover:text-(--color-foreground) transition-colors"
                    onClick={() => setConfirmDelete(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="w-full flex items-center gap-[8px] px-[10px] py-[7px] rounded-[6px] font-code text-[10px] tracking-[0.1em] uppercase text-(--color-muted) hover:text-red-400 cursor-pointer bg-transparent border-0 text-left transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in oklab, var(--color-border), transparent 40%)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                onClick={() => setConfirmDelete(true)}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.5a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9L11 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InlineRename({
  initialName,
  onCommit,
  onCancel,
}: {
  initialName: string;
  onCommit: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.select(); }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); if (value.trim() && value.trim() !== initialName) onCommit(value.trim()); else onCancel(); }
    if (e.key === "Escape") onCancel();
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKey}
      onBlur={() => { if (value.trim() && value.trim() !== initialName) onCommit(value.trim()); else onCancel(); }}
      className="font-ui text-[14.5px] font-medium tracking-[-0.005em] text-(--color-foreground) bg-transparent border-b border-(--color-primary) outline-none w-full min-w-0 leading-[1.4] px-0"
      aria-label="Rename file"
    />
  );
}

export function WorksheetsTable({
  rows,
  source,
  selected,
  onToggle,
  onDelete,
  onRename,
}: {
  rows: Worksheet[];
  source: SourceFilter;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingOriginal, setRenamingOriginal] = useState("");

  function startRename(id: string, currentName: string) {
    setRenamingId(id);
    setRenamingOriginal(currentName);
  }

  function commitRename(id: string, newName: string) {
    setRenamingId(null);
    onRename(id, newName);
  }

  function cancelRename() {
    setRenamingId(null);
  }

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
            <div className="w-[18px] flex-shrink-0" />
            <div className="w-[33px] flex-shrink-0" />
            <div className="flex-1 min-w-0 flex items-center gap-[6px] text-(--color-foreground) cursor-pointer">
              Worksheet <span className="opacity-60">↓</span>
            </div>
            <div className="dash-col-source flex-shrink-0 w-[110px]">Source</div>
            <div className="dash-col-modified flex-shrink-0 w-[90px]">Modified</div>
            <div className="dash-col-actions flex-shrink-0 w-[100px] text-right">Actions</div>
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
                    <span className="absolute inset-0 rounded-[3px] border transition-[background,border-color,box-shadow] duration-[0.15s] border-(--color-border) bg-(--color-background) group-hover:border-(--color-primary) peer-checked:bg-(--color-primary) peer-checked:border-(--color-primary) peer-focus-visible:[box-shadow:0_0_0_2px_color-mix(in_oklab,var(--color-primary),transparent_60%)]" />
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

                {/* Name + inline rename */}
                <div className="flex-1 min-w-0">
                  {renamingId === r.id ? (
                    <InlineRename
                      initialName={renamingOriginal}
                      onCommit={(newName) => commitRename(r.id, newName)}
                      onCancel={cancelRename}
                    />
                  ) : (
                    <div className="font-ui text-[14.5px] font-medium tracking-[-0.005em] text-(--color-foreground) leading-[1.25]">
                      {truncateName(r.name)}
                    </div>
                  )}
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
                <div className="dash-col-actions flex-shrink-0 w-[100px] flex items-center justify-end gap-[6px]">
                  <button type="button" className={actBase}>Open</button>
                  <OverflowMenu
                    row={r}
                    onRename={startRename}
                    onDelete={onDelete}
                  />
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
