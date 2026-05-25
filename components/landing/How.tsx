import { Wrap } from "./Wrap";

function StepUpload() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 240 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <rect
        x="40"
        y="40"
        width="64"
        height="80"
        rx="1"
        className="fill-(--color-surface) stroke-[color-mix(in_oklab,var(--color-foreground),transparent_75%)] stroke-[0.6] drop-shadow-[0_6px_8px_rgba(0,0,0,0.08)]"
      />
      <rect
        x="48"
        y="32"
        width="64"
        height="80"
        rx="1"
        className="fill-(--color-surface) stroke-[color-mix(in_oklab,var(--color-foreground),transparent_75%)] stroke-[0.6] drop-shadow-[0_6px_8px_rgba(0,0,0,0.08)]"
      />
      <rect
        x="56"
        y="24"
        width="64"
        height="80"
        rx="1"
        className="fill-(--color-surface) stroke-[color-mix(in_oklab,var(--color-foreground),transparent_75%)] stroke-[0.6] drop-shadow-[0_6px_8px_rgba(0,0,0,0.08)]"
      />
      <line
        x1="62"
        y1="44"
        x2="106"
        y2="44"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]"
      />
      <line
        x1="62"
        y1="54"
        x2="100"
        y2="54"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]"
      />
      <line
        x1="62"
        y1="64"
        x2="108"
        y2="64"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]"
      />
      <rect
        x="62"
        y="72"
        width="46"
        height="22"
        className="fill-[color-mix(in_oklab,var(--color-primary),transparent_78%)] stroke-[color-mix(in_oklab,var(--color-primary),transparent_40%)] stroke-[0.8]"
      />
      <path
        d="M 168 70 H 134 M 140 64 L 134 70 L 140 76"
        stroke="var(--color-primary)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="176"
        y="50"
        width="53"
        height="40"
        rx="6"
        fill="color-mix(in oklab, var(--color-background), white 2%)"
        stroke="var(--color-border)"
        strokeWidth="1"
      />
      <text
        x="202"
        y="70"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="var(--color-muted)"
      >
        DB
      </text>
    </svg>
  );
}

function StepShare() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 240 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g transform="translate(40 30)">
        <path
          d="M 0 8 V 72 H 160 V 8 Z M 0 8 H 160"
          fill="var(--color-surface)"
          stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
          strokeWidth="0.8"
        />
        <line
          x1="112"
          y1="8"
          x2="112"
          y2="72"
          stroke="color-mix(in oklab, var(--color-foreground), transparent 70%)"
          strokeWidth="0.6"
          strokeDasharray="2 3"
        />
        <text
          x="12"
          y="28"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="9"
          letterSpacing="0.14em"
          fill="var(--color-muted)"
        >
          /T/4F8A2C9D
        </text>
        <line
          x1="12"
          y1="40"
          x2="102"
          y2="40"
          className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]"
        />
        <line
          x1="12"
          y1="52"
          x2="86"
          y2="52"
          className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]"
        />
        <text
          x="136"
          y="34"
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="8"
          letterSpacing="0.14em"
          fill="var(--color-primary)"
        >
          EXPIRES
        </text>
        <text
          x="136"
          y="54"
          textAnchor="middle"
          fontFamily="var(--font-instrument-serif), serif"
          fontSize="22"
          fill="var(--color-foreground)"
        >
          2h
        </text>
        <circle cx="112" cy="0" r="3" fill="var(--color-background)" />
        <circle cx="112" cy="80" r="3" fill="var(--color-background)" />
      </g>
    </svg>
  );
}

function StepTrace() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 240 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g transform="translate(120 22) scale(0.4)">
        <rect
          x="-46"
          y="-44"
          width="92"
          height="80"
          rx="10"
          fill="color-mix(in oklab, var(--color-foreground), transparent 8%)"
          stroke="color-mix(in oklab, var(--color-foreground), transparent 50%)"
          strokeWidth="2"
        />
        <rect
          x="-22"
          y="-22"
          width="44"
          height="22"
          rx="4"
          fill="color-mix(in oklab, var(--color-foreground), white 5%)"
        />
        <circle
          cx="-8"
          cy="-11"
          r="7"
          fill="var(--color-background)"
          stroke="var(--color-primary)"
          strokeWidth="3"
        />
        <circle cx="-8" cy="-11" r="3" fill="var(--color-primary)" />
        <circle
          cx="12"
          cy="-11"
          r="3"
          fill="color-mix(in oklab, var(--home-beam), white 20%)"
          stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
          strokeWidth="1.5"
        />
      </g>
      <path
        d="M 60 50 L 180 50 L 198 124 L 42 124 Z"
        className="fill-(--color-surface) stroke-[color-mix(in_oklab,var(--color-foreground),transparent_75%)] stroke-[0.6] drop-shadow-[0_6px_8px_rgba(0,0,0,0.08)]"
      />
      <line
        x1="74"
        y1="68"
        x2="160"
        y2="68"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]"
      />
      <line
        x1="72"
        y1="80"
        x2="154"
        y2="80"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_65%)] stroke-[1.6] [stroke-linecap:round]"
      />
      <rect
        x="68"
        y="92"
        width="100"
        height="24"
        className="fill-[color-mix(in_oklab,var(--color-primary),transparent_78%)] stroke-[color-mix(in_oklab,var(--color-primary),transparent_40%)] stroke-[0.8]"
      />
      <g className="stroke-(--color-primary) stroke-[1.6] [stroke-linecap:square] fill-none">
        <path d="M 54 50 H 66 M 60 44 V 56" />
        <path d="M 186 50 H 174 M 180 44 V 56" />
        <path d="M 36 124 H 48 M 42 118 V 130" />
        <path d="M 204 124 H 192 M 198 118 V 130" />
      </g>
      <line
        x1="112"
        y1="38"
        x2="60"
        y2="50"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_60%)] stroke-[0.8] [stroke-dasharray:2_4] fill-none"
      />
      <line
        x1="128"
        y1="38"
        x2="180"
        y2="50"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_60%)] stroke-[0.8] [stroke-dasharray:2_4] fill-none"
      />
      <line
        x1="112"
        y1="38"
        x2="42"
        y2="124"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_60%)] stroke-[0.8] [stroke-dasharray:2_4] fill-none"
      />
      <line
        x1="128"
        y1="38"
        x2="198"
        y2="124"
        className="stroke-[color-mix(in_oklab,var(--color-foreground),transparent_60%)] stroke-[0.8] [stroke-dasharray:2_4] fill-none"
      />
    </svg>
  );
}

const stepArtBg =
  "linear-gradient(180deg, color-mix(in oklab, var(--color-background), white 2%), color-mix(in oklab, var(--color-background), black 2%))";

const stepCropTL =
  "absolute pointer-events-none w-3 h-3 -top-px -left-px before:content-[''] before:absolute before:bg-(--color-foreground) before:w-3 before:h-px before:opacity-[0.45] before:top-0 before:left-0 after:content-[''] after:absolute after:bg-(--color-foreground) after:w-px after:h-3 after:opacity-[0.45] after:top-0 after:left-0";
const stepCropTR =
  "absolute pointer-events-none w-3 h-3 -top-px -right-px before:content-[''] before:absolute before:bg-(--color-foreground) before:w-3 before:h-px before:opacity-[0.45] before:top-0 before:right-0 after:content-[''] after:absolute after:bg-(--color-foreground) after:w-px after:h-3 after:opacity-[0.45] after:top-0 after:right-0";
const stepCropBL =
  "absolute pointer-events-none w-3 h-3 -bottom-px -left-px before:content-[''] before:absolute before:bg-(--color-foreground) before:w-3 before:h-px before:opacity-[0.45] before:bottom-0 before:left-0 after:content-[''] after:absolute after:bg-(--color-foreground) after:w-px after:h-3 after:opacity-[0.45] after:bottom-0 after:left-0";
const stepCropBR =
  "absolute pointer-events-none w-3 h-3 -bottom-px -right-px before:content-[''] before:absolute before:bg-(--color-foreground) before:w-3 before:h-px before:opacity-[0.45] before:bottom-0 before:right-0 after:content-[''] after:absolute after:bg-(--color-foreground) after:w-px after:h-3 after:opacity-[0.45] after:bottom-0 after:right-0";

export function How() {
  return (
    <section
      id="how"
      className="py-16 sm:py-20 lg:py-[100px] border-t border-(--color-border)"
    >
      <Wrap>
        <div className="flex items-end justify-between gap-6 mb-10 sm:mb-12 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 font-code text-[14px] tracking-[0.16em] uppercase text-(--color-muted) mb-5">
              How it works
            </div>
          <h2 className="font-heading font-normal text-[clamp(24px,3.2vw,40px)] leading-[1.1] tracking-[-0.015em] m-0 max-w-[22ch] text-balance text-(--color-foreground)">
            From upload to{" "}
            <em className="font-heading italic text-(--color-primary)">
              traceable
            </em>
            , in three steps.
          </h2>
          </div>
          <p className="text-[14px] sm:text-[14.5px] leading-[1.55] text-(--color-muted) max-w-[38ch] m-0 text-pretty">
            Hosts run the workshop. Participants just open a link — no install,
            no account needed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <article className="relative bg-(--color-surface) border border-(--color-border) p-6 sm:p-7 flex flex-col gap-4 min-h-[280px] sm:min-h-[360px]">
            <span className={stepCropTL} />
            <span className={stepCropTR} />
            <span className={stepCropBL} />
            <span className={stepCropBR} />
            <div className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted)">
              <strong className="text-(--color-primary) font-medium mr-2">
                01
              </strong>
              Step 01
            </div>
            <div
              className="h-[120px] sm:h-[140px] mt-1 border border-(--color-border) rounded-sm relative overflow-hidden"
              style={{ background: stepArtBg }}
            >
              <StepUpload />
            </div>
            <h3 className="font-heading font-normal text-xl sm:text-2xl leading-[1.15] tracking-[-0.01em] m-0 text-(--color-foreground)">
              Pull from{" "}
              <em className="font-heading italic text-(--color-primary)">
                Drive
              </em>{" "}
              or{" "}
              <em className="font-heading italic text-(--color-primary)">
                Dropbox.
              </em>
            </h3>
            <p className="text-[13.5px] sm:text-[14px] leading-normal text-(--color-muted) m-0 text-pretty">
              Connect your cloud once. Pick any worksheet — PDF or image —
              straight from your storage.
            </p>
          </article>

          <article className="relative bg-(--color-surface) border border-(--color-border) p-6 sm:p-7 flex flex-col gap-4 min-h-[280px] sm:min-h-[360px]">
            <span className={stepCropTL} />
            <span className={stepCropTR} />
            <span className={stepCropBL} />
            <span className={stepCropBR} />
            <div className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted)">
              <strong className="text-(--color-primary) font-medium mr-2">
                02
              </strong>
              Step 02
            </div>
            <div
              className="h-[120px] sm:h-[140px] mt-1 border border-(--color-border) rounded-sm relative overflow-hidden"
              style={{ background: stepArtBg }}
            >
              <StepShare />
            </div>
            <h3 className="font-heading font-normal text-xl sm:text-2xl leading-[1.15] tracking-[-0.01em] m-0 text-(--color-foreground)">
              Share a{" "}
              <em className="font-heading italic text-(--color-primary)">
                temporary
              </em>{" "}
              link.
            </h3>
            <p className="text-[13.5px] sm:text-[14px] leading-normal text-(--color-muted) m-0 text-pretty">
              Each session gets a /t/… URL. Hand it out by QR or chat. Links
              expire on your terms — at the end of the session, the door is
              closed.
            </p>
          </article>

          <article className="relative bg-(--color-surface) border border-(--color-border) p-6 sm:p-7 flex flex-col gap-4 min-h-[280px] sm:min-h-[360px]">
            <span className={stepCropTL} />
            <span className={stepCropTR} />
            <span className={stepCropBL} />
            <span className={stepCropBR} />
            <div className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted)">
              <strong className="text-(--color-primary) font-medium mr-2">
                03
              </strong>
              Step 03
            </div>
            <div
              className="h-[120px] sm:h-[140px] mt-1 border border-(--color-border) rounded-sm relative overflow-hidden"
              style={{ background: stepArtBg }}
            >
              <StepTrace />
            </div>
            <h3 className="font-heading font-normal text-xl sm:text-2xl leading-[1.15] tracking-[-0.01em] m-0 text-(--color-foreground)">
              Point at a{" "}
              <em className="font-heading italic text-(--color-primary)">
                blank
              </em>{" "}
              sheet.
            </h3>
            <p className="text-[13.5px] sm:text-[14px] leading-normal text-(--color-muted) m-0 text-pretty">
              Participants open the link and point their camera at any blank
              sheet. The browser locks onto its corners and overlays the
              worksheet on their screen — they trace what they see.
            </p>
          </article>
        </div>
      </Wrap>
    </section>
  );
}
