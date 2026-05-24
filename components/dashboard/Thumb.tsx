import type { ThumbVariant } from "./data";

export function Thumb({ variant = "lines" }: { variant?: ThumbVariant }) {
  return (
    <svg className="w-full h-full block" viewBox="0 0 44 62" preserveAspectRatio="xMidYMid meet">
      <rect x="0.5" y="0.5" width="43" height="61" fill="var(--color-surface)" />
      <rect x="6" y="7"    width="20" height="3"   fill="var(--color-foreground)" opacity="0.85" />
      <rect x="6" y="12.5" width="12" height="1.4" fill="var(--color-foreground)" opacity="0.55" />

      {variant === "lines" && (
        <g stroke="var(--color-foreground)" strokeOpacity="0.65" strokeWidth="0.7" strokeLinecap="round">
          {[20, 24, 28, 32, 36, 40, 44, 48, 52].map((y) => (
            <line key={y} x1="6" y1={y} x2={y === 32 || y === 48 ? 34 : y === 40 ? 32 : y === 52 ? 36 : 38} y2={y} />
          ))}
        </g>
      )}

      {variant === "grid" && (
        <g stroke="var(--color-foreground)" strokeOpacity="0.45" strokeWidth="0.5">
          {[0,1,2,3,4,5,6].map((i) => <line key={"r"+i} x1="6" y1={20+i*5} x2="38" y2={20+i*5} />)}
          {[0,1,2,3,4,5,6].map((i) => <line key={"c"+i} x1={6+i*5} y1="20" x2={6+i*5} y2="55" />)}
        </g>
      )}

      {variant === "figure" && (
        <>
          <g stroke="var(--color-foreground)" strokeOpacity="0.6" strokeWidth="0.6" strokeLinecap="round">
            <line x1="6" y1="20" x2="38" y2="20" />
            <line x1="6" y1="23.5" x2="32" y2="23.5" />
          </g>
          <rect x="9" y="29" width="26" height="14" fill="var(--color-primary)" opacity="0.22" stroke="var(--color-primary)" strokeOpacity="0.5" strokeWidth="0.5" />
          <line x1="9" y1="29" x2="35" y2="43" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="0.5" />
          <g stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="0.6" strokeLinecap="round">
            <line x1="6" y1="48" x2="38" y2="48" />
            <line x1="6" y1="51.5" x2="30" y2="51.5" />
          </g>
        </>
      )}

      {variant === "boxes" && (
        <>
          <rect x="6"  y="20" width="14" height="10" stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="0.6" fill="none" />
          <rect x="24" y="20" width="14" height="10" stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="0.6" fill="none" />
          <rect x="6"  y="34" width="14" height="10" stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="0.6" fill="none" />
          <rect x="24" y="34" width="14" height="10" fill="var(--color-primary)" opacity="0.18" stroke="var(--color-primary)" strokeOpacity="0.45" strokeWidth="0.6" />
          <line x1="6" y1="50" x2="38" y2="50" stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="0.6" />
          <line x1="6" y1="54" x2="32" y2="54" stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="0.6" />
        </>
      )}

      {variant === "music" && (
        <g stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="0.4">
          {[20,22,24,26,28,36,38,40,42,44].map((y, i) => (
            <line key={i} x1="6" y1={y} x2="38" y2={y} />
          ))}
          <circle cx="14" cy="26" r="1.2" fill="var(--color-foreground)" opacity="0.7" />
          <circle cx="22" cy="24" r="1.2" fill="var(--color-foreground)" opacity="0.7" />
          <circle cx="30" cy="28" r="1.2" fill="var(--color-foreground)" opacity="0.7" />
          <circle cx="18" cy="42" r="1.2" fill="var(--color-primary)"    opacity="0.85" />
          <circle cx="28" cy="40" r="1.2" fill="var(--color-foreground)" opacity="0.7" />
        </g>
      )}

      {variant === "blueprint" && (
        <>
          <rect x="8" y="20" width="28" height="20" stroke="var(--color-primary)" strokeOpacity="0.55" strokeWidth="0.6" fill="none" />
          <line x1="8" y1="30" x2="36" y2="30" stroke="var(--color-primary)" strokeOpacity="0.5" strokeWidth="0.4" strokeDasharray="1 1" />
          <line x1="22" y1="20" x2="22" y2="40" stroke="var(--color-primary)" strokeOpacity="0.5" strokeWidth="0.4" strokeDasharray="1 1" />
          <circle cx="22" cy="30" r="1.4" fill="var(--color-primary)" />
          <g stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="0.6">
            <line x1="6" y1="46" x2="34" y2="46" />
            <line x1="6" y1="50" x2="30" y2="50" />
            <line x1="6" y1="54" x2="32" y2="54" />
          </g>
        </>
      )}
    </svg>
  );
}
