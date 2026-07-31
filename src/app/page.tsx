import { Hero } from '@/components/sections/hero';
import { Gallery } from '@/components/sections/gallery';
import { Statement } from '@/components/sections/statement';
import { Paths } from '@/components/sections/paths';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { System } from '@/components/sections/system';
import { ExperiencesIntro } from '@/components/sections/experiences-intro';
import { Experiences } from '@/components/sections/experiences';
import { Footer } from '@/components/sections/footer';
import { PageScripts } from '@/components/page-scripts';

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
        <Statement />
        <Paths />
        <About />
        <Testimonials />
        <System />
        <ExperiencesIntro />
        <Experiences />
        <Footer />
      </div>
      <PageScripts />
    </>
  );
}
