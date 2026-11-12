import Image from "@/components/safe-image";
import { bootcamp } from "@/content/bootcamp";
import { ClaimText, Print, Rich } from "@/components/editorial";
import type { Img } from "@/content/types";
import { resolveClaim } from "@/lib/offer";
import { KitStack } from "./kit-stack";
import { Flag } from "./flags";
import { DayMore } from "./phone-touch";
import { VideoCard } from "@/components/video-card";
import { VerifiedBadge } from "@/components/verified-badge";

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
  return (
    <div className="ed ed-paper ed-audience">
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
        </ul>
      </section>
    </div>
  );
}

export function EdManifesto() {
  const { manifesto, editorial } = bootcamp;
  const { thesis, balance, market, promiseShot, promiseTemple } = editorial.manifesto;
  const words = manifesto.strikes.map((word) => <span key={word}>{word}</span>);
  return (
    <div className="ed ed-manifesto">
      <div className="ed-dark ed-thesis-block">
        <p className="ed-market-lead ed-r">{market.lead}</p>
        <p className="ed-beats">
          {market.beats.map((beat) => (
            <span key={beat} className="ed-r">
              {beat}
            </span>
          ))}
        </p>
        <Shot image={balance.image} name={balance.name} sizes="60vw" className="ed-balance-shot" position="50% 46%" />
        <p className="ed-market ed-r">{market.text}</p>
        {market.contrasts.map(([one, other]) => (
          <p key={one} className="ed-contrast ed-r">
            {one}
            <em>{other}</em>
          </p>
        ))}

        <p className="ed-thesis-pre ed-r">{market.thesisPre}</p>
        <h2 className="ed-thesis ed-r">
          {market.thesis.before}
          <mark>{market.thesis.highlight}</mark>
          {market.thesis.after}
        </h2>
        <Shot image={thesis.image} name={thesis.name} sizes="92vw" className="ed-thesis-shot" position="50% 24%" />
        <p className="ed-counter ed-r">{market.counter}</p>
      </div>

      {/* The two pictures sit on the seam between the dark and the paper. */}
      <div className="ed-seam">
        <div className="ed-duo ed-promise-duo">
          <Shot image={promiseShot.image} name={promiseShot.name} sizes="46vw" position="50% 62%" />
          <Shot image={promiseTemple.image} name={promiseTemple.name} sizes="46vw" position="50% 100%" />
        </div>
      </div>

      <div className="ed-paper ed-promise-block">
        <p className="ed-market-lead ed-promise ed-r">{market.promise}</p>
        {market.lines.map((line) => (
          <p key={line} className="ed-market ed-r">
            {line}
          </p>
        ))}
        <p className="ed-close ed-r">
          {market.close[0]}
          <strong>{market.close[1]}</strong>
        </p>
      </div>

      <div aria-hidden className="ed-strikes">
        <div>
          {words}
          {words}
        </div>
      </div>

      <EdAuthority />

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
    </div>
  );
}

export function EdAuthority() {
  const { hosts, editorial } = bootcamp;
  const { title, intro, photos, proof } = editorial.authority;
  return (
    <section className="ed-dark ed-authority" data-phone-anchor="testimonios">
      <h3 className="ed-title ed-r">{title}</h3>
      {intro.map((line) => (
        <p key={line} className="ed-lead ed-r">
          {line}
        </p>
      ))}
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
            {item.faces && (
              <dd className="ed-faces">
                {item.faces.map((face) => (
                  <span key={face.name} className="ed-face">
                    <span className="ed-face-pic">
                      {face.image ? (
                        <Image src={face.image.src!} alt="" width={96} height={96} quality={90} />
                      ) : (
                        <b aria-hidden>{face.name.charAt(0)}</b>
                      )}
                      <VerifiedBadge />
                    </span>
                    <small>{face.name}</small>
                  </span>
                ))}
              </dd>
            )}
          </div>
        ))}
      </dl>
      <div className="ed-proof ed-r">
        <p className="ed-proof-lead">{proof.lead}</p>
        <VideoCard name={proof.name} videoId={proof.videoId} start={proof.start} closeLabel={bootcamp.os.closeWindow} caption={false} windowTitle={proof.window} playLabel={proof.play} />
      </div>
    </section>
  );
}

/** The paid-traffic page keeps only the core of the manifesto: the thesis and its answer. */
export function EdThesis() {
  const { editorial } = bootcamp;
  const { thesis, market } = editorial.manifesto;
  return (
    <div className="ed ed-manifesto">
      <div className="ed-dark ed-thesis-block">
        <p className="ed-thesis-pre ed-r">{market.thesisPre}</p>
        <h2 className="ed-thesis ed-r">
          {market.thesis.before}
          <mark>{market.thesis.highlight}</mark>
          {market.thesis.after}
        </h2>
        <Shot image={thesis.image} name={thesis.name} sizes="92vw" className="ed-thesis-shot" position="50% 24%" />
        <p className="ed-counter ed-r">{market.counter}</p>
      </div>
    </div>
  );
}

export function EdPilar() {
  const { casePilar, editorial } = bootcamp;
  return (
    <div className="ed ed-raised ed-pilar">
      <p className="ed-kicker ed-r">{casePilar.kicker}</p>
      <h2 className="ed-title ed-r">{casePilar.title}</h2>
      <p className="ed-pilar-role ed-r">{editorial.pilarRole}</p>
      <p className="ed-lead ed-r">{editorial.pilarLead}</p>
      <p className="ed-figure ed-r">
        <ClaimText id={casePilar.figure} />
      </p>
      <p className="ed-figure-note ed-r">{editorial.pilarPeriod}</p>
      <p className="ed-lead ed-pilar-promise ed-r">{editorial.pilarPromise}</p>
    </div>
  );
}

export function EdDays() {
  const { twoDays, editorial } = bootcamp;
  return (
    <div className="ed ed-days">
      <div className="ed-paper ed-days-head">
        <p className="ed-days-question ed-r">{editorial.days.question}</p>
        <h2 className="ed-giant ed-r">
          {editorial.days.title.before} <em>{editorial.days.title.italic}</em>
        </h2>
        <p className="ed-lead ed-r">{editorial.days.intro}</p>
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
            <Shot image={dated.photo.image} name={dated.photo.name} sizes="86vw" className="ed-day-shot" position={i === 0 ? "50% 40%" : "50% 66%"} />
            <p className="ed-kicker ed-r">
              {day.number} · {dated.label}
            </p>
            <p className="ed-focus ed-r">{dated.focus}</p>
            <h3 className="ed-title ed-r">{day.title}</h3>
            <p className="ed-lead ed-r">{day.summary}</p>
            {dated.reveal && (
              <p className="ed-reveal ed-r">
                {dated.reveal.before}
                <strong>{dated.reveal.figure}</strong>
                {dated.reveal.after}
              </p>
            )}
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
      <h2 className="ed-huge ed-r">{editorial.kit.title}</h2>
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
          <Shot image={lead.image} name={lead.name} sizes="92vw" className="ed-hosts-lead" position="50% 40%" />
        </div>
        <h2 className="ed-title ed-names ed-r">
          {hosts.people[0].name}
          <br />
          <em>y</em> {hosts.people[1].name}
        </h2>
        {editorial.hosts.philosophy.map((paragraph, i) => (
          <p key={paragraph} className={`${i === 0 ? "ed-lead" : "ed-body"} ed-r`}>
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
