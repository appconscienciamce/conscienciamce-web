import { bootcamp } from "@/content/bootcamp";
import { ClaimText, Print, Rich } from "@/components/editorial";
import type { Img } from "@/content/types";
import { resolveClaim } from "@/lib/offer";
import { KitStack } from "./kit-stack";

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
  const { headline, photo } = editorial.audience;
  const floor = resolveClaim(audience.floor);
  return (
    <div className="ed ed-paper ed-audience">
      <h2 className="ed-huge ed-r">
        {headline.before}
        <em>{headline.italic}</em>
        {headline.after}
      </h2>
      <Shot image={photo.image} name={photo.name} sizes="70vw" className="ed-audience-shot" position="50% 62%" />
      <p className="ed-lead ed-r">{audience.intro}</p>
      <section className="ed-fit ed-r">
        <h3>{audience.fitTitle}</h3>
        <ul>
          {audience.fit.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="ed-nofit ed-r">
        <h3>{audience.notFitTitle}</h3>
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
  const { manifesto, editorial } = bootcamp;
  const { inline, tired } = editorial.manifesto;
  const words = manifesto.strikes.map((word) => <span key={word}>{word}</span>);
  return (
    <div className="ed ed-dark ed-manifesto">
      <h2 className="ed-thesis ed-r">
        {manifesto.thesis.before}
        <span aria-hidden className="ed-chip">
          <Print image={inline} sizes="110px" />
        </span>{" "}
        <mark>{manifesto.thesis.highlight}</mark>
        {manifesto.thesis.after}
      </h2>
      <p className="ed-counter ed-r">{manifesto.counter}</p>

      <div aria-hidden className="ed-strikes">
        <div>
          {words}
          {words}
        </div>
      </div>

      <h3 className="ed-opening ed-r">{manifesto.opening}</h3>
      <Shot image={tired.image} name={tired.name} sizes="62vw" className="ed-tired-shot" />
      <ol className="ed-tired">
        {manifesto.tiredOf.map((line) => (
          <li key={line} className="ed-r">
            {line}
          </li>
        ))}
      </ol>

      <blockquote className="ed-note ed-r">{manifesto.paragraph}</blockquote>
      <p className="ed-lead ed-r">{manifesto.closing}</p>
    </div>
  );
}

export function EdPilar() {
  const { casePilar } = bootcamp;
  const figure = resolveClaim(casePilar.figure);
  return (
    <div className="ed ed-raised ed-pilar">
      <p className="ed-kicker ed-r">{casePilar.kicker}</p>
      <h2 className="ed-title ed-r">{casePilar.title}</h2>
      <p className="ed-figure ed-r">
        <ClaimText id={casePilar.figure} />
      </p>
      <p className="ed-lead ed-r">{figure.state === "fallback" ? casePilar.lead.fallback : casePilar.lead.withClaim}</p>
    </div>
  );
}

export function EdDays() {
  const { twoDays, editorial } = bootcamp;
  return (
    <div className="ed ed-days">
      <div className="ed-dark ed-days-head">
        <h2 className="ed-giant ed-r">
          {editorial.days.title.before} <em>{editorial.days.title.italic}</em>
        </h2>
        <p className="ed-lead ed-r">{twoDays.intro}</p>
        <p className="ed-kicker ed-r">{editorial.days.schedule}</p>
      </div>
      {twoDays.days.map((day, i) => {
        const dated = editorial.days.dates[i];
        return (
          <article key={day.number} className={`ed-day ${i === 0 ? "ed-dark" : "ed-paper"}`} data-phone-anchor={i === 1 ? "dia-2" : undefined}>
            <p aria-hidden className="ed-day-n ed-r">
              {dated.day}
            </p>
            <Shot image={dated.photo.image} name={dated.photo.name} sizes="64vw" className="ed-day-shot" />
            <p className="ed-kicker ed-r">
              {day.number} · {dated.label}
            </p>
            <h3 className="ed-title ed-r">{day.title}</h3>
            <p className="ed-lead ed-r">{day.summary}</p>
            <details className="ed-more ed-r">
              <summary>{editorial.days.more}</summary>
              <ul>
                {day.items.map((item, n) => (
                  <li key={n}>
                    <Rich paragraph={item} as="span" />
                  </li>
                ))}
              </ul>
            </details>
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
        {outcomes.items.map((item, i) => (
          <li key={item.numeral} className="ed-r">
            <Print image={editorial.gains[i]} sizes="34vw" />
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function EdHosts() {
  const { hosts, editorial } = bootcamp;
  const { lead, side, trio, numbers } = editorial.hosts;
  return (
    <div className="ed ed-hosts">
      <div className="ed-dark ed-hosts-top">
        <div className="ed-hosts-shots">
          <Shot image={lead.image} name={lead.name} sizes="66vw" className="ed-hosts-lead" />
          <Shot image={side.image} name={side.name} sizes="44vw" className="ed-hosts-side" />
        </div>
        <h2 className="ed-huge ed-r">
          {hosts.people[0].name} <em>y</em> {hosts.people[1].name}
        </h2>
        <p className="ed-lead ed-r">
          {hosts.trackRecord.before}
          <ClaimText id={hosts.trackRecord.claim} />
          {hosts.trackRecord.after}
        </p>
        <Shot image={trio.image} name={trio.name} sizes="58vw" className="ed-hosts-trio" />
        {hosts.paragraphs.map((paragraph) => (
          <p key={paragraph} className="ed-body ed-r">
            {paragraph}
          </p>
        ))}
      </div>
      <section className="ed-paper ed-numbers" data-phone-anchor="resultados">
        <h3 className="ed-kicker ed-r">{numbers}</h3>
        <dl>
          {hosts.authority.items.map((item) => (
            <div key={item.value} className="ed-r">
              <dt>{item.value}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

export function EdEnroll() {
  const { investment, editorial } = bootcamp;
  return (
    <div className="ed ed-dark ed-enroll">
      <h2 className="ed-title ed-r">{investment.title}</h2>
      <p className="ed-seats ed-r">
        <strong>{editorial.enroll.seats}</strong>
        {editorial.enroll.seatsText}
      </p>
    </div>
  );
}
