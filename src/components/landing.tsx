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
import type { AdsContext } from "@/components/stations/ads-hero";
import { AdsReading } from "@/components/os/ads-reading";
import { SiteFooter } from "@/components/site-footer";
import { adsCtaLabel, ctaHref, resolvePrice } from "@/lib/offer";

/**
 * The whole page. `/` is the current version; `/evento` keeps the previous one, which reads differently on a phone.
 * `/v2` is the current version for paid traffic (`ads`): the sale first, the price in sight, and on a phone
 * the page is the window itself, with no home screen of folders to open first.
 */
export function Landing({ variant, ads }: { variant: Variant; ads?: AdsContext }) {
  const { chapters, cta, os } = bootcamp;
  const price = resolvePrice();

  return (
    <BoardProvider>
      <a href="#para-quien" className="skip-link">
        {os.skip}
      </a>

      <div className={`track${variant === "current" ? " v-current" : ""}${ads ? " v-ads" : ""}`} data-board="track">
        <div className="stage" data-board="stage">
          <SystemBar variant={variant} />
          <ChapterBar chapters={chapters} ui={os} />
          {!ads && <PhoneShell variant={variant} />}
          <DesktopShell />
          <div className="scrim" aria-hidden />

          <MapWindow ui={os} chapters={chapters} ctaHref={ctaHref} ctaLabel={cta.shortLabel}>
            <BoardEdges />
            <main>
              {/* On the ads page the hero is the first frame of the window, so the page scrolls straight on. */}
              {!ads && <HeroStation variant={variant} />}
              <div className="canvas">
                {!ads && <AppBar title={chapters[1].label} back={os.back} />}
                <div className="canvas-sheet">
                  {ads && <HeroStation variant={variant} ads={ads} />}
                  <AudienceStation variant={variant} />
                  <ManifestoStation variant={variant} ads={ads} />
                  <PilarStation variant={variant} />
                  <TwoDaysStation variant={variant} />
                  <OutcomesStation variant={variant} />
                  <HostsStation variant={variant} />
                  <EnrollStation variant={variant} ads={!!ads} />
                </div>
              </div>
            </main>
          </MapWindow>
        </div>
      </div>

      <SiteFooter />

      {/* The current page keeps the button bare: the price lives on the ticket. */}
      <FlowBar price={variant === "classic" ? (price?.label ?? null) : null} label={ads ? adsCtaLabel() : undefined} />
      {ads && <AdsReading />}
    </BoardProvider>
  );
}
