import Image from "@/components/safe-image";
import { bootcamp } from "@/content/bootcamp";
import { CtaButton } from "@/components/editorial";
import { VerifiedBadge } from "@/components/verified-badge";
import { ADS_TICKET_HREF, adsCtaLabel } from "@/lib/offer";
import { AdsCountdownChip } from "./ads-date-line";
import { Flag } from "./flags";

/** The proof box: the figure, then the case. */
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

/** When and at what time: the countdown, the dates, and the hour in each country. */
function AdsChips() {
  const { ads, editorial } = bootcamp;
  return (
    <div className="ads-chips">
      <p className="ads-chip-row">
        <AdsCountdownChip />
        <span className="ads-chip">{ads.dateChip}</span>
      </p>
      <p className="ads-chip-row">
        {editorial.days.zones.map((zone) => (
          <span key={zone.flag} className="ads-chip ads-chip-zone">
            <Flag code={zone.flag} />
            {zone.flag.toUpperCase()} {zone.time}
          </span>
        ))}
      </p>
    </div>
  );
}

/** The people behind the numbers: the same faces the authority section shows, stacked. */
function AdsFaces() {
  const faces = bootcamp.hosts.authority.items.find((item) => item.faces)?.faces;
  if (!faces) return null;
  return (
    <div className="ads-faces">
      <ul className="ads-face-stack">
        {faces.map((face, i) => (
          <li key={face.name} className="ads-face">
            {face.image ? (
              <Image src={face.image.src!} alt="" width={72} height={72} quality={85} />
            ) : (
              <b aria-hidden>{face.name.charAt(0)}</b>
            )}
            {i === faces.length - 1 && <VerifiedBadge className="ads-face-badge" />}
          </li>
        ))}
      </ul>
      <p className="ads-faces-label">{bootcamp.ads.facesLabel}</p>
    </div>
  );
}

/**
 * The first screen, for someone who comes from an ad: when it happens, what is promised,
 * the proof, the people, and one button that goes to the ticket (never straight to the checkout).
 * It is laid out to fill exactly one phone screen.
 */
export function EdHero() {
  const { hero, ads: copy } = bootcamp;
  const cut = copy.lead.lastIndexOf(copy.leadHighlight);
  return (
    <div className="ed ed-paper ed-hero">
      <AdsChips />
      <div className="ads-hero-copy">
        <h1 id="hero-title" className="ed-hero-title">
          <span className="sr-only">{hero.programName}: </span>
          {copy.promise}
        </h1>
        <p className="ed-hero-lead">
          {cut === -1 ? (
            copy.lead
          ) : (
            <>
              {copy.lead.slice(0, cut)}
              <em>{copy.leadHighlight}</em>
            </>
          )}
        </p>
        <AdsQualifier />
      </div>
      <div className="ads-hero-proof">
        <AdsProof />
        <AdsFaces />
      </div>
      <CtaButton label={adsCtaLabel()} track="hero_cta_click" className="ads-hero-cta" href={ADS_TICKET_HREF} />
    </div>
  );
}
