/**
 * Hero.
 *
 * Rewritten from the ported Elementor markup: the container scaffolding is
 * gone, leaving the design's own gb-* classes, which the ported stylesheet
 * still styles.
 *
 * Deviations from the original build, per the 2026 revision: no VSL, no
 * decorative hands, new promise copy, a Spline scene in place of the static
 * star, and the CTA lifted out of the video layout it used to live in.
 */
export function Hero() {
  return (
    <section className="mce-hero">
      <div className="gb-widget gb-widget--no-vsl">
        {/* Backdrop. Inert: it must never take the scroll or the CTA's clicks. */}
        <div className="spline-container" aria-hidden="true">
          <iframe
            src="https://my.spline.design/glowingplanetparticles-HmCVKutonlFn3Oqqe6DI9nWi/"
            title=""
            tabIndex={-1}
            loading="lazy"
            frameBorder="0"
            width="100%"
            height="100%"
            id="aura-spline"
          />
        </div>

        <div className="gb-hero" id="gbHero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gb-logo"
            src="/wp-content/uploads/2026/02/logo.webp"
            alt="Consciencia MCE"
            width="398"
            height="55"
            fetchPriority="high"
          />

          <p className="gb-promise titulo-premium-2">
            90 días para convertirte en la persona capaz de crear y sostener una vida
            extraordinaria
            <span className="gb-promise-break"> en propósito, abundancia y libertad</span>
          </p>

          <p className="gb-description">
            Entrenamiento práctico de mente, cuerpo y espíritu para reprogramar tu identidad y
            transformar tu potencial en resultados aplicando los principios, sistemas y
            tecnología de Consciencia MCE.
          </p>

          <div className="gb-hero-cta">
            <a className="orb-btn" href="#formulario">
              <div className="orb orb-1" />
              <div className="orb orb-2" />
              <div className="orb orb-3" />
              <span className="btn-label">QUIERO SER PARTE</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
