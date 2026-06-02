"use client";

import { useEffect } from "react";
import { CropMark } from "./CropMark";
import type { Worksheet } from "./data";

export function WorksheetPreviewModal({
  worksheet,
  onClose,
}: {
  worksheet: Worksheet | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!worksheet) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [worksheet, onClose]);

  if (!worksheet) return null;

  const provider = worksheet.source === "drive" ? "drive" : "dropbox";
  const mime = worksheet.mimeType ?? "application/octet-stream";
  const src = `/api/preview/${provider}/${encodeURIComponent(worksheet.id)}?mime=${encodeURIComponent(mime)}`;
  const isImage = mime.startsWith("image/");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-(--color-surface) border border-(--color-border) flex flex-col w-full max-w-[900px] max-h-[90dvh]"
        style={{ boxShadow: "var(--shadow-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <CropMark position="tl" />
        <CropMark position="tr" />
        <CropMark position="bl" />
        <CropMark position="br" />

        {/* Header */}
        <div className="flex items-center justify-between gap-[12px] px-[18px] py-[12px] border-b border-(--color-border) flex-shrink-0">
          <span className="font-ui text-[13.5px] font-medium text-(--color-foreground) truncate min-w-0">
            {worksheet.name}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-[26px] h-[26px] inline-grid place-items-center bg-transparent border border-(--color-border) rounded-[2px] cursor-pointer text-(--color-muted) hover:text-(--color-foreground) hover:border-(--color-primary) transition-[color,border-color] duration-[0.15s]"
            aria-label="Close preview"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0 bg-(--color-background)">
          {isImage ? (
            <img
              src={src}
              alt={worksheet.name}
              className="w-full h-full object-contain"
              style={{ maxHeight: "calc(90dvh - 53px)" }}
            />
          ) : (
            <iframe
              src={src}
              title={worksheet.name}
              className="w-full border-0"
              style={{ height: "calc(90dvh - 53px)" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
