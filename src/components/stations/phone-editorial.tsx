import { bootcamp } from "@/content/bootcamp";
import { ClaimText, Print, Rich } from "@/components/editorial";
import type { Img } from "@/content/types";
import { resolveClaim } from "@/lib/offer";
import { KitStack } from "./kit-stack";
import { Flag } from "./flags";
import { DayMore } from "./phone-touch";

/**
 * The phone reading, section by section. The board keeps its own pieces; these only
 * exist on a phone (html.phone-os), so a change here never moves anything on the map.
 */

function Shot({ image, name, sizes, className = "", position }: { image: Img; name: string; sizes: string; className?: string; position?: string }) {
  return (
    <figure className={`shot ed-r ${className}`}>
      <span aria-hidden className="shot-bar">
        <i />
        <i />
        <i />
        <b>{name}</b>
      </span>
      <Print image={image} sizes={sizes} objectPosition={position} />
    </figure>
  );
}

export function EdAudience() {
  const { audience, editorial } = bootcamp;
  const { headline } = editorial.audience;
  const floor = resolveClaim(audience.floor);
  return (
    <div className="ed ed-paper ed-audience">
      <h2 className="ed-huge ed-r">
        {headline.before}
        <em>{headline.italic}</em>
        {headline.after}
      </h2>
      <p className="ed-lead ed-r">{audience.intro}</p>
      <section className="ed-fit">
        <h3 className="ed-r">{audience.fitTitle}</h3>
        <ul>
          {audience.fit.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="ed-nofit">
        <h3 className="ed-r">{audience.notFitTitle}</h3>
        <ul>
          {audience.notFit.map((item) => (
            <li key={item}>{item}</li>
          ))}
          {floor.state !== "fallback" && (
            <li>
              <ClaimText id={audience.floor} />
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

export function EdManifesto() {
  const { manifesto } = bootcamp;
  const words = manifesto.strikes.map((word) => <span key={word}>{word}</span>);
  return (
    <div className="ed ed-manifesto">
      <div className="ed-dark ed-thesis-block">
        <h2 className="ed-thesis ed-r">
          {manifesto.thesis.before}
          <mark>{manifesto.thesis.highlight}</mark>
          {manifesto.thesis.after}
        </h2>
        <p className="ed-counter ed-r">{manifesto.counter}</p>
      </div>

      <div aria-hidden className="ed-strikes">
        <div>
          {words}
          {words}
        </div>
      </div>

      <div className="ed-paper ed-tired-block">
        <h3 className="ed-opening ed-r">{manifesto.opening}</h3>
        <ol className="ed-tired">
          {manifesto.tiredOf.map((line) => (
            <li key={line} className="ed-r">
              {line}
            </li>
          ))}
        </ol>
      </div>

      <EdAuthority />
    </div>
  );
}

function EdAuthority() {
  const { hosts, editorial } = bootcamp;
  const { title, intro, photos } = editorial.authority;
  return (
    <section className="ed-dark ed-authority" data-phone-anchor="testimonios">
      <h3 className="ed-title ed-r">{title}</h3>
      <p className="ed-lead ed-r">{intro}</p>
      <div className="ed-duo">
        {photos.map((photo) => (
          <Shot key={photo.name} image={photo.image} name={photo.name} sizes="46vw" position="50% 40%" />
        ))}
      </div>
      <dl className="ed-results">
        {hosts.authority.items.map((item) => (
          <div key={item.value} className="ed-r">
            <dt>{item.value}</dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function EdPilar() {
  const { casePilar, editorial } = bootcamp;
  return (
    <div className="ed ed-raised ed-pilar">
      <p className="ed-kicker ed-r">{casePilar.kicker}</p>
      <h2 className="ed-title ed-r">{casePilar.title}</h2>
      <p className="ed-lead ed-r">{editorial.pilarLead}</p>
      <p className="ed-figure ed-r">
        <ClaimText id={casePilar.figure} />
      </p>
      <p className="ed-figure-note ed-r">{editorial.pilarPeriod}</p>
    </div>
  );
}

export function EdDays() {
  const { twoDays, editorial } = bootcamp;
  return (
    <div className="ed ed-days">
      <div className="ed-paper ed-days-head">
        <h2 className="ed-giant ed-r">
          {editorial.days.title.before} <em>{editorial.days.title.italic}</em>
        </h2>
        <p className="ed-lead ed-r">{twoDays.intro}</p>
        <ul className="ed-zones ed-r">
          {editorial.days.zones.map((zone) => (
            <li key={zone.place}>
              <Flag code={zone.flag} />
              <strong>{zone.time}</strong>
              {zone.place}
            </li>
          ))}
        </ul>
      </div>
      {twoDays.days.map((day, i) => {
        const dated = editorial.days.dates[i];
        return (
          <article key={day.number} className={`ed-day ${i === 0 ? "ed-dark" : "ed-paper"}`} data-phone-anchor={i === 1 ? "dia-2" : undefined}>
            <p aria-hidden className="ed-day-n ed-r">
              {dated.day}
              <small>{dated.month}</small>
            </p>
            <Shot image={dated.photo.image} name={dated.photo.name} sizes="86vw" className="ed-day-shot" position={i === 0 ? "50% 58%" : "50% 66%"} />
            <p className="ed-kicker ed-r">
              {day.number} · {dated.label}
            </p>
            <p className="ed-focus ed-r">{dated.focus}</p>
            <h3 className="ed-title ed-r">{day.title}</h3>
            <p className="ed-lead ed-r">{day.summary}</p>
            {dated.reveal && <p className="ed-reveal ed-r">{dated.reveal}</p>}
            <DayMore label={editorial.days.more}>
              <ul>
                {day.items.map((item, n) => (
                  <li key={n}>
                    <Rich paragraph={item} as="span" />
                  </li>
                ))}
              </ul>
            </DayMore>
          </article>
        );
      })}
    </div>
  );
}

export function EdOutcomes() {
  const { outcomes, editorial } = bootcamp;
  return (
    <div className="ed ed-paper ed-outcomes">
      <h2 className="ed-huge ed-r">{outcomes.title}</h2>
      <KitStack cards={editorial.kit.cards} />
      <p className="ed-kicker ed-r">{outcomes.intro}</p>
      <ol className="ed-gains">
        {editorial.gainsShown.map((i) => (
          <li key={outcomes.items[i].numeral} className="ed-r">
            <Print image={editorial.gains[i]} sizes="34vw" />
            <p>{outcomes.items[i].text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function EdHosts() {
  const { hosts, editorial } = bootcamp;
  const { lead } = editorial.hosts;
  return (
    <div className="ed ed-hosts">
      <div className="ed-dark ed-hosts-top">
        <div className="ed-hosts-shots">
          <Shot image={lead.image} name={lead.name} sizes="92vw" className="ed-hosts-lead" position="50% 46%" />
        </div>
        <h2 className="ed-title ed-names ed-r">
          {hosts.people[0].name}
          <br />
          <em>y</em> {hosts.people[1].name}
        </h2>
        <p className="ed-lead ed-r">
          {hosts.trackRecord.before}
          <ClaimText id={hosts.trackRecord.claim} />
          {hosts.trackRecord.after}
        </p>
        {hosts.paragraphs.map((paragraph) => (
          <p key={paragraph} className="ed-body ed-r">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export function EdEnroll() {
  const { investment } = bootcamp;
  return (
    <div className="ed ed-dark ed-enroll">
      <h2 className="ed-title ed-r">{investment.title}</h2>
    </div>
  );
}
