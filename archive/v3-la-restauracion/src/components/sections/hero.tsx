import { bootcamp } from "@/content/bootcamp";
import { ClaimText, CtaButton, PriceText } from "@/components/editorial";
import { HeroCine } from "@/components/experience/hero-cine";
import { resolveClaim } from "@/lib/offer";

const { hero, brand, chapters } = bootcamp;

export function Hero() {
  const pilar = resolveClaim("pilarRevenue");
  return (
    <HeroCine
      id={chapters[0].id}
      title="/media/hero/title.webp"
      titleAlt={hero.seoTitle}
      art="/media/hero/art.webp"
      depth="/media/hero/depth.webp"
      artAlt={hero.artAlt}
      moon="/media/hero/moon.webp"
      words={hero.words}
      scrollNote={hero.scrollNote}
      bar={
        <header className="hero-cine__bar">
          <a href="#inicio" aria-label={brand.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.mark.src!} alt="" width={24} height={24} />
            <span>Bootcamp — Creadores Conscientes</span>
          </a>
          <span aria-hidden className="hero-cine__rule" />
          <span>2 días en vivo</span>
          <span className="hide-sm">
            • <PriceText fallback="" />
          </span>
        </header>
      }
      copy={
        <>
          <p className="hero-cine__promise">
            {hero.promise} <em>{hero.promiseEnd}</em>
          </p>
          <div aria-hidden className="hero-cine__ornament">
            <span>✦</span>
          </div>
          <p className="hero-cine__audience">{hero.audience}</p>
          <p className="hero-cine__hosts">{hero.hosts}</p>
        </>
      }
      side={
        <>
          <div className="hero-cine__actions">
            <CtaButton className="w-full" />
            <a href="#para-quien" className="btn btn-ghost w-full">
              {hero.secondaryCta}
            </a>
          </div>
          <div className="hero-cine__facts">
            <span>2 días en vivo</span>
            {pilar.state === "fallback" ? (
              <span>Caso real abierto</span>
            ) : (
              <span>
                Caso real: +<ClaimText id="pilarRevenue" />
              </span>
            )}
            <span>{hero.criteria}</span>
            <span className="sm:hidden">
              <PriceText fallback="" />
            </span>
          </div>
        </>
      }
    />
  );
}
