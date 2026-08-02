import { EventsMap } from '@/components/events-map';

// Ported from the original Elementor build (sections 5409d4c / 6263192).
//
// 2026 revision: the glass event cards were replaced by the world map, which
// carries the same information on its pins. The intro copy above it and the
// CTA below are the ported markup, unchanged.

const intro = "<div class=\"elementor-element elementor-element-6263192 e-con-full e-flex e-con e-parent\" data-id=\"6263192\" data-element_type=\"container\" data-e-type=\"container\" style=\"content-visibility: auto;contain-intrinsic-size: auto 4107px;\">\n\t\t\t\t<div class=\"elementor-element elementor-element-06ef5cd elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget-tablet__width-inherit elementor-widget elementor-widget-icon-box\" data-id=\"06ef5cd\" data-element_type=\"widget\" data-e-type=\"widget\" data-widget_type=\"icon-box.default\">\n\t\t\t\t\t\t\t<div class=\"elementor-icon-box-wrapper\">\n\n\t\t\t\n\t\t\t\t\t\t<div class=\"elementor-icon-box-content\">\n\n\t\t\t\t\t\t\t\t\t<h3 class=\"elementor-icon-box-title\">\n\t\t\t\t\t\t<span  >\n\t\t\t\t\t\t\t<span class=\"titulo-premium\">Cercanias y experiencias MCE</span>\t\t\t\t\t\t</span>\n\t\t\t\t\t</h3>\n\t\t\t\t\n\t\t\t\t\t\t\t\t\t<p class=\"elementor-icon-box-description\">\n\t\t\t\t\t\tMás allá del contenido, MCE es un movimiento vivo.\nEncuentros presenciales, experiencias transformadoras y espacios diseñados para conectar con líderes que están creando una nueva forma de vivir, emprender y expandirse.\t\t\t\t\t</p>\n\t\t\t\t\n\t\t\t</div>\n\t\t\t\n\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t<div class=\"elementor-element elementor-element-cc2c296 elementor-widget elementor-widget-html\" data-id=\"cc2c296\" data-element_type=\"widget\" data-e-type=\"widget\" data-widget_type=\"html.default\">\n\t\t\t\t\t<div class=\"mce-proximo-evento\">\r\n\r\n  <!-- ORBS -->\r\n  <div class=\"mce-bg-orbs\">\r\n    <span class=\"mce-orb mce-orb-1\"></span>\r\n    <span class=\"mce-orb mce-orb-2\"></span>\r\n    <span class=\"mce-orb mce-orb-3\"></span>\r\n  </div>\r\n\r\n  <!-- GLASS CARD -->";

const cta = "<div class=\"elementor-element elementor-element-3218f6d elementor-widget-mobile__width-inherit elementor-widget elementor-widget-html\" data-id=\"3218f6d\" data-element_type=\"widget\" data-e-type=\"widget\" data-widget_type=\"html.default\">\n\t\t\t\t\t<a class=\"orb-btn\" href=\"https://www.typeform.com/\">\r\n  <span class=\"surface-glow\"></span>\r\n  <span class=\"shine\"></span>\r\n  <div class=\"orb orb-1\"></div>\r\n  <div class=\"orb orb-2\"></div>\r\n  <div class=\"orb orb-3\"></div>\r\n  <span class=\"btn-label\">AGENDAR LLAMADA</span>\r\n</a>\t\t\t\t</div>\n\t\t\t\t</div>";

export function Experiences() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: intro }} />
      <EventsMap />
      <div dangerouslySetInnerHTML={{ __html: cta }} />
    </>
  );
}
