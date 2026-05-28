export function DriveMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <path d="m126 417q9 5 19 5H367q9 0 19-5V313H99" fill="#4285f4"/>
      <path d="m196 87q9-5 20-5h80q12 0 20 5v104h-68" fill="#188038"/>
      <path d="m66 313q0-10 5-19l110-191q6-11 15-16l60 104-72 125" fill="#34a853"/>
      <path d="M316 87q10 6 15 16L438 289q8 12 8 24l-118 3-72-125" fill="#fbbc04"/>
      <path d="m185.714 313H66q0 8 3 15l40 70q7 13 17 19" fill="#1967d2"/>
      <path d="m386 417q9-5 16-17l38-66q6-10 6-21H326.3" fill="#ea4335"/>
    </svg>
  );
}

export function DropMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" fill="#0061ff">
      <path d="m158 101-99 63 295 188 99-63m-99-188 99 63-295 188-99-63m99 83 98 63 98-63-98-62z"/>
    </svg>
  );
}

export function SourceMark({ id, size = 14 }: { id: string; size?: number }) {
  if (id === "drive")   return <DriveMark size={size} />;
  if (id === "dropbox") return <DropMark  size={size} />;
  return null;
}
