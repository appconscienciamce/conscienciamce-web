import { bootcamp } from "@/content/bootcamp";
import { CtaButton, SectionLabel } from "@/components/editorial";
import { AuthenticityTest } from "@/components/experience/authenticity-test";

const { audience, chapters } = bootcamp;
const chapter = chapters[1];

export function Audience() {
  const { test } = audience;
  return (
    <section
      id={chapter.id}
      aria-labelledby="audience-title"
      className="surface-putty px-[var(--gutter)] py-20 sm:py-24 lg:py-28"
    >
      <SectionLabel number={chapter.number} label={chapter.label} className="justify-center" />

      <div className="mx-auto mt-10 max-w-[62rem] text-center">
        <h2 id="audience-title" data-reveal className="display text-[clamp(2.75rem,7vw,6.5rem)]">
          {audience.title}
        </h2>
        <p data-reveal className="display mx-auto mt-8 max-w-[44rem] text-[clamp(1.5rem,2.6vw,2.25rem)] italic leading-[1.2]">
          {audience.question}
        </p>
        <p data-reveal className="mx-auto mt-8 max-w-[38rem] text-lg leading-relaxed text-[var(--muted)]">
          {audience.intro}
        </p>
      </div>

      <AuthenticityTest
        title={test.title}
        intro={test.intro}
        fit={audience.fit}
        notFit={audience.notFit}
        idle={test.idle}
        partial={test.partial}
        fitVerdict={test.fit}
        notFitVerdict={test.notFit}
      >
        <CtaButton />
      </AuthenticityTest>
    </section>
  );
}
