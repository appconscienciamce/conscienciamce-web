import Script from 'next/script';

/**
 * Loads the original page behaviour: vendor libraries first, then the page's
 * own scripts in document order.
 *
 * `afterInteractive` matters here — the ported scripts query the DOM at module
 * scope (they ran inline in the original document), so they must not execute
 * before the markup exists.
 */
const VENDOR = [
  'lenis.min.js',
  'gsap.min.js',
  'ScrollTrigger.min.js',
  'Draggable.min.js',
  'three.min.js',
  'particles.min.js',
  'imagesloaded.pkgd.min.js',
];

const SECTION_SCRIPTS = [
  'lenis-init.js',
  'section-00.js',
  'section-01.js',
  'section-02.js',
  'section-03.js',
  'section-04.js',
  'section-05.js',
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
