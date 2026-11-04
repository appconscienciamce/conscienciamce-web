import { bootcamp } from "@/content/bootcamp";
import { ClaimText, Niche, SectionLabel } from "@/components/editorial";

const { hosts, chapters } = bootcamp;
const chapter = chapters[5];

export function Hosts() {
  return (
    <section
      id={chapter.id}
      aria-labelledby="hosts-title"
      className="surface-bone px-[var(--gutter)] py-20 sm:py-24 lg:py-28"
    >
      <SectionLabel number={chapter.number} label={chapter.label} />

      <h2 id="hosts-title" data-reveal className="display mt-10 max-w-[16ch] text-[clamp(2.75rem,6.5vw,6rem)]">
        {hosts.title}
      </h2>

      <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-6">
          {hosts.people.map((person, i) => (
            <figure
              key={person.name}
              data-reveal
              style={{ "--delay": `${i * 130}ms` } as React.CSSProperties}
              className={i === 1 ? "mt-14 sm:mt-20" : ""}
            >
              <Niche image={person.image} sizes="(min-width: 1024px) 22vw, 44vw" />
              <figcaption className="mt-3 text-[0.8125rem] leading-snug">
                <span className="block font-medium">{person.name}</span>
                <span className="text-[var(--muted)]">{person.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-8">
          <div data-reveal className="space-y-5 text-lg leading-relaxed text-[var(--muted)]">
            <p>
              {hosts.trackRecord.before}
              <ClaimText id={hosts.trackRecord.claim} />
              {hosts.trackRecord.after}
            </p>
            {hosts.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div data-reveal className="mt-12 border-t border-[var(--rule)] pt-8">
            <p className="display text-[clamp(1.75rem,2.6vw,2.25rem)] italic">{hosts.ownBrandLead}</p>
            <p className="mt-4 text-lg leading-relaxed">
              <ClaimText id={hosts.ownBrandClaim} />
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">{hosts.ownBrandAfter}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
