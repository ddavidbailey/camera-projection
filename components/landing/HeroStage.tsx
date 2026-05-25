export function HeroStage() {
  return (
    <div
      className="relative aspect-[1/0.92] w-full border border-(--color-border) rounded-sm overflow-hidden"
      role="img"
      aria-label="A camera projects a worksheet onto a blank sheet of paper, anchoring the overlay on screen"
      style={{
        background:
          "radial-gradient(ellipse 70% 45% at 50% 12%, color-mix(in oklab, var(--home-beam), transparent 76%) 0%, transparent 70%)," +
          "linear-gradient(180deg, color-mix(in oklab, var(--color-background), white 1%), color-mix(in oklab, var(--color-background), black 3%))",
      }}
    >
      {/* Stage crop marks */}
      <span className="absolute pointer-events-none w-[14px] h-[14px] z-4 top-[10px] left-[10px] before:content-[''] before:absolute before:bg-(--color-foreground) before:w-[14px] before:h-px before:opacity-[0.55] before:top-0 before:left-0 after:content-[''] after:absolute after:bg-(--color-foreground) after:w-px after:h-[14px] after:opacity-[0.55] after:top-0 after:left-0" />
      <span className="absolute pointer-events-none w-[14px] h-[14px] z-4 top-[10px] right-[10px] before:content-[''] before:absolute before:bg-(--color-foreground) before:w-[14px] before:h-px before:opacity-[0.55] before:top-0 before:right-0 after:content-[''] after:absolute after:bg-(--color-foreground) after:w-px after:h-[14px] after:opacity-[0.55] after:top-0 after:right-0" />
      <span className="absolute pointer-events-none w-[14px] h-[14px] z-4 bottom-[10px] left-[10px] before:content-[''] before:absolute before:bg-(--color-foreground) before:w-[14px] before:h-px before:opacity-[0.55] before:bottom-0 before:left-0 after:content-[''] after:absolute after:bg-(--color-foreground) after:w-px after:h-[14px] after:opacity-[0.55] after:bottom-0 after:left-0" />
      <span className="absolute pointer-events-none w-[14px] h-[14px] z-4 bottom-[10px] right-[10px] before:content-[''] before:absolute before:bg-(--color-foreground) before:w-[14px] before:h-px before:opacity-[0.55] before:bottom-0 before:right-0 after:content-[''] after:absolute after:bg-(--color-foreground) after:w-px after:h-[14px] after:opacity-[0.55] after:bottom-0 after:right-0" />

      {/* Top strip */}
      <div className="absolute top-[18px] left-[22px] right-[22px] flex items-center gap-2.5 font-code text-[10px] tracking-[0.16em] uppercase text-(--color-muted) z-5">
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-(--color-border) rounded-full"
          style={{ background: "color-mix(in oklab, var(--color-surface), transparent 30%)" }}
        >
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 720"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="paperReveal" clipPathUnits="userSpaceOnUse">
            <rect x="130" y="280" width="540" height="0">
              <animate attributeName="height" values="0;360;360;0;0" keyTimes="0;0.4;0.55;0.95;1" dur="7s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
            </rect>
          </clipPath>
          <clipPath id="paperShape" clipPathUnits="userSpaceOnUse">
            <path d="M 210 280 L 590 280 L 670 640 L 130 640 Z" />
          </clipPath>
          <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--home-beam)" stopOpacity="0.3" />
            <stop offset="80%"  stopColor="var(--home-beam)" stopOpacity="0.02" />
            <stop offset="100%" stopColor="var(--home-beam)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Camera */}
        <g transform="translate(400 90)">
          <rect x="-46" y="-44" width="92" height="80" rx="10"
            fill="color-mix(in oklab, var(--color-foreground), transparent 8%)"
            stroke="color-mix(in oklab, var(--color-foreground), transparent 50%)"
            strokeWidth="0.8" />
          <rect x="-22" y="-22" width="44" height="22" rx="4"
            fill="color-mix(in oklab, var(--color-foreground), white 5%)" />
          <circle cx="-8" cy="-11" r="7" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="1.2" />
          <circle cx="-8" cy="-11" r="3" fill="var(--color-primary)" />
          <circle cx="12" cy="-11" r="3"
            fill="color-mix(in oklab, var(--home-beam), white 20%)"
            stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
            strokeWidth="0.6" />
        </g>

        {/* Projection cone */}
        <path d="M 354 130 L 130 640 L 670 640 L 446 130 Z" fill="url(#coneGrad)" />
        <line x1="354" y1="130" x2="130" y2="640" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_60%)] stroke-[0.8] [stroke-dasharray:2_4] fill-none" />
        <line x1="446" y1="130" x2="670" y2="640" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_60%)] stroke-[0.8] [stroke-dasharray:2_4] fill-none" />

        {/* Paper */}
        <path d="M 210 280 L 590 280 L 670 640 L 130 640 Z" className="fill-(--color-surface) stroke-[color-mix(in_oklab,var(--color-foreground),transparent_75%)] stroke-[0.6] drop-shadow-[0_6px_8px_rgba(0,0,0,0.08)]" />

        {/* Worksheet contents */}
        <g clipPath="url(#paperShape)">
          <g clipPath="url(#paperReveal)">
            <rect x="276" y="316" width="170" height="14" className="fill-(--color-foreground) opacity-[0.86]" rx="1" />
            <rect x="276" y="346" width="100" height="6"  className="fill-(--color-foreground) opacity-[0.86]" rx="1" opacity="0.5" />
            <line x1="276" y1="376" x2="520" y2="376" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="274" y1="394" x2="510" y2="394" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="272" y1="412" x2="518" y2="412" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="270" y1="430" x2="492" y2="430" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="268" y1="448" x2="514" y2="448" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="266" y1="466" x2="500" y2="466" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="264" y1="484" x2="516" y2="484" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="262" y1="502" x2="482" y2="502" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="260" y1="520" x2="508" y2="520" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="258" y1="538" x2="498" y2="538" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="256" y1="556" x2="470" y2="556" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="252" y1="576" x2="510" y2="576" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="250" y1="592" x2="430" y2="592" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]" />
            <line x1="220" y1="616" x2="280" y2="616" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_80%)] stroke-[1.2] [stroke-linecap:round]" />
            <line x1="490" y1="616" x2="560" y2="616" className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_80%)] stroke-[1.2] [stroke-linecap:round]" />
          </g>
        </g>

        {/* Corner brackets */}
        <g className="stroke-(--color-primary) stroke-[1.6] [stroke-linecap:square] fill-none">
          <path d="M 198 280 H 222 M 210 268 V 292" />
          <path d="M 602 280 H 578 M 590 268 V 292" />
          <path d="M 118 640 H 142 M 130 628 V 652" />
          <path d="M 682 640 H 658 M 670 628 V 652" />
        </g>

        {/* Scan line */}
        <line className="stroke-(--home-beam) stroke-[1.4] drop-shadow-[0_0_4px_color-mix(in_oklab,var(--home-beam),transparent_30%)]" x1="210" x2="590" y1="280" y2="280">
          <animate attributeName="y1" values="280;640;640;280;280" keyTimes="0;0.4;0.55;0.95;1" dur="7s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
          <animate attributeName="y2" values="280;640;640;280;280" keyTimes="0;0.4;0.55;0.95;1" dur="7s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
          <animate attributeName="x1" values="210;130;130;210;210" keyTimes="0;0.4;0.55;0.95;1" dur="7s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
          <animate attributeName="x2" values="590;670;670;590;590" keyTimes="0;0.4;0.55;0.95;1" dur="7s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
        </line>
      </svg>

      {/* Bottom strip */}
      <div className="absolute left-[22px] right-[22px] bottom-[18px] flex items-center gap-2.5 font-code text-[10px] tracking-[0.16em] uppercase text-(--color-muted) z-5">
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary),transparent_80%)] animate-auth-pulse shrink-0" />
        <span>overlaying</span>
        <span className="flex-1" />
        <span style={{ color: "color-mix(in oklab, var(--color-muted), transparent 30%)" }}>
          anchored · 4 corners
        </span>
      </div>
    </div>
  );
}
