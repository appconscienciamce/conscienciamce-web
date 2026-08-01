/**
 * Drives the two interactive pieces in the Club section:
 *   1. the ripple grid backdrop — a wave spreading from the clicked cell
 *   2. the laptop lid, which opens as the element crosses the viewport
 *
 * Both degrade quietly: the grid is decorative, and the lid renders open when
 * this script does not run.
 */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Ripple grid ─────────────────────────────────────────────────────── */
  var grid = document.querySelector('.mce-ripple');

  if (grid && !reduceMotion) {
    var cells = Array.prototype.slice.call(
      grid.querySelectorAll('.mce-ripple-cell')
    );

    grid.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.classList.contains('mce-ripple-cell')) return;

      var originCol = Number(target.dataset.col);
      var originRow = Number(target.dataset.row);

      cells.forEach(function (cell) {
        // Chebyshev distance gives a square wave front, matching the grid.
        var distance = Math.max(
          Math.abs(Number(cell.dataset.col) - originCol),
          Math.abs(Number(cell.dataset.row) - originRow)
        );

        cell.style.setProperty('--d', String(distance));
        cell.classList.remove('is-rippling');
        // Force a reflow so re-adding the class restarts the animation.
        void cell.offsetWidth;
        cell.classList.add('is-rippling');
      });
    });

    grid.addEventListener(
      'animationend',
      function (event) {
        if (event.target.classList) {
          event.target.classList.remove('is-rippling');
        }
      },
      true
    );
  }

  /* ── Laptop lid ──────────────────────────────────────────────────────── */
  var macbook = document.querySelector('[data-macbook]');

  if (macbook && !reduceMotion) {
    var ticking = false;

    var update = function () {
      ticking = false;

      var rect = macbook.getBoundingClientRect();
      var viewport = window.innerHeight || 0;
      if (!viewport) return;

      // 0 while still below the fold, 1 once it has risen past two thirds.
      var travelled = viewport - rect.top;
      var span = viewport * 0.72;
      var progress = Math.min(Math.max(travelled / span, 0), 1);

      macbook.style.setProperty('--open', progress.toFixed(3));
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }
})();
