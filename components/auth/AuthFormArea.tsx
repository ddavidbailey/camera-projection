"use client";

import { useMode } from "./AuthProvider";
import { PaperCard } from "./ui";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export function AuthFormArea() {
  const { mode, setMode } = useMode();

  return (
    <main className="relative grid place-items-center p-10 max-sm:p-8">
      <div className="w-full max-w-[480px] flex flex-col gap-[18px]">
        <PaperCard>
          {/* Tab toggle */}
          <div
            className="relative grid grid-cols-2 border border-(--color-border) p-[3px] rounded-[10px] mb-7 font-code"
            style={{ background: "color-mix(in oklab, var(--color-background), var(--color-surface) 50%)" }}
          >
            <button
              className={`relative z-2 bg-transparent border-none py-2.5 px-3 text-[11px] tracking-[0.12em] uppercase cursor-pointer transition-colors duration-200 ${mode === "in" ? "text-(--color-foreground)" : "text-(--color-muted)"}`}
              onClick={() => setMode("in")}
            >
              Sign in
            </button>
            <button
              className={`relative z-2 bg-transparent border-none py-2.5 px-3 text-[11px] tracking-[0.12em] uppercase cursor-pointer transition-colors duration-200 ${mode === "up" ? "text-(--color-foreground)" : "text-(--color-muted)"}`}
              onClick={() => setMode("up")}
            >
              Sign up
            </button>
            <span
              className={`absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] bg-(--color-surface) border border-(--color-border) rounded-lg z-1 transition-transform duration-320 ease-[cubic-bezier(0.65,0.05,0.36,1)] ${mode === "up" ? "translate-x-full" : "translate-x-0"}`}
            />
          </div>

          {mode === "in" ? <SignInForm /> : <SignUpForm />}
        </PaperCard>

        <footer className="flex justify-between items-center font-code text-[10.5px] tracking-[0.08em] uppercase text-(--color-muted) px-1.5">
          <span>↳ /auth/{mode === "in" ? "sign-in" : "sign-up"}</span>
        </footer>
      </div>
    </main>
  );
}
