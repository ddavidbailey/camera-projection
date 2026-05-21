"use client";

import { useState, useEffect, useMemo, createContext, useContext } from "react";

/* ── Palette context ─────────────────────────────────────────────────────── */
type PaletteKey = "paper" | "dusk";
type Mode = "in" | "up";

const PaletteCtx = createContext<PaletteKey>("paper");
const usePalette = () => useContext(PaletteCtx);

interface Palette {
  bg: string;
  paper: string;
  ink: string;
  muted: string;
  line: string;
  beam: string;
  accent: string;
  registration: string;
}

const PALETTES: Record<PaletteKey, Palette> = {
  paper: {
    bg: "#EFE7D6",
    paper: "#F8F2E4",
    ink: "#1B1A17",
    muted: "#7A6F5C",
    line: "#D7CCB4",
    beam: "oklch(0.86 0.07 218)",
    accent: "oklch(0.66 0.13 52)",
    registration: "#C7B891",
  },
  dusk: {
    bg: "#1A1B24",
    paper: "#22232E",
    ink: "#EDE7D6",
    muted: "#8E8A7D",
    line: "#33343F",
    beam: "oklch(0.78 0.09 84)",
    accent: "oklch(0.72 0.13 28)",
    registration: "#4A4B58",
  },
};

/* ── Decorative helpers ───────────────────────────────────────────────────── */
function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--c-bg, #EFE7D6), white 6%), transparent 40%)," +
          "radial-gradient(circle at 90% 80%, color-mix(in oklab, var(--c-bg, #EFE7D6), black 4%), transparent 50%)",
      }}
    />
  );
}

function CropMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const wrap = {
    tl: "-top-px -left-px",
    tr: "-top-px -right-px",
    bl: "-bottom-px -left-px",
    br: "-bottom-px -right-px",
  }[position];
  const anchor = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[position];
  return (
    <span
      className={`absolute w-3.5 h-3.5 pointer-events-none z-3 ${wrap}`}
      aria-hidden="true"
    >
      <span
        className={`absolute w-3.5 h-px bg-(--c-ink) opacity-55 ${anchor}`}
      />
      <span
        className={`absolute w-px h-3.5 bg-(--c-ink) opacity-55 ${anchor}`}
      />
    </span>
  );
}

function RegMark({
  position,
  show,
}: {
  position: "tl" | "tr" | "bl" | "br";
  show: boolean;
}) {
  const wrap = {
    tl: "-top-0.5 -left-0.5",
    tr: "-top-0.5 -right-0.5",
    bl: "-bottom-0.5 -left-0.5",
    br: "-bottom-0.5 -right-0.5",
  }[position];
  const anchor = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[position];
  return (
    <span
      className={`absolute w-1.5 h-1.5 pointer-events-none transition-opacity duration-180 ${show ? "opacity-100" : "opacity-0"} ${wrap}`}
      aria-hidden="true"
    >
      <span className={`absolute w-1.5 h-px bg-(--c-accent) ${anchor}`} />
      <span className={`absolute w-px h-1.5 bg-(--c-accent) ${anchor}`} />
    </span>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */
function Logomark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="6"
        width="20"
        height="14"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 20 L4 36 L36 36 L30 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="20"
        cy="13"
        r="3"
        stroke="var(--c-accent)"
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="20"
        x2="20"
        y2="36"
        stroke="var(--c-accent)"
        strokeWidth="1"
        strokeDasharray="1.5 2.5"
      />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21 12.5a9 9 0 1 1-3.1-6.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M21 4v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DropboxGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4l6 4-6 4-6-4 6-4z"
        transform="translate(6 2)"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6 4l6 4-6 4-6-4 6-4z"
        transform="translate(6 10)"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Field ───────────────────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  hint?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}

function Field({
  label,
  hint,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const id = useMemo(() => "f-" + Math.random().toString(36).slice(2, 8), []);

  const wrapClass = [
    "relative border rounded-[10px] transition-[border-color,box-shadow] duration-180",
    "bg-[color-mix(in_oklab,var(--c-paper),white_4%)]",
    focused
      ? "border-[color-mix(in_oklab,var(--c-ink),transparent_40%)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--c-beam),transparent_80%)]"
      : error
        ? "border-(--c-accent)"
        : "border-(--c-line)",
  ].join(" ");

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="font-code text-[10.5px] tracking-[0.14em] uppercase text-(--c-muted)">
          {label}
        </span>
        {hint && (
          <span className="font-code text-[10.5px] tracking-[0.08em] text-[color-mix(in_oklab,var(--c-muted),transparent_30%)]">
            {hint}
          </span>
        )}
      </div>
      <div className={wrapClass}>
        <RegMark position="tl" show={focused} />
        <RegMark position="tr" show={focused} />
        <RegMark position="bl" show={focused} />
        <RegMark position="br" show={focused} />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full px-3.5 py-3 bg-transparent border-none outline-none text-[14.5px] text-(--c-ink) tracking-[-0.005em] placeholder:text-[color-mix(in_oklab,var(--c-muted),transparent_40%)]"
        />
      </div>
      {error && (
        <span className="font-code text-[10.5px] text-(--c-accent) tracking-[0.08em]">
          {error}
        </span>
      )}
    </label>
  );
}

/* ── Password field ──────────────────────────────────────────────────────── */
interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  showStrength?: boolean;
  autoComplete?: string;
  error?: string;
}

function PasswordField({
  label,
  value,
  onChange,
  showStrength,
  autoComplete,
  error,
}: PasswordFieldProps) {
  const [reveal, setReveal] = useState(false);
  const [focused, setFocused] = useState(false);
  const id = useMemo(() => "p-" + Math.random().toString(36).slice(2, 8), []);

  const strength = useMemo(() => {
    let n = 0;
    if (value.length >= 8) n++;
    if (/[A-Z]/.test(value)) n++;
    if (/[0-9]/.test(value)) n++;
    if (/[^A-Za-z0-9]/.test(value)) n++;
    return n;
  }, [value]);

  const strengthColors = [
    "bg-[color-mix(in_oklab,var(--c-accent),white_10%)]",
    "bg-(--c-accent)",
    "bg-[color-mix(in_oklab,var(--c-beam),var(--c-ink)_10%)]",
    "bg-[color-mix(in_oklab,var(--c-beam),var(--c-ink)_25%)]",
  ];

  const strengthLabels = [
    "8+ chars, mix of cases, numbers, symbols",
    "weak",
    "weak",
    "fair",
    "strong",
    "very strong",
  ];

  const wrapClass = [
    "relative border rounded-[10px] transition-[border-color,box-shadow] duration-180",
    "bg-[color-mix(in_oklab,var(--c-paper),white_4%)]",
    focused
      ? "border-[color-mix(in_oklab,var(--c-ink),transparent_40%)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--c-beam),transparent_80%)]"
      : error
        ? "border-(--c-accent)"
        : "border-(--c-line)",
  ].join(" ");

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="font-code text-[10.5px] tracking-[0.14em] uppercase text-(--c-muted)">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setReveal((r) => !r)}
          className="font-code text-[10.5px] tracking-[0.12em] uppercase text-(--c-muted) bg-transparent border-none p-0 cursor-pointer hover:text-(--c-ink)"
        >
          {reveal ? "hide" : "show"}
        </button>
      </div>
      <div className={wrapClass}>
        <RegMark position="tl" show={focused} />
        <RegMark position="tr" show={focused} />
        <RegMark position="bl" show={focused} />
        <RegMark position="br" show={focused} />
        <input
          id={id}
          type={reveal ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="••••••••"
          autoComplete={autoComplete}
          className="block w-full px-3.5 py-3 bg-transparent border-none outline-none text-[14.5px] text-(--c-ink) tracking-[-0.005em] placeholder:text-[color-mix(in_oklab,var(--c-muted),transparent_40%)]"
        />
      </div>
      {showStrength && (
        <div className="flex items-center gap-2.5 mt-0.5">
          <div className="grid grid-cols-4 gap-[3px] flex-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-[3px] rounded-sm transition-colors duration-180 ${i < strength ? strengthColors[strength - 1] : "bg-(--c-line)"}`}
              />
            ))}
          </div>
          <span className="font-code text-[10px] uppercase tracking-widest text-(--c-muted) whitespace-nowrap">
            {value.length === 0 ? strengthLabels[0] : strengthLabels[strength]}
          </span>
        </div>
      )}
      {error && (
        <span className="font-code text-[10.5px] text-(--c-accent) tracking-[0.08em]">
          {error}
        </span>
      )}
    </label>
  );
}

/* ── OAuth chip ──────────────────────────────────────────────────────────── */
function OAuthChip({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex items-center gap-2.5 px-3.5 py-[11px] bg-[color-mix(in_oklab,var(--c-paper),white_4%)] border border-(--c-line) rounded-[10px] text-(--c-ink) text-[13px] font-medium cursor-pointer text-left transition-[background,border-color,transform] duration-180 hover:bg-[color-mix(in_oklab,var(--c-paper),white_12%)] hover:border-[color-mix(in_oklab,var(--c-line),var(--c-ink)_10%)] active:translate-y-px"
    >
      <span className="grid place-items-center text-(--c-ink)">
        {icon}
      </span>
      <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </span>
      <span className="font-code text-[11px] text-(--c-muted)">↗</span>
    </button>
  );
}

/* ── Checkbox ────────────────────────────────────────────────────────────── */
function CheckBox({
  checked,
  onChange,
  children,
  block = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  block?: boolean;
}) {
  const palette = usePalette();
  const checkedClass =
    palette === "dusk"
      ? "bg-(--c-paper) border-(--c-paper) text-[var(--c-bg)]"
      : "bg-(--c-ink) border-(--c-ink) text-(--c-paper)";

  return (
    <label
      className={`inline-flex items-center gap-2 text-[13px] text-(--c-ink) cursor-pointer select-none ${block ? "items-start gap-2.5 leading-[1.4] whitespace-normal" : "whitespace-nowrap"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute opacity-0 pointer-events-none"
      />
      <span
        className={`w-4 h-4 border rounded-[3px] grid place-items-center shrink-0 transition-all duration-180 ${checked ? checkedClass : "border-(--c-line) bg-[color-mix(in_oklab,var(--c-paper),white_6%)] text-transparent"} ${block ? "mt-0.5" : ""}`}
      >
        <svg viewBox="0 0 12 12" width="10" height="10">
          <path
            d="M2 6.5l2.5 2.5L10 3"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </label>
  );
}

/* ── Paper card ──────────────────────────────────────────────────────────── */
function PaperCard({ children }: { children: React.ReactNode }) {
  const palette = usePalette();

  const shadow =
    palette === "dusk"
      ? "0 1px 0 color-mix(in oklab, var(--c-paper), white 4%) inset, 0 30px 60px -30px rgba(0,0,0,0.5)"
      : "0 1px 0 color-mix(in oklab, var(--c-paper), white 6%) inset, 0 30px 60px -40px rgba(0,0,0,0.25), 0 4px 14px -8px rgba(0,0,0,0.12)";

  return (
    <div
      className="relative bg-(--c-paper) border border-(--c-line) px-9 pt-9 pb-8"
      style={{ boxShadow: shadow }}
    >
      {/* projection beam */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-1"
        aria-hidden="true"
      >
        <span
          className="absolute top-[-60%] left-1/2 -translate-x-1/2 w-[140%] h-[180%]"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 0%, color-mix(in oklab, var(--c-beam), transparent 70%) 0%, color-mix(in oklab, var(--c-beam), transparent 88%) 40%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      </div>
      {/* baseline grid */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--c-ink), transparent 94%) 1px, transparent 1px)," +
            "linear-gradient(to bottom, color-mix(in oklab, var(--c-ink), transparent 94%) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(180deg, black 0%, black 70%, transparent 100%)",
        }}
      />
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />
      <div className="relative z-2">{children}</div>
    </div>
  );
}

/* ── Sign-in form ────────────────────────────────────────────────────────── */
function SignIn({ onSwitch }: { onSwitch: () => void }) {
  const palette = usePalette();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: authClient.signIn.email({ email, password: pwd, rememberMe: remember })
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2200);
    }, 900);
  };

  const submitBase =
    palette === "dusk"
      ? "bg-(--c-paper) border-[color-mix(in_oklab,var(--c-paper),white_8%)] text-[var(--c-bg)]"
      : "bg-(--c-ink) border-(--c-ink) text-(--c-paper)";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-3.5 mb-1.5">
        <div className="inline-flex items-center gap-2 font-code text-[10.5px] tracking-[0.16em] uppercase text-(--c-muted) whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-(--c-accent) shadow-[0_0_0_3px_color-mix(in_oklab,var(--c-accent),transparent_80%)]" />
          <span>—— Host sign in</span>
        </div>
        <h1 className="font-heading font-normal text-[clamp(30px,3.6vw,40px)] leading-[1.08] tracking-[-0.015em] m-0 text-(--c-ink) text-balance">
          Pick up where{" "}
          <em className="italic text-(--c-accent) pr-[0.06em]">
            the light
          </em>{" "}
          left off.
        </h1>
        <p className="text-[14.5px] leading-[1.55] text-(--c-muted) m-0 max-w-[38ch] text-pretty">
          Sign back into your workshop. Your worksheets and active session links
          are right where you parked them.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        {/* TODO: authClient.signIn.social({ provider: 'google' }) */}
        <OAuthChip icon={<GoogleGlyph />} label="Continue with Google" />
        <OAuthChip icon={<DropboxGlyph />} label="Continue with Dropbox" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 my-0.5">
        <span className="h-px bg-[linear-gradient(90deg,transparent,var(--c-line),transparent)]" />
        <span className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--c-muted) whitespace-nowrap">
          or with email
        </span>
        <span className="h-px bg-[linear-gradient(90deg,transparent,var(--c-line),transparent)]" />
      </div>

      <Field
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@studio.io"
        autoComplete="email"
      />
      <PasswordField
        label="Password"
        value={pwd}
        onChange={setPwd}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <CheckBox checked={remember} onChange={setRemember}>
          Keep me signed in
        </CheckBox>
        <a
          href="#"
          className="text-[13px] text-(--c-muted) no-underline border-b border-dashed border-(--c-line) pb-px transition-[color,border-color] duration-180 hover:text-(--c-ink) hover:border-(--c-ink) whitespace-nowrap"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className={`group relative flex w-full items-center justify-center gap-3 px-5 py-3.5 whitespace-nowrap border rounded-[10px] text-sm font-medium tracking-[-0.005em] cursor-pointer mt-1 overflow-hidden transition-[transform,opacity] duration-180 hover:-translate-y-px ${submitted ? "bg-(--c-accent) border-(--c-accent) text-(--c-paper)" : submitBase}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--c-beam),transparent_50%),transparent)] group-hover:translate-x-full transition-transform duration-550"
        />
        <span className="relative">
          {submitted ? "Aligning camera…" : submitting ? "Tracing…" : "Sign in"}
        </span>
        <span
          className={`relative inline-flex ${submitting ? "animate-auth-trace" : ""}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <p className="text-center text-[13px] text-(--c-muted) mt-1.5 text-balance">
        New here?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="bg-transparent border-none p-0 font-[inherit] text-(--c-ink) cursor-pointer border-b border-b-(--c-ink) pb-px hover:text-(--c-accent) hover:border-b-(--c-accent)"
        >
          Create an account
        </button>
      </p>
    </form>
  );
}

/* ── Sign-up form ────────────────────────────────────────────────────────── */
function SignUp({ onSwitch }: { onSwitch: () => void }) {
  const palette = usePalette();
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setSubmitting(true);
    // TODO: authClient.signUp.email({ name, email, password: pwd, callbackURL: '/dashboard' })
    setTimeout(() => setSubmitting(false), 1200);
  };

  const submitBase =
    palette === "dusk"
      ? "bg-(--c-paper) border-[color-mix(in_oklab,var(--c-paper),white_8%)] text-[var(--c-bg)]"
      : "bg-(--c-ink) border-(--c-ink) text-(--c-paper)";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-3.5 mb-1.5">
        <div className="inline-flex items-center gap-2 font-code text-[10.5px] tracking-[0.16em] uppercase text-(--c-muted) whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-(--c-accent) shadow-[0_0_0_3px_color-mix(in_oklab,var(--c-accent),transparent_80%)]" />
          <span>—— Create a workshop</span>
        </div>
        <h1 className="font-heading font-normal text-[clamp(30px,3.6vw,40px)] leading-[1.08] tracking-[-0.015em] m-0 text-(--c-ink) text-balance">
          Set the{" "}
          <em className="italic text-(--c-accent) pr-[0.06em]">paper</em>.
          We&apos;ll find it.
        </h1>
        <p className="text-[14.5px] leading-[1.55] text-(--c-muted) m-0 max-w-[38ch] text-pretty">
          A workshop account lets you upload worksheets, connect cloud storage,
          and share expiring camera links with your room.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        {/* TODO: authClient.signIn.social({ provider: 'google' }) */}
        <OAuthChip icon={<GoogleGlyph />} label="Sign up with Google" />
        <OAuthChip icon={<DropboxGlyph />} label="Sign up with Dropbox" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 my-0.5">
        <span className="h-px bg-[linear-gradient(90deg,transparent,var(--c-line),transparent)]" />
        <span className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--c-muted) whitespace-nowrap">
          or with email
        </span>
        <span className="h-px bg-[linear-gradient(90deg,transparent,var(--c-line),transparent)]" />
      </div>

      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        <Field
          label="Your name"
          value={name}
          onChange={setName}
          placeholder="Ada Lovelace"
          autoComplete="name"
        />
        <Field
          label="Workshop"
          hint="optional"
          value={org}
          onChange={setOrg}
          placeholder="Hatch Studio"
          autoComplete="organization"
        />
      </div>

      <Field
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@studio.io"
        autoComplete="email"
      />
      <PasswordField
        label="Password"
        value={pwd}
        onChange={setPwd}
        showStrength
        autoComplete="new-password"
      />

      <CheckBox checked={agree} onChange={setAgree} block>
        <span>
          I agree to the{" "}
          <a
            href="#"
            className="text-inherit underline decoration-1 underline-offset-2"
          >
            terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-inherit underline decoration-1 underline-offset-2"
          >
            privacy policy
          </a>
          .
        </span>
      </CheckBox>

      <button
        type="submit"
        disabled={!agree}
        className={`group relative flex w-full items-center justify-center gap-3 px-5 py-3.5 whitespace-nowrap border rounded-[10px] text-sm font-medium tracking-[-0.005em] cursor-pointer mt-1 overflow-hidden transition-[transform,opacity] duration-180 ${agree ? "hover:-translate-y-px" : "opacity-55 cursor-not-allowed"} ${submitBase}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--c-beam),transparent_50%),transparent)] group-hover:translate-x-full transition-transform duration-550"
        />
        <span className="relative">
          {submitting ? "Setting up…" : "Create account"}
        </span>
        <span
          className={`relative inline-flex ${submitting ? "animate-auth-trace" : ""}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <p className="text-center text-[13px] text-(--c-muted) mt-1.5 text-balance">
        Already running workshops?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="bg-transparent border-none p-0 font-[inherit] text-(--c-ink) cursor-pointer border-b border-b-(--c-ink) pb-px hover:text-(--c-accent) hover:border-b-(--c-accent)"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ── Aside ───────────────────────────────────────────────────────────────── */
function Aside({ mode }: { mode: Mode }) {
  return (
    <aside
      className="relative px-11 py-10 border-r border-(--c-line) flex flex-col gap-8 h-full justify-center"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--c-bg), white 2%) 0%, var(--c-bg) 100%)",
      }}
    >
      {/* Brand row */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2.5 text-(--c-ink)">
          <Logomark size={26} />
          <span className="font-heading text-[22px] tracking-[-0.01em]">
            Tracelight
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-code text-[10px] uppercase tracking-[0.08em] text-(--c-muted) whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-(--c-accent) shadow-[0_0_0_3px_color-mix(in_oklab,var(--c-accent),transparent_80%)]" />
          v0.1 · beta
        </span>
      </div>

      {/* Scan diagram */}
      <div
        className="relative flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="relative w-full max-w-[340px] aspect-square border border-(--c-line) rounded-sm overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 20%, color-mix(in oklab, var(--c-beam), transparent 78%) 0%, transparent 65%)," +
              "linear-gradient(180deg, color-mix(in oklab, var(--c-bg), white 1%), color-mix(in oklab, var(--c-bg), black 3%))",
          }}
        >
          <svg
            className="w-full h-full block"
            viewBox="0 0 300 300"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="scanReveal" clipPathUnits="userSpaceOnUse">
                <rect x="87" y="92" width="126" height="0">
                  <animate
                    attributeName="height"
                    values="0;178;178;0;0"
                    keyTimes="0;0.42;0.5;0.92;1"
                    dur="6s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1"
                  />
                </rect>
              </clipPath>
            </defs>
            {/* aperture */}
            <circle
              cx="150"
              cy="44"
              r="12"
              fill="none"
              stroke="var(--c-ink)"
              strokeWidth="1.4"
            />
            <circle cx="150" cy="44" r="3.4" fill="var(--c-accent)" />
            {/* cone */}
            <line
              x1="150"
              y1="56"
              x2="87"
              y2="92"
              stroke="color-mix(in oklab, var(--c-ink), transparent 55%)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <line
              x1="150"
              y1="56"
              x2="213"
              y2="92"
              stroke="color-mix(in oklab, var(--c-ink), transparent 55%)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            {/* paper */}
            <rect
              x="87"
              y="92"
              width="126"
              height="178"
              rx="1"
              fill="var(--c-paper)"
              stroke="color-mix(in oklab, var(--c-ink), transparent 70%)"
              strokeWidth="0.8"
            />
            {/* paper contents */}
            <g clipPath="url(#scanReveal)">
              <rect
                x="99"
                y="104"
                width="54"
                height="6"
                fill="var(--c-ink)"
                opacity="0.85"
              />
              <line
                x1="99"
                y1="124"
                x2="200"
                y2="124"
                stroke="color-mix(in oklab, var(--c-ink), transparent 65%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="99"
                y1="134"
                x2="186"
                y2="134"
                stroke="color-mix(in oklab, var(--c-ink), transparent 65%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="99"
                y1="144"
                x2="196"
                y2="144"
                stroke="color-mix(in oklab, var(--c-ink), transparent 65%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="99"
                y1="154"
                x2="172"
                y2="154"
                stroke="color-mix(in oklab, var(--c-ink), transparent 65%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="99"
                y="168"
                width="82"
                height="42"
                fill="color-mix(in oklab, var(--c-accent), transparent 75%)"
                stroke="color-mix(in oklab, var(--c-accent), transparent 40%)"
                strokeWidth="0.8"
              />
              <line
                x1="103"
                y1="173"
                x2="177"
                y2="207"
                stroke="color-mix(in oklab, var(--c-accent), transparent 55%)"
                strokeWidth="0.7"
              />
              <line
                x1="177"
                y1="173"
                x2="103"
                y2="207"
                stroke="color-mix(in oklab, var(--c-accent), transparent 55%)"
                strokeWidth="0.7"
              />
              <line
                x1="99"
                y1="220"
                x2="196"
                y2="220"
                stroke="color-mix(in oklab, var(--c-ink), transparent 65%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="99"
                y1="230"
                x2="176"
                y2="230"
                stroke="color-mix(in oklab, var(--c-ink), transparent 65%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="99"
                y1="252"
                x2="125"
                y2="252"
                stroke="color-mix(in oklab, var(--c-ink), transparent 80%)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <line
                x1="185"
                y1="252"
                x2="201"
                y2="252"
                stroke="color-mix(in oklab, var(--c-ink), transparent 80%)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>
            {/* corner brackets */}
            <g
              stroke="var(--c-accent)"
              strokeWidth="1.4"
              strokeLinecap="square"
              fill="none"
            >
              <path d="M83 92 H91 M87 92 V100" />
              <path d="M217 92 H209 M213 92 V100" />
              <path d="M83 270 H91 M87 270 V262" />
              <path d="M217 270 H209 M213 270 V262" />
            </g>
            {/* scan line */}
            <line
              x1="87"
              x2="213"
              y1="92"
              y2="92"
              stroke="var(--c-accent)"
              strokeWidth="1.2"
              style={{
                filter:
                  "drop-shadow(0 0 4px color-mix(in oklab, var(--c-accent), transparent 30%))",
              }}
            >
              <animate
                attributeName="y1"
                values="92;270;270;92;92"
                keyTimes="0;0.42;0.5;0.92;1"
                dur="6s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1"
              />
              <animate
                attributeName="y2"
                values="92;270;270;92;92"
                keyTimes="0;0.42;0.5;0.92;1"
                dur="6s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0 0 1 1"
              />
            </line>
          </svg>

          {/* caption */}
          <div className="absolute left-3.5 right-3.5 bottom-3 flex items-center gap-2 font-code text-[9.5px] tracking-[0.12em] uppercase text-(--c-muted) z-4">
            <span className="w-1.5 h-1.5 rounded-full bg-(--c-accent) shadow-[0_0_0_3px_color-mix(in_oklab,var(--c-accent),transparent_80%)] animate-auth-pulse" />
            <span>scanning</span>
            <span className="flex-1" />
            <span className="text-[color-mix(in_oklab,var(--c-muted),transparent_30%)]">
              a4 · 210 × 297
            </span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="border-t border-(--c-line) pt-6">
        <p className="font-heading text-[22px] leading-[1.3] text-(--c-ink) m-0 mb-3 tracking-[-0.005em] text-pretty">
          &ldquo;Point the camera. The worksheet appears{" "}
          <em className="italic text-(--c-accent)">on the paper</em> — no
          printing, no projector hung from a ceiling.&rdquo;
        </p>
        <p className="font-code text-[10.5px] uppercase tracking-widest text-(--c-muted) m-0">
          — how it works, briefly
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between gap-3 font-code text-[10.5px] uppercase tracking-[0.08em] text-(--c-muted)">
        <span>{mode === "in" ? "01 / sign in" : "02 / new account"}</span>
        <span>privacy · terms · status</span>
      </div>
    </aside>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function AuthPage() {
  const [palette] = useState<PaletteKey>("paper");
  const [mode, setMode] = useState<Mode>("in");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(
      new Date()
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, " / "),
    );
  }, []);

  const paletteVars = useMemo(() => {
    const p = PALETTES[palette];
    return {
      "--c-bg": p.bg,
      "--c-paper": p.paper,
      "--c-ink": p.ink,
      "--c-muted": p.muted,
      "--c-line": p.line,
      "--c-beam": p.beam,
      "--c-accent": p.accent,
      "--c-registration": p.registration,
    } as React.CSSProperties;
  }, [palette]);

  return (
    <PaletteCtx.Provider value={palette}>
      <div
        className="font-ui text-(--c-ink,#1B1A17) bg-(--c-bg,#EFE7D6) min-h-screen relative antialiased [text-rendering:optimizeLegibility]"
        data-palette={palette}
        style={paletteVars}
      >
        <GrainOverlay />

        <div className="relative grid grid-cols-[minmax(360px,38%)_1fr] min-h-screen z-1 max-[920px]:grid-cols-1">
          <div className="max-[920px]:hidden">
            <Aside mode={mode} />
          </div>

          <main className="relative grid place-items-center p-10 max-sm:p-8">
            <div className="w-full max-w-[480px] flex flex-col gap-[18px]">
              <PaperCard>
                {/* Tab toggle */}
                <div
                  className="relative grid grid-cols-2 border border-(--c-line) p-[3px] rounded-[10px] mb-7 font-code"
                  style={{
                    background:
                      "color-mix(in oklab, var(--c-bg), var(--c-paper) 50%)",
                  }}
                >
                  <button
                    className={`relative z-2 bg-transparent border-none py-2.5 px-3 text-[11px] tracking-[0.12em] uppercase cursor-pointer transition-colors duration-200 ${mode === "in" ? "text-(--c-ink)" : "text-(--c-muted)"}`}
                    onClick={() => setMode("in")}
                  >
                    Sign in
                  </button>
                  <button
                    className={`relative z-2 bg-transparent border-none py-2.5 px-3 text-[11px] tracking-[0.12em] uppercase cursor-pointer transition-colors duration-200 ${mode === "up" ? "text-(--c-ink)" : "text-(--c-muted)"}`}
                    onClick={() => setMode("up")}
                  >
                    Sign up
                  </button>
                  <span
                    className={`absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] bg-(--c-paper) border border-(--c-line) rounded-lg z-1 transition-transform duration-320 ease-[cubic-bezier(0.65,0.05,0.36,1)] ${mode === "up" ? "translate-x-full" : "translate-x-0"}`}
                  />
                </div>

                {mode === "in" ? (
                  <SignIn onSwitch={() => setMode("up")} />
                ) : (
                  <SignUp onSwitch={() => setMode("in")} />
                )}
              </PaperCard>

              <footer className="flex justify-between items-center font-code text-[10.5px] tracking-[0.08em] uppercase text-(--c-muted) px-1.5">
                <span>↳ /auth/{mode === "in" ? "sign-in" : "sign-up"}</span>
                <span suppressHydrationWarning>{dateStr}</span>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </PaletteCtx.Provider>
  );
}
