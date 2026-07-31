(function () {
  const popup   = document.getElementById('floatingPopup');
  const pName   = document.getElementById('popupName');
  const pDesc   = document.getElementById('popupDesc');
  const wrapper = document.querySelector('.testimonials-wrapper');
  const grid    = document.querySelector('.testimonials-grid');
  const cards   = Array.from(grid.querySelectorAll('.t-card'));
  const POPUP_W = 240;
  let hideTimer = null;

  function showPopup(card) {
    clearTimeout(hideTimer);
    pName.textContent = card.dataset.name;
    pDesc.textContent = card.dataset.desc;
    const cRect = card.getBoundingClientRect();
    const wRect = wrapper.getBoundingClientRect();
    const top   = (cRect.bottom - wRect.top) + 10;
    let left    = cRect.left - wRect.left;
    const maxL  = wRect.width - POPUP_W - 8;
    left = Math.max(8, Math.min(left, maxL));
    const cardCX = (cRect.left - wRect.left) + cRect.width / 2;
    const arrowL = Math.max(12, Math.min(cardCX - left - 7, POPUP_W - 26));
    popup.style.setProperty('--arrow-left', arrowL + 'px');
    popup.style.left  = left + 'px';
    popup.style.top   = top  + 'px';
    popup.style.width = POPUP_W + 'px';
    popup.classList.add('visible');
  }

  function hidePopup() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => popup.classList.remove('visible'), 120);
  }

  /* desktop hover — solo >760px */
  cards.forEach(c => {
    c.addEventListener('mouseenter', () => { if (window.innerWidth > 760) showPopup(c); });
    c.addEventListener('mouseleave', () => { if (window.innerWidth > 760) hidePopup(); });
  });
  popup.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  popup.addEventListener('mouseleave', hidePopup);

  /* mobile: dots */
  function initMobile() {
    if (window.innerWidth > 760) return;

    const dotsBox = document.getElementById('carouselDots');
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dotsBox.appendChild(dot);
    });
    const dots = Array.from(dotsBox.querySelectorAll('.carousel-dot'));

    function getCenteredIdx() {
      const cx = grid.getBoundingClientRect().left + grid.getBoundingClientRect().width / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const photo = card.querySelector('.t-card-photo') || card;
        const cr = photo.getBoundingClientRect();
        const d  = Math.abs((cr.left + cr.width / 2) - cx);
        if (d < minDist) { minDist = d; closest = i; }
      });
      return closest;
    }

    function updateDots() {
      const idx = getCenteredIdx();
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      cards.forEach((card, i) => card.classList.toggle('active', i === idx));
    }

    let raf;
    grid.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateDots);
    }, { passive: true });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', e => {
        e.stopPropagation();
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });

    updateDots();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobile);
  } else {
    initMobile();
  }
})();