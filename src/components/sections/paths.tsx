import { PathsGrid } from '@/components/paths-grid';

/**
 * "¿Para quién es esto?"
 *
 * Rewritten from the ported Elementor markup: the container scaffolding is
 * gone. The CTA keeps the orb-btn structure the ported stylesheet animates.
 */
export function Paths() {
  return (
    <section className="mce-paths">
      <div className="mce-paths-inner">
        <h3 className="mce-section-title scroll-bottom">
          <span className="titulo-premium">El club es para vos si...</span>
        </h3>

        <PathsGrid />

        <div className="mce-section-cta scroll-bottom">
          <a className="orb-btn" href="#formulario">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <span className="btn-label">QUIERO SER PARTE</span>
          </a>
        </div>
      </div>
    </section>
  );
}
