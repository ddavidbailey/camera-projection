"use client";

import { useMode } from "./AuthProvider";
import { Logomark } from "./icons";

export function AuthAside() {
  const { mode } = useMode();

  return (
    <aside
      className="relative px-11 py-10 border-r border-(--color-border) flex flex-col gap-8 h-full justify-center"
      style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--color-background), white 2%) 0%, var(--color-background) 100%)" }}
    >
      {/* Brand row */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2.5 text-(--color-foreground)">
          <Logomark size={26} />
          <span className="font-heading text-[22px] tracking-[-0.01em]">Tracelight</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-code text-[10px] uppercase tracking-[0.08em] text-(--color-muted) whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary),transparent_80%)]" />
          v0.1 · beta
        </span>
      </div>

      {/* Scan diagram */}
      <div className="relative flex items-center justify-center" aria-hidden="true">
        <div
          className="relative w-full max-w-[340px] aspect-square border border-(--color-border) rounded-sm overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 20%, color-mix(in oklab, var(--color-secondary), transparent 78%) 0%, transparent 65%)," +
              "linear-gradient(180deg, color-mix(in oklab, var(--color-background), white 1%), color-mix(in oklab, var(--color-background), black 3%))",
          }}
        >
          <svg className="w-full h-full block" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              <clipPath id="scanReveal" clipPathUnits="userSpaceOnUse">
                <rect x="87" y="92" width="126" height="0">
                  <animate attributeName="height" values="0;178;178;0;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
                </rect>
              </clipPath>
            </defs>
            <circle cx="150" cy="44" r="12" fill="none" stroke="var(--color-foreground)" strokeWidth="1.4" />
            <circle cx="150" cy="44" r="3.4" fill="var(--color-primary)" />
            <line x1="150" y1="56" x2="87" y2="92" stroke="color-mix(in oklab, var(--color-foreground), transparent 55%)" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="150" y1="56" x2="213" y2="92" stroke="color-mix(in oklab, var(--color-foreground), transparent 55%)" strokeWidth="1" strokeDasharray="2 4" />
            <rect x="87" y="92" width="126" height="178" rx="1" fill="var(--color-surface)" stroke="color-mix(in oklab, var(--color-foreground), transparent 70%)" strokeWidth="0.8" />
            <g clipPath="url(#scanReveal)">
              <rect x="99" y="104" width="54" height="6" fill="var(--color-foreground)" opacity="0.85" />
              <line x1="99" y1="124" x2="200" y2="124" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="2" strokeLinecap="round" />
              <line x1="99" y1="134" x2="186" y2="134" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="2" strokeLinecap="round" />
              <line x1="99" y1="144" x2="196" y2="144" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="2" strokeLinecap="round" />
              <line x1="99" y1="154" x2="172" y2="154" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="2" strokeLinecap="round" />
              <rect x="99" y="168" width="82" height="42" fill="color-mix(in oklab, var(--color-primary), transparent 75%)" stroke="color-mix(in oklab, var(--color-primary), transparent 40%)" strokeWidth="0.8" />
              <line x1="103" y1="173" x2="177" y2="207" stroke="color-mix(in oklab, var(--color-primary), transparent 55%)" strokeWidth="0.7" />
              <line x1="177" y1="173" x2="103" y2="207" stroke="color-mix(in oklab, var(--color-primary), transparent 55%)" strokeWidth="0.7" />
              <line x1="99" y1="220" x2="196" y2="220" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="2" strokeLinecap="round" />
              <line x1="99" y1="230" x2="176" y2="230" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="2" strokeLinecap="round" />
              <line x1="99" y1="252" x2="125" y2="252" stroke="color-mix(in oklab, var(--color-foreground), transparent 80%)" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="185" y1="252" x2="201" y2="252" stroke="color-mix(in oklab, var(--color-foreground), transparent 80%)" strokeWidth="1.4" strokeLinecap="round" />
            </g>
            <g stroke="var(--color-primary)" strokeWidth="1.4" strokeLinecap="square" fill="none">
              <path d="M83 92 H91 M87 92 V100" />
              <path d="M217 92 H209 M213 92 V100" />
              <path d="M83 270 H91 M87 270 V262" />
              <path d="M217 270 H209 M213 270 V262" />
            </g>
            <line x1="87" x2="213" y1="92" y2="92" stroke="var(--color-primary)" strokeWidth="1.2"
              style={{ filter: "drop-shadow(0 0 4px color-mix(in oklab, var(--color-primary), transparent 30%))" }}>
              <animate attributeName="y1" values="92;270;270;92;92" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
              <animate attributeName="y2" values="92;270;270;92;92" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
            </line>
          </svg>

          <div className="absolute left-3.5 right-3.5 bottom-3 flex items-center gap-2 font-code text-[9.5px] tracking-[0.12em] uppercase text-(--color-muted) z-4">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary),transparent_80%)] animate-auth-pulse" />
            <span>scanning</span>
            <span className="flex-1" />
            <span className="text-[color-mix(in_oklab,var(--color-muted),transparent_30%)]">a4 · 210 × 297</span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="border-t border-(--color-border) pt-6">
        <p className="font-heading text-[22px] leading-[1.3] text-(--color-foreground) m-0 mb-3 tracking-[-0.005em] text-pretty">
          &ldquo;Point the camera. The worksheet appears{" "}
          <em className="italic text-(--color-primary)">on the paper</em> — no printing, no projector hung from a ceiling.&rdquo;
        </p>
        <p className="font-code text-[10.5px] uppercase tracking-widest text-(--color-muted) m-0">— how it works, briefly</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between gap-3 font-code text-[10.5px] uppercase tracking-[0.08em] text-(--color-muted)">
        <span>{mode === "in" ? "01 / sign in" : "02 / new account"}</span>
        <span>privacy · terms · status</span>
      </div>
    </aside>
  );
}
