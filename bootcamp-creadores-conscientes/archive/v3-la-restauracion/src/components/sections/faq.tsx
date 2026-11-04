import { bootcamp } from "@/content/bootcamp";
import { DraftNote } from "@/components/editorial";

const { faq } = bootcamp;

/** Native <details>: keyboard and screen-reader support without any JS. */
export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="surface-putty px-[var(--gutter)] py-20 sm:py-24">
      <div className="mx-auto max-w-[46rem]">
        <h2 id="faq-title" data-reveal className="display text-center text-[clamp(2.75rem,6vw,5rem)]">
          {faq.title}
        </h2>
        <div className="mt-12 border-t border-[var(--rule)]">
          {faq.items.map((item) => (
            <details key={item.q} data-reveal className="group border-b border-[var(--rule)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="text-xl transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-6 leading-relaxed text-[var(--muted)]">
                <p>{item.a}</p>
                {item.pending && <DraftNote>{item.pending}</DraftNote>}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
