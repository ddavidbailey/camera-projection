export function Logomark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="10" y="6" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 20 L4 36 L36 36 L30 20 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="13" r="3" stroke="var(--color-primary)" strokeWidth="1.5" />
      <line x1="20" y1="20" x2="20" y2="36" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="1.5 2.5" />
    </svg>
  );
}
