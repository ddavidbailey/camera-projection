"use client";

import { useState, useMemo, useEffect } from "react";
import { TopStrip }        from "@/components/dashboard/TopStrip";
import { PageHeader }      from "@/components/dashboard/PageHeader";
import { SourcesPanel }    from "@/components/dashboard/SourcesPanel";
import { SessionsPanel }   from "@/components/dashboard/SessionsPanel";
import { FilterBar }       from "@/components/dashboard/FilterBar";
import { WorksheetsTable } from "@/components/dashboard/WorksheetsTable";
import { LIVE_IDS, type SourceFilter, type Worksheet, type ThumbVariant } from "@/components/dashboard/data";
import type { DriveFile } from "@/lib/google-drive";

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
  };
}

export function DashboardClient() {
  const [source,  setSource]  = useState<SourceFilter>("all");
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("Modified");
  const [allRows, setAllRows] = useState<Worksheet[]>([]);

  useEffect(() => {
    fetch("/api/googledrive/files")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(({ files }: { files: DriveFile[] }) => {
        setAllRows(files.map(driveFileToWorksheet));
      })
      .catch(() => {});
  }, []);

  const counts = useMemo(() => ({
    total:   allRows.length,
    drive:   allRows.filter((r) => r.source === "drive").length,
    dropbox: allRows.filter((r) => r.source === "dropbox").length,
    live:    LIVE_IDS.size,
  }), [allRows]);

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
                counts={counts}
                onDisconnect={(provider) => {
                  if (provider === "google_drive") {
                    setAllRows((prev) => prev.filter((r) => r.source !== "drive"));
                  }
                }}
              />
            </aside>

            <section className="min-w-0">
              <FilterBar source={source} setSource={setSource} counts={counts} sort={sort} setSort={setSort} />
              <WorksheetsTable rows={rows} source={source} />
              <div className="mt-[28px] pt-[22px] border-t border-(--color-border) flex items-center justify-between flex-wrap gap-[14px] font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted)">
                <span>showing {rows.length} of {counts.total}</span>
                <span>tracelight · v0.1 · beta</span>
              </div>
            </section>

            <aside className="max-[1500px]:col-span-full">
              <SessionsPanel worksheets={allRows} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
