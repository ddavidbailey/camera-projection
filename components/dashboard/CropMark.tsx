type Position = "tl" | "tr" | "bl" | "br";

const WRAP: Record<Position, string> = {
  tl: "-top-px -left-px",
  tr: "-top-px -right-px",
  bl: "-bottom-px -left-px",
  br: "-bottom-px -right-px",
};

const ANCHOR: Record<Position, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0",
};

export function CropMark({ position }: { position: Position }) {
  return (
    <span
      className={`absolute w-[12px] h-[12px] pointer-events-none ${WRAP[position]}`}
      aria-hidden="true"
    >
      <span className={`absolute w-[12px] h-px bg-(--color-foreground) opacity-45 ${ANCHOR[position]}`} />
      <span className={`absolute w-px h-[12px] bg-(--color-foreground) opacity-45 ${ANCHOR[position]}`} />
    </span>
  );
}
