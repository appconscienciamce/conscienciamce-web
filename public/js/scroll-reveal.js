/**
 * Scroll entrances.
 *
 * Elements tagged `.scroll-bottom`, `.scroll-top`, `.scroll-left` or
 * `.scroll-right` start offset and blurred, then settle into place when they
 * reach 85% of the viewport. The direction class decides which way they come
 * from; the transition itself lives in the stylesheet, and this script only
 * adds `.ativo` at the right moment.
 *
 * Elements reveal once and stay revealed — scrolling back up does not hide
 * them again, which keeps a long page from feeling restless.
 *
 * Progressive enhancement: the offset state is only applied once this script
 * confirms GSAP is present (via `.reveal-ready` on the root), so a failure to
 * load leaves everything on screen rather than blank.
 *
 * `.scroll-bottom2` is the reference landing's own class, kept because the
 * Club's light arc still uses it.
 */
(function () {
  var SELECTOR =
    '.scroll-bottom, .scroll-top, .scroll-left, .scroll-right, .scroll-bottom2';

  var targets = document.querySelectorAll(SELECTOR);
  if (!targets.length) return;

  var root = document.documentElement;

  // Reduced motion: reveal everything immediately and skip the animation.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add('ativo');
    });
    return;
  }

  if (!window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  // Only now does the CSS hide anything — see the note above.
  root.classList.add('reveal-ready');

  Array.prototype.forEach.call(targets, function (el) {
    window.ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        el.classList.add('ativo');
      },
    });
  });

  /**
   * Images and the Spline frame settle after this runs, which shifts every
   * trigger below them. Recomputing on load keeps the start points honest.
   */
  window.addEventListener('load', function () {
    window.ScrollTrigger.refresh();
  });
})();
