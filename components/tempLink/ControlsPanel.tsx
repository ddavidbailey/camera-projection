"use client";

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
    <div className="ctrl-row">
      <div className="ctrl-label-row">
        <span className="ctrl-label">{label}</span>
        <span className="ctrl-val">{format ? format(value) : value}</span>
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
        <div className="tick-row">
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

export function ControlsPanel({
  zoom,
  setZoom,
  brightness,
  setBrightness,
  overlayOpacity,
  setOverlayOpacity,
  torch,
  setTorch,
  flipped,
  setFlipped,
}: ControlsPanelProps) {
  return (
    <section className="view-panel" aria-label="Camera controls">
      <span className="crop crop-tl" />
      <span className="crop crop-tr" />
      <span className="crop crop-bl" />
      <span className="crop crop-br" />

      <div className="view-panel-head">
        <span className="view-panel-num">02</span>
        <span className="view-panel-title">Camera</span>
      </div>

      <div className="ctrl-list">
        <Slider
          label="Zoom"
          value={zoom}
          min={1}
          max={5}
          step={0.1}
          onChange={setZoom}
          format={(v) => `${v.toFixed(1)}×`}
          ticks={["1×", "2×", "3×", "4×", "5×"]}
        />

        <div className="zoom-row">
          {ZOOM_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`zoom-btn${Math.abs(zoom - p) < 0.05 ? " is-on" : ""}`}
              onClick={() => setZoom(p)}
            >
              {p}×
            </button>
          ))}
        </div>

        <Slider
          label="Brightness"
          value={brightness}
          min={0.5}
          max={1.6}
          step={0.05}
          onChange={setBrightness}
          format={(v) =>
            v === 1 ? "auto" : `${v > 1 ? "+" : ""}${Math.round((v - 1) * 100)}%`
          }
        />

        <Slider
          label="Overlay strength"
          value={overlayOpacity}
          min={0.2}
          max={1}
          step={0.05}
          onChange={setOverlayOpacity}
          format={(v) => `${Math.round(v * 100)}%`}
        />

        <div className="icon-toggles">
          <button
            type="button"
            className={`icon-toggle${torch ? " is-on" : ""}`}
            onClick={() => setTorch(!torch)}
          >
            <IconLightning />
            Torch
          </button>
          <button
            type="button"
            className={`icon-toggle${flipped ? " is-on" : ""}`}
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
