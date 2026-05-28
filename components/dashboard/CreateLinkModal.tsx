"use client";

import { useState, useEffect } from "react";
import { CropMark } from "./CropMark";

interface ModalFile {
  id: string;
  fileName: string;
  provider: string;
  fileId: string;
  filePath: string;
  mimeType: string;
}

interface CreateLinkModalProps {
  open: boolean;
  files: ModalFile[];
  onClose: () => void;
}

const EXPIRY_OPTIONS: Array<1 | 4 | 8 | 24> = [1, 4, 8, 24];

export function CreateLinkModal({ open, files, onClose }: CreateLinkModalProps) {
  const [step, setStep] = useState<"configure" | "created">("configure");
  const [expiryHours, setExpiryHours] = useState<1 | 4 | 8 | 24>(4);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open]);

  if (!open) return null;

  const generatedUrl = token && typeof window !== "undefined" ? `${window.location.origin}/t/${token}` : token ? `/t/${token}` : "";

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/share-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, expiryHours }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Failed to create link");
      }
      const data = await res.json() as { token: string };
      setToken(data.token);
      setStep("created");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setStep("configure");
    setExpiryHours(4);
    setToken(null);
    setCopied(false);
    setError(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-(--color-surface) border border-(--color-border) p-[28px] w-full max-w-[480px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <CropMark position="tl" />
        <CropMark position="tr" />
        <CropMark position="bl" />
        <CropMark position="br" />

        {step === "configure" ? (
          <>
            {/* Header */}
            <div className="mb-[20px]">
              <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-primary)">
                New workshop link
              </span>
            </div>

            {/* File list */}
            <div className="mb-[20px] max-h-[200px] overflow-y-auto flex flex-col gap-[6px]">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-[10px] px-[10px] py-[8px] border border-(--color-border) bg-(--color-background)"
                >
                  <span className="font-ui text-[13px] text-(--color-foreground) truncate min-w-0">
                    {f.fileName.replace(/\.[^.]+$/, "")}
                  </span>
                  <span className="flex-shrink-0 font-code text-[9px] tracking-[0.14em] uppercase px-[6px] py-[3px] border border-(--color-border) text-(--color-muted) rounded-full">
                    {f.provider === "google_drive" ? "Drive" : "Dropbox"}
                  </span>
                </div>
              ))}
            </div>

            {/* Expiry */}
            <div className="mb-[24px] flex items-center gap-[12px]">
              <span className="font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted) flex-shrink-0">
                Expires in
              </span>
              <div className="flex items-center gap-[6px]">
                {EXPIRY_OPTIONS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setExpiryHours(h)}
                    className={`appearance-none px-[10px] py-[5px] font-code text-[10px] tracking-[0.12em] uppercase cursor-pointer rounded-[2px] transition-[background,color,border-color] duration-[0.18s] ${
                      expiryHours === h
                        ? "bg-(--color-foreground) text-(--color-surface) border border-(--color-foreground)"
                        : "border border-(--color-border) text-(--color-muted) hover:text-(--color-foreground)"
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="font-code text-[10px] tracking-[0.12em] uppercase text-(--color-error, red) mt-[8px] mb-[4px]">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-[10px]">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || files.length === 0}
                className="w-full appearance-none bg-(--color-foreground) text-(--color-surface) border border-(--color-foreground) px-[14px] py-[10px] font-code text-[10.5px] tracking-[0.14em] uppercase cursor-pointer inline-flex items-center justify-center gap-[8px] transition-[background,color] duration-[0.18s] hover:bg-(--color-surface) hover:text-(--color-foreground) disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Generating…" : "Generate link"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="appearance-none bg-transparent border-0 font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted) cursor-pointer hover:text-(--color-foreground) transition-colors duration-[0.18s] py-[4px] text-center"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="mb-[20px]">
              <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-primary)">
                New workshop link
              </span>
            </div>

            {/* Generated URL */}
            <div className="mb-[24px] p-[12px] border border-(--color-border) bg-(--color-background) font-code text-[11px] tracking-[0.08em] text-(--color-foreground) break-all">
              {generatedUrl}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-[10px]">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full appearance-none bg-(--color-foreground) text-(--color-surface) border border-(--color-foreground) px-[14px] py-[10px] font-code text-[10.5px] tracking-[0.14em] uppercase cursor-pointer inline-flex items-center justify-center gap-[8px] transition-[background,color] duration-[0.18s] hover:bg-(--color-surface) hover:text-(--color-foreground)"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="appearance-none bg-transparent border-0 font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted) cursor-pointer hover:text-(--color-foreground) transition-colors duration-[0.18s] py-[4px] text-center"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
