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

      {/* Projection stage */}
      <div className="relative flex items-center justify-center" aria-hidden="true">
        <div
          className="relative w-full max-w-[340px] aspect-square border border-(--color-border) rounded-sm overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 12%, color-mix(in oklab, var(--color-secondary), transparent 76%) 0%, transparent 70%)," +
              "linear-gradient(180deg, color-mix(in oklab, var(--color-background), white 1%), color-mix(in oklab, var(--color-background), black 3%))",
          }}
        >
          {/* Top strip — document pill + format */}
          <div className="absolute top-3 left-3.5 right-3.5 flex items-center gap-2 font-code text-[8px] tracking-[0.12em] uppercase text-(--color-muted) z-[5]">
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-(--color-border)"
              style={{ background: "color-mix(in oklab, var(--color-surface), transparent 30%)" }}
            >
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <rect x="1.5" y="1.5" width="9" height="9" rx="0.5" stroke="currentColor" strokeWidth="1" />
                <line x1="3.5" y1="4.5" x2="8.5" y2="4.5" stroke="currentColor" strokeWidth="1" />
                <line x1="3.5" y1="6.5" x2="7.5" y2="6.5" stroke="currentColor" strokeWidth="1" />
                <line x1="3.5" y1="8.5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1" />
              </svg>
              worksheet-03.pdf
            </span>
            <span className="flex-1" />
            <span>a4</span>
          </div>

          <svg className="w-full h-full block" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Clip grows downward in sync with the scan line to reveal worksheet */}
              <clipPath id="authPaperReveal" clipPathUnits="userSpaceOnUse">
                <rect x="40" y="105" width="220" height="0">
                  <animate attributeName="height" values="0;163;163;0;0" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
                </rect>
              </clipPath>
              <clipPath id="authPaperShape" clipPathUnits="userSpaceOnUse">
                <path d="M 90 105 L 210 105 L 260 268 L 40 268 Z" />
              </clipPath>
              <linearGradient id="authConeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.3" />
                <stop offset="80%" stopColor="var(--color-secondary)" stopOpacity="0.02" />
                <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Camera — phone body + lens housing + lens + flash, scaled to fit */}
            <g transform="translate(150, 36) scale(0.5)">
              <rect x="-46" y="-44" width="92" height="80" rx="10"
                fill="color-mix(in oklab, var(--color-foreground), transparent 8%)"
                stroke="color-mix(in oklab, var(--color-foreground), transparent 50%)"
                strokeWidth="1.6" />
              <rect x="-22" y="-22" width="44" height="22" rx="4"
                fill="color-mix(in oklab, var(--color-foreground), white 5%)" />
              <circle cx="-8" cy="-11" r="7" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="2.4" />
              <circle cx="-8" cy="-11" r="3" fill="var(--color-primary)" />
              <circle cx="12" cy="-11" r="3"
                fill="color-mix(in oklab, var(--color-secondary), white 20%)"
                stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
                strokeWidth="1.2" />
            </g>

            {/* Projection cone */}
            <path d="M 143 60 L 40 268 L 260 268 L 157 60 Z" fill="url(#authConeGrad)" />
            <line x1="143" y1="60" x2="40" y2="268" stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)" strokeWidth="0.8" strokeDasharray="2 4" />
            <line x1="157" y1="60" x2="260" y2="268" stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)" strokeWidth="0.8" strokeDasharray="2 4" />

            {/* Paper — perspective trapezoid */}
            <path d="M 90 105 L 210 105 L 260 268 L 40 268 Z"
              fill="var(--color-surface)"
              stroke="color-mix(in oklab, var(--color-foreground), transparent 70%)"
              strokeWidth="0.8"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.08))" }} />

            {/* Worksheet contents revealed by scan */}
            <g clipPath="url(#authPaperShape)">
              <g clipPath="url(#authPaperReveal)">
                <rect x="118" y="118" width="55" height="7" fill="var(--color-foreground)" opacity="0.86" rx="0.5" />
                <rect x="118" y="132" width="40" height="4" fill="var(--color-foreground)" opacity="0.5" rx="0.5" />
                <line x1="118" y1="148" x2="188" y2="148" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="116" y1="159" x2="184" y2="159" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="114" y1="170" x2="185" y2="170" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="112" y1="181" x2="180" y2="181" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="110" y1="192" x2="182" y2="192" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="108" y1="203" x2="178" y2="203" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="106" y1="214" x2="180" y2="214" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="104" y1="228" x2="176" y2="228" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="102" y1="242" x2="172" y2="242" stroke="color-mix(in oklab, var(--color-foreground), transparent 65%)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="70" y1="258" x2="86" y2="258" stroke="color-mix(in oklab, var(--color-foreground), transparent 80%)" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="200" y1="258" x2="218" y2="258" stroke="color-mix(in oklab, var(--color-foreground), transparent 80%)" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            </g>

            {/* Corner detection brackets at paper corners */}
            <g stroke="var(--color-primary)" strokeWidth="1.4" strokeLinecap="square" fill="none">
              <path d="M 82 105 H 98 M 90 97 V 113" />
              <path d="M 218 105 H 202 M 210 97 V 113" />
              <path d="M 32 268 H 48 M 40 260 V 276" />
              <path d="M 268 268 H 252 M 260 260 V 276" />
            </g>

            {/* Crop marks at stage corners */}
            <g stroke="var(--color-foreground)" strokeWidth="0.8" opacity="0.5" fill="none">
              <path d="M 6 16 V 6 H 16" />
              <path d="M 294 16 V 6 H 284" />
              <path d="M 6 284 V 294 H 16" />
              <path d="M 294 284 V 294 H 284" />
            </g>

            {/* Scan line — widens as it descends to follow the trapezoid */}
            <line x1="90" x2="210" y1="105" y2="105"
              stroke="var(--color-secondary)" strokeWidth="1.2"
              style={{ filter: "drop-shadow(0 0 4px color-mix(in oklab, var(--color-secondary), transparent 30%))" }}>
              <animate attributeName="y1" values="105;268;268;105;105" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
              <animate attributeName="y2" values="105;268;268;105;105" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
              <animate attributeName="x1" values="90;40;40;90;90" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
              <animate attributeName="x2" values="210;260;260;210;210" keyTimes="0;0.42;0.5;0.92;1" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
            </line>
          </svg>

          {/* Bottom strip */}
          <div className="absolute left-3.5 right-3.5 bottom-3 flex items-center gap-2 font-code text-[9.5px] tracking-[0.12em] uppercase text-(--color-muted) z-[5]">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary),transparent_80%)] animate-auth-pulse" />
            <span>overlaying</span>
            <span className="flex-1" />
            <span style={{ color: "color-mix(in oklab, var(--color-muted), transparent 30%)" }}>anchored · 4 corners</span>
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
