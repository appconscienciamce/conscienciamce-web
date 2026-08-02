/**
 * `.scroll-bottom2` entrance, reproduced from the reference landing:
 * elements start hidden and 30px high, then settle into place when they reach
 * 85% of the viewport.
 *
 * Progressive enhancement: elements are visible in CSS by default and only
 * hidden once this script confirms GSAP is present, so a failure to load
 * leaves them on screen rather than blank.
 */
(function () {
  var targets = document.querySelectorAll('.scroll-bottom2');
  if (!targets.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.set('.scroll-bottom2', { autoAlpha: 0 });

  window.gsap.utils.toArray('.scroll-bottom2').forEach(function (el) {
    window.gsap.fromTo(
      el,
      { y: -30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
})();
