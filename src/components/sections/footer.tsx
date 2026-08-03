/**
 * Footer.
 *
 * Rewritten from the ported Elementor markup: the container scaffolding is
 * gone, leaving the particles canvas and the legal line. particles.js mounts
 * into #particles-js, so that id has to stay.
 */
export function Footer() {
  return (
    <footer className="mce-footer">
      <div id="particles-js" aria-hidden="true" />

      <p className="mce-footer-legal">
        © CONSCIENCIA MCE. 2026. ALL RIGHTS RESERVED. La participación en este programa es
        voluntaria y no garantiza resultados específicos. Toda la información compartida en
        esta página y durante el proceso es confidencial y está protegida por derechos de
        autor.
      </p>
    </footer>
  );
}
