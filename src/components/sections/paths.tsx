// Ported from the original Elementor build (section 23e1682).
//
// 2026 revision: the two-column "dos caminos" split was replaced by a single
// qualifying list. Markup classes are kept from the original list widget so the
// existing styles apply unchanged.

const html = `<div class="elementor-element elementor-element-23e1682 e-flex e-con-boxed e-con e-parent" data-id="23e1682" data-element_type="container" data-e-type="container">
\t\t\t\t\t<div class="e-con-inner">
\t\t\t\t<div class="elementor-element elementor-element-3846697 elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-icon-box" data-id="3846697" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
\t\t\t\t\t\t\t<div class="elementor-icon-box-wrapper">
\t\t\t\t\t\t<div class="elementor-icon-box-content">
\t\t\t\t\t\t\t\t\t<h3 class="elementor-icon-box-title">
\t\t\t\t\t\t<span  >
\t\t\t\t\t\t\t<span class="titulo-premium">¿Para quién es esto?</span>\t\t\t\t\t\t</span>
\t\t\t\t\t</h3>
\t\t\t</div>
\t\t</div>
\t\t\t\t\t\t</div>
\t\t<div class="elementor-element elementor-element-7239509 e-con-full e-flex e-con e-child mce-single-column" data-id="7239509" data-element_type="container" data-e-type="container">
\t\t\t\t<div class="elementor-element elementor-element-0885e8e elementor-widget elementor-widget-html" data-id="0885e8e" data-element_type="widget" data-e-type="widget" data-widget_type="html.default">
\t\t\t\t\t<ul class="list">
  <li class="item">
    <div class="img-wrap">
      <img decoding="async" src="/wp-content/uploads/2026/03/item-1.webp" alt="" loading="eager" width="600" height="400" fetchpriority="high">
    </div>
    <div class="content">
      <p class="text">Sabes que tienes <strong>más potencial del que hoy estás expresando</strong> en tu negocio y en tu vida, pero todavía no consigues llevarlo a resultados de forma consistente.</p>
    </div>
  </li>
  <li class="item">
    <div class="img-wrap">
      <img decoding="async" src="/wp-content/uploads/2026/03/item-2.webp" alt="" loading="lazy" width="600" height="400">
    </div>
    <div class="content">
      <p class="text">Has consumido desarrollo personal, espiritualidad o consciencia, entiendes muchas cosas a nivel teórico, pero <strong>tu realidad todavía no refleja todo lo que sabes</strong>.</p>
    </div>
  </li>
  <li class="item">
    <div class="img-wrap">
      <img decoding="async" src="/wp-content/uploads/2026/03/item-3.webp" alt="" loading="lazy" width="600" height="400">
    </div>
    <div class="content">
      <p class="text">Has conseguido resultados, pero <strong>te cuesta sostenerlos</strong> sin volver a caer en los mismos patrones, perder claridad o desconectarte de tu visión.</p>
    </div>
  </li>
  <li class="item">
    <div class="img-wrap">
      <img decoding="async" src="/wp-content/uploads/2026/03/item-4.webp" alt="" loading="lazy" width="600" height="400">
    </div>
    <div class="content">
      <p class="text">Quieres construir un negocio con propósito <strong>sin tener que elegir entre expansión material y desarrollo espiritual</strong>, integrando ambos en una misma forma de vivir y operar.</p>
    </div>
  </li>
  <li class="item">
    <div class="img-wrap">
      <img decoding="async" src="/wp-content/uploads/2026/03/item-5.webp" alt="" loading="lazy" width="600" height="400">
    </div>
    <div class="content">
      <p class="text">Sientes que tu siguiente nivel no depende de aprender otra estrategia, sino de <strong>elevar tus estándares, transformar tu identidad</strong> y convertirte en la persona capaz de sostener una realidad más grande.</p>
    </div>
  </li>
</ul>
\t\t\t\t</div>
\t\t</div>
\t\t<div class="mce-section-cta">
\t\t\t<a class="orb-btn" href="#formulario">
\t\t\t\t<div class="orb orb-1"></div>
\t\t\t\t<div class="orb orb-2"></div>
\t\t\t\t<div class="orb orb-3"></div>
\t\t\t\t<span class="btn-label">QUIERO SER PARTE</span>
\t\t\t</a>
\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`;

export function Paths() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
