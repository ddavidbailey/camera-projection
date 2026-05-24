"use client";

import { CropMark } from "./CropMark";

/* ── Slider ───────────────────────────────────────────────────────────────── */
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  ticks?: string[];
}

function Slider({ label, value, min, max, step, onChange, format, ticks }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-[7px]">
      <div className="flex items-baseline justify-between gap-[8px]">
        <span className="font-code text-[10px] tracking-[0.14em] uppercase text-(--color-muted)">
          {label}
        </span>
        <span className="font-code text-[10.5px] text-(--color-foreground) tracking-[0.08em]">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        className="view-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ "--pct": pct + "%" } as React.CSSProperties}
      />
      {ticks && (
        <div className="flex justify-between mt-[-4px] font-code text-[9px] tracking-[0.12em] text-[color-mix(in_oklab,var(--color-muted),transparent_30%)]">
          {ticks.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      )}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────────── */
function IconLightning() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M7 1L2 7h3l-1 4 5-6H6l1-4z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function IconFlip() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M2 3.5L4.5 6 2 8.5M10 3.5L7.5 6 10 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── ControlsPanel ────────────────────────────────────────────────────────── */
export interface ControlsPanelProps {
  zoom: number;
  setZoom: (v: number) => void;
  brightness: number;
  setBrightness: (v: number) => void;
  overlayOpacity: number;
  setOverlayOpacity: (v: number) => void;
  torch: boolean;
  setTorch: (v: boolean) => void;
  flipped: boolean;
  setFlipped: (v: boolean) => void;
}

const ZOOM_PRESETS = [1, 1.5, 2, 3];

function toggleClass(active: boolean) {
  return active
    ? "border-(--color-primary) text-(--color-primary) bg-[color-mix(in_oklab,var(--color-primary),transparent_92%)]"
    : "border-(--color-border) text-(--color-muted) bg-transparent hover:border-(--color-primary) hover:text-(--color-primary)";
}

export function ControlsPanel({
  zoom, setZoom,
  brightness, setBrightness,
  overlayOpacity, setOverlayOpacity,
  torch, setTorch,
  flipped, setFlipped,
}: ControlsPanelProps) {
  return (
    <section className="relative bg-(--color-surface) border border-(--color-border) p-[18px] pb-[16px]" aria-label="Camera controls">
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />

      <div className="flex items-center gap-[10px] mb-[14px]">
        <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-primary)">02</span>
        <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-muted)">Camera</span>
      </div>

      <div className="flex flex-col gap-[14px]">
        <Slider
          label="Zoom"
          value={zoom}
          min={1} max={5} step={0.1}
          onChange={setZoom}
          format={(v) => `${v.toFixed(1)}×`}
          ticks={["1×", "2×", "3×", "4×", "5×"]}
        />

        <div className="flex items-stretch gap-[8px]">
          {ZOOM_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`flex-1 border rounded-[2px] py-[8px] font-code text-[10.5px] tracking-[0.14em] uppercase cursor-pointer transition-[border-color,color,background] duration-[0.18s] ${toggleClass(Math.abs(zoom - p) < 0.05)}`}
              onClick={() => setZoom(p)}
            >
              {p}×
            </button>
          ))}
        </div>

        <Slider
          label="Brightness"
          value={brightness}
          min={0.5} max={1.6} step={0.05}
          onChange={setBrightness}
          format={(v) => v === 1 ? "auto" : `${v > 1 ? "+" : ""}${Math.round((v - 1) * 100)}%`}
        />

        <Slider
          label="Overlay strength"
          value={overlayOpacity}
          min={0.2} max={1} step={0.05}
          onChange={setOverlayOpacity}
          format={(v) => `${Math.round(v * 100)}%`}
        />

        <div className="grid grid-cols-2 gap-[8px]">
          <button
            type="button"
            className={`border rounded-[2px] px-[8px] py-[6px] font-code text-[8.5px] tracking-[0.12em] uppercase cursor-pointer inline-flex items-center justify-center gap-[5px] transition-[border-color,color,background] duration-[0.18s] ${toggleClass(torch)}`}
            onClick={() => setTorch(!torch)}
          >
            <IconLightning />
            Torch
          </button>
          <button
            type="button"
            className={`border rounded-[2px] px-[8px] py-[6px] font-code text-[8.5px] tracking-[0.12em] uppercase cursor-pointer inline-flex items-center justify-center gap-[5px] transition-[border-color,color,background] duration-[0.18s] ${toggleClass(flipped)}`}
            onClick={() => setFlipped(!flipped)}
          >
            <IconFlip />
            Flip
          </button>
        </div>
      </div>
    </section>
  );
}
