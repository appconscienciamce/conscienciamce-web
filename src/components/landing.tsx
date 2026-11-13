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
import { AdsEnrollStation } from "@/components/stations/ads-enroll";
import { ADS_TICKET_HREF, adsCtaLabel, ctaHref, resolvePrice } from "@/lib/offer";

/**
 * The whole page. `/` is the current version; `/evento` keeps the previous one, which reads differently on a phone.
 * `/v2` is the current version for paid traffic (`ads`): one short vertical reading (promise, people, videos,
 * who it is for, the case, the days, the ticket, the questions), at every width, with no map and no home screen.
 * Every button on it goes to the ticket; only the ticket links to the checkout.
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
          {!ads && <DesktopShell />}
          <div className="scrim" aria-hidden />

          <MapWindow ui={os} chapters={chapters} ctaHref={ctaHref} ctaLabel={cta.shortLabel}>
            {!ads && <BoardEdges />}
            <main>
              {/* On the ads page the hero is the first frame of the window, so the page scrolls straight on. */}
              {!ads && <HeroStation variant={variant} />}
              <div className="canvas">
                {!ads && <AppBar title={chapters[1].label} back={os.back} />}
                <div className="canvas-sheet">
                  {ads && <HeroStation variant={variant} ads={ads} />}
                  <AudienceStation variant={variant} />
                  {!ads && <ManifestoStation variant={variant} />}
                  <PilarStation variant={variant} />
                  <TwoDaysStation variant={variant} />
                  {!ads && <OutcomesStation variant={variant} />}
                  {!ads && <HostsStation variant={variant} />}
                  {ads ? <AdsEnrollStation ads={ads} /> : <EnrollStation variant={variant} />}
                </div>
              </div>
            </main>
          </MapWindow>
        </div>
      </div>

      <SiteFooter />

      {/* The current page keeps the button bare: the price lives on the ticket. */}
      <FlowBar
        price={variant === "classic" ? (price?.label ?? null) : null}
        label={ads ? adsCtaLabel() : undefined}
        href={ads ? ADS_TICKET_HREF : undefined}
      />
      {ads && <AdsReading />}
    </BoardProvider>
  );
}
