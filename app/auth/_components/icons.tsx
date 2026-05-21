export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--color-background, #EFE7D6), white 6%), transparent 40%)," +
          "radial-gradient(circle at 90% 80%, color-mix(in oklab, var(--color-background, #EFE7D6), black 4%), transparent 50%)",
      }}
    />
  );
}

export function Logomark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="10" y="6" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 20 L4 36 L36 36 L30 20 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="13" r="3" stroke="var(--color-primary)" strokeWidth="1.5" />
      <line x1="20" y1="20" x2="20" y2="36" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="1.5 2.5" />
    </svg>
  );
}

export function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.5a9 9 0 1 1-3.1-6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 4v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DropboxGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4l6 4-6 4-6-4 6-4z" transform="translate(6 2)" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 4l6 4-6 4-6-4 6-4z" transform="translate(6 10)" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
