"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { TopStrip }        from "@/components/dashboard/TopStrip";
import { PageHeader }      from "@/components/dashboard/PageHeader";
import { SourcesPanel }    from "@/components/dashboard/SourcesPanel";
import { SessionsPanel }   from "@/components/dashboard/SessionsPanel";
import { FilterBar }       from "@/components/dashboard/FilterBar";
import { WorksheetsTable } from "@/components/dashboard/WorksheetsTable";
import { CreateLinkModal } from "@/components/dashboard/CreateLinkModal";
import { WorksheetPreviewModal } from "@/components/dashboard/WorksheetPreviewModal";
import { LIVE_IDS, type SourceFilter, type Worksheet, type ThumbVariant } from "@/components/dashboard/data";
import type { DriveFile } from "@/lib/google-drive";
import type { DropboxFile } from "@/lib/dropbox";

function mimeToThumb(mime: string): ThumbVariant {
  if (mime.includes("image")) return "figure";
  return "lines";
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function driveFileToWorksheet(f: DriveFile): Worksheet {
  return {
    id:       f.id,
    name:     f.name,
    path:     "/",
    pages:    1,
    source:   "drive",
    modified: relativeTime(f.modifiedTime),
    thumb:    mimeToThumb(f.mimeType),
    mimeType: f.mimeType,
  };
}

export function DashboardClient() {
  const [source,     setSource]     = useState<SourceFilter>("all");
  const [search,     setSearch]     = useState("");
  const [sort,       setSort]       = useState("Modified");
  const [allRows,    setAllRows]    = useState<Worksheet[]>([]);
  const [selected,   setSelected]   = useState<Set<string>>(new Set());
  const [modalOpen,  setModalOpen]  = useState(false);
  const [previewWs,  setPreviewWs]  = useState<Worksheet | null>(null);
  const [sessionsKey, setSessionsKey] = useState(0);
  const [page,       setPage]       = useState(0);
  const [pageSize,   setPageSize]   = useState(10);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 880px)");
    if (mq.matches) setPageSize(5);
    function handler(e: MediaQueryListEvent) { setPageSize(e.matches ? 5 : 10); setPage(0); }
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    async function load() {
      const [driveRes, dropboxRes] = await Promise.allSettled([
        fetch("/api/googledrive/files").then((r) => r.ok ? r.json() : Promise.reject()),
        fetch("/api/dropbox/files").then((r) => r.ok ? r.json() : Promise.reject()),
      ]);

      const driveFiles: Worksheet[] = driveRes.status === "fulfilled"
        ? (driveRes.value.files as DriveFile[]).map(driveFileToWorksheet)
        : [];

      const dropboxFiles: Worksheet[] = dropboxRes.status === "fulfilled"
        ? (dropboxRes.value.files as DropboxFile[]).map((f) => {
            const ext = f.name.split(".").pop()?.toLowerCase();
            const mimeType =
              ext === "pdf"                  ? "application/pdf" :
              ext === "png"                  ? "image/png" :
              (ext === "jpg" || ext === "jpeg") ? "image/jpeg" :
              "application/octet-stream";
            return {
              id:       f.id,
              name:     f.name,
              path:     f.pathDisplay,
              pages:    1,
              source:   "dropbox" as const,
              modified: relativeTime(f.serverModified),
              thumb:    mimeType.startsWith("image/") ? "figure" as const : "lines" as const,
              mimeType,
            };
          })
        : [];

      setAllRows([...driveFiles, ...dropboxFiles]);
    }

    load();
  }, []);

  const counts = useMemo(() => ({
    total:   allRows.length,
    drive:   allRows.filter((r) => r.source === "drive").length,
    dropbox: allRows.filter((r) => r.source === "dropbox").length,
    live:    LIVE_IDS.size,
  }), [allRows]);

  function onToggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onDelete(id: string) {
    const ws = allRows.find((r) => r.id === id);
    if (!ws) return;
    const provider = ws.source === "drive" ? "googledrive" : "dropbox";
    const res = await fetch(`/api/${provider}/files/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      setAllRows((prev) => prev.filter((r) => r.id !== id));
      setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
    }
  }

  async function onRename(id: string, newName: string) {
    const ws = allRows.find((r) => r.id === id);
    if (!ws) return;
    const provider = ws.source === "drive" ? "googledrive" : "dropbox";
    const body: Record<string, string> = { name: newName };
    if (ws.source === "dropbox") body.path = ws.path;
    const res = await fetch(`/api/${provider}/files/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setAllRows((prev) => prev.map((r) => r.id === id ? { ...r, name: newName } : r));
    }
  }

  const rows = useMemo(() => {
    let r = allRows;
    if (source !== "all") r = r.filter((x) => x.source === source);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter((x) => x.name.toLowerCase().includes(q) || x.path.toLowerCase().includes(q));
    }
    if (sort === "Name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [allRows, source, search, sort]);

  useEffect(() => { setPage(0); }, [rows]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pagedRows  = rows.slice(page * pageSize, (page + 1) * pageSize);
  const rangeStart = rows.length === 0 ? 0 : page * pageSize + 1;
  const rangeEnd   = Math.min((page + 1) * pageSize, rows.length);

  return (
    <div className="relative z-[1] flex flex-col min-h-dvh font-ui antialiased [text-rendering:optimizeLegibility] text-(--color-foreground) bg-(--color-background)">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 18% 8%, color-mix(in oklab, var(--color-background), white 6%), transparent 42%)," +
            "radial-gradient(circle at 88% 85%, color-mix(in oklab, var(--color-background), black 4%), transparent 55%)",
        }}
      />

      <TopStrip search={search} setSearch={setSearch} />

      <main className="flex-1 py-[26px] pb-[40px] relative z-[1]">
        <div className="w-full max-w-[1480px] mx-auto px-8 max-[720px]:px-[18px]">
          <PageHeader />

          <div className="grid grid-cols-[260px_minmax(0,1fr)_300px] max-[1500px]:grid-cols-[240px_minmax(0,1fr)] max-[880px]:grid-cols-1 gap-[22px] items-start">
            <aside>
              <SourcesPanel
                active={source}
                setActive={setSource}
                onDisconnect={(provider) => {
                  if (provider === "google_drive") setAllRows((prev) => prev.filter((r) => r.source !== "drive"));
                  if (provider === "dropbox")      setAllRows((prev) => prev.filter((r) => r.source !== "dropbox"));
                }}
              />
            </aside>

            <section className="min-w-0">
              <FilterBar
                source={source}
                setSource={setSource}
                counts={counts}
                sort={sort}
                setSort={setSort}
                selectedCount={selected.size}
                onCreateLink={() => setModalOpen(true)}
              />
              <WorksheetsTable rows={pagedRows} source={source} selected={selected} onToggle={onToggle} onDelete={onDelete} onRename={onRename} onOpen={setPreviewWs} />
              <div className="mt-[28px] pt-[22px] border-t border-(--color-border) flex flex-col gap-[12px] font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted)">
                {/* Pagination row */}
                <div className="flex items-center justify-between flex-wrap gap-[12px]">
                  <span>
                    {rows.length === 0 ? "0 files" : `${rangeStart}–${rangeEnd} of ${rows.length}${rows.length < counts.total ? ` (${counts.total} total)` : ""}`}
                  </span>

                  <div className="flex items-center gap-[10px]">
                    {/* Prev */}
                    <button
                      type="button"
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                      className="inline-flex items-center justify-center w-[26px] h-[26px] border border-(--color-border) rounded-[3px] text-(--color-muted) disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:text-(--color-foreground) hover:not-disabled:border-(--color-primary) transition-[color,border-color] duration-[0.15s] cursor-pointer"
                      aria-label="Previous page"
                    >
                      ←
                    </button>

                    {/* Page indicator */}
                    <span className="tabular-nums">
                      {page + 1} / {totalPages}
                    </span>

                    {/* Next */}
                    <button
                      type="button"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                      className="inline-flex items-center justify-center w-[26px] h-[26px] border border-(--color-border) rounded-[3px] text-(--color-muted) disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:text-(--color-foreground) hover:not-disabled:border-(--color-primary) transition-[color,border-color] duration-[0.15s] cursor-pointer"
                      aria-label="Next page"
                    >
                      →
                    </button>

                    {/* Per-page selector */}
                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                      className="bg-(--color-background) border border-(--color-border) rounded-[3px] font-code text-[10px] tracking-[0.1em] uppercase text-(--color-muted) px-[7px] py-[4px] cursor-pointer hover:text-(--color-foreground) hover:border-(--color-primary) transition-[color,border-color] duration-[0.15s] ml-[4px]"
                      aria-label="Files per page"
                    >
                      {[5, 10, 15, 20, 25, 30].map((n) => (
                        <option key={n} value={n}>{n} / page</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Legal / version row */}
                <div className="flex items-center justify-end gap-[14px]">
                  <Link href="/privacy" className="hover:text-(--color-foreground) transition-colors no-underline">Privacy</Link>
                  <Link href="/terms" className="hover:text-(--color-foreground) transition-colors no-underline">Terms</Link>
                  <span>tracelight · v0.1 · beta</span>
                </div>
              </div>
            </section>

            <aside className="max-[1500px]:col-span-full">
              <SessionsPanel worksheets={allRows} refreshKey={sessionsKey} />
            </aside>
          </div>
        </div>
      </main>

      <WorksheetPreviewModal worksheet={previewWs} onClose={() => setPreviewWs(null)} />

      <CreateLinkModal
        open={modalOpen}
        files={Array.from(selected).flatMap((wsId) => {
          const ws = allRows.find((r) => r.id === wsId);
          if (!ws) return [];
          return [{
            id: wsId,
            fileName: ws.name,
            provider: ws.source === "drive" ? "google_drive" : "dropbox",
            fileId: ws.id,
            filePath: ws.path,
            mimeType: ws.mimeType ?? (ws.source === "drive" ? "application/pdf" : "application/octet-stream"),
          }];
        })}
        onClose={() => {
          setModalOpen(false);
          setSelected(new Set());
          setSessionsKey((k) => k + 1);
        }}
      />
    </div>
  );
}
