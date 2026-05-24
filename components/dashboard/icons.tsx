/* Original geometric glyphs — NOT recreations of brand logos */

export function DriveMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.5 L12.5 11.5 L1.5 11.5 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M7 4.5 L10.5 11 L3.5 11 Z" fill="currentColor" opacity="0.18" />
      <line x1="7" y1="1.5" x2="7" y2="11.5" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

export function DropMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="3.5" y="0.7" width="6.5" height="6.5" transform="rotate(45 6.75 4)" stroke="currentColor" strokeWidth="1" />
      <rect x="3.5" y="6.5" width="6.5" height="6.5" transform="rotate(45 6.75 9.75)" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.16" />
    </svg>
  );
}

export function SourceMark({ id, size = 14 }: { id: string; size?: number }) {
  if (id === "drive")   return <DriveMark size={size} />;
  if (id === "dropbox") return <DropMark  size={size} />;
  return null;
}
