import { Iceberg } from '@/components/iceberg';
import { ClubGrid } from '@/components/club-grid';
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

/**
 * Bridge into the Club. Set larger and in white — it carries the reader from
 * the philosophy into what the Club actually is.
 */

export function Club() {
  return (
    <section className="mce-club">
      <div className="mce-club-inner">
        {/* The ripple grid is a backdrop: it fills this block and the heading
            sits above it. */}
        <div className="mce-club-heading">
          <BackgroundRippleEffect rows={6} cols={27} cellSize={56} />

          <div className="mce-club-heading-content scroll-bottom">
            <h2 className="mce-section-title">
              <span className="titulo-premium left-text">¿Qué es Consciencia MCE?</span>
            </h2>
          </div>

          {/* The opening line belongs with the narrative, not set apart under
              the heading, so it reads as one continuous passage. */}
          <div className="mce-narrative mce-club-heading-content">
            {WHAT_IS_MCE.map((phrase) => (
              <p key={phrase} className="mce-narrative-line scroll-bottom">
                {phrase}
              </p>
            ))}
          </div>
        </div>

        <div className="mce-chain">
          <p className="mce-chain-lead scroll-bottom">
            La filosofía de MCE parte de una <em>idea central</em>:
          </p>
          {/* The four links arrive in sequence, which is the order the chain
              is meant to be read in. The class goes on the li rather than the
              span: the span's sheen is drawn by pseudo-elements at z-index
              -1, and the reveal's `filter` on that same element would trap
              them behind its background. */}
          <ol className="mce-chain-steps reveal-stagger">
            <li className="scroll-bottom">
              <span>Consciencia</span>
            </li>
            <li className="scroll-bottom">
              <span>Identidad</span>
            </li>
            <li className="scroll-bottom">
              <span>Acción</span>
            </li>
            <li className="scroll-bottom">
              <span>Materia</span>
            </li>
          </ol>
          <div className="mce-narrative">
            {CHAIN_NOTES.map((phrase) => (
              <p key={phrase} className="mce-narrative-line scroll-bottom">
                {phrase}
              </p>
            ))}
          </div>

          {/* The iceberg copy belongs to the same block as the chain, so it
              inherits the same measure and gutters. */}
          <div className="mce-narrative">
            {ICEBERG_COPY.map((phrase) => (
              <p key={phrase} className="mce-narrative-line scroll-bottom">
                {phrase}
              </p>
            ))}
          </div>

          <div className="mce-iceberg scroll-bottom">
            <Iceberg />
          </div>
        </div>

        <p className="mce-club-bridge scroll-bottom">
          De ahí nace <em>el Club</em>: la base y los fundamentos de Consciencia MCE. Un
          entrenamiento práctico de <em>90 días</em> para reprogramar tu identidad y
          desarrollar tu potencial.
        </p>

        {/* Light arc behind the heading, carried over from the reference
            landing along with its scroll-in animation. */}
        <div className="mce-club-access">
          {/* Dot pattern backdrop, carried over from the reference landing. */}
          <span className="mce-dots" aria-hidden="true" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mce-lightarc scroll-bottom2"
            src="/media/LIGHT2.webp"
            alt=""
            aria-hidden="true"
            width="800"
            height="400"
            loading="lazy"
          />

          <div className="mce-club-access-heading scroll-bottom">
            <h3 className="mce-section-title mce-section-title--sub">
              <span className="titulo-premium club-titulo">Dentro del Club accedés a</span>
            </h3>
          </div>

          <div className="mce-club-access-list">
            <ClubGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
