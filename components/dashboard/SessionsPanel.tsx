"use client";

import { useState, useEffect, useCallback } from "react";
import { CropMark } from "./CropMark";
import type { Worksheet } from "./data";

interface ShareLinkFile {
  id: string;
  fileId: string;
  provider: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  sortOrder: number;
}

interface ShareLink {
  id: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  files: ShareLinkFile[];
}

function formatExpiry(expiresAt: string): { label: string; soon: boolean } {
  const msLeft = new Date(expiresAt).getTime() - Date.now();
  if (msLeft <= 0) return { label: "expired", soon: true };
  const totalMins = Math.floor(msLeft / 60_000);
  if (totalMins < 60) return { label: `${totalMins}m`, soon: totalMins < 30 };
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return { label: mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`, soon: false };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function FileSummary({ files }: { files: ShareLinkFile[] }) {
  if (files.length === 0) return <span>—</span>;
  const first = files[0].fileName.replace(/\.[^.]+$/, "");
  if (files.length === 1) return <span>{first}</span>;
  return (
    <span>
      {first}{" "}
      <span className="text-(--color-muted)">+{files.length - 1} more</span>
    </span>
  );
}

function LinkCard({ link, onRevoked }: { link: ShareLink; onRevoked: (id: string) => void }) {
  const [copyLabel, setCopyLabel] = useState("copy link");
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const expiry = formatExpiry(link.expiresAt);

  function handleCopy() {
    navigator.clipboard.writeText(`${window.location.origin}/t/${link.token}`);
    setCopyLabel("copied!");
    setTimeout(() => setCopyLabel("copy link"), 2000);
  }

  async function handleRevoke() {
    try {
      const res = await fetch(`/api/share-links/${link.id}`, { method: "DELETE" });
      if (res.ok) {
        onRevoked(link.id);
      } else {
        setRevokeError("Failed to revoke");
      }
    } catch {
      setRevokeError("Network error");
    }
  }

  return (
    <article
      className="p-[12px] border border-(--color-border) rounded-[4px] grid gap-[8px]"
      style={{ background: "color-mix(in oklab, var(--color-background), white 1%)" }}
    >
      <div className="flex items-center justify-between font-code text-[10.5px] tracking-[0.16em] uppercase">
        <span className="text-(--color-foreground)">/t/{link.token}</span>
        <span style={{ color: expiry.soon ? "var(--color-warning)" : "var(--color-primary)" }}>
          ⌛ {expiry.label}
        </span>
      </div>

      <div className="font-ui text-[13px] text-(--color-foreground) whitespace-nowrap overflow-hidden text-ellipsis">
        {formatDate(link.createdAt)}
        <span className="block font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted) mt-[2px]">
          <FileSummary files={link.files} />
        </span>
      </div>

      <div className="flex items-center gap-[10px] font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted)">
        <span className="flex-1" />
        <button
          type="button"
          onClick={handleCopy}
          className="bg-transparent border-0 p-0 font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted) cursor-pointer hover:text-(--color-foreground) transition-colors"
        >
          {copyLabel}
        </button>
        <button
          type="button"
          onClick={handleRevoke}
          className="bg-transparent border-0 p-0 font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted) cursor-pointer hover:text-(--color-foreground) transition-colors"
        >
          revoke
        </button>
      </div>
      {revokeError && (
        <p className="font-code text-[9.5px] tracking-[0.12em] uppercase text-(--color-warning) mt-[4px]">
          {revokeError}
        </p>
      )}
    </article>
  );
}

export function SessionsPanel({
  worksheets: _worksheets,
  refreshKey,
}: {
  worksheets: Worksheet[];
  refreshKey?: number;
}) {
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  // tick state forces re-render every 60s so expiry countdowns stay fresh
  const [, setTick] = useState(0);

  const loadLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/share-links");
      if (res.ok) {
        const data = (await res.json()) as ShareLink[];
        setLinks(data);
        setFetchError(null);
      } else {
        setFetchError("Could not load sessions");
      }
    } catch {
      setFetchError("Network error");
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks, refreshKey]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  function handleRevoked(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <section className="relative bg-(--color-surface) border border-(--color-border) p-[20px] pb-[18px]">
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />

      <div className="flex items-baseline justify-between gap-[10px] mb-[16px]">
        <div>
          <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-primary) mr-[6px]">03</span>
          <span className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted)">Active sessions</span>
        </div>
        <span className="font-code text-[10px] tracking-[0.14em] uppercase text-[color-mix(in_oklab,var(--color-muted),transparent_25%)]">
          {links.length} open
        </span>
      </div>

      {fetchError ? (
        <p className="font-code text-[10.5px] tracking-[0.14em] uppercase text-(--color-warning) text-center py-[20px]">
          {fetchError}
        </p>
      ) : links.length === 0 ? (
        <p className="font-code text-[10.5px] tracking-[0.14em] uppercase text-(--color-muted) text-center py-[20px]">
          No active sessions
        </p>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} onRevoked={handleRevoked} />
          ))}
        </div>
      )}
    </section>
  );
}
