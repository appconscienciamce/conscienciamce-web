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
import { EdAudience, EdDays, EdManifesto, EdOutcomes, EdPilar } from "./phone-editorial";
import { CheckList } from "./phone-touch";

export function HeroStation({ variant }: { variant: Variant }) {
  const { hero, os } = bootcamp;
  const promiseLead = hero.promise.slice(0, hero.promise.lastIndexOf(hero.promiseHighlight));
  return (
    <Station index={0} titleId="hero-title" className="st-hero">
      <Piece x={44} y={36} w={950}>
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
          {floor.state !== "fallback" && (
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
  const { manifesto } = bootcamp;
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
      <Piece x={2130} y={66} w={430} r={1} movable className="paper-note note-tape manifesto-note">
        <p>{manifesto.paragraph}</p>
      </Piece>
      <Piece x={2130} y={372} w={430}>
        <p className="body-soft">{manifesto.closing}</p>
      </Piece>
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
        <p className="mono-note">{casePilar.figureCaption}</p>
        <p className="lead">{figure.state === "fallback" ? casePilar.lead.fallback : casePilar.lead.withClaim}</p>
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
        <p className="file-intro">{casePilar.intro}</p>
        <ol className={current ? "file-layers ed-r" : "file-layers"}>
          {casePilar.layers.map((layer, i) => (
            <li key={layer}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {layer}
            </li>
          ))}
        </ol>
      </Piece>

      <Piece x={1930} y={16} w={170} r={-2.5} movable className="clip-print">
        <svg className="paper-clip" viewBox="0 0 20 54" fill="none" aria-hidden>
          <path d="M14.5 13v28a5.5 5.5 0 0 1-11 0V9a7 7 0 0 1 14 0v31" />
        </svg>
        <Print image={casePilar.image} sizes="170px" className="clip-photo" />
      </Piece>

      <Piece x={1914} y={236} w={356} className="file-review ph-keep">
        <h3>{casePilar.reviewTitle}</h3>
        {current ? (
          <CheckList items={casePilar.review} />
        ) : (
          <ul>
            {casePilar.review.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <p className="body-soft">{casePilar.closing}</p>
      </Piece>
    </Station>
  );
}

export function TwoDaysStation({ variant }: { variant: Variant }) {
  const { twoDays } = bootcamp;
  const [dayOne, dayTwo] = twoDays.days;
  return (
    <Station index={4} titleId="days-title" className="st-days">
      {variant === "current" && <EdDays />}
      <Piece x={36} y={40} w={320}>
        <h2 id="days-title" className="display-lg">
          {twoDays.title}
        </h2>
        <p className="lead">{twoDays.intro}</p>
      </Piece>
      <Piece x={60} y={420} w={230} r={-1.5} movable as="figure" className="snap">
        <Print image={twoDays.image} sizes="230px" className="snap-photo-short" objectPosition="30% 70%" />
      </Piece>

      <Piece x={390} y={20} w={780} h={660} as="article" className="day doc-dark">
        <header>
          <span className="day-n">1</span>
          <div>
            <p className="eyebrow">{dayOne.number}</p>
            <h3>{dayOne.title}</h3>
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
            <p className="eyebrow">{dayTwo.number}</p>
            <h3>{dayTwo.title}</h3>
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

      <Piece x={2150} y={80} w={320} as="aside" className="decisions paper-note note-pad" movable>
        <h3>{twoDays.decisionsTitle}</h3>
        <ol>
          {twoDays.decisions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Piece>
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

/** The line leaves each card and lands on the next one, across the gap between rows. */
const zigzag = () => {
  const dock = OUTCOME_POSITIONS.map(([x, y], i) => ({
    x: x + OUTCOME_CARD.w / 2,
    y: i % 2 === 0 ? y + OUTCOME_CARD.h : y,
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
  const { outcomes } = bootcamp;
  return (
    <Station index={5} titleId="outcomes-title" className="st-outcomes">
      {variant === "current" && <EdOutcomes />}
      <Piece x={0} y={0} w={1320} h={780} className="outcome-lines">
        <svg viewBox="0 0 1320 780" aria-hidden fill="none">
          <path d={zigzag()} pathLength={1} />
          {OUTCOME_POSITIONS.map(([x, y], i) => (
            <circle key={x} cx={x + OUTCOME_CARD.w / 2} cy={i % 2 === 0 ? y + OUTCOME_CARD.h : y} r="5" />
          ))}
        </svg>
      </Piece>
      <Piece x={36} y={22} w={820}>
        <h2 id="outcomes-title" className="display-md outcomes-title">
          {outcomes.title}
        </h2>
        <p className="mono-note outcomes-intro">{outcomes.intro}</p>
      </Piece>
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
      <Piece x={1104} y={500} w={196} r={1.4} movable as="figure" className="snap note-tape">
        <Print image={outcomes.photo} sizes="196px" className="snap-photo-short" objectPosition="50% 62%" />
      </Piece>
    </Station>
  );
}
