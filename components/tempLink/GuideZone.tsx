"use client";

import type { DetectionStatus } from "@/hooks/usePaperDetection";

interface GuideZoneProps {
  status: DetectionStatus;
}

export function GuideZone({ status }: GuideZoneProps) {
  const locked = status === "locked";
  const color  = locked ? "var(--color-secondary)" : "var(--color-primary)";

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[4]"
      style={{ height: "85%", aspectRatio: "1 / 1.4142" }}
    >
      {/* Full border outline */}
      <div
        className="absolute inset-0"
        style={{ border: `1.5px solid ${color}`, opacity: locked ? 0.6 : 0.35 }}
      />

      {/* Semi-transparent fill so the zone is clearly visible */}
      <div
        className="absolute inset-0"
        style={{ background: `${color}`, opacity: locked ? 0 : 0.06 }}
      />

      {/* Corner brackets — sit on top of the border */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => {
        const top    = pos.startsWith("t") ? "-1px" : "auto";
        const bottom = pos.startsWith("b") ? "-1px" : "auto";
        const left   = pos.endsWith("l")  ? "-1px" : "auto";
        const right  = pos.endsWith("r")  ? "-1px" : "auto";
        const borderTop    = pos.startsWith("t") ? `2px solid ${color}` : "none";
        const borderBottom = pos.startsWith("b") ? `2px solid ${color}` : "none";
        const borderLeft   = pos.endsWith("l")   ? `2px solid ${color}` : "none";
        const borderRight  = pos.endsWith("r")   ? `2px solid ${color}` : "none";
        return (
          <span
            key={pos}
            className="absolute w-[22px] h-[22px]"
            style={{ top, bottom, left, right, borderTop, borderBottom, borderLeft, borderRight }}
          />
        );
      })}

      {/* Centre label while searching */}
      {status === "searching" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-surface) bg-[rgba(0,0,0,0.4)] backdrop-blur-[4px] px-[10px] py-[5px] rounded-full">
            Place paper here
          </p>
        </div>
      )}

      {/* Re-center prompt */}
      {status === "recenter" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-code text-[10px] tracking-[0.18em] uppercase text-(--color-surface) bg-[rgba(0,0,0,0.45)] backdrop-blur-[4px] px-[10px] py-[5px] rounded-full">
            Re-center paper in frame
          </p>
        </div>
      )}
    </div>
  );
}
