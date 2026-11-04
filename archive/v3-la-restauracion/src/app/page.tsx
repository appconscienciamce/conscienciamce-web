import Image from "next/image";
import { bootcamp } from "@/content/bootcamp";
import { MotionController } from "@/components/motion-controller";
import { RestorationMeter } from "@/components/experience/restoration-meter";
import { StickyCta } from "@/components/sticky-cta";
import { Hero } from "@/components/sections/hero";
import { Outcomes } from "@/components/sections/outcomes";
import { Audience } from "@/components/sections/audience";
import { Interlude } from "@/components/sections/interlude";
import { Manifesto } from "@/components/sections/manifesto";
import { CasePilar } from "@/components/sections/case-pilar";
import { TwoDays } from "@/components/sections/two-days";
import { Proof } from "@/components/sections/proof";
import { Hosts } from "@/components/sections/hosts";
import { Investment } from "@/components/sections/investment";
import { Faq } from "@/components/sections/faq";
import { ctaHref, isDraft, resolvePrice } from "@/lib/offer";

export default function Page() {
  const { chapters, cta, footer, previewNotice, brand } = bootcamp;
  const price = resolvePrice();

  return (
    <>
      <a
        href="#para-quien"
        className="sr-only-focusable fixed left-4 top-4 z-[80] rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)]"
      >
        Saltar al contenido
      </a>

      {isDraft && (
        <div role="note" className="bg-[var(--ink)] px-[var(--gutter)] py-2 text-center text-xs text-[var(--sanguine-on-dark)]">
          {previewNotice}
        </div>
      )}

      <main>
        <Hero />
        <Outcomes />
        <Audience />
        <Interlude />
        <Manifesto />
        <CasePilar />
        <TwoDays />
        <Proof />
        <Hosts />
        <Investment />
        <Faq />
      </main>

      <footer className="surface-ink px-[var(--gutter)] pb-24 pt-12 sm:pb-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Image src={brand.wordmark.src!} alt={brand.wordmark.alt} width={brand.wordmark.width} height={brand.wordmark.height} className="h-auto w-56" />
            <p className="mt-4 text-[0.8125rem] text-[var(--muted)]">{footer.line}</p>
          </div>
          <div className="text-[0.75rem] text-[var(--muted)] sm:text-right">
            <p>{footer.legal}</p>
            <p className="mt-1">© {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>

      <StickyCta
        href={ctaHref}
        label={cta.label}
        price={price ? `${price.label}${price.state === "pending" ? "*" : ""}` : null}
        closingId={chapters[chapters.length - 1].id}
      />
      <RestorationMeter />
      <MotionController />
    </>
  );
}
