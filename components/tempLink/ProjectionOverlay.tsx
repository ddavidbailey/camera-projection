// viewBox: 0 0 400 300
// Paper corners proportionally match the home page HeroStage trapezoid.
const TL = [112, 58] as const;
const TR = [288, 58] as const;
const BL = [56,  272] as const;
const BR = [344, 272] as const;

const PAPER_PATH = `M ${TL[0]} ${TL[1]} L ${TR[0]} ${TR[1]} L ${BR[0]} ${BR[1]} L ${BL[0]} ${BL[1]} Z`;
const PAPER_H    = String(BL[1] - TL[1]); // height of scan travel

const DUR        = "7s";
const KEY_TIMES  = "0;0.4;0.55;0.95;1";
const SPLINES    = "0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1";

export function ProjectionOverlay({
  opacity = 0.85,
}: {
  opacity?: number;
  pageIndex?: number; // kept for API compatibility
}) {
  return (
    <g opacity={opacity}>
      <defs>
        {/* Clips content to the paper shape */}
        <clipPath id="proj-paper-clip" clipPathUnits="userSpaceOnUse">
          <path d={PAPER_PATH} />
        </clipPath>

        {/* Grows downward to reveal content as the scan line passes */}
        <clipPath id="proj-scan-clip" clipPathUnits="userSpaceOnUse">
          <rect x={BL[0]} y={TL[1]} width={BR[0] - BL[0]} height="0">
            <animate
              attributeName="height"
              values={`0;${PAPER_H};${PAPER_H};0;0`}
              keyTimes={KEY_TIMES}
              dur={DUR}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines={SPLINES}
            />
          </rect>
        </clipPath>

        {/* Projection cone gradient — matches home page coneGrad */}
        <linearGradient id="proj-cone-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--color-secondary)" stopOpacity="0.28" />
          <stop offset="80%"  stopColor="var(--color-secondary)" stopOpacity="0.02" />
          <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Projection cone — from off-screen top, fanning to paper bottom */}
      <path
        d={`M 200 0 L ${BL[0]} ${BL[1]} L ${BR[0]} ${BR[1]} Z`}
        fill="url(#proj-cone-grad)"
      />
      <line
        x1="200" y1="0" x2={BL[0]} y2={BL[1]}
        stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        fill="none"
      />
      <line
        x1="200" y1="0" x2={BR[0]} y2={BR[1]}
        stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        fill="none"
      />

      {/* Paper surface */}
      <path
        d={PAPER_PATH}
        fill="var(--color-surface)"
        stroke="color-mix(in oklab, var(--color-foreground), transparent 75%)"
        strokeWidth="0.6"
        style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.08))" }}
        opacity="0.92"
      />

      {/* Worksheet contents — revealed as scan line passes */}
      <g clipPath="url(#proj-paper-clip)">
        <g clipPath="url(#proj-scan-clip)">
          {/* Heading */}
          <rect x="144" y="82"  width="86"  height="7"   fill="var(--color-foreground)" opacity="0.86" rx="0.6" />
          <rect x="144" y="96"  width="52"  height="3"   fill="var(--color-foreground)" opacity="0.45" rx="0.6" />
          {/* Body lines */}
          <line x1="144" y1="114" x2="266" y2="114" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="143" y1="127" x2="260" y2="127" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="142" y1="140" x2="264" y2="140" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="141" y1="153" x2="252" y2="153" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="140" y1="166" x2="258" y2="166" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="139" y1="179" x2="248" y2="179" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="138" y1="192" x2="256" y2="192" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="137" y1="205" x2="244" y2="205" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="136" y1="218" x2="252" y2="218" stroke="color-mix(in oklab, var(--color-foreground), transparent 62%)" strokeWidth="1.6" strokeLinecap="round" />
          {/* Footer marks */}
          <line x1="88"  y1="254" x2="110" y2="254" stroke="color-mix(in oklab, var(--color-foreground), transparent 80%)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="270" y1="254" x2="294" y2="254" stroke="color-mix(in oklab, var(--color-foreground), transparent 80%)" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </g>

      {/* Corner brackets — same style as home page */}
      <g stroke="var(--color-primary)" strokeWidth="1.6" strokeLinecap="square" fill="none">
        <path d={`M ${TL[0] - 12} ${TL[1]} H ${TL[0] + 12} M ${TL[0]} ${TL[1] - 12} V ${TL[1] + 12}`} />
        <path d={`M ${TR[0] + 12} ${TR[1]} H ${TR[0] - 12} M ${TR[0]} ${TR[1] - 12} V ${TR[1] + 12}`} />
        <path d={`M ${BL[0] - 12} ${BL[1]} H ${BL[0] + 12} M ${BL[0]} ${BL[1] - 12} V ${BL[1] + 12}`} />
        <path d={`M ${BR[0] + 12} ${BR[1]} H ${BR[0] - 12} M ${BR[0]} ${BR[1] - 12} V ${BR[1] + 12}`} />
      </g>

      {/* Scan line — same animation as home page */}
      <line
        x1={TL[0]} x2={TR[0]} y1={TL[1]} y2={TL[1]}
        stroke="var(--color-secondary)"
        strokeWidth="1.4"
        style={{ filter: "drop-shadow(0 0 4px color-mix(in oklab, var(--color-secondary), transparent 30%))" }}
      >
        <animate attributeName="y1" values={`${TL[1]};${BL[1]};${BL[1]};${TL[1]};${TL[1]}`}
          keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" calcMode="spline" keySplines={SPLINES} />
        <animate attributeName="y2" values={`${TL[1]};${BR[1]};${BR[1]};${TL[1]};${TL[1]}`}
          keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" calcMode="spline" keySplines={SPLINES} />
        <animate attributeName="x1" values={`${TL[0]};${BL[0]};${BL[0]};${TL[0]};${TL[0]}`}
          keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" calcMode="spline" keySplines={SPLINES} />
        <animate attributeName="x2" values={`${TR[0]};${BR[0]};${BR[0]};${TR[0]};${TR[0]}`}
          keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" calcMode="spline" keySplines={SPLINES} />
      </line>
    </g>
  );
}
