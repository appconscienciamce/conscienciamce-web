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

/** What MCE is, as phrases — revealed one at a time. */
const WHAT_IS_MCE = [
  'Consciencia MCE nace de integrar dos mundos que casi siempre se presentan como opuestos: consciencia y materia, espiritualidad y negocios, cielo y tierra.',
  'No se trata de abandonar lo material para ser espiritual. Tampoco de construir éxito externo desconectado de quién sos por dentro. Se trata de unir ambos mundos.',
  'Parte de entender al ser humano como un ser multidimensional —mente, cuerpo y espíritu— y de buscar equilibrio entre todas sus dimensiones: entre lo femenino y lo masculino, lo interno y lo externo.',
  'Desde esta visión la realidad no se limita a lo físico: existen principios espirituales y metafísicos que pueden comprenderse, estructurarse y aplicarse de manera práctica.',
  'Dios se plantea como un principio presente en todo, cuya naturaleza es expansión y más vida. Por eso desarrollar tu potencial, crear y expandirte es también una forma de expresar esa naturaleza.',
];

/** Closing thoughts on the chain. */
const CHAIN_NOTES = [
  'Tu realidad externa termina siendo un reflejo de quién sos internamente. Por eso el verdadero trabajo empieza en la consciencia y la identidad, pero debe terminar expresándose en la materia.',
  'El objetivo es alcanzar un éxito integral: no solamente crecer en el negocio o generar riqueza, sino construir una vida coherente y expansiva en todas sus áreas —propósito, relaciones, familia, físico, espiritualidad y materia— sin sacrificar una dimensión para desarrollar otra.',
];

/** Client copy, verbatim. */
const ICEBERG_COPY = [
  'Antes de construir un gran negocio, una relación extraordinaria, riqueza, impacto o una vida alineada con tu visión, existen bases internas que tienen que poder sostenerlo.',
  'Lo que ves afuera es solamente la punta del iceberg. Debajo están tu nivel de consciencia, tu identidad, tus paradigmas, tus estándares, tus principios y la manera desde la que operás cada día.',
];

/** How the Club follows from the philosophy. */
const CLUB_INTRO = [
  'De ahí nace el Club: la base y los fundamentos de Consciencia MCE. Un entrenamiento práctico de 90 días para reprogramar tu identidad y desarrollar tu potencial.',
];

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
                  Integrar consciencia y materia: dos mundos que casi siempre se presentan
                  como opuestos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mce-narrative">
          {WHAT_IS_MCE.map((phrase) => (
            <p key={phrase} className="mce-narrative-line">
              {phrase}
            </p>
          ))}
        </div>

        <div className="mce-chain">
          <p className="mce-chain-lead">La filosofía de MCE parte de una idea central:</p>
          <ol className="mce-chain-steps">
            <li>
              <span>Consciencia</span>
            </li>
            <li>
              <span>Identidad</span>
            </li>
            <li>
              <span>Acción</span>
            </li>
            <li>
              <span>Materia</span>
            </li>
          </ol>
          <div className="mce-narrative">
          {CHAIN_NOTES.map((phrase) => (
            <p key={phrase} className="mce-narrative-line">
              {phrase}
            </p>
          ))}
        </div>
        </div>

        <div className="mce-narrative">
          {ICEBERG_COPY.map((phrase) => (
            <p key={phrase} className="mce-narrative-line">
              {phrase}
            </p>
          ))}
        </div>

        <div className="mce-iceberg">
          <Iceberg />
        </div>

        <div className="mce-narrative">
          {CLUB_INTRO.map((phrase) => (
            <p key={phrase} className="mce-narrative-line">
              {phrase}
            </p>
          ))}
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
