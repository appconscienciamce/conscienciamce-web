import { bootcamp } from "@/content/bootcamp";
import { Pending, SectionLabel } from "@/components/editorial";
import { CaseEnvelope } from "@/components/experience/case-envelope";
import { resolveClaim } from "@/lib/offer";

const { casePilar, chapters } = bootcamp;
const chapter = chapters[3];

export function CasePilar() {
  const figure = resolveClaim(casePilar.figure);
  const lead = figure.state === "fallback" ? casePilar.lead.fallback : casePilar.lead.withClaim;

  return (
    <section id={chapter.id} aria-labelledby="case-title" className="surface-bone">
      <CaseEnvelope
        layers={casePilar.layers}
        photo={casePilar.image.src!}
        photoAlt={casePilar.image.alt}
        name="Pilar"
        fileLabel="Expediente"
        kicker={casePilar.kicker}
        heading={
          <>
            <SectionLabel number={chapter.number} label={casePilar.kicker} className="justify-center" />
            <h2 id="case-title" className="display mt-3 text-[clamp(2.25rem,4.6vw,4.25rem)]">
              {casePilar.title}
            </h2>
          </>
        }
        figure={
          figure.state === "fallback" ? (
            <p className="display text-[clamp(1.75rem,3vw,2.5rem)] italic leading-none">{figure.text}</p>
          ) : (
            <>
              <p className="label text-[var(--muted)]">{casePilar.figureCaption}</p>
              <p className="display mt-1 text-[clamp(2rem,3.6vw,3rem)] leading-none tabular-nums">
                +{figure.state === "pending" ? <Pending needs={figure.needs}>{figure.text}</Pending> : figure.text}
              </p>
            </>
          )
        }
      />

      <div className="px-[var(--gutter)] pb-20 pt-10 sm:pb-24 lg:pb-28">
        <div className="max-w-[46rem]">
          <p data-reveal className="display text-[clamp(1.6rem,2.6vw,2.375rem)] leading-[1.2]">
            {lead}
          </p>
          <p data-reveal className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
            {casePilar.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[9px] bg-[var(--rule)] sm:grid-cols-3">
          {casePilar.review.map((item, i) => (
            <p
              key={item}
              data-reveal
              style={{ "--delay": `${i * 100}ms` } as React.CSSProperties}
              className="display bg-[var(--bg)] p-6 text-[clamp(1.75rem,2.8vw,2.5rem)] italic leading-tight sm:p-8"
            >
              {item}
            </p>
          ))}
        </div>

        <p data-reveal className="mt-10 max-w-[44rem] text-xl font-medium leading-relaxed">
          {casePilar.closing}
        </p>
      </div>
    </section>
  );
}
