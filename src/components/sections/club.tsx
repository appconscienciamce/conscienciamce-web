import { Iceberg } from '@/components/iceberg';

/**
 * "¿Qué es Consciencia MCE?" — new in the 2026 revision.
 *
 * Copy is the client's, verbatim. The heading carries the same treatment as
 * the other section titles (Inter 36/700, -1px tracking, shimmer fill), which
 * the original applied per element id and therefore does not reach a new
 * section on its own.
 */

const intro = `<div class="mce-club-intro">
  <p class="text">Antes de construir un gran negocio, una relación extraordinaria, riqueza, impacto o una vida alineada con tu visión, existen <strong>bases internas que tienen que poder sostenerlo</strong>.</p>
  <p class="text">Lo que ves afuera es solamente la punta del iceberg. Debajo están tu nivel de consciencia, tu identidad, tus paradigmas, tus estándares, tus principios y la manera desde la que operás cada día.</p>
</div>`;

const clubList = `<ul class="list mce-club-list">
  <li class="item"><div class="content"><p class="text"><strong>La app</strong></p></div></li>
  <li class="item"><div class="content"><p class="text"><strong>2 mentorías semanales</strong></p></div></li>
  <li class="item"><div class="content"><p class="text">La <strong>filosofía, tecnología, principios y valores</strong> de MCE</p></div></li>
  <li class="item"><div class="content"><p class="text"><strong>Protocolos prácticos</strong></p></div></li>
  <li class="item"><div class="content"><p class="text">Comunidad de <strong>líderes y emprendedores conscientes</strong></p></div></li>
  <li class="item"><div class="content"><p class="text">Acceso a nuestros <strong>eventos privados</strong></p></div></li>
</ul>`;

export function Club() {
  return (
    <div
      className="elementor-element e-flex e-con-boxed e-con e-parent mce-club"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div className="elementor-element elementor-widget elementor-widget-icon-box">
          <div className="elementor-icon-box-wrapper">
            <div className="elementor-icon-box-content">
              <h2 className="elementor-icon-box-title mce-section-title">
                <span className="titulo-premium">¿Qué es Consciencia MCE?</span>
              </h2>
              <p className="elementor-icon-box-description">
                De Consciencia MCE nace <span className="remarcado">el Club</span>: la base y los
                fundamentos sobre los que se construye todo lo demás.
              </p>
            </div>
          </div>
        </div>

        <div
          className="elementor-element elementor-widget elementor-widget-html"
          dangerouslySetInnerHTML={{ __html: intro }}
        />

        <div className="mce-iceberg">
          <Iceberg />
        </div>

        <div className="elementor-element elementor-widget elementor-widget-icon-box">
          <div className="elementor-icon-box-wrapper">
            <div className="elementor-icon-box-content">
              <h3 className="elementor-icon-box-title mce-section-title mce-section-title--sub">
                <span className="titulo-premium">Dentro del Club accedés a</span>
              </h3>
            </div>
          </div>
        </div>

        <div
          className="elementor-element elementor-widget elementor-widget-html"
          dangerouslySetInnerHTML={{ __html: clubList }}
        />
      </div>
    </div>
  );
}
