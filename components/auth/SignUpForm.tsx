"use client";

import { useState } from "react";
import { usePalette } from "./AuthProvider";
import { Field, PasswordField, OAuthChip, CheckBox } from "./ui";
import { GoogleGlyph, DropboxGlyph } from "./icons";

export function SignUpForm() {
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
      ? "bg-(--color-surface) border-[color-mix(in_oklab,var(--color-surface),white_8%)] text-[var(--color-background)]"
      : "bg-(--color-foreground) border-(--color-foreground) text-(--color-surface)";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-3.5 mb-1.5">
        <div className="inline-flex items-center gap-2 font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted) whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary),transparent_80%)]" />
          <span>Create a workshop</span>
        </div>
        <h1 className="font-heading font-normal text-[clamp(30px,3.6vw,40px)] leading-[1.08] tracking-[-0.015em] m-0 text-(--color-foreground) text-balance">
          Set the{" "}
          <em className="italic text-(--color-primary) pr-[0.06em]">paper</em>.
          We&apos;ll find it.
        </h1>
        <p className="text-[14.5px] leading-[1.55] text-(--color-muted) m-0 max-w-[38ch] text-pretty">
          A workshop account lets you upload worksheets, connect cloud storage,
          and share expiring camera links with your room.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        <OAuthChip icon={<GoogleGlyph />} label="Continue with Google" />
        <OAuthChip icon={<DropboxGlyph />} label="Continue with Dropbox" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 my-0.5">
        <span className="h-px bg-[linear-gradient(90deg,transparent,var(--color-border),transparent)]" />
        <span className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted) whitespace-nowrap">
          or with email
        </span>
        <span className="h-px bg-[linear-gradient(90deg,transparent,var(--color-border),transparent)]" />
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
          className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-secondary),transparent_50%),transparent)] group-hover:translate-x-full transition-transform duration-550"
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
    </form>
  );
}
