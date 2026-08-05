import Script from 'next/script';

/**
 * Loads the original page behaviour: vendor libraries first, then the page's
 * own scripts in document order.
 *
 * `afterInteractive` matters here — the ported scripts query the DOM at module
 * scope (they ran inline in the original document), so they must not execute
 * before the markup exists.
 */
// three.js, Draggable and imagesLoaded were dropped with the wave and VSL —
// nothing left on the page references them.
const VENDOR = [
  'lenis.min.js',
  'gsap.min.js',
  'ScrollTrigger.min.js',
  'particles.min.js',
];

// section-00 (VSL player), section-01 (Three.js wave), section-02
// (testimonials popup/carousel), section-03 (.fases-wrapper) and section-04
// (.container/.mockup scroll timeline) were dropped along with the markup they
// drove — the React sections replaced those trees and their selectors.
const SECTION_SCRIPTS = [
  'lenis-init.js',
  'section-05.js',
  'iceberg.js',
  'scroll-reveal.js',
];

export function PageScripts() {
  return (
    <>
      {VENDOR.map((file) => (
        <Script
          key={file}
          src={`/wp-content/cache/flying-press/${file}`}
          strategy="afterInteractive"
        />
      ))}
      {SECTION_SCRIPTS.map((file) => (
        <Script key={file} src={`/js/${file}`} strategy="afterInteractive" />
      ))}
    </>
  );
}
