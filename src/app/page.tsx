import { Hero } from '@/components/sections/hero';
import { Gallery } from '@/components/sections/gallery';
import { Club } from '@/components/sections/club';
import { Paths } from '@/components/sections/paths';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { Experiences } from '@/components/sections/experiences';
import { Footer } from '@/components/sections/footer';
import { PageScripts } from '@/components/page-scripts';
import GradualBlur from '@/components/ui/gradual-blur';

/**
 * Section order follows the 2026 landing revision:
 *   promise → Santi photos + CTA → what MCE/Club is → who it's for + CTA
 *   → who Santi is → CTA + upcoming events
 *
 * Retired in this revision: the "Statement" break line (the growing Consciencia
 * MCE logo), the "System" trabajo interno/externo block, and "Testimonios",
 * which is being rebuilt.
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
        <Experiences />
        <Footer />
      </div>
      {/* Fixed blur along the bottom edge of the viewport. */}
      <GradualBlur
        target="page"
        position="bottom"
        height="56px"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
      />

      <PageScripts />
    </>
  );
}
