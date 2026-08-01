import { Iceberg } from '@/components/iceberg';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';

/**
 * "¿Qué es Consciencia MCE?" — new in the 2026 revision.
 *
 * The iceberg paragraphs and the Club access list are the client's copy,
 * verbatim. The surrounding explanation of what MCE is was drafted from the
 * philosophy brief, which the brief itself left as a gap ("Explicación sobre
 * mce …"). Everything here is editable in place.
 *
 * The heading carries the same treatment as the other section titles
 * (Inter 36/700, -1px tracking, shimmer fill), which the original applied per
 * element id and therefore does not reach a new section on its own.
 */

/** What MCE is — drafted from the philosophy brief. */
const whatIsMce = `<div class="mce-club-intro">
  <p class="text">Consciencia MCE nace de integrar dos mundos que casi siempre se presentan como opuestos: <strong>consciencia y materia, espiritualidad y negocios, cielo y tierra</strong>.</p>
  <p class="text">No se trata de abandonar lo material para ser espiritual. Tampoco de construir éxito externo desconectado de quién sos por dentro. Se trata de unir ambos mundos.</p>
  <p class="text">Parte de entender al ser humano como un <strong>ser multidimensional</strong> —mente, cuerpo y espíritu— y de buscar equilibrio entre todas sus dimensiones: entre lo femenino y lo masculino, lo interno y lo externo. Desde esta visión la realidad no se limita a lo físico: existen principios espirituales y metafísicos que pueden comprenderse, estructurarse y aplicarse de manera práctica.</p>
  <p class="text">Dios se plantea como un principio presente en todo, cuya naturaleza es <strong>expansión y más vida</strong>. Por eso desarrollar tu potencial, crear y expandirte es también una forma de expresar esa naturaleza.</p>
</div>`;

/** The chain that organises the whole philosophy. */
const chain = `<div class="mce-chain">
  <p class="mce-chain-lead">La filosofía de MCE parte de una idea central:</p>
  <ol class="mce-chain-steps">
    <li><span>Consciencia</span></li>
    <li><span>Identidad</span></li>
    <li><span>Acción</span></li>
    <li><span>Materia</span></li>
  </ol>
  <p class="text mce-chain-note">Tu realidad externa termina siendo un reflejo de quién sos internamente. Por eso el verdadero trabajo empieza en la consciencia y la identidad, pero <strong>debe terminar expresándose en la materia</strong>.</p>
  <p class="text mce-chain-note">El objetivo es alcanzar un <strong>éxito integral</strong>: no solamente crecer en el negocio o generar riqueza, sino construir una vida coherente y expansiva en todas sus áreas —propósito, relaciones, familia, físico, espiritualidad y materia— sin sacrificar una dimensión para desarrollar otra.</p>
</div>`;

/** Client copy, verbatim. */
const intro = `<div class="mce-club-intro">
  <p class="text">Antes de construir un gran negocio, una relación extraordinaria, riqueza, impacto o una vida alineada con tu visión, existen <strong>bases internas que tienen que poder sostenerlo</strong>.</p>
  <p class="text">Lo que ves afuera es solamente la punta del iceberg. Debajo están tu nivel de consciencia, tu identidad, tus paradigmas, tus estándares, tus principios y la manera desde la que operás cada día.</p>
</div>`;

/** How the Club follows from the philosophy. */
const clubIntro = `<div class="mce-club-intro">
  <p class="text">De ahí nace <strong>el Club</strong>: la base y los fundamentos de Consciencia MCE. Un entrenamiento práctico de <strong>90 días</strong> para reprogramar tu identidad, desarrollar tu potencial y crear una vida extraordinaria con propósito, abundancia y libertad.</p>
  <p class="text">Primero la filosofía: identidad, consciencia, principios, propósito y visión. Después la traducción a <strong>protocolos prácticos</strong> —metas, hábitos, sistemas internos— para que no dependas de estar permanentemente en llamadas, sino que aprendas a entrenarte. El Club produce la transformación; <strong>la app te permite sostenerla</strong> todos los días.</p>
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
        {/* The ripple grid is a backdrop: it fills this block and the heading
            sits above it. */}
        <div className="mce-club-heading">
          <BackgroundRippleEffect rows={6} cols={27} cellSize={56} />

          <div className="elementor-element elementor-widget elementor-widget-icon-box mce-club-heading-content">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-content">
                <h2 className="elementor-icon-box-title mce-section-title">
                  <span className="titulo-premium">¿Qué es Consciencia MCE?</span>
                </h2>
                <p className="elementor-icon-box-description">
                  Integrar <span className="remarcado">consciencia y materia</span>: dos mundos que
                  casi siempre se presentan como opuestos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="elementor-element elementor-widget elementor-widget-html"
          dangerouslySetInnerHTML={{ __html: whatIsMce }}
        />

        <div
          className="elementor-element elementor-widget elementor-widget-html"
          dangerouslySetInnerHTML={{ __html: chain }}
        />

        <div
          className="elementor-element elementor-widget elementor-widget-html"
          dangerouslySetInnerHTML={{ __html: intro }}
        />

        <div className="mce-iceberg">
          <Iceberg />
        </div>

        <div
          className="elementor-element elementor-widget elementor-widget-html"
          dangerouslySetInnerHTML={{ __html: clubIntro }}
        />

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
