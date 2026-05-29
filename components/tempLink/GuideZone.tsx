"use client";

import type { DetectionStatus } from "@/hooks/usePaperDetection";

interface GuideZoneProps {
  status: DetectionStatus;
}

export function GuideZone({ status }: GuideZoneProps) {
  const locked = status === "locked";
  const bracketColor = locked ? "var(--color-secondary)" : "var(--color-primary)";

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[4]"
      style={{ width: "75%", aspectRatio: "1 / 1.4142" }}
    >
      {/* Corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => {
        const top    = pos.startsWith("t") ? "0" : "auto";
        const bottom = pos.startsWith("b") ? "0" : "auto";
        const left   = pos.endsWith("l")  ? "0" : "auto";
        const right  = pos.endsWith("r")  ? "0" : "auto";
        const borderTop    = pos.startsWith("t") ? `1.5px solid ${bracketColor}` : "none";
        const borderBottom = pos.startsWith("b") ? `1.5px solid ${bracketColor}` : "none";
        const borderLeft   = pos.endsWith("l")   ? `1.5px solid ${bracketColor}` : "none";
        const borderRight  = pos.endsWith("r")   ? `1.5px solid ${bracketColor}` : "none";
        return (
          <span
            key={pos}
            className="absolute w-[20px] h-[20px]"
            style={{ top, bottom, left, right, borderTop, borderBottom, borderLeft, borderRight }}
          />
        );
      })}

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
