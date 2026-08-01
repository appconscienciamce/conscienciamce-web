/**
 * Reveals the iceberg callouts one after another when the drawing scrolls into
 * view, matching how the strata read top to bottom.
 *
 * Progressive enhancement: the callouts are visible by default in CSS. This
 * script adds `is-armed` to hide them only once it knows it can animate them
 * back in, so a JS or GSAP failure leaves the section readable.
 */
(function () {
  var svg = document.querySelector('.mce-iceberg-svg');
  if (!svg) return;

  var callouts = svg.querySelectorAll('.ice-callout');
  if (!callouts.length) return;

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Below this width the callouts are replaced by the HTML fallback list.
  var isNarrow = window.matchMedia('(max-width: 900px)').matches;

  if (prefersReducedMotion || isNarrow) return;

  svg.classList.add('is-armed');

  // Each callout carries its own --i, so the stagger lives in CSS; the script
  // only decides when the sequence starts.
  var reveal = function () {
    svg.classList.add('is-revealed');
  };

  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.create({
      trigger: svg,
      start: 'top 75%',
      once: true,
      onEnter: reveal,
    });
    return;
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal();
          observer.disconnect();
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(svg);
    return;
  }

  reveal();
})();
