import Link from "next/link";
import { Wrap } from "./Wrap";
import { HeroStage } from "./HeroStage";

export function Hero() {
  return (
    <section className="py-10 sm:py-14 lg:py-[72px] relative">
      <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-code text-[11px] tracking-[0.16em] uppercase text-(--color-muted) mb-5 sm:mb-[22px]">
            Tracelight · for workshops
          </div>
          <h1 className="font-heading font-normal text-[clamp(36px,5.6vw,72px)] leading-[1.02] tracking-[-0.02em] m-0 mb-5 sm:mb-[22px] text-(--color-foreground) text-balance">
            Hand out worksheets{" "}
            <span className="relative inline-block whitespace-nowrap after:content-[''] after:absolute after:left-[-2px] after:right-[-2px] after:top-[56%] after:h-[2px] after:bg-(--color-primary) after:-rotate-2 after:origin-[left_center] after:opacity-[0.85]">
              on paper
            </span>.
            <br />
            Through{" "}
            <em className="font-heading italic text-(--color-primary) pr-[0.04em]">
              any blank sheet.
            </em>
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-[1.55] text-(--color-muted) m-0 mb-7 max-w-[44ch] text-pretty">
            Upload a worksheet to Drive or Dropbox. Share a temporary link.
            Participants point their camera at any blank sheet — Tracelight uses
            it as an anchor and overlays the worksheet on their screen.
          </p>
          <div className="flex items-center gap-[18px] flex-wrap">
            <Link
              href="/auth"
              className="group font-code text-[11px] font-medium tracking-[0.14em] uppercase no-underline px-4 py-[9px] bg-(--color-foreground) text-(--color-surface) border border-(--color-foreground) rounded-[10px] inline-flex items-center gap-2 hover:-translate-y-px transition-transform duration-180"
            >
              Sign up{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="#how"
              className="font-code text-[11px] tracking-[0.14em] uppercase text-(--color-muted) no-underline py-2 hover:text-(--color-foreground) transition-colors duration-180"
            >
              See how it works
            </a>
            <span className="inline-flex items-center gap-2 font-code text-[11px] tracking-[0.12em] uppercase text-(--color-muted)">
              <span className="w-[5px] h-[5px] rounded-full bg-(--color-primary) shrink-0" />
              works in-browser · no app
            </span>
          </div>
        </div>
        <HeroStage />
      </Wrap>
    </section>
  );
}
