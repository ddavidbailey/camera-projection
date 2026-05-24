type Position = "tl" | "tr" | "bl" | "br";

const WRAP = {
  cam: {
    tl: "top-[10px] left-[10px]",
    tr: "top-[10px] right-[10px]",
    bl: "bottom-[10px] left-[10px]",
    br: "bottom-[10px] right-[10px]",
  },
  panel: {
    tl: "-top-px -left-px",
    tr: "-top-px -right-px",
    bl: "-bottom-px -left-px",
    br: "-bottom-px -right-px",
  },
};

const ANCHOR = {
  tl: "top-0 left-0",
  tr: "top-0 right-0",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0",
};

export function CropMark({
  position,
  variant = "panel",
}: {
  position: Position;
  variant?: "cam" | "panel";
}) {
  const isCam    = variant === "cam";
  const size     = isCam ? "w-[14px] h-[14px]" : "w-[10px] h-[10px]";
  const barH     = isCam ? "w-[14px] h-px"     : "w-[10px] h-px";
  const barV     = isCam ? "w-px h-[14px]"      : "w-px h-[10px]";
  const opacity  = isCam ? "opacity-55"          : "opacity-40";
  const zIndex   = isCam ? "z-[6]"               : "";

  return (
    <span
      className={`absolute pointer-events-none ${size} ${WRAP[variant][position]} ${zIndex}`}
      aria-hidden="true"
    >
      <span className={`absolute ${barH} bg-(--color-foreground) ${opacity} ${ANCHOR[position]}`} />
      <span className={`absolute ${barV} bg-(--color-foreground) ${opacity} ${ANCHOR[position]}`} />
    </span>
  );
}
