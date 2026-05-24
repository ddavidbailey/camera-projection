"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { usePalette } from "./AuthProvider";
import { Field, PasswordField, OAuthChip, CheckBox } from "./ui";
import { GoogleGlyph, DropboxGlyph } from "./icons";
import { emailSignIn } from "@/utils/auth-client";
import { googleSignInAction, dropboxSignInAction } from "@/app/actions/social-auth";

export function SignInForm() {
  const router = useRouter();
  const palette = usePalette();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await emailSignIn(email, pwd, remember);
    if (err) {
      setError(err.message ?? "Sign in failed.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
    router.replace("/dashboard");
  };

  const submitBase =
    palette === "dusk"
      ? "bg-(--color-surface) border-[color-mix(in_oklab,var(--color-surface),white_8%)] text-[var(--color-background)]"
      : "bg-(--color-foreground) border-(--color-foreground) text-(--color-surface)";

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-3.5 mb-1.5">
        <div className="inline-flex items-center gap-2 font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted) whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary) shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary),transparent_80%)]" />
          <span>Host sign in</span>
        </div>
        <h1 className="font-heading font-normal text-[clamp(30px,3.6vw,40px)] leading-[1.08] tracking-[-0.015em] m-0 text-(--color-foreground) text-balance">
          Pick up where{" "}
          <em className="italic text-(--color-primary) pr-[0.06em]">
            the light
          </em>{" "}
          left off.
        </h1>
        <p className="text-[14.5px] leading-[1.55] text-(--color-muted) m-0 max-w-[38ch] text-pretty">
          Sign back into your workshop. Your worksheets and active session links
          are right where you parked them.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        <form action={googleSignInAction}>
          <OAuthChip icon={<GoogleGlyph />} label="Continue with Google" />
        </form>
        <form action={dropboxSignInAction}>
          <OAuthChip icon={<DropboxGlyph />} label="Continue with Dropbox" />
        </form>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 my-0.5">
        <span className="h-px bg-[linear-gradient(90deg,transparent,var(--color-border),transparent)]" />
        <span className="font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted) whitespace-nowrap">
          or with email
        </span>
        <span className="h-px bg-[linear-gradient(90deg,transparent,var(--color-border),transparent)]" />
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

      {error && (
        <p className="font-code text-[10.5px] tracking-[0.08em] text-(--color-primary) -mt-1">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <CheckBox checked={remember} onChange={setRemember}>
          Keep me signed in
        </CheckBox>
        <a
          href="#"
          className="text-[13px] text-(--color-muted) no-underline border-b border-dashed border-(--color-border) pb-px transition-[color,border-color] duration-180 hover:text-(--color-foreground) hover:border-(--color-foreground) whitespace-nowrap"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className={`group relative flex w-full items-center justify-center gap-3 px-5 py-3.5 whitespace-nowrap border rounded-[10px] text-sm font-medium tracking-[-0.005em] cursor-pointer mt-1 overflow-hidden transition-[transform,opacity] duration-180 hover:-translate-y-px ${submitted ? "bg-(--color-primary) border-(--color-primary) text-(--color-surface)" : submitBase}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-secondary),transparent_50%),transparent)] group-hover:translate-x-full transition-transform duration-550"
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
      </form>
    </div>
  );
}
