function sizeWidget() {
    const wrapper = document.querySelector('.fases-wrapper');
    const widget  = document.querySelector('.master-of-all-divs');
    if (!wrapper || !widget) return;
    // Use the larger of width/height so it covers the whole wrapper
    const size = Math.max(wrapper.offsetWidth, wrapper.offsetHeight);
    widget.style.setProperty('--w', size + 'px');
  }
  sizeWidget();
  window.addEventListener('resize', sizeWidget);