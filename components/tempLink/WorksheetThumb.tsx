const VARIANTS = [
  { heading: 28, lines: [76, 64, 70, 58, 72, 60, 66, 54], hasFigure: true,  figureH: 32 },
  { heading: 22, lines: [70, 66, 60, 56],                  hasFigure: true,  figureH: 48 },
  { heading: 32, lines: [78, 70, 64, 60, 56, 72, 68, 60, 54, 48], hasFigure: false, figureH: 0 },
  { heading: 22, lines: [60, 54, 48],                      hasFigure: true,  figureH: 24 },
];

export function WorksheetThumb({ pageIndex = 0 }: { pageIndex?: number }) {
  const v = VARIANTS[pageIndex % VARIANTS.length];
  const W = 100, H = 141;
  const px = 14, py = 18;
  const innerW = W - px * 2;
  const y = py + 4;

  return (
    <svg className="w-full h-full block" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <rect x={px} y={y}     width={v.heading}       height="3"   className="o-band" rx="0.4" />
      <rect x={px} y={y + 7} width={v.heading * 0.6} height="1.2" className="o-band" opacity="0.4" rx="0.4" />

      <g>
        {v.lines.map((w, i) => (
          <line
            key={i}
            x1={px}
            y1={y + 16 + i * 4.2}
            x2={px + w}
            y2={y + 16 + i * 4.2}
            className="o-line"
            strokeWidth="0.9"
          />
        ))}
      </g>

      {v.hasFigure && (
        <rect
          x={px}
          y={y + 16 + v.lines.length * 4.2 + 4}
          width={innerW * 0.85}
          height={v.figureH}
          className="o-figure"
          rx="0.4"
        />
      )}

      <line x1={px}           y1={H - 10} x2={px + 12}     y2={H - 10} className="o-line-faint" strokeWidth="0.7" />
      <line x1={W - px - 12}  y1={H - 10} x2={W - px}      y2={H - 10} className="o-line-faint" strokeWidth="0.7" />

      <g stroke="var(--color-mark)" strokeWidth="0.5">
        <path d={`M${px - 3} ${py - 3} h6 M${px} ${py - 6} v6`} />
        <path d={`M${W - px + 3} ${py - 3} h-6 M${W - px} ${py - 6} v6`} />
        <path d={`M${px - 3} ${H - py + 3} h6 M${px} ${H - py + 6} v-6`} />
        <path d={`M${W - px + 3} ${H - py + 3} h-6 M${W - px} ${H - py + 6} v-6`} />
      </g>
    </svg>
  );
}
