import type { Metadata } from "next";
import Link from "next/link";
import { Logomark } from "@/components/tempLink/Logomark";

export const metadata: Metadata = {
  title: "Tracelight — Terms of Service",
  description: "The terms governing your use of Tracelight.",
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

export default function TermsPage() {
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
            <span className="text-(--color-foreground)">terms of service</span>
          </span>

          <span className="flex-1" />

          <Link
            href="/dashboard"
            className="font-code text-[10.5px] tracking-[0.12em] uppercase text-(--color-muted) hover:text-(--color-foreground) transition-colors no-underline"
          >
            Back to app
          </Link>
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
              Terms of <em className="italic text-(--color-primary)">service.</em>
            </h1>
            <p className="m-0 font-ui text-[15.5px] leading-[1.6] text-(--color-muted) max-w-[52ch]">
              By using Tracelight you agree to these terms. They're written to be readable — no legalese where plain language works.
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-[16px]">

            <Section n="01" title="Acceptance of terms">
              <p>
                By creating an account or using any part of the Tracelight service, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.
              </p>
              <p>
                Tracelight is currently in public beta. Features may change, be added, or be removed. These terms may be updated from time to time — continued use after any update constitutes acceptance of the revised terms.
              </p>
            </Section>

            <Section n="02" title="What the service does">
              <p>
                Tracelight is a workshop overlay tool. It lets hosts connect a Google Drive or Dropbox account, select a file, generate a temporary session link, and share that link with participants who view the file overlaid through their device camera.
              </p>
              <p>
                The service is provided on a best-effort basis. As a beta product, uptime, availability, and feature completeness are not guaranteed.
              </p>
            </Section>

            <Section n="03" title="Your account">
              <p>
                You are responsible for maintaining the security of your account credentials. Tracelight is not liable for any loss or damage resulting from unauthorised access to your account.
              </p>
              <p>
                You must provide accurate information when creating an account. Accounts are personal — you may not transfer your account or share access with others.
              </p>
              <p>
                You may delete your account at any time. Upon deletion, your stored OAuth tokens and session data will be permanently removed.
              </p>
            </Section>

            <Section n="04" title="Third-party integrations">
              <p>
                Connecting Google Drive or Dropbox to Tracelight is subject to the terms of those services. Your use of Google Drive is governed by{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-primary) underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Google's Terms of Service
                </a>
                . Your use of Dropbox is governed by{" "}
                <a
                  href="https://www.dropbox.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-primary) underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Dropbox's Terms of Service
                </a>
                .
              </p>
              <p>
                Tracelight is not affiliated with Google or Dropbox and is not responsible for changes, outages, or restrictions imposed by those services.
              </p>
            </Section>

            <Section n="05" title="Your content">
              <p>
                Files you access through Google Drive or Dropbox remain entirely yours. Tracelight claims no ownership, licence, or rights over any content you access through the service.
              </p>
              <p>
                You are solely responsible for ensuring you have the right to use and share any files you distribute via session links. Do not share content you do not own or do not have permission to distribute.
              </p>
            </Section>

            <Section n="06" title="Session links">
              <p>
                When you generate a session link, anyone who has that link can access the associated file until the link expires. You are responsible for how and with whom you share session links.
              </p>
              <p>
                Tracelight is not responsible for unauthorised access that results from a session link being shared beyond its intended audience. Revoke links immediately from your dashboard if they are shared in error.
              </p>
            </Section>

            <Section n="07" title="Acceptable use">
              <p>You agree not to use Tracelight to:</p>
              <ul className="list-none flex flex-col gap-[8px] pl-0">
                {[
                  "Distribute or share illegal, infringing, harmful, or offensive content",
                  "Attempt to reverse-engineer, scrape, or extract data from the service",
                  "Interfere with or disrupt the service or its infrastructure",
                  "Circumvent any access controls or session expiry mechanisms",
                  "Use the service for any purpose other than its intended workshop and educational use",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-[10px]">
                    <span className="mt-[6px] w-[4px] h-[4px] rounded-full bg-(--color-primary) flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                Tracelight reserves the right to suspend or terminate accounts that violate these conditions without prior notice.
              </p>
            </Section>

            <Section n="08" title="No warranty">
              <p>
                The service is provided "as is" and "as available" without warranty of any kind, express or implied. Tracelight does not warrant that the service will be uninterrupted, error-free, or that files will always be accessible through connected integrations.
              </p>
              <p>
                This is especially relevant during the beta period, where significant changes may occur at any time.
              </p>
            </Section>

            <Section n="09" title="Limitation of liability">
              <p>
                To the fullest extent permitted by law, Tracelight shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service — including but not limited to loss of data, missed workshops, or issues resulting from third-party service outages.
              </p>
              <p>
                Your sole remedy for dissatisfaction with the service is to stop using it.
              </p>
            </Section>

            <Section n="10" title="Governing law">
              <p>
                These terms are governed by and construed in accordance with the laws of the jurisdiction in which Tracelight operates. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
              </p>
            </Section>

            <Section n="11" title="Contact">
              <p>
                If you have questions about these terms, please contact us at{" "}
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
          <Link href="/dashboard" className="hover:text-(--color-foreground) transition-colors no-underline">
            Back to app →
          </Link>
        </div>
      </footer>
    </div>
  );
}
