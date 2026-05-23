"use client";

import { CropMark } from "./CropMark";
import { SESSIONS, LIVE_IDS, type Worksheet } from "./data";

export function SessionsPanel({ worksheets }: { worksheets: Worksheet[] }) {
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
          {LIVE_IDS.size} open
        </span>
      </div>

      <div className="flex flex-col gap-[12px]">
        {SESSIONS.map((s) => {
          const ws = worksheets.find((r) => r.id === s.wsId);
          return (
            <article
              key={s.code}
              className="p-[12px] border border-(--color-border) rounded-[4px] grid gap-[8px]"
              style={{ background: "color-mix(in oklab, var(--color-background), white 1%)" }}
            >
              <div className="flex items-center justify-between font-code text-[10.5px] tracking-[0.16em] uppercase">
                <span className="text-(--color-foreground)">/t/{s.code}</span>
                <span style={{ color: s.soon ? "var(--color-warning)" : "var(--color-primary)" }}>
                  ⌛ {s.expIn}
                </span>
              </div>

              <div className="font-ui text-[13px] text-(--color-foreground) whitespace-nowrap overflow-hidden text-ellipsis">
                {ws ? ws.name.replace(/\.[^.]+$/, "") : "—"}
                <span className="block font-code text-[9.5px] tracking-[0.14em] uppercase text-(--color-muted) mt-[2px]">
                  {ws?.path ?? ""}
                </span>
              </div>

              <div className="flex items-center gap-[10px] font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted)">
                <span className="inline-flex items-center gap-[5px]">
                  <span
                    className="w-[5px] h-[5px] rounded-full bg-(--color-success) animate-auth-pulse"
                    style={{ boxShadow: "0 0 0 3px color-mix(in oklab, var(--color-success), transparent 80%)" }}
                  />
                  {s.viewers} viewers
                </span>
                <span className="flex-1" />
                <button
                  type="button"
                  className="bg-transparent border-0 p-0 font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted) cursor-pointer hover:text-(--color-foreground) transition-colors"
                >
                  copy link
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
