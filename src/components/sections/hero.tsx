// Ported from the original Elementor build (section 5c563a5).
//
// Deviations from the original, per the 2026 landing revision:
//   - VSL removed (preview, play button and the video layout it revealed)
//   - Decorative hands removed (gb-left-arm / gb-right-arm)
//   - New promise copy
//   - The CTA used to live inside the video layout; with the VSL gone it now
//     sits directly in the hero so it stays visible.
//   - Spline scene as the hero backdrop, replacing the static star image.

const html = `<div class="elementor-element elementor-element-5c563a5 e-con-full e-flex e-con e-parent" data-id="5c563a5" data-element_type="container" data-e-type="container">
\t\t\t\t<div class="elementor-element elementor-element-8f0ba71 elementor-widget__width-inherit elementor-widget elementor-widget-html" data-id="8f0ba71" data-element_type="widget" data-e-type="widget" data-widget_type="html.default">
\t\t\t\t\t<!-- ========== HTML ========== -->
<div class="gb-widget gb-widget--no-vsl">

  <!-- ── Spline backdrop ── -->
  <div class="spline-container" aria-hidden="true">
    <iframe
      src="https://my.spline.design/glowingplanetparticles-HmCVKutonlFn3Oqqe6DI9nWi/"
      title=""
      tabindex="-1"
      loading="lazy"
      frameborder="0"
      width="100%"
      height="100%"
      id="aura-spline"></iframe>
  </div>

  <!-- ── Hero text ── -->
  <div class="gb-hero" id="gbHero">
    <img decoding="async" class="gb-logo" src="/wp-content/uploads/2026/02/logo.webp" alt="Logo" width="398" height="55" loading="eager" fetchpriority="high">
    <p class="gb-promise titulo-premium-2">90 días para convertirte en la persona capaz de crear y sostener una vida extraordinaria<span class="gb-promise-break"> en propósito, abundancia y libertad</span></p>
    <p class="gb-description">Entrenamiento práctico de mente, cuerpo y espíritu para reprogramar tu identidad y transformar tu potencial en resultados aplicando los principios, sistemas y tecnología de Consciencia MCE.</p>

    <div class="gb-hero-cta">
      <a class="orb-btn" href="#formulario">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <span class="btn-label">QUIERO SER PARTE</span>
      </a>
    </div>
  </div>

</div>

<div class="gb-hidden-images"></div>
\t\t\t\t</div>
\t\t\t\t</div>`;

export function Hero() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
