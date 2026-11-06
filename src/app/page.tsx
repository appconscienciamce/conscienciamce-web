import { bootcamp } from "@/content/bootcamp";
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
          <ChapterBar chapters={chapters} ui={os} />
          <PhoneShell />
          <DesktopShell />
          <div className="scrim" aria-hidden />

          <MapWindow ui={os} chapters={chapters} ctaHref={ctaHref} ctaLabel={cta.shortLabel}>
            <BoardEdges />
            <main>
              <HeroStation />
              <div className="canvas">
                <AppBar title={chapters[1].label} back={os.back} />
                <div className="canvas-sheet">
                  <AudienceStation />
                  <ManifestoStation />
                  <PilarStation />
                  <TwoDaysStation />
                  <OutcomesStation />
                  <HostsStation />
                  <EnrollStation />
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
