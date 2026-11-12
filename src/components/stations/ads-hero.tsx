import { bootcamp } from "@/content/bootcamp";
import { CtaButton } from "@/components/editorial";
import { adsCtaLabel, seatsLine } from "@/lib/offer";

/** What the paid-traffic page (`/v2`) knows that `/` does not. */
export interface AdsContext {
  /** Real seats left, or null when the counter has no answer. */
  seatsLeft: number | null;
}

/** "Quedan N lugares". Nothing at all without a real number. */
export function AdsSeats({ left, className = "" }: { left: number | null; className?: string }) {
  if (left === null) return null;
  return (
    <p className={`ads-seats ${className}`}>
      <span aria-hidden className="ads-seats-dot" />
      {seatsLine(left)}
    </p>
  );
}

/** The proof line under the title: the figure, then the case. */
export function AdsProof({ className = "" }: { className?: string }) {
  const { proof } = bootcamp.ads;
  return (
    <p className={`ads-proof ${className}`}>
      <strong>{proof.figure}</strong>
      <span aria-hidden className="ads-proof-sep">
        {" · "}
      </span>
      <span>{proof.case}</span>
    </p>
  );
}

export function AdsQualifier({ className = "" }: { className?: string }) {
  return <p className={`ads-qualifier ${className}`}>{bootcamp.ads.qualifier}</p>;
}

/**
 * The first screen on a phone, for someone who comes from an ad: date, title, promise,
 * who it is for, proof, the buy button with its price and the seats left.
 * It lives inside the hero window and only shows on the phone reading.
 */
export function EdHero({ ads }: { ads: AdsContext }) {
  const { hero } = bootcamp;
  const cut = hero.promise.lastIndexOf(hero.promiseHighlight);
  return (
    <div className="ed ed-paper ed-hero">
      <p className="ed-hero-date">{hero.dateLine}</p>
      <h1 className="ed-hero-title">
        {hero.title.before}
        <em>{hero.title.italic}</em>
        {hero.title.after}
      </h1>
      <p className="ed-hero-promise">
        {hero.promise.slice(0, cut)}
        <em>{hero.promiseHighlight}</em>
      </p>
      <AdsQualifier />
      <AdsProof />
      <CtaButton label={adsCtaLabel()} track="hero_cta_click" className="ads-hero-cta" />
      <AdsSeats left={ads.seatsLeft} />
    </div>
  );
}
