'use client';

import { CalendarClock, Compass, ListChecks, Smartphone, Ticket, Users } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

/**
 * What the Club includes, as Aceternity's GlowingEffect bento grid.
 *
 * Structure, grid areas and GridItem are the published demo's, unchanged. Two
 * adaptations: the icons match what each card says, and the `dark:` variants
 * are dropped — this page has no `dark` class, so those styles would never
 * apply. The glow's palette is swapped for the page blues by overriding its
 * --gradient in CSS, leaving the vendored component untouched.
 */
export function ClubGrid() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Smartphone className="h-4 w-4 text-neutral-400" />}
        title="La app"
        description="La herramienta que sostiene cada día lo que entrenás."
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<CalendarClock className="h-4 w-4 text-neutral-400" />}
        title="2 mentorías semanales"
        description="Acompañamiento en vivo, todas las semanas."
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Compass className="h-4 w-4 text-neutral-400" />}
        title="La filosofía, tecnología, principios y valores de MCE"
        description="La base sobre la que se construye todo lo demás."
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<ListChecks className="h-4 w-4 text-neutral-400" />}
        title="Protocolos prácticos"
        description="Metas, hábitos y sistemas internos para entrenarte solo."
      />

      <GridItem
        area="md:[grid-area:3/1/4/7] xl:[grid-area:2/8/3/11]"
        icon={<Users className="h-4 w-4 text-neutral-400" />}
        title="Comunidad de líderes y emprendedores conscientes"
        description="El entorno que sostiene otra frecuencia y otro estándar."
      />

      <GridItem
        area="md:[grid-area:3/7/4/13] xl:[grid-area:2/11/3/13]"
        icon={<Ticket className="h-4 w-4 text-neutral-400" />}
        title="Eventos privados"
        description="Encuentros presenciales del ecosistema."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">{icon}</div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem]">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-neutral-400 md:text-base/[1.375rem] [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
