import Image from "@/components/safe-image";
import { bootcamp } from "@/content/bootcamp";
import { CtaButton } from "@/components/editorial";
import { VerifiedBadge } from "@/components/verified-badge";
import { ADS_TICKET_HREF, adsCtaLabel, seatsLine } from "@/lib/offer";
import { AdsDateLine } from "./ads-date-line";

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

/** The people behind the numbers: the same faces the authority section shows, small. */
function AdsFaces() {
  const faces = bootcamp.hosts.authority.items.find((item) => item.faces)?.faces;
  if (!faces) return null;
  return (
    <ul className="ads-faces">
      {faces.map((face) => (
        <li key={face.name} className="ads-face">
          <span className="ads-face-pic">
            {face.image ? (
              <Image src={face.image.src!} alt="" width={72} height={72} quality={85} />
            ) : (
              <b aria-hidden>{face.name.charAt(0)}</b>
            )}
            <VerifiedBadge className="ads-face-badge" />
          </span>
          <small>{face.name}</small>
        </li>
      ))}
    </ul>
  );
}

/**
 * The first screen, for someone who comes from an ad: who it is for, what is promised,
 * the proof, the people, and one button that goes to the ticket (never straight to the checkout).
 */
export function EdHero({ ads }: { ads: AdsContext }) {
  const { hero, ads: copy } = bootcamp;
  const cut = copy.promise.lastIndexOf(copy.promiseHighlight);
  const title = hero.title.before + hero.title.italic + hero.title.after;
  return (
    <div className="ed ed-paper ed-hero">
      <AdsDateLine className="ed-hero-date" />
      <p className="ed-hero-kicker">{title}</p>
      <h1 id="hero-title" className="ed-hero-title">
        <span className="sr-only">{hero.programName}: </span>
        {cut === -1 ? (
          copy.promise
        ) : (
          <>
            {copy.promise.slice(0, cut)}
            <em>{copy.promiseHighlight}</em>
          </>
        )}
      </h1>
      <AdsQualifier />
      <AdsProof />
      <AdsFaces />
      <CtaButton label={adsCtaLabel()} track="hero_cta_click" className="ads-hero-cta" href={ADS_TICKET_HREF} />
      <AdsSeats left={ads.seatsLeft} />
    </div>
  );
}
