"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/utils/auth-client";
import { getIntegrationStatus, disconnectIntegration, type Integrations } from "@/app/actions/integrations";
import { DriveMark, DropMark } from "./icons";
import { CropMark } from "./CropMark";
import type { SourceFilter } from "./data";

const DEFAULT: Integrations = {
  google_drive: { connected: false, email: "" },
  dropbox:      { connected: false, email: "" },
};

interface SourcesPanelProps {
  active: SourceFilter;
  setActive: (v: SourceFilter) => void;
  counts: { drive: number; dropbox: number };
}

const activeClass = "border-(--color-primary) bg-[color-mix(in_oklab,var(--color-primary),transparent_92%)]";
const idleClass   = "border-(--color-border) bg-[color-mix(in_oklab,var(--color-background),white_1%)] hover:border-[color-mix(in_oklab,var(--color-primary),transparent_50%)]";

function countBadge(active: boolean) {
  return active
    ? "border-(--color-primary) text-(--color-primary) bg-(--color-surface)"
    : "border-(--color-border) text-(--color-foreground) bg-(--color-surface)";
}

export function SourcesPanel({ active, setActive, counts }: SourcesPanelProps) {
  const [integrations, setIntegrations] = useState<Integrations>(DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIntegrationStatus()
      .then((data) => { setIntegrations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function connectGoogle() {
    await authClient.linkSocial({ provider: "google", callbackURL: "/dashboard" });
  }

  async function handleDisconnectGoogle() {
    await disconnectIntegration("google_drive");
    setIntegrations((prev) => ({ ...prev, google_drive: { connected: false, email: "" } }));
  }

  const gd = integrations.google_drive;

  return (
    <section className="relative bg-(--color-surface) border border-(--color-border) p-[20px] pb-[18px]">
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />

      <div className="flex items-baseline justify-between gap-[10px] mb-[16px]">
        <div>
          <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-primary) mr-[6px]">01</span>
          <span className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted)">Sources</span>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        {/* Google Drive */}
        {loading ? (
          <div className="h-[58px] border border-(--color-border) rounded-[4px] animate-pulse bg-(--color-background)" />
        ) : gd.connected ? (
          <button
            type="button"
            className={`grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-[12px] p-[12px] border rounded-[4px] cursor-pointer text-left w-full transition-[border-color,background] duration-[0.18s] ${active === "drive" ? activeClass : idleClass}`}
            onClick={() => setActive(active === "drive" ? "all" : "drive")}
          >
            <span className="w-[32px] h-[32px] inline-grid place-items-center rounded-[2px]">
              <DriveMark size={20} />
            </span>
            <span className="min-w-0">
              <div className="font-ui text-[13.5px] font-medium text-(--color-foreground) leading-[1.15] tracking-[-0.005em]">
                Google Drive
              </div>
              <div className="mt-[2px] font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted) whitespace-nowrap overflow-hidden text-ellipsis">
                {gd.email}
              </div>
            </span>
            <span className={`font-code text-[10.5px] tracking-[0.1em] px-[8px] py-[3px] border rounded-full tabular-nums ${countBadge(active === "drive")}`}>
              {counts.drive}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={connectGoogle}
            className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-[12px] p-[12px] border border-dashed border-(--color-border) rounded-[4px] cursor-pointer text-left w-full hover:border-(--color-primary) transition-[border-color] duration-[0.18s]"
          >
            <span className="w-[32px] h-[32px] inline-grid place-items-center rounded-[2px] text-(--color-muted)">
              <DriveMark size={20} />
            </span>
            <span className="min-w-0">
              <div className="font-ui text-[13.5px] font-medium text-(--color-muted) leading-[1.15]">Connect Drive</div>
              <div className="mt-[2px] font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted)">click to link account</div>
            </span>
          </button>
        )}

        {/* Dropbox — Phase 2 */}
        <div className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-[12px] p-[12px] border border-dashed border-(--color-border) rounded-[4px] opacity-40 select-none">
          <span className="w-[32px] h-[32px] inline-grid place-items-center rounded-[2px] text-(--color-muted)">
            <DropMark size={20} />
          </span>
          <span className="min-w-0">
            <div className="font-ui text-[13.5px] font-medium text-(--color-muted) leading-[1.15]">Dropbox</div>
            <div className="mt-[2px] font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted)">coming soon</div>
          </span>
        </div>
      </div>

      {/* Storage meter */}
      <div className="mt-[12px] pt-[14px] border-t border-dashed border-(--color-border)">
        <div className="flex items-baseline justify-between font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted) mb-[8px]">
          <span>Storage in use</span>
          <span><span className="text-(--color-foreground) tabular-nums">2.4</span>&nbsp;/&nbsp;15 GB</span>
        </div>
        <div className="h-[4px] bg-(--color-border) rounded-[2px] relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-[9.5%] bg-(--color-primary) rounded-[2px]" />
          <div
            className="absolute inset-0"
            style={{
              background: "repeating-linear-gradient(45deg, var(--color-primary) 0 4px, color-mix(in oklab, var(--color-primary), transparent 60%) 4px 8px)",
              clipPath: "inset(0 calc(100% - 16%) 0 9.5%)",
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-[10px] font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted)">
          <span className="inline-flex items-center gap-[6px]">
            <span className="inline-block w-[6px] h-[6px] bg-(--color-primary)" />
            Drive 1.4 GB
          </span>
          <span className="inline-flex items-center gap-[6px]">
            <span className="inline-block w-[6px] h-[6px] border border-(--color-primary)" />
            Dropbox 1.0 GB
          </span>
        </div>
      </div>
    </section>
  );
}
