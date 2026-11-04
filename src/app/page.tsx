import { bootcamp } from "@/content/bootcamp";
import { BoardProvider } from "@/components/os/board-provider";
import { DesktopShell, FlowBar, SystemBar } from "@/components/os/desktop-shell";
import { MapWindow, ViewMapButton } from "@/components/os/map-window";
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

export default function Page() {
  const { chapters, cta, os } = bootcamp;
  const price = resolvePrice();

  return (
    <BoardProvider>
      <a href="#para-quien" className="skip-link">
        {os.skip}
      </a>

      <div className="track" data-board="track">
        <div className="stage" data-board="stage">
          <SystemBar />
          <DesktopShell />
          <div className="scrim" aria-hidden />

          <MapWindow ui={os} chapters={chapters} ctaHref={ctaHref} ctaLabel={cta.shortLabel}>
            <BoardEdges />
            <main>
              <HeroStation />
              <AudienceStation />
              <ManifestoStation />
              <PilarStation />
              <TwoDaysStation />
              <OutcomesStation />
              <HostsStation />
              <EnrollStation />
            </main>
          </MapWindow>
        </div>
      </div>

      <SiteFooter />

      <ViewMapButton label={os.viewMap} />
      <FlowBar price={price?.label ?? null} />
    </BoardProvider>
  );
}
