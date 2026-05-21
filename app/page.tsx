import Link from "next/link";
import "./home.css";

function Logomark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="10" y="6" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 20 L4 36 L36 36 L30 20 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="13" r="3" stroke="var(--color-primary)" strokeWidth="1.5" />
      <line x1="20" y1="20" x2="20" y2="36" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="1.5 2.5" />
    </svg>
  );
}

function Header() {
  return (
    <header className="home-nav">
      <div className="home-wrap home-nav-inner">
        <Link href="/" className="home-brand">
          <Logomark />
          <span className="home-brand-name">Tracelight</span>
          <span className="home-brand-tag">beta</span>
        </Link>
        <nav className="home-nav-links">
          <a href="#how">How it works</a>
          <a href="#workshops">For workshops</a>
          <a href="#docs">Docs</a>
        </nav>
        <div className="home-nav-cta">
          <Link href="/auth" className="home-btn-quiet">Sign in</Link>
          <Link href="/auth" className="home-btn-solid">
            Sign up <span className="home-arrow">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroStage() {
  return (
    <div
      className="home-stage"
      role="img"
      aria-label="A camera projects a worksheet onto a blank sheet of paper, anchoring the overlay on screen"
    >
      <span className="home-crop home-crop-tl" />
      <span className="home-crop home-crop-tr" />
      <span className="home-crop home-crop-bl" />
      <span className="home-crop home-crop-br" />

      <div className="home-stage-strip-top">
        <span className="home-device-pill">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="1.5" y="1.5" width="9" height="9" rx="0.5" stroke="currentColor" strokeWidth="1" />
            <line x1="3.5" y1="4.5" x2="8.5" y2="4.5" stroke="currentColor" strokeWidth="1" />
            <line x1="3.5" y1="6.5" x2="7.5" y2="6.5" stroke="currentColor" strokeWidth="1" />
            <line x1="3.5" y1="8.5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1" />
          </svg>
          worksheet-03.pdf
        </span>
        <span className="home-spacer" />
        <span>a4</span>
      </div>

      <svg
        className="home-stage-svg"
        viewBox="0 0 800 720"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Clip that grows downward in sync with the scan line to reveal worksheet */}
          <clipPath id="paperReveal" clipPathUnits="userSpaceOnUse">
            <rect x="180" y="280" width="440" height="0">
              <animate
                attributeName="height"
                values="0;360;360;0;0"
                keyTimes="0;0.4;0.55;0.95;1"
                dur="7s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1"
              />
            </rect>
          </clipPath>

          <clipPath id="paperShape" clipPathUnits="userSpaceOnUse">
            <path d="M 246 280 L 554 280 L 624 640 L 176 640 Z" />
          </clipPath>

          <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--home-beam)" stopOpacity="0.3" />
            <stop offset="80%" stopColor="var(--home-beam)" stopOpacity="0.02" />
            <stop offset="100%" stopColor="var(--home-beam)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Camera — phone body + lens housing + lens + flash */}
        <g transform="translate(400 90)">
          <rect
            x="-46" y="-44" width="92" height="80" rx="10"
            fill="color-mix(in oklab, var(--color-foreground), transparent 8%)"
            stroke="color-mix(in oklab, var(--color-foreground), transparent 50%)"
            strokeWidth="0.8"
          />
          <rect
            x="-22" y="-22" width="44" height="22" rx="4"
            fill="color-mix(in oklab, var(--color-foreground), white 5%)"
          />
          <circle cx="-8" cy="-11" r="7" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="1.2" />
          <circle cx="-8" cy="-11" r="3" fill="var(--color-primary)" />
          <circle
            cx="12" cy="-11" r="3"
            fill="color-mix(in oklab, var(--home-beam), white 20%)"
            stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
            strokeWidth="0.6"
          />
        </g>

        {/* Projection cone */}
        <path d="M 354 130 L 176 640 L 624 640 L 446 130 Z" fill="url(#coneGrad)" />
        <line x1="354" y1="130" x2="176" y2="640" className="home-s-cone" />
        <line x1="446" y1="130" x2="624" y2="640" className="home-s-cone" />

        {/* Paper (perspective trapezoid) */}
        <path d="M 246 280 L 554 280 L 624 640 L 176 640 Z" className="home-s-paper" />

        {/* Worksheet contents — revealed by the scan clip */}
        <g clipPath="url(#paperShape)">
          <g clipPath="url(#paperReveal)">
            <rect x="276" y="316" width="170" height="14" className="home-s-band" rx="1" />
            <rect x="276" y="346" width="100" height="6" className="home-s-band" rx="1" opacity="0.5" />
            <line x1="276" y1="376" x2="520" y2="376" className="home-s-line" />
            <line x1="274" y1="394" x2="510" y2="394" className="home-s-line" />
            <line x1="272" y1="412" x2="518" y2="412" className="home-s-line" />
            <line x1="270" y1="430" x2="492" y2="430" className="home-s-line" />
            <line x1="268" y1="448" x2="514" y2="448" className="home-s-line" />
            <line x1="266" y1="466" x2="500" y2="466" className="home-s-line" />
            <line x1="264" y1="484" x2="516" y2="484" className="home-s-line" />
            <line x1="262" y1="502" x2="482" y2="502" className="home-s-line" />
            <line x1="260" y1="520" x2="508" y2="520" className="home-s-line" />
            <line x1="258" y1="538" x2="498" y2="538" className="home-s-line" />
            <line x1="256" y1="556" x2="470" y2="556" className="home-s-line" />
            <line x1="252" y1="576" x2="510" y2="576" className="home-s-line" />
            <line x1="250" y1="592" x2="430" y2="592" className="home-s-line" />
            <line x1="220" y1="616" x2="280" y2="616" className="home-s-line-faint" />
            <line x1="490" y1="616" x2="560" y2="616" className="home-s-line-faint" />
          </g>
        </g>

        {/* Corner detection brackets */}
        <g className="home-s-bracket">
          <path d="M 234 280 H 258 M 246 268 V 292" />
          <path d="M 566 280 H 542 M 554 268 V 292" />
          <path d="M 162 640 H 190 M 176 624 V 652" />
          <path d="M 638 640 H 610 M 624 624 V 652" />
        </g>

        {/* Scanning line — moves and widens in lockstep with the clip */}
        <line className="home-s-scan" x1="246" x2="554" y1="280" y2="280">
          <animate attributeName="y1" values="280;640;640;280;280" keyTimes="0;0.4;0.55;0.95;1" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
          <animate attributeName="y2" values="280;640;640;280;280" keyTimes="0;0.4;0.55;0.95;1" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
          <animate attributeName="x1" values="246;176;176;246;246" keyTimes="0;0.4;0.55;0.95;1" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
          <animate attributeName="x2" values="554;624;624;554;554" keyTimes="0;0.4;0.55;0.95;1" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1" />
        </line>
      </svg>

      <div className="home-stage-strip">
        <span className="home-stage-dot" />
        <span>overlaying</span>
        <span className="home-spacer" />
        <span className="home-meta-dim">anchored · 4 corners</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="home-hero">
      <div className="home-wrap home-hero-inner">
        <div>
          <div className="home-eyebrow">
            <span>Tracelight · for workshops</span>
          </div>
          <h1 className="home-headline">
            Hand out worksheets <span className="home-strike-paper">on paper</span>.
            <br />
            Through <em>any blank sheet.</em>
          </h1>
          <p className="home-sub">
            Upload a worksheet to Drive or Dropbox. Share a temporary link.
            Participants point their camera at any blank sheet — Tracelight uses
            it as an anchor and overlays the worksheet on their screen.
          </p>
          <div className="home-hero-cta">
            <Link href="/auth" className="home-btn-solid">
              Sign up <span className="home-arrow">→</span>
            </Link>
            <a href="#how" className="home-btn-quiet">See how it works</a>
            <span className="home-hero-meta">
              <span className="home-pip" /> works in-browser · no app
            </span>
          </div>
        </div>
        <HeroStage />
      </div>
    </section>
  );
}

function StepUpload() {
  return (
    <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect x="40" y="40" width="64" height="80" rx="1" className="home-s-paper" />
      <rect x="48" y="32" width="64" height="80" rx="1" className="home-s-paper" />
      <rect x="56" y="24" width="64" height="80" rx="1" className="home-s-paper" />
      <line x1="62" y1="44" x2="106" y2="44" className="home-s-line" />
      <line x1="62" y1="54" x2="100" y2="54" className="home-s-line" />
      <line x1="62" y1="64" x2="108" y2="64" className="home-s-line" />
      <rect x="62" y="72" width="46" height="22" className="home-s-figure" />
      <path
        d="M 134 64 H 168 M 162 58 L 168 64 L 162 70"
        stroke="var(--color-primary)" strokeWidth="1.6" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <rect
        x="178" y="42" width="48" height="36" rx="6"
        fill="color-mix(in oklab, var(--color-background), white 2%)"
        stroke="var(--color-border)" strokeWidth="1"
      />
      <text
        x="202" y="64" textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono), monospace" fontSize="8"
        letterSpacing="0.16em" fill="var(--color-muted)"
      >
        DRIVE
      </text>
    </svg>
  );
}

function StepShare() {
  return (
    <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g transform="translate(40 30)">
        <path
          d="M 0 8 V 72 H 160 V 8 Z M 0 8 H 160"
          fill="var(--color-surface)"
          stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
          strokeWidth="0.8"
        />
        <line
          x1="112" y1="8" x2="112" y2="72"
          stroke="color-mix(in oklab, var(--color-foreground), transparent 70%)"
          strokeWidth="0.6" strokeDasharray="2 3"
        />
        <text
          x="12" y="28"
          fontFamily="var(--font-jetbrains-mono), monospace" fontSize="9"
          letterSpacing="0.14em" fill="var(--color-muted)"
        >
          /T/4F8A2C9D
        </text>
        <line x1="12" y1="40" x2="102" y2="40" className="home-s-line" />
        <line x1="12" y1="52" x2="86" y2="52" className="home-s-line" />
        <text
          x="136" y="34" textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono), monospace" fontSize="8"
          letterSpacing="0.14em" fill="var(--color-primary)"
        >
          EXPIRES
        </text>
        <text
          x="136" y="54" textAnchor="middle"
          fontFamily="var(--font-instrument-serif), serif" fontSize="22"
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
    <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* Camera at 0.4 scale — matches hero camera exactly */}
      <g transform="translate(120 22) scale(0.4)">
        <rect
          x="-46" y="-44" width="92" height="80" rx="10"
          fill="color-mix(in oklab, var(--color-foreground), transparent 8%)"
          stroke="color-mix(in oklab, var(--color-foreground), transparent 50%)"
          strokeWidth="2"
        />
        <rect
          x="-22" y="-22" width="44" height="22" rx="4"
          fill="color-mix(in oklab, var(--color-foreground), white 5%)"
        />
        <circle cx="-8" cy="-11" r="7" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="3" />
        <circle cx="-8" cy="-11" r="3" fill="var(--color-primary)" />
        <circle
          cx="12" cy="-11" r="3"
          fill="color-mix(in oklab, var(--home-beam), white 20%)"
          stroke="color-mix(in oklab, var(--color-foreground), transparent 60%)"
          strokeWidth="1.5"
        />
      </g>
      {/* Paper */}
      <path d="M 60 50 L 180 50 L 198 124 L 42 124 Z" className="home-s-paper" />
      <line x1="74" y1="68" x2="160" y2="68" className="home-s-line" />
      <line x1="72" y1="80" x2="154" y2="80" className="home-s-line" />
      <rect x="68" y="92" width="100" height="24" className="home-s-figure" />
      {/* Brackets — all four corners including top two */}
      <g className="home-s-bracket">
        <path d="M 54 50 H 66 M 60 44 V 56" />
        <path d="M 186 50 H 174 M 180 44 V 56" />
        <path d="M 36 124 H 48 M 42 118 V 130" />
        <path d="M 204 124 H 192 M 198 118 V 130" />
      </g>
      {/* Cone lines to all four corners */}
      <line x1="112" y1="38" x2="60" y2="50" className="home-s-cone" />
      <line x1="128" y1="38" x2="180" y2="50" className="home-s-cone" />
      <line x1="112" y1="38" x2="42" y2="124" className="home-s-cone" />
      <line x1="128" y1="38" x2="198" y2="124" className="home-s-cone" />
    </svg>
  );
}

function How() {
  return (
    <section id="how" className="home-how">
      <div className="home-wrap">
        <div className="home-how-head">
          <h2 className="home-how-title">
            From upload to <em>traceable</em>, in three steps.
          </h2>
          <p className="home-how-sub">
            Hosts run the workshop. Participants just open a link — no install,
            no account needed.
          </p>
        </div>
        <div className="home-steps">
          <article className="home-step">
            <span className="home-crop home-crop-tl" />
            <span className="home-crop home-crop-tr" />
            <span className="home-crop home-crop-bl" />
            <span className="home-crop home-crop-br" />
            <div className="home-step-num"><strong>01</strong> Step 01</div>
            <div className="home-step-art"><StepUpload /></div>
            <h3 className="home-step-h">
              Pull from <em>Drive</em> or <em>Dropbox.</em>
            </h3>
            <p className="home-step-p">
              Connect your cloud once. Pick any worksheet — PDF or image —
              straight from your storage.
            </p>
          </article>

          <article className="home-step">
            <span className="home-crop home-crop-tl" />
            <span className="home-crop home-crop-tr" />
            <span className="home-crop home-crop-bl" />
            <span className="home-crop home-crop-br" />
            <div className="home-step-num"><strong>02</strong> Step 02</div>
            <div className="home-step-art"><StepShare /></div>
            <h3 className="home-step-h">
              Share a <em>temporary</em> link.
            </h3>
            <p className="home-step-p">
              Each session gets a /t/… URL. Hand it out by QR or chat. Links
              expire on your terms — at the end of the session, the door is
              closed.
            </p>
          </article>

          <article className="home-step">
            <span className="home-crop home-crop-tl" />
            <span className="home-crop home-crop-tr" />
            <span className="home-crop home-crop-bl" />
            <span className="home-crop home-crop-br" />
            <div className="home-step-num"><strong>03</strong> Step 03</div>
            <div className="home-step-art"><StepTrace /></div>
            <h3 className="home-step-h">
              Point at a <em>blank</em> sheet.
            </h3>
            <p className="home-step-p">
              Participants open the link and point their camera at any blank
              sheet. The browser locks onto its corners and overlays the
              worksheet on their screen — they trace what they see.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="home-foot">
      <div className="home-wrap home-foot-inner">
        <span>↳ tracelight · v0.1 · beta</span>
        <span>privacy · terms · status</span>
        <span>en-US · 20 / 05 / 2026</span>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero />
        <How />
      </main>
      <Footer />
    </div>
  );
}
