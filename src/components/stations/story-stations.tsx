import { bootcamp } from "@/content/bootcamp";
import { ClaimText, CtaButton, Print, Rich } from "@/components/editorial";
import { Piece, Station } from "@/components/board/primitives";
import { Scribble } from "@/components/os/glyphs";
import { MapCard } from "@/components/os/mobile-chrome";
import { CrumpleNote } from "@/components/crumple-note";
import { TechText } from "@/components/tech-text";
import { resolveClaim } from "@/lib/offer";
import type { Variant } from "@/content/types";
import { ManifestoBoard } from "./manifesto-board";
import { Flag } from "./flags";
import { EdAudience, EdAuthority, EdDays, EdManifesto, EdOutcomes, EdPilar } from "./phone-editorial";
import { EdHero, type AdsContext } from "./ads-hero";

export function HeroStation({ variant, ads }: { variant: Variant; ads?: AdsContext }) {
  const { hero, os } = bootcamp;
  const promiseLead = hero.promise.slice(0, hero.promise.lastIndexOf(hero.promiseHighlight));
  // The paid-traffic page is only ever read in one column: no board pieces, just the first three blocks.
  if (ads) {
    return (
      <Station index={0} titleId="hero-title" className="st-hero">
        <EdHero ads={ads} />
        <div className="ed">
          <EdAuthority ads />
        </div>
      </Station>
    );
  }
  return (
    <Station index={0} titleId="hero-title" className="st-hero">
      <Piece x={44} y={36} w={960} className="hero-top">
        <p className="eyebrow">{hero.eyebrow}</p>
        {variant === "current" && (
          <>
            <p className="hero-kicker">{hero.kicker}</p>
            <p className="hero-date">{hero.dateLine}</p>
          </>
        )}
      </Piece>
      <Piece x={40} y={74} w={970}>
        <h1 id="hero-title" className="hero-title">
          <span className="sr-only">{hero.programName}: </span>
          {hero.title.before}
          <em>{hero.title.italic}</em>
          {hero.title.after}
        </h1>
      </Piece>
      <Piece x={44} y={330} w={590}>
        <p className="hero-promise">
          {promiseLead}
          <span className="sr-only">{hero.promiseHighlight}</span>
        </p>
        <TechText text={hero.promiseHighlight} className="hero-tech" />
      </Piece>
      <Piece x={44} y={528} w={590} className="hero-cta">
        <CtaButton track="hero_cta_click" />
        <a href="#mapa" className="btn btn-line" data-track="hero_cta_click">
          {hero.secondaryCta}
        </a>
        <MapCard title={os.mapCard.title} text={os.mapCard.text} cta={os.mapCard.cta} />
      </Piece>
      <Piece x={690} y={334} w={306} as="aside" className="hero-facts">
        <p className="hero-format">
          {hero.format}
          <Scribble className="hero-scribble" />
        </p>
        <p>{hero.hosts}</p>
        <p>{hero.audience}</p>
        <p className="hero-filter">{hero.notBeginners}</p>
        <span className="sr-only">{os.liveBadge}</span>
      </Piece>
    </Station>
  );
}

export function AudienceStation({ variant }: { variant: Variant }) {
  const { audience } = bootcamp;
  const floor = resolveClaim(audience.floor);
  return (
    <Station index={1} titleId="audience-title" className="st-audience">
      {variant === "current" && <EdAudience />}
      <Piece x={36} y={36} w={1060}>
        <h2 id="audience-title" className="display-xl">
          {audience.title}
        </h2>
      </Piece>
      <Piece x={36} y={394} w={500}>
        <p className="lead">{audience.intro}</p>
      </Piece>
      <Piece x={610} y={376} w={470} r={-1.6} movable>
        <CrumpleNote text={audience.question} label={audience.crumpleLabel} className="paper-note note-pad note-question" />
      </Piece>

      <Piece x={1200} y={120} w={1120} h={680} as="div" className="fork-art">
        <svg viewBox="0 0 1120 680" aria-hidden fill="none">
          <path d="M0 340 H150 C230 340 240 170 322 170" className="fork-line" pathLength={1} />
          <path d="M150 340 C230 340 240 500 322 500" className="fork-line" pathLength={1} />
          <circle cx="150" cy="340" r="6" className="fork-dot" />
        </svg>
        <ul className="fork-labels">
          {audience.conflict.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </Piece>

      <Piece x={1236} y={350} w={230} as="aside" className="fork-note">
        <p>{audience.conflictNote}</p>
      </Piece>

      <Piece x={1530} y={136} w={780} as="div" className="fit-group">
        <h3>{audience.fitTitle}</h3>
        <ul>
          {audience.fit.map((item) => (
            <li key={item} className="paper-note fit-note" data-movable>
              {item}
            </li>
          ))}
        </ul>
      </Piece>

      <Piece x={1530} y={508} w={780} as="div" className="fit-group is-not">
        <h3>{audience.notFitTitle}</h3>
        <ul>
          {audience.notFit.map((item) => (
            <li key={item} className="nofit-card" data-movable>
              <span aria-hidden className="nofit-mark" />
              {item}
            </li>
          ))}
          {variant !== "current" && floor.state !== "fallback" && (
            <li className="nofit-card is-floor">
              <span aria-hidden className="nofit-mark" />
              <ClaimText id={audience.floor} />
            </li>
          )}
        </ul>
      </Piece>
    </Station>
  );
}

export function ManifestoStation({ variant }: { variant: Variant }) {
  const { manifesto, editorial } = bootcamp;
  const { market } = editorial.manifesto;
  const current = variant === "current";
  return (
    <Station index={2} titleId="manifesto-title" className="st-manifesto">
      {variant === "current" && <EdManifesto />}
      <ManifestoBoard
        strikes={manifesto.strikes}
        sortLabel={manifesto.sortLabel}
        unsortLabel={manifesto.unsortLabel}
        sortedTitle={manifesto.sortedTitle}
      >
        <h2 id="manifesto-title" className="eyebrow">
          {manifesto.title}
        </h2>
        {current && (
          <p className="board-newworld">
            <strong>{editorial.manifesto.newWorld.lead}</strong>{" "}
            <span className="board-beats">
              {market.beats.map((beat) => (
                <span key={beat}>{beat}</span>
              ))}
            </span>{" "}
            {editorial.manifesto.newWorld.text}
          </p>
        )}
        {current && <p className="board-thesis-pre">{market.thesisPre}</p>}
        <blockquote className="thesis">
          {manifesto.thesis.before}
          <mark>{manifesto.thesis.highlight}</mark>
          {manifesto.thesis.after}
        </blockquote>
        <p className="thesis-counter">{manifesto.counter}</p>
      </ManifestoBoard>

      <Piece x={1380} y={20} w={700} as="article" className="doc-dark tired">
        <h3>{manifesto.opening}</h3>
        <ul>
          {manifesto.tiredOf.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Piece>
      {current ? (
        <>
          <Piece x={2110} y={30} w={210} r={-1.4} movable as="figure" className="snap">
            <Print image={editorial.manifesto.thesis.image} sizes="210px" className="snap-photo-short" objectPosition="50% 30%" />
            <figcaption className="mono-note">{editorial.manifesto.thesis.name}</figcaption>
          </Piece>
          <Piece x={2340} y={150} w={200} r={1.6} movable as="figure" className="snap">
            <Print image={editorial.manifesto.balance.image} sizes="200px" className="snap-photo-short" objectPosition="50% 40%" />
            <figcaption className="mono-note">{editorial.manifesto.balance.name}</figcaption>
          </Piece>

          {/* The rest of the manifesto, on the next sheet of the same station. */}
          <Piece x={2700} y={60} w={520} className="board-contrasts">
            {market.contrasts.map(([one, other]) => (
              <p key={one}>
                {one}
                <em>{other}</em>
              </p>
            ))}
          </Piece>
          <Piece x={2700} y={452} w={500} r={-1} movable className="paper-note note-tape board-market-counter">
            <p>{market.counter}</p>
          </Piece>
          <Piece x={3330} y={40} w={600} className="board-promise">
            <p>{market.promise}</p>
          </Piece>
          <Piece x={3330} y={258} w={560} as="ul" className="board-lines">
            {market.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </Piece>
          <Piece x={3330} y={440} w={600} as="article" className="doc-dark board-close">
            <p>
              {market.close[0]}
              <strong>{market.close[1]}</strong>
            </p>
          </Piece>
        </>
      ) : (
        <>
          <Piece x={2130} y={66} w={430} r={1} movable className="paper-note note-tape manifesto-note">
            <p>{manifesto.paragraph}</p>
          </Piece>
          <Piece x={2130} y={372} w={430}>
            <p className="body-soft">{manifesto.closing}</p>
          </Piece>
        </>
      )}
    </Station>
  );
}

export function PilarStation({ variant }: { variant: Variant }) {
  const { casePilar, editorial } = bootcamp;
  const figure = resolveClaim(casePilar.figure);
  const current = variant === "current";
  const name = current ? editorial.pilarName : casePilar.folderName;
  return (
    <Station index={3} titleId="pilar-title" className="st-pilar">
      {variant === "current" && <EdPilar />}
      <Piece x={36} y={40} w={640}>
        <p className="eyebrow">{casePilar.kicker}</p>
        <h2 id="pilar-title" className="display-lg">
          {casePilar.title}
        </h2>
      </Piece>
      <Piece x={36} y={386} w={600}>
        <p className="pilar-figure">
          <ClaimText id={casePilar.figure} />
        </p>
        {current ? (
          <>
            <p className="lead">
              <em>{editorial.pilarRole}</em> {editorial.pilarLead} <ClaimText id={casePilar.figure} /> {editorial.pilarPeriod}.
            </p>
            <p className="body-soft">{editorial.pilarPromise}</p>
          </>
        ) : (
          <>
            <p className="mono-note">{casePilar.figureCaption}</p>
            <p className="lead">{figure.state === "fallback" ? casePilar.lead.fallback : casePilar.lead.withClaim}</p>
          </>
        )}
      </Piece>

      <Piece x={716} y={72} w={460} h={540} className="folder ph-keep">
        <a href="#expediente" aria-label={`${casePilar.folderCta}: ${casePilar.folderLabel}`}>
          <span className="folder-back" />
          <span className="folder-sheet folder-sheet-a" />
          <span className="folder-sheet folder-sheet-b">
            <Print image={casePilar.image} sizes="150px" className="folder-photo" />
          </span>
          <span className="folder-front">
            <span className="folder-tab">{casePilar.folderLabel}</span>
            <span className="folder-head">
              <span>{casePilar.fileTitle}</span>
              <span>{casePilar.kicker}</span>
            </span>
            <span className="folder-name">{name}</span>
            <span className="folder-stamp">
              <svg viewBox="0 0 120 120" aria-hidden>
                <defs>
                  <path id="pilar-stamp-ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
                </defs>
                <circle cx="60" cy="60" r="58" />
                <circle cx="60" cy="60" r="35" />
                <text>
                  <textPath href="#pilar-stamp-ring" textLength="285">
                    {casePilar.stamp}
                  </textPath>
                </text>
                <path d="M47 61l9 9 18-20" />
              </svg>
            </span>
            <span className="folder-meta">
              <span>
                <small>{casePilar.folderResultLabel}</small>
                <ClaimText id={casePilar.figure} />
              </span>
              <span>
                <small>{casePilar.folderScopeLabel}</small>
                {casePilar.folderScope}
              </span>
            </span>
            <span className="folder-cta">
              {casePilar.folderCta}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </span>
        </a>
      </Piece>

      <Piece x={1280} y={20} w={600} as="article" id="expediente" className="doc-paper file-doc ph-keep">
        <header className="file-head">
          <p className="eyebrow">{casePilar.fileTitle}</p>
          <p className="file-case">{name}</p>
          <p className="file-tag">{casePilar.kicker}</p>
        </header>
        <div aria-hidden className="file-clip">
          <svg className="paper-clip" viewBox="0 0 20 54" fill="none" aria-hidden>
            <path d="M14.5 13v28a5.5 5.5 0 0 1-11 0V9a7 7 0 0 1 14 0v31" />
          </svg>
          <Print image={casePilar.image} sizes="120px" className="clip-photo" />
        </div>
        <p className="file-intro">{current ? editorial.pilarFile.intro : casePilar.intro}</p>
        <ol className={current ? "file-layers ed-r" : "file-layers"}>
          {(current ? editorial.pilarFile.layers : casePilar.layers).map((layer, i) => (
            <li key={layer}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {layer}
            </li>
          ))}
        </ol>
        {current && <p className="file-share">{editorial.pilarFile.share}</p>}
      </Piece>

      <Piece x={current ? 1818 : 1930} y={current ? -46 : 16} w={170} r={current ? 4 : -2.5} movable className="clip-print">
        <svg className="paper-clip" viewBox="0 0 20 54" fill="none" aria-hidden>
          <path d="M14.5 13v28a5.5 5.5 0 0 1-11 0V9a7 7 0 0 1 14 0v31" />
        </svg>
        <Print image={casePilar.image} sizes="170px" className="clip-photo" />
      </Piece>

      {current && (
        <Piece x={1924} y={262} w={356} className="file-review board-share">
          <p>{editorial.pilarFile.share}</p>
        </Piece>
      )}

      {!current && (
        <Piece x={1914} y={236} w={356} className="file-review ph-keep">
          <h3>{casePilar.reviewTitle}</h3>
          <ul>
            {casePilar.review.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="body-soft">{casePilar.closing}</p>
        </Piece>
      )}
    </Station>
  );
}

const ZONES_Y = 412;

export function TwoDaysStation({ variant }: { variant: Variant }) {
  const { twoDays, editorial } = bootcamp;
  const [dayOne, dayTwo] = twoDays.days;
  const current = variant === "current";
  const [dateOne, dateTwo] = editorial.days.dates;
  return (
    <Station index={4} titleId="days-title" className="st-days">
      {variant === "current" && <EdDays />}
      <Piece x={36} y={40} w={320}>
        <h2 id="days-title" className="display-lg">
          {twoDays.title}
        </h2>
        {current ? (
          <>
            <p className="board-days-question">{editorial.days.question}</p>
            <p className="body-soft">{editorial.days.intro}</p>
          </>
        ) : (
          <p className="lead">{twoDays.intro}</p>
        )}
      </Piece>
      {current && (
        <Piece x={36} y={ZONES_Y} w={320} as="ul" className="board-zones">
          {editorial.days.zones.map((zone) => (
            <li key={zone.place}>
              <Flag code={zone.flag} />
              <strong>{zone.time}</strong>
              {zone.place}
            </li>
          ))}
        </Piece>
      )}
      <Piece x={60} y={494} w={210} r={-1.5} movable as="figure" className="snap">
        <Print image={twoDays.image} sizes="230px" className="snap-photo-short" objectPosition="30% 70%" />
      </Piece>

      <Piece x={390} y={20} w={780} h={660} as="article" className="day doc-dark">
        <header>
          <span className="day-n">1</span>
          <div>
            <p className="eyebrow">{current ? `${dayOne.number} · ${dateOne.label}` : dayOne.number}</p>
            <h3>{dayOne.title}</h3>
            {current && <p className="board-focus">{dateOne.focus}</p>}
          </div>
        </header>
        <p className="day-summary">{dayOne.summary}</p>
        <ul>
          {dayOne.items.map((item, i) => (
            <li key={i}>
              <Rich paragraph={item} as="span" />
            </li>
          ))}
        </ul>
      </Piece>

      <Piece x={1320} y={20} w={780} h={660} as="article" id="dia-2" className="day doc-paper">
        <header>
          <span className="day-n">2</span>
          <div>
            <p className="eyebrow">{current ? `${dayTwo.number} · ${dateTwo.label}` : dayTwo.number}</p>
            <h3>{dayTwo.title}</h3>
            {current && <p className="board-focus">{dateTwo.focus}</p>}
          </div>
        </header>
        <p className="day-summary">{dayTwo.summary}</p>
        <ul>
          {dayTwo.items.map((item, i) => (
            <li key={i}>
              <Rich paragraph={item} as="span" />
            </li>
          ))}
        </ul>
      </Piece>

      {current && dateTwo.reveal ? (
        <Piece x={2180} y={226} w={320} as="aside" className="board-reveal" movable>
          <p>{dateTwo.reveal.before}</p>
          <strong>{dateTwo.reveal.figure}</strong>
          <p>{dateTwo.reveal.after}</p>
        </Piece>
      ) : (
        <Piece x={2150} y={80} w={320} as="aside" className="decisions paper-note note-pad" movable>
          <h3>{twoDays.decisionsTitle}</h3>
          <ol>
            {twoDays.decisions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Piece>
      )}
    </Station>
  );
}

const OUTCOME_CARD = { w: 360, h: 236 };
const OUTCOME_POSITIONS: [number, number][] = [
  [20, 158],
  [250, 470],
  [480, 158],
  [710, 470],
  [940, 158],
];

/** The current page's kit: four passes, taller, so the longest text fits. */
const KIT_CARD = { w: 360, h: 290 };
const KIT_POSITIONS: [number, number][] = [
  [20, 132],
  [250, 474],
  [480, 132],
  [710, 474],
];

/** The three outcomes the phone shows, on the second sheet of the station. */
const GAIN_POSITIONS: [number, number][] = [
  [1460, 150],
  [1810, 300],
  [2160, 150],
];
const GAIN_CARD = { w: 300 };

/** The line leaves each card and lands on the next one, across the gap between rows. */
const zigzag = (positions = OUTCOME_POSITIONS, card = OUTCOME_CARD) => {
  const dock = positions.map(([x, y], i) => ({
    x: x + card.w / 2,
    y: i % 2 === 0 ? y + card.h : y,
  }));
  const bend = 56;
  return dock.reduce((path, to, i) => {
    if (i === 0) return `M${to.x} ${to.y}`;
    const from = dock[i - 1];
    const down = to.y > from.y ? 1 : -1;
    return `${path} C${from.x} ${from.y + bend * down} ${to.x} ${to.y - bend * down} ${to.x} ${to.y}`;
  }, "");
};

export function OutcomesStation({ variant }: { variant: Variant }) {
  const { outcomes, editorial } = bootcamp;
  const current = variant === "current";
  return (
    <Station index={5} titleId="outcomes-title" className="st-outcomes">
      {variant === "current" && <EdOutcomes />}
      <Piece x={0} y={0} w={1320} h={780} className="outcome-lines">
        <svg viewBox="0 0 1320 780" aria-hidden fill="none">
          {current ? (
            <>
              <path d={zigzag(KIT_POSITIONS, KIT_CARD)} pathLength={1} />
              {KIT_POSITIONS.map(([x, y], i) => (
                <circle key={x} cx={x + KIT_CARD.w / 2} cy={i % 2 === 0 ? y + KIT_CARD.h : y} r="5" />
              ))}
            </>
          ) : (
            <>
              <path d={zigzag()} pathLength={1} />
              {OUTCOME_POSITIONS.map(([x, y], i) => (
                <circle key={x} cx={x + OUTCOME_CARD.w / 2} cy={i % 2 === 0 ? y + OUTCOME_CARD.h : y} r="5" />
              ))}
            </>
          )}
        </svg>
      </Piece>
      <Piece x={36} y={22} w={820}>
        <h2 id="outcomes-title" className="display-md outcomes-title">
          {current ? editorial.kit.title : outcomes.title}
        </h2>
        <p className="mono-note outcomes-intro">{outcomes.intro}</p>
      </Piece>
      {current ? (
        <ol className="outcome-list">
          {editorial.kit.cards.map((card, i) => {
            const [x, y] = KIT_POSITIONS[i];
            return (
              <li key={card.title}>
                <Piece x={x} y={y} w={KIT_CARD.w} h={KIT_CARD.h} className="outcome board-kit">
                  <span className="mono-note">{card.tag}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </Piece>
              </li>
            );
          })}
        </ol>
      ) : (
      <ol className="outcome-list">
        {outcomes.items.map((item, i) => {
          const [x, y] = OUTCOME_POSITIONS[i];
          return (
            <li key={item.numeral}>
              <Piece x={x} y={y} w={OUTCOME_CARD.w} h={OUTCOME_CARD.h} className="outcome">
                <span aria-hidden className="outcome-n">
                  {item.numeral}
                </span>
                <p>{item.text}</p>
              </Piece>
            </li>
          );
        })}
      </ol>
      )}
      {current && (
        <ol className="outcome-list board-gains">
          {editorial.gainsShown.map((itemIndex, n) => {
            const [x, y] = GAIN_POSITIONS[n];
            const item = outcomes.items[itemIndex];
            return (
              <li key={item.numeral}>
                <Piece x={x} y={y} w={GAIN_CARD.w} className="outcome board-gain">
                  <Print image={editorial.gains[itemIndex]} sizes="300px" className="board-gain-print" objectPosition="50% 40%" />
                  <span aria-hidden className="outcome-n">
                    {item.numeral}
                  </span>
                  <p>{item.text}</p>
                </Piece>
              </li>
            );
          })}
        </ol>
      )}
      <Piece x={1104} y={500} w={196} r={1.4} movable as="figure" className="snap note-tape">
        <Print image={outcomes.photo} sizes="196px" className="snap-photo-short" objectPosition="50% 62%" />
      </Piece>
    </Station>
  );
}
