// New in the 2026 revision: what MCE is, and the Club as its foundation.
//
// Built from the same Elementor primitives the rest of the page uses
// (icon-box heading + list widget) so it inherits the existing styles rather
// than introducing a parallel visual language.
//
// The iceberg image is a placeholder: /wp-content/uploads/2026/03/iceberg.webp
// does not exist yet and must be supplied before launch.

const html = `<div class="elementor-element e-flex e-con-boxed e-con e-parent mce-club" data-element_type="container">
\t\t\t\t\t<div class="e-con-inner">
\t\t\t\t<div class="elementor-element elementor-widget elementor-widget-icon-box" data-element_type="widget" data-widget_type="icon-box.default">
\t\t\t\t\t\t\t<div class="elementor-icon-box-wrapper">
\t\t\t\t\t\t<div class="elementor-icon-box-content">
\t\t\t\t\t\t\t\t\t<h3 class="elementor-icon-box-title">
\t\t\t\t\t\t<span  >
\t\t\t\t\t\t\t<span class="titulo-premium">Qué es Consciencia MCE</span>\t\t\t\t\t\t</span>
\t\t\t\t\t</h3>
\t\t\t\t\t\t\t\t\t<p class="elementor-icon-box-description">
\t\t\t\t\t\tDe Consciencia MCE nace <span class="remarcado">el Club</span>: la base y los fundamentos sobre los que se construye todo lo demás.\t\t\t\t\t</p>
\t\t\t</div>
\t\t</div>
\t\t\t\t\t\t</div>

\t\t\t\t<div class="elementor-element elementor-widget elementor-widget-html" data-element_type="widget" data-widget_type="html.default">
\t\t\t\t\t<div class="mce-club-intro">
  <p class="text">Antes de construir un gran negocio, una relación extraordinaria, riqueza, impacto o una vida alineada con tu visión, existen <strong>bases internas que tienen que poder sostenerlo</strong>.</p>
  <p class="text">Lo que ves afuera es solamente la punta del iceberg. Debajo están tu nivel de consciencia, tu identidad, tus paradigmas, tus estándares, tus principios y la manera desde la que operas cada día.</p>
</div>

<div class="mce-iceberg">
  <img decoding="async" src="/wp-content/uploads/2026/03/iceberg.webp" alt="La punta del iceberg: lo visible sobre lo que lo sostiene" loading="lazy" width="1200" height="900">
</div>
\t\t\t\t</div>

\t\t\t\t<div class="elementor-element elementor-widget elementor-widget-icon-box" data-element_type="widget" data-widget_type="icon-box.default">
\t\t\t\t\t\t\t<div class="elementor-icon-box-wrapper">
\t\t\t\t\t\t<div class="elementor-icon-box-content">
\t\t\t\t\t\t\t\t\t<h3 class="elementor-icon-box-title">
\t\t\t\t\t\t<span  >
\t\t\t\t\t\t\t<span class="titulo-premium">Dentro del Club accedes a</span>\t\t\t\t\t\t</span>
\t\t\t\t\t</h3>
\t\t\t</div>
\t\t</div>
\t\t\t\t\t\t</div>

\t\t\t\t<div class="elementor-element elementor-widget elementor-widget-html" data-element_type="widget" data-widget_type="html.default">
\t\t\t\t\t<ul class="list mce-club-list">
  <li class="item"><div class="content"><p class="text"><strong>La app</strong></p></div></li>
  <li class="item"><div class="content"><p class="text"><strong>2 mentorías semanales</strong></p></div></li>
  <li class="item"><div class="content"><p class="text">La <strong>filosofía, tecnología, principios y valores</strong> de MCE</p></div></li>
  <li class="item"><div class="content"><p class="text"><strong>Protocolos prácticos</strong></p></div></li>
  <li class="item"><div class="content"><p class="text">Comunidad de <strong>líderes y emprendedores conscientes</strong></p></div></li>
  <li class="item"><div class="content"><p class="text">Acceso a nuestros <strong>eventos privados</strong></p></div></li>
</ul>
\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>`;

export function Club() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
