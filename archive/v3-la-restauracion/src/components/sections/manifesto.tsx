import { bootcamp } from "@/content/bootcamp";
import { SectionLabel } from "@/components/editorial";
import { TiredOf } from "@/components/experience/tired-of";

const { manifesto, chapters } = bootcamp;
const chapter = chapters[2];

export function Manifesto() {
  const [first, ...rest] = manifesto.title.split(" y ");
  return (
    <section id={chapter.id} aria-labelledby="manifesto-title" className="surface-putty">
      <div className="px-[var(--gutter)] pt-20 sm:pt-24 lg:pt-28">
        <SectionLabel number={chapter.number} label={chapter.label} />
        <h2 id="manifesto-title" data-reveal className="display mt-8 text-[clamp(2.75rem,7.5vw,7rem)]">
          {first}
          {rest.length > 0 && <span className="block pl-[0.6em] italic">y {rest.join(" y ")}</span>}
        </h2>
      </div>

      <TiredOf eyebrow={manifesto.opening} lines={manifesto.tiredOf} />

      <div className="grid gap-8 px-[var(--gutter)] pb-20 sm:pb-24 lg:grid-cols-12 lg:pb-28">
        <p data-reveal className="text-lg leading-relaxed text-[var(--muted)] lg:col-span-5">
          {manifesto.paragraph}
        </p>
        <p data-reveal className="text-xl font-medium leading-relaxed sm:text-2xl lg:col-span-6 lg:col-start-7">
          {manifesto.closing}
        </p>
      </div>
    </section>
  );
}
