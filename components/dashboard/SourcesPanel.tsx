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
  onDisconnect?: (provider: keyof Integrations) => void;
}

const activeClass = "border-(--color-primary) bg-[color-mix(in_oklab,var(--color-primary),transparent_92%)]";
const idleClass   = "border-(--color-border) bg-[color-mix(in_oklab,var(--color-background),white_1%)] hover:border-[color-mix(in_oklab,var(--color-primary),transparent_50%)]";

export function SourcesPanel({ active, setActive, onDisconnect }: SourcesPanelProps) {
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

  async function connectDropbox() {
    await authClient.linkSocial({ provider: "dropbox", callbackURL: "/dashboard" });
  }

  async function handleDisconnectDropbox() {
    await disconnectIntegration("dropbox");
    setIntegrations((prev) => ({ ...prev, dropbox: { connected: false, email: "" } }));
    onDisconnect?.("dropbox");
  }

  async function handleDisconnectGoogle() {
    await disconnectIntegration("google_drive");
    setIntegrations((prev) => ({ ...prev, google_drive: { connected: false, email: "" } }));
    onDisconnect?.("google_drive");
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
          <div className={`p-[12px] border rounded-[4px] transition-[border-color,background] duration-[0.18s] ${active === "drive" ? activeClass : idleClass}`}>
            <button
              type="button"
              className="flex items-center gap-[12px] cursor-pointer text-left w-full bg-transparent border-0 p-0"
              onClick={() => setActive(active === "drive" ? "all" : "drive")}
            >
              <span className="w-[32px] h-[32px] inline-grid place-items-center rounded-[2px] flex-shrink-0">
                <DriveMark size={20} />
              </span>
              <div>
                <div className="font-ui text-[13.5px] font-medium text-(--color-foreground) leading-[1.15] tracking-[-0.005em]">
                  Google Drive
                </div>
                <div className="mt-[2px] font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted)">
                  {gd.email.length > 12 ? `${gd.email.slice(0, 12)}…` : gd.email}
                </div>
              </div>
            </button>
            <div className="mt-[8px] pt-[8px] border-t border-dashed border-(--color-border) flex items-center justify-between">
              <button
                type="button"
                onClick={handleDisconnectGoogle}
                className="font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted) hover:text-(--color-foreground) transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                disconnect
              </button>
              <span className="font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-primary)">
                Connected
              </span>
            </div>
          </div>
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

        {/* Dropbox */}
        {loading ? (
          <div className="h-[58px] border border-(--color-border) rounded-[4px] animate-pulse bg-(--color-background)" />
        ) : integrations.dropbox.connected ? (
          <div className={`p-[12px] border rounded-[4px] transition-[border-color,background] duration-[0.18s] ${active === "dropbox" ? activeClass : idleClass}`}>
            <button
              type="button"
              className="flex items-center gap-[12px] cursor-pointer text-left w-full bg-transparent border-0 p-0"
              onClick={() => setActive(active === "dropbox" ? "all" : "dropbox")}
            >
              <span className="w-[32px] h-[32px] inline-grid place-items-center rounded-[2px] flex-shrink-0">
                <DropMark size={20} />
              </span>
              <div>
                <div className="font-ui text-[13.5px] font-medium text-(--color-foreground) leading-[1.15] tracking-[-0.005em]">
                  Dropbox
                </div>
                <div className="mt-[2px] font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted)">
                  {integrations.dropbox.email.length > 12 ? `${integrations.dropbox.email.slice(0, 12)}…` : integrations.dropbox.email}
                </div>
              </div>
            </button>
            <div className="mt-[8px] pt-[8px] border-t border-dashed border-(--color-border) flex items-center justify-between">
              <button
                type="button"
                onClick={handleDisconnectDropbox}
                className="font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted) hover:text-(--color-foreground) transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                disconnect
              </button>
              <span className="font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-primary)">
                Connected
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={connectDropbox}
            className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-[12px] p-[12px] border border-dashed border-(--color-border) rounded-[4px] cursor-pointer text-left w-full hover:border-(--color-primary) transition-[border-color] duration-[0.18s]"
          >
            <span className="w-[32px] h-[32px] inline-grid place-items-center rounded-[2px] text-(--color-muted)">
              <DropMark size={20} />
            </span>
            <span className="min-w-0">
              <div className="font-ui text-[13.5px] font-medium text-(--color-muted) leading-[1.15]">Connect Dropbox</div>
              <div className="mt-[2px] font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted)">click to link account</div>
            </span>
          </button>
        )}
      </div>

    </section>
  );
}
