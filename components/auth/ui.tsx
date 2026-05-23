"use client";

import { useState, useMemo, useId } from "react";
import { usePalette } from "./AuthProvider";

/* ── CropMark ────────────────────────────────────────────────────────────── */
export function CropMark({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const wrap = {
    tl: "-top-px -left-px",
    tr: "-top-px -right-px",
    bl: "-bottom-px -left-px",
    br: "-bottom-px -right-px",
  }[position];
  const anchor = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[position];
  return (
    <span
      className={`absolute w-3.5 h-3.5 pointer-events-none z-3 ${wrap}`}
      aria-hidden="true"
    >
      <span
        className={`absolute w-3.5 h-px bg-(--color-foreground) opacity-55 ${anchor}`}
      />
      <span
        className={`absolute w-px h-3.5 bg-(--color-foreground) opacity-55 ${anchor}`}
      />
    </span>
  );
}

/* ── RegMark ─────────────────────────────────────────────────────────────── */
export function RegMark({
  position,
  show,
}: {
  position: "tl" | "tr" | "bl" | "br";
  show: boolean;
}) {
  const wrap = {
    tl: "-top-0.5 -left-0.5",
    tr: "-top-0.5 -right-0.5",
    bl: "-bottom-0.5 -left-0.5",
    br: "-bottom-0.5 -right-0.5",
  }[position];
  const anchor = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[position];
  return (
    <span
      className={`absolute w-1.5 h-1.5 pointer-events-none transition-opacity duration-180 ${show ? "opacity-100" : "opacity-0"} ${wrap}`}
      aria-hidden="true"
    >
      <span className={`absolute w-1.5 h-px bg-(--color-primary) ${anchor}`} />
      <span className={`absolute w-px h-1.5 bg-(--color-primary) ${anchor}`} />
    </span>
  );
}

/* ── Field ───────────────────────────────────────────────────────────────── */
export interface FieldProps {
  label: string;
  hint?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}

export function Field({
  label,
  hint,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();

  const wrapClass = [
    "relative border rounded-[10px] transition-[border-color,box-shadow] duration-180",
    "bg-[color-mix(in_oklab,var(--color-surface),white_4%)]",
    focused
      ? "border-[color-mix(in_oklab,var(--color-foreground),transparent_40%)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-secondary),transparent_80%)]"
      : error
        ? "border-(--color-primary)"
        : "border-(--color-border)",
  ].join(" ");

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="font-code text-[10.5px] tracking-[0.14em] uppercase text-(--color-muted)">
          {label}
        </span>
        {hint && (
          <span className="font-code text-[10.5px] tracking-[0.08em] text-[color-mix(in_oklab,var(--color-muted),transparent_30%)]">
            {hint}
          </span>
        )}
      </div>
      <div className={wrapClass}>
        <RegMark position="tl" show={focused} />
        <RegMark position="tr" show={focused} />
        <RegMark position="bl" show={focused} />
        <RegMark position="br" show={focused} />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full px-3.5 py-3 bg-transparent border-none outline-none text-[14.5px] text-(--color-foreground) tracking-[-0.005em] placeholder:text-[color-mix(in_oklab,var(--color-muted),transparent_40%)]"
        />
      </div>
      {error && (
        <span className="font-code text-[10.5px] text-(--color-primary) tracking-[0.08em]">
          {error}
        </span>
      )}
    </label>
  );
}

export interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  showStrength?: boolean;
  autoComplete?: string;
  error?: string;
}

export function PasswordField({
  label,
  value,
  onChange,
  showStrength,
  autoComplete,
  error,
}: PasswordFieldProps) {
  const [reveal, setReveal] = useState(false);
  const [focused, setFocused] = useState(false);
  const id = useId();

  const strength = useMemo(() => {
    let n = 0;
    if (value.length >= 8) n++;
    if (/[A-Z]/.test(value)) n++;
    if (/[0-9]/.test(value)) n++;
    if (/[^A-Za-z0-9]/.test(value)) n++;
    return n;
  }, [value]);

  const strengthColors = [
    "bg-[color-mix(in_oklab,var(--color-primary),white_10%)]",
    "bg-(--color-primary)",
    "bg-[color-mix(in_oklab,var(--color-secondary),var(--color-foreground)_10%)]",
    "bg-[color-mix(in_oklab,var(--color-secondary),var(--color-foreground)_25%)]",
  ];
  const strengthLabels = [
    "8+ chars, mix of cases, numbers, symbols",
    "weak",
    "weak",
    "fair",
    "strong",
    "very strong",
  ];

  const wrapClass = [
    "relative border rounded-[10px] transition-[border-color,box-shadow] duration-180",
    "bg-[color-mix(in_oklab,var(--color-surface),white_4%)]",
    focused
      ? "border-[color-mix(in_oklab,var(--color-foreground),transparent_40%)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-secondary),transparent_80%)]"
      : error
        ? "border-(--color-primary)"
        : "border-(--color-border)",
  ].join(" ");

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="font-code text-[10.5px] tracking-[0.14em] uppercase text-(--color-muted)">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setReveal((r) => !r)}
          className="font-code text-[10.5px] tracking-[0.12em] uppercase text-(--color-muted) bg-transparent border-none p-0 cursor-pointer hover:text-(--color-foreground)"
        >
          {reveal ? "hide" : "show"}
        </button>
      </div>
      <div className={wrapClass}>
        <RegMark position="tl" show={focused} />
        <RegMark position="tr" show={focused} />
        <RegMark position="bl" show={focused} />
        <RegMark position="br" show={focused} />
        <input
          id={id}
          type={reveal ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="••••••••"
          autoComplete={autoComplete}
          className="block w-full px-3.5 py-3 bg-transparent border-none outline-none text-[14.5px] text-(--color-foreground) tracking-[-0.005em] placeholder:text-[color-mix(in_oklab,var(--color-muted),transparent_40%)]"
        />
      </div>
      {showStrength && (
        <div className="flex items-center gap-2.5 mt-0.5">
          <div className="grid grid-cols-4 gap-[3px] flex-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-[3px] rounded-sm transition-colors duration-180 ${i < strength ? strengthColors[strength - 1] : "bg-(--color-border)"}`}
              />
            ))}
          </div>
          <span className="font-code text-[10px] uppercase tracking-widest text-(--color-muted) whitespace-nowrap">
            {value.length === 0 ? strengthLabels[0] : strengthLabels[strength]}
          </span>
        </div>
      )}
      {error && (
        <span className="font-code text-[10.5px] text-(--color-primary) tracking-[0.08em]">
          {error}
        </span>
      )}
    </label>
  );
}

export function OAuthChip({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex items-center gap-2.5 px-3.5 py-[11px] bg-[color-mix(in_oklab,var(--color-surface),white_4%)] border border-(--color-border) rounded-[10px] text-(--color-foreground) text-[13px] font-medium cursor-pointer text-left transition-[background,border-color,transform] duration-180 hover:bg-[color-mix(in_oklab,var(--color-surface),white_12%)] hover:border-[color-mix(in_oklab,var(--color-border),var(--color-foreground)_10%)] active:translate-y-px"
    >
      <span className="grid place-items-center text-(--color-foreground)">
        {icon}
      </span>
      <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </span>
      <span className="font-code text-[11px] text-(--color-muted)">↗</span>
    </button>
  );
}

export function CheckBox({
  checked,
  onChange,
  children,
  block = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  block?: boolean;
}) {
  const palette = usePalette();
  const checkedClass =
    palette === "dusk"
      ? "bg-(--color-surface) border-(--color-surface) text-[var(--color-background)]"
      : "bg-(--color-foreground) border-(--color-foreground) text-(--color-surface)";

  return (
    <label
      className={`inline-flex items-center gap-2 text-[13px] text-(--color-foreground) cursor-pointer select-none ${block ? "items-start gap-2.5 leading-[1.4] whitespace-normal" : "whitespace-nowrap"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute opacity-0 pointer-events-none"
      />
      <span
        className={`w-4 h-4 border rounded-[3px] grid place-items-center shrink-0 transition-all duration-180 ${checked ? checkedClass : "border-(--color-border) bg-[color-mix(in_oklab,var(--color-surface),white_6%)] text-transparent"} ${block ? "mt-0.5" : ""}`}
      >
        <svg viewBox="0 0 12 12" width="10" height="10">
          <path
            d="M2 6.5l2.5 2.5L10 3"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </label>
  );
}

export function PaperCard({ children }: { children: React.ReactNode }) {
  const palette = usePalette();
  const shadow =
    palette === "dusk"
      ? "0 1px 0 color-mix(in oklab, var(--color-surface), white 4%) inset, 0 30px 60px -30px rgba(0,0,0,0.5)"
      : "0 1px 0 color-mix(in oklab, var(--color-surface), white 6%) inset, 0 30px 60px -40px rgba(0,0,0,0.25), 0 4px 14px -8px rgba(0,0,0,0.12)";

  return (
    <div
      className="relative bg-(--color-surface) border border-(--color-border) px-9 pt-4 pb-4"
      style={{ boxShadow: shadow }}
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-1"
        aria-hidden="true"
      >
        <span
          className="absolute top-[-60%] left-1/2 -translate-x-1/2 w-[140%] h-[180%]"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 0%, color-mix(in oklab, var(--color-secondary), transparent 70%) 0%, color-mix(in oklab, var(--color-secondary), transparent 88%) 40%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none z-1"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-foreground), transparent 94%) 1px, transparent 1px),linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground), transparent 94%) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(180deg, black 0%, black 70%, transparent 100%)",
        }}
      />
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />
      <div className="relative z-2">{children}</div>
    </div>
  );
}
