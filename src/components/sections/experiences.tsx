import { EventsMap } from '@/components/events-map';

/**
 * "Cercanias y experiencias MCE".
 *
 * Rewritten from the ported Elementor markup: the container scaffolding is
 * gone, leaving the heading, the intro copy and the map that replaced the
 * glass event cards.
 */
export function Experiences() {
  return (
    <section className="mce-experiences">
      <div className="mce-experiences-intro">
        <h3 className="mce-section-title scroll-bottom">
          <span className="titulo-premium">Cercanias y experiencias MCE</span>
        </h3>
        <p className="mce-experiences-lead scroll-bottom">
          Más allá del contenido, MCE es un movimiento vivo. Encuentros presenciales,
          experiencias transformadoras y espacios diseñados para conectar con líderes que
          están creando una nueva forma de vivir, emprender y expandirse.
        </p>
      </div>

      <EventsMap />
    </section>
  );
}
