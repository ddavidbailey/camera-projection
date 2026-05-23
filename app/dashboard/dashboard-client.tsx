"use client";

import { useState, useMemo } from "react";
import { TopStrip }       from "@/components/dashboard/TopStrip";
import { PageHeader }     from "@/components/dashboard/PageHeader";
import { SourcesPanel }   from "@/components/dashboard/SourcesPanel";
import { SessionsPanel }  from "@/components/dashboard/SessionsPanel";
import { FilterBar }      from "@/components/dashboard/FilterBar";
import { WorksheetsTable } from "@/components/dashboard/WorksheetsTable";
import { SEED, LIVE_IDS, type SourceFilter } from "@/components/dashboard/data";

export function DashboardClient() {
  const [source, setSource] = useState<SourceFilter>("all");
  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState("Modified");

  const counts = useMemo(() => ({
    total:   SEED.length,
    drive:   SEED.filter((r) => r.source === "drive").length,
    dropbox: SEED.filter((r) => r.source === "dropbox").length,
    live:    LIVE_IDS.size,
  }), []);

  const rows = useMemo(() => {
    let r = SEED;
    if (source !== "all") r = r.filter((x) => x.source === source);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter((x) => x.name.toLowerCase().includes(q) || x.path.toLowerCase().includes(q));
    }
    if (sort === "Name")     r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Sessions") r = [...r].sort((a, b) => b.sessions - a.sessions);
    return r;
  }, [source, search, sort]);

  return (
    <div
      className="relative z-[1] flex flex-col min-h-dvh font-ui antialiased [text-rendering:optimizeLegibility] text-(--color-foreground) bg-(--color-background)"
      data-palette="paper"
    >
      {/* Background gradient */}
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
            {/* Left rail — sources */}
            <aside>
              <SourcesPanel active={source} setActive={setSource} counts={counts} />
            </aside>

            {/* Centre — filter + table */}
            <section className="min-w-0">
              <FilterBar
                source={source}
                setSource={setSource}
                counts={counts}
                sort={sort}
                setSort={setSort}
              />
              <WorksheetsTable rows={rows} source={source} />
              <div className="mt-[28px] pt-[22px] border-t border-(--color-border) flex items-center justify-between flex-wrap gap-[14px] font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted)">
                <span>showing {rows.length} of {counts.total}</span>
                <span>tracelight · v0.1 · beta</span>
              </div>
            </section>

            {/* Right rail — sessions */}
            <aside className="max-[1500px]:col-span-full">
              <SessionsPanel worksheets={SEED} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
