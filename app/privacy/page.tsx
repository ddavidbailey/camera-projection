import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Logomark } from "@/components/tempLink/Logomark";
import { auth } from "@/utils/auth";

export const metadata: Metadata = {
  title: "Tracelight — Privacy Policy",
  description: "How Tracelight handles your data.",
};

function CropMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const wrap = { tl: "-top-px -left-px", tr: "-top-px -right-px", bl: "-bottom-px -left-px", br: "-bottom-px -right-px" }[position];
  const anchor = { tl: "top-0 left-0", tr: "top-0 right-0", bl: "bottom-0 left-0", br: "bottom-0 right-0" }[position];
  return (
    <span className={`absolute w-[12px] h-[12px] pointer-events-none ${wrap}`} aria-hidden="true">
      <span className={`absolute w-[12px] h-px bg-(--color-foreground) opacity-45 ${anchor}`} />
      <span className={`absolute w-px h-[12px] bg-(--color-foreground) opacity-45 ${anchor}`} />
    </span>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="relative bg-(--color-surface) border border-(--color-border) p-[32px] max-[600px]:p-[22px]">
      <CropMark position="tl" />
      <CropMark position="tr" />
      <CropMark position="bl" />
      <CropMark position="br" />
      <div className="mb-[14px] flex items-center gap-[8px]">
        <span className="font-code text-[10px] tracking-[0.16em] uppercase text-(--color-primary)">{n}</span>
        <span className="h-px flex-1 bg-(--color-border)" />
      </div>
      <h2 className="font-heading font-normal text-[clamp(22px,2.8vw,30px)] leading-[1.1] tracking-[-0.015em] text-(--color-foreground) m-0 mb-[16px]">
        {title}
      </h2>
      <div className="font-ui text-[14.5px] leading-[1.7] text-(--color-muted) flex flex-col gap-[12px]">
        {children}
      </div>
    </div>
  );
}

export default async function PrivacyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="relative min-h-dvh flex flex-col font-ui antialiased [text-rendering:optimizeLegibility] text-(--color-foreground) bg-(--color-background)">
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 18% 8%, color-mix(in oklab, var(--color-background), white 6%), transparent 42%)," +
            "radial-gradient(circle at 88% 85%, color-mix(in oklab, var(--color-background), black 4%), transparent 55%)",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: "color-mix(in oklab, var(--color-background), transparent 18%)",
          borderColor: "color-mix(in oklab, var(--color-border), transparent 40%)",
          backdropFilter: "blur(8px) saturate(110%)",
        }}
      >
        <div className="w-full max-w-[1480px] mx-auto px-8 max-[600px]:px-[18px] flex items-center gap-[18px] h-[60px]">
          <Link href="/" className="inline-flex items-center gap-[10px] text-(--color-foreground) no-underline">
            <Logomark size={24} />
            <span className="font-heading text-[20px] tracking-[-0.01em]">Tracelight</span>
            <span className="font-code text-[10px] uppercase tracking-[0.14em] text-(--color-muted) px-[7px] py-[3px] border border-(--color-border) rounded-full ml-1">
              beta
            </span>
          </Link>

          <span className="inline-flex items-center gap-[10px] font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted)">
            <span>workspace</span>
            <span className="opacity-45">/</span>
            <span className="text-(--color-foreground)">privacy policy</span>
          </span>

          <span className="flex-1" />

          {session && (
            <Link
              href="/dashboard"
              className="font-code text-[10.5px] tracking-[0.12em] uppercase text-(--color-muted) hover:text-(--color-foreground) transition-colors no-underline"
            >
              ← Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-[48px] pb-[64px] relative z-[1]">
        <div className="w-full max-w-[720px] mx-auto px-8 max-[600px]:px-[18px]">

          {/* Hero */}
          <div className="mb-[48px]">
            <div className="inline-flex items-center gap-[8px] font-code text-[10.5px] tracking-[0.16em] uppercase text-(--color-muted) mb-[14px]">
              <span
                className="w-[6px] h-[6px] rounded-full bg-(--color-primary)"
                style={{ boxShadow: "0 0 0 3px color-mix(in oklab, var(--color-primary), transparent 80%)" }}
              />
              <span>Last updated · June 2025</span>
            </div>
            <h1 className="font-heading font-normal text-[clamp(36px,5vw,56px)] leading-[1.04] tracking-[-0.02em] m-0 mb-[14px] text-balance">
              Your data, handled{" "}
              <em className="italic text-(--color-primary)">with care.</em>
            </h1>
            <p className="m-0 font-ui text-[15.5px] leading-[1.6] text-(--color-muted) max-w-[52ch]">
              Tracelight is a tool for running workshops — not a data business. This page explains exactly what we access, what we store, and what we never do.
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-[16px]">

            <Section n="01" title="What Tracelight does">
              <p>
                Tracelight lets workshop hosts connect their Google Drive or Dropbox account, choose a file, and share a temporary link with participants. Participants open that link on a device with a camera and see the worksheet overlaid live — no printing required.
              </p>
              <p>
                That is the entire purpose of the app. Everything we access exists to make that flow work, nothing more.
              </p>
            </Section>

            <Section n="02" title="What we access">
              <p>
                When you connect Google Drive or Dropbox, we store an encrypted OAuth token in our database. This token lets us fetch the list of files in your account and retrieve the content of a file when a participant opens a session link.
              </p>
              <p>
                We access your account email address to identify your integration. We read file names, types, and modification dates to populate your dashboard. We temporarily stream file content (PDF or image) to a participant's browser when a session is active.
              </p>
              <p>
                File content is never written to our servers or database. It is streamed directly to the participant and discarded.
              </p>
            </Section>

            <Section n="03" title="What we never do">
              <p>
                We do not sell, share, rent, or otherwise transfer your data to any third party — ever.
              </p>
              <p>
                We do not use your files, metadata, or account information to train models, run analytics, serve advertising, or for any purpose beyond the core features described above.
              </p>
              <p>
                We do not use third-party analytics scripts or tracking pixels. No data about your usage is sent to external services.
              </p>
            </Section>

            <Section n="04" title="Data storage &amp; security">
              <p>
                Your OAuth tokens are encrypted at rest before being written to our database. Session links expire after a fixed window and are deleted from our records. No file content is persisted beyond an active stream.
              </p>
              <p>
                You can disconnect Google Drive or Dropbox at any time from your dashboard. Doing so permanently deletes your stored token.
              </p>
            </Section>

            <Section n="05" title="Google API limited use disclosure">
              <p>
                Tracelight's use of information received from Google APIs adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-primary) underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <p>
                Specifically: data obtained via Google APIs is used only to provide and improve the workshop overlay feature. It is not used to develop, improve, or train generalised AI or ML models. It is not transferred to third parties except as necessary to provide the service (i.e., streaming a file to the participant's browser during an active session you created).
              </p>
            </Section>

            <Section n="06" title="Contact">
              <p>
                If you have any questions about this privacy policy or how your data is handled, please reach out at{" "}
                <a
                  href="mailto:ddavidbailey@outlook.com"
                  className="text-(--color-primary) underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  ddavidbailey@outlook.com
                </a>
                .
              </p>
            </Section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-[1] border-t border-(--color-border)">
        <div className="w-full max-w-[720px] mx-auto px-8 max-[600px]:px-[18px] py-[22px] flex items-center justify-between flex-wrap gap-[14px] font-code text-[10px] tracking-[0.12em] uppercase text-(--color-muted)">
          <span>tracelight · v0.1 · beta</span>
        </div>
      </footer>
    </div>
  );
}
