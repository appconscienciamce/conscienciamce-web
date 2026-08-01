/**
 * Laptop that opens as the section scrolls into view, introducing the app.
 *
 * The lid starts folded back and rotates upright while the element crosses the
 * viewport. A script writes the scroll progress to a `--open` custom property
 * on the wrapper; all the motion is CSS driven off that one value, so nothing
 * animates on the main thread beyond setting a number.
 *
 * Plain CSS and a small script rather than a component library: this project
 * has no Tailwind or motion library, and adding either would put a second
 * styling system on top of the ported Elementor base.
 */

export function MacbookScroll({
  screenSrc,
  screenAlt,
}: {
  /** Screenshot of the app. Omit to show the placeholder UI. */
  screenSrc?: string;
  screenAlt?: string;
}) {
  return (
    <div className="mce-macbook" data-macbook>
      <div className="mce-macbook-stage">
        {/* Lid — rotates open with scroll progress. */}
        <div className="mce-macbook-lid">
          <div className="mce-macbook-screen">
            {screenSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={screenSrc} alt={screenAlt ?? ''} loading="lazy" />
            ) : (
              // Placeholder until a real app screenshot exists.
              <div className="mce-macbook-placeholder" aria-hidden="true">
                <span className="mce-macbook-ph-bar" />
                <span className="mce-macbook-ph-bar" />
                <span className="mce-macbook-ph-bar" />
                <div className="mce-macbook-ph-tiles">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <span className="mce-macbook-glare" aria-hidden="true" />
          </div>
        </div>

        {/* Base — keyboard deck and trackpad. */}
        <div className="mce-macbook-base" aria-hidden="true">
          <div className="mce-macbook-keyboard">
            {Array.from({ length: 6 }, (_, row) => (
              <div className="mce-macbook-keyrow" key={row}>
                {Array.from({ length: row === 5 ? 9 : 14 }, (_, key) => (
                  <span className="mce-macbook-key" key={key} />
                ))}
              </div>
            ))}
          </div>
          <div className="mce-macbook-trackpad" />
        </div>
      </div>
    </div>
  );
}
