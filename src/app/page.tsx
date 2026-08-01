import { Hero } from '@/components/sections/hero';
import { Gallery } from '@/components/sections/gallery';
import { Club } from '@/components/sections/club';
import { Paths } from '@/components/sections/paths';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { ExperiencesIntro } from '@/components/sections/experiences-intro';
import { Experiences } from '@/components/sections/experiences';
import { Footer } from '@/components/sections/footer';
import { PageScripts } from '@/components/page-scripts';

/**
 * Section order follows the 2026 landing revision:
 *   promise → Santi photos + CTA → what MCE/Club is → who it's for + CTA
 *   → who Santi is → testimonials → CTA + upcoming events
 *
 * Retired in this revision: the "Statement" break line (the growing Consciencia
 * MCE logo) and the "System" trabajo interno/externo block.
 */
export default function HomePage() {
  return (
    <>
      <div
        data-elementor-type="wp-page"
        data-elementor-id="1000"
        className="elementor elementor-1000"
      >
        <Hero />
        <Gallery />
        <Club />
        <Paths />
        <About />
        <Testimonials />
        <ExperiencesIntro />
        <Experiences />
        <Footer />
      </div>
      <PageScripts />
    </>
  );
}
