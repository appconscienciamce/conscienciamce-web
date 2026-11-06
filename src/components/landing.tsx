import { bootcamp } from "@/content/bootcamp";
import type { Variant } from "@/content/types";
import { BoardProvider } from "@/components/os/board-provider";
import { DesktopShell, FlowBar, PhoneShell, SystemBar } from "@/components/os/desktop-shell";
import { MapWindow } from "@/components/os/map-window";
import { ChapterBar } from "@/components/os/mobile-chrome";
import { AppBar } from "@/components/os/phone-home";
import { BoardEdges } from "@/components/board/primitives";
import {
  AudienceStation,
  HeroStation,
  ManifestoStation,
  OutcomesStation,
  PilarStation,
  TwoDaysStation,
} from "@/components/stations/story-stations";
import { EnrollStation, HostsStation } from "@/components/stations/closing-stations";
import { SiteFooter } from "@/components/site-footer";
import { ctaHref, resolvePrice } from "@/lib/offer";

/** The whole page. `/` is the current version; `/evento` keeps the previous one, which reads differently on a phone. */
export function Landing({ variant }: { variant: Variant }) {
  const { chapters, cta, os } = bootcamp;
  const price = resolvePrice();

  return (
    <BoardProvider>
      <a href="#para-quien" className="skip-link">
        {os.skip}
      </a>

      <div className={variant === "current" ? "track v-current" : "track"} data-board="track">
        <div className="stage" data-board="stage">
          <SystemBar variant={variant} />
          <ChapterBar chapters={chapters} ui={os} />
          <PhoneShell variant={variant} />
          <DesktopShell />
          <div className="scrim" aria-hidden />

          <MapWindow ui={os} chapters={chapters} ctaHref={ctaHref} ctaLabel={cta.shortLabel}>
            <BoardEdges />
            <main>
              <HeroStation variant={variant} />
              <div className="canvas">
                <AppBar title={chapters[1].label} back={os.back} />
                <div className="canvas-sheet">
                  <AudienceStation variant={variant} />
                  <ManifestoStation variant={variant} />
                  <PilarStation variant={variant} />
                  <TwoDaysStation variant={variant} />
                  <OutcomesStation variant={variant} />
                  <HostsStation variant={variant} />
                  <EnrollStation variant={variant} />
                </div>
              </div>
            </main>
          </MapWindow>
        </div>
      </div>

      <SiteFooter />

      <FlowBar price={price?.label ?? null} />
    </BoardProvider>
  );
}
