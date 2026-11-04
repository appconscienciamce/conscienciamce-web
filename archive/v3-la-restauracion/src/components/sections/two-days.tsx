import { bootcamp } from "@/content/bootcamp";
import { DraftNote, Picture, Rich, SectionLabel, WallLabel } from "@/components/editorial";
import { DayWipe } from "@/components/experience/day-wipe";

const { twoDays, chapters } = bootcamp;
const chapter = chapters[4];

function DayPanel({ day, index }: { day: (typeof twoDays.days)[number]; index: number }) {
  return (
    <article
      aria-labelledby={`day-${index}`}
      className="grid h-full content-center gap-8 px-[var(--gutter)] py-14 lg:grid-cols-12 lg:gap-8 lg:py-6"
    >
      <div className="lg:col-span-5">
        <p className="display text-[clamp(5rem,11vw,10rem)] leading-[0.85] text-[var(--muted)]">{index + 1}</p>
        <p className="label mt-4 text-[var(--muted)]">{day.number}</p>
        <h3 id={`day-${index}`} className="display mt-3 text-[clamp(2.25rem,4vw,3.75rem)] leading-[1]">
          {day.title}
        </h3>
        <p className="mt-5 max-w-[30rem] text-lg leading-relaxed">{day.summary}</p>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <ul className="border-t border-[var(--rule)]">
          {day.items.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[1.5rem_1fr] gap-2 border-b border-[var(--rule)] py-3.5 leading-relaxed text-[var(--muted)]"
            >
              <span aria-hidden>—</span>
              <Rich paragraph={item} as="span" />
            </li>
          ))}
        </ul>
        {day.draftNote && <DraftNote>{day.draftNote}</DraftNote>}
      </div>
    </article>
  );
}

export function TwoDays() {
  const [dayA, dayB] = twoDays.days;
  return (
    <section id={chapter.id} aria-labelledby="days-title" className="surface-ink">
      <div className="px-[var(--gutter)] pt-20 sm:pt-24 lg:pt-28">
        <SectionLabel number={chapter.number} label="El programa" />
        <div className="mt-10 grid items-end gap-10 pb-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h2 id="days-title" data-reveal className="display text-[clamp(4.5rem,15vw,14rem)] leading-[0.84]">
              {twoDays.title}
            </h2>
            <p
              data-reveal
              className="display mt-8 max-w-[34rem] text-[clamp(1.4rem,2.2vw,1.875rem)] italic leading-[1.25] text-[var(--muted)]"
            >
              {twoDays.intro}
            </p>
          </div>
          <figure data-reveal className="w-[min(60vw,16rem)] lg:col-span-3 lg:col-start-10 lg:w-full">
            <Picture
              image={twoDays.image}
              sizes="(min-width: 1024px) 16rem, 60vw"
              className="aspect-square w-full overflow-hidden rounded-full"
            />
            <WallLabel label={twoDays.imageLabel} fig="Fig. 2" className="mt-3" />
          </figure>
        </div>
      </div>

      <DayWipe dayA={<DayPanel day={dayA} index={0} />} dayB={<DayPanel day={dayB} index={1} />} />

      <div className="px-[var(--gutter)] py-20 lg:py-28">
        <p data-reveal className="label text-[var(--muted)]">
          {twoDays.decisionsTitle}
        </p>
        <ul className="mt-6 border-t border-[var(--rule)]">
          {twoDays.decisions.map((item, i, all) => {
            const step = all.length - 1 - i;
            return (
              <li
                key={item}
                data-reveal
                style={
                  {
                    "--delay": `${i * 80}ms`,
                    paddingLeft: `calc(${step} * clamp(0.6rem, 3vw, 3.5rem))`,
                  } as React.CSSProperties
                }
                className={`display border-b border-[var(--rule)] py-3 text-[clamp(2rem,5.6vw,5.25rem)] leading-[1.02] ${
                  step === 0 ? "italic" : "text-[var(--muted)]"
                }`}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
