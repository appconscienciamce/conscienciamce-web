import { PathsGrid } from '@/components/paths-grid';

/**
 * "¿Para quién es esto?" — section 23e1682 of the original Elementor build.
 *
 * 2026 revision: the two-column "dos caminos" split became a single qualifying
 * list, and that list is now the features grid. The heading and the CTA keep
 * their ported markup so they stay consistent with the rest of the page.
 */

const cta = `<div class="mce-section-cta">
\t\t\t<a class="orb-btn" href="#formulario">
\t\t\t\t<div class="orb orb-1"></div>
\t\t\t\t<div class="orb orb-2"></div>
\t\t\t\t<div class="orb orb-3"></div>
\t\t\t\t<span class="btn-label">QUIERO SER PARTE</span>
\t\t\t</a>
\t\t</div>`;

export function Paths() {
  return (
    <div
      className="elementor-element elementor-element-23e1682 e-flex e-con-boxed e-con e-parent mce-paths"
      data-id="23e1682"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-3846697 elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-icon-box">
          <div className="elementor-icon-box-wrapper">
            <div className="elementor-icon-box-content">
              <h3 className="elementor-icon-box-title">
                <span>
                  <span className="titulo-premium">¿Para quién es esto?</span>
                </span>
              </h3>
            </div>
          </div>
        </div>

        <PathsGrid />

        <div dangerouslySetInnerHTML={{ __html: cta }} />
      </div>
    </div>
  );
}
