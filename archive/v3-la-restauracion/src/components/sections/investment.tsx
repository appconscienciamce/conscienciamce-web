import { bootcamp } from "@/content/bootcamp";
import { ClaimText, CtaButton, Pending, PriceText, SectionLabel } from "@/components/editorial";
import { CreationTouch } from "@/components/experience/creation-touch";
import { checkoutLive, REGISTRATION_ANCHOR, resolveLogistics } from "@/lib/offer";

const { investment, chapters, cta } = bootcamp;
const chapter = chapters[6];

export function Investment() {
  const logistics = resolveLogistics();
  const { imageLabel, ticket } = investment;

  return (
    <section id={chapter.id} aria-labelledby="investment-title" className="surface-ink">
      <div className="px-[var(--gutter)] py-20 sm:py-24 lg:py-28">
        <SectionLabel number={chapter.number} label={chapter.label} />

        <h2 id="investment-title" data-reveal className="display mt-10 max-w-[18ch] text-[clamp(2.75rem,6.5vw,6rem)]">
          {investment.title}
        </h2>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p data-reveal className="display text-[clamp(1.6rem,2.6vw,2.375rem)] leading-[1.22]">
              <ClaimText id={investment.oneOnOne.claim} />
            </p>
            <div data-reveal className="mt-6 space-y-4 text-lg leading-relaxed text-[var(--muted)]">
              {investment.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          <div data-reveal className="lg:col-span-5 lg:col-start-8">
            <p className="display text-[clamp(1.6rem,2.4vw,2.125rem)] italic leading-[1.2]">{investment.selectionTitle}</p>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-[var(--muted)]">
              {investment.selection.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CreationTouch
        alt={investment.image.alt}
        label={`${imageLabel.title} · ${imageLabel.meta}`}
        hint={investment.touchHint}
      >
        <div className="surface-parchment notched mx-auto max-w-[30rem] p-6 sm:p-8">
          <p className="label text-[var(--muted)]">{ticket.priceLabel}</p>
          <p className="display mt-1 text-[clamp(2.75rem,6vw,4rem)] leading-none tabular-nums">
            <PriceText fallback={<span className="text-3xl italic">{ticket.pricePending}</span>} />
          </p>
          <p className="mt-3 text-[0.9375rem] text-[var(--muted)]">{ticket.detail}</p>

          <dl className="mt-4 border-t border-[var(--rule)] text-[0.875rem]">
            {logistics.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-[var(--rule)] py-1.5">
                <dt className="label text-[0.6875rem] text-[var(--muted)]">{row.label}</dt>
                <dd className="text-right font-medium">
                  {row.state === "pending" ? <Pending needs={`${row.label} sin confirmar`}>{row.value}</Pending> : row.value}
                </dd>
              </div>
            ))}
          </dl>

          <CtaButton className="mt-5 w-full" />
        </div>
      </CreationTouch>

      {!checkoutLive && (
        <div id={REGISTRATION_ANCHOR} data-reveal className="mx-auto max-w-[36rem] px-[var(--gutter)] py-16 text-center">
          <h3 className="display text-[clamp(2rem,4vw,3.25rem)] italic">{cta.pendingNoticeTitle}</h3>
          <p className="mt-3 text-lg text-[var(--muted)]">{cta.pendingNoticeBody}</p>
        </div>
      )}
    </section>
  );
}
