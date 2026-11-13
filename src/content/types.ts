/**
 * Content model for the bootcamp landing.
 *
 * Every string a reader sees lives in `bootcamp.ts`. Components only decide
 * how it looks. Editorial controls (status, claims, price, logistics, checkout)
 * live in `OfferConfig` so a reviewer can approve a launch without touching UI.
 */

/** `draft` renders pending markers; `approved` hides anything not approved. */
export type OfferStatus = "draft" | "approved";

/**
 * A factual claim (revenue, audience size, prices of other services).
 * Shown in production only when approved. In draft it renders with a
 * visible "pending" marker so reviewers can see what still needs proof.
 */
export interface Claim {
  text: string;
  /** Safe replacement used in production while the claim is not approved. */
  fallback: string;
  /** What has to be checked before approving it. */
  needs: string;
}

export type ClaimId =
  | "salesTrackRecord"
  | "millionsInSales"
  | "pilarRevenue"
  | "oneOnOneRange"
  | "revenueFloor"
  | "santiagoMonthly";

/** A logistic detail. `value: null` means "not decided yet". */
export interface Detail {
  label: string;
  value: string | null;
  approved: boolean;
}

export interface OfferConfig {
  status: OfferStatus;
  approvedClaims: ClaimId[];
  price: { currency: "USD"; amount: number; label: string; approved: boolean };
  /** Format, dates, schedule, platform, recording. Rendered in this order. */
  logistics: Detail[];
  /**
   * Real checkout URL. While `null`, every CTA scrolls to the
   * "registration opening soon" notice instead of a fake purchase.
   */
  checkoutUrl: string | null;
  /** The live days, as calendar dates in Buenos Aires (YYYY-MM-DD). The system bar counts down to them. */
  eventDates: { start: string; end: string };
}

export interface Seo {
  title: string;
  description: string;
  siteName: string;
  url: string | null;
  ogImage: string | null;
  locale: string;
}

export interface Chapter {
  id: string;
  number: string;
  label: string;
}

export type Inline = string | { strong: string };
export type RichParagraph = Inline[];

/** Image slot. `src: null` renders a labelled placeholder, never a stand-in face. */
/** Which version of the page: the current one at `/`, or the previous one, kept at `/evento`. */
export type Variant = "classic" | "current";

export interface Img {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** Placeholder label while `src` is null. */
  pendingLabel?: string;
}

/** All the fixed labels of the operating system: chrome, controls, hints. */
export interface OsCopy {
  nav: { label: string; href: string; chapters?: boolean; items?: { label: string; href: string }[] }[];
  navLabel: string;
  sound: { label: string; track: string; play: string; pause: string; playing: string; paused: string; volume: string };
  liveBadge: string;
  /** The days left until the bootcamp, where the clock is. Singular and plural, and the live days. */
  countdown: { dates: string; left: string; leftOne: string; unit: string; unitOne: string; today: string; day: string };
  windowTitle: string;
  openMap: string;
  resume: string;
  close: string;
  minimize: string;
  maximize: string;
  restore: string;
  guided: string;
  explore: string;
  backToTour: string;
  continueFrom: string;
  exploreHint: string;
  chapter: string;
  prev: string;
  next: string;
  index: string;
  hideIndex: string;
  minimap: string;
  zoomIn: string;
  zoomOut: string;
  zoomReset: string;
  fit: string;
  closeMap: string;
  back: string;
  readHere: string;
  readHereLabel: string;
  mapHint: string;
  chaptersLabel: string;
  phone: {
    heroWindow: string;
    next: string;
    apps: { para: string; manifesto: string; pilar: string; file: string; days: string; outcomes: string; hosts: string; testimonials: string; enroll: string };
  };
  mapCard: { title: string; text: string; cta: string; full: string };
  skip: string;
  closeWindow: string;
}

/** Museum wall-label caption. */
export interface WallLabel {
  title: string;
  meta: string;
}

export interface BootcampContent {
  offer: OfferConfig;
  seo: Seo;
  claims: Record<ClaimId, Claim>;
  chapters: Chapter[];
  brand: { name: string; mark: Img; wordmark: Img };
  cta: { label: string; shortLabel: string; pendingNoticeTitle: string; pendingNoticeBody: string };
  hero: {
    eyebrow: string;
    kicker: string;
    dateLine: string;
    programName: string;
    title: { before: string; italic: string; after: string };
    promise: string;
    /** Closing words of the promise, set as the interactive line. */
    promiseHighlight: string;
    format: string;
    hosts: string;
    audience: string;
    notBeginners: string;
    secondaryCta: string;
  };
  /** Only the paid-traffic page (`/v2`) reads this. */
  ads: {
    /** Who the page is for, said once near the top. */
    qualifier: string;
    /** The proof line under the title, in two halves. */
    proof: { figure: string; case: string };
    /** Label beside the stacked faces of the people the team works with. */
    facesLabel: string;
    /** Joins the ticket button label and the price: "Quiero participar · USD 36,90". */
    ctaJoin: string;
    /** The headline: what is promised, in one sentence. */
    promise: string;
    /** The smaller paragraph under the headline. `leadHighlight` is its tail set in italics. */
    lead: string;
    leadHighlight: string;
    /** The date chip: "17 y 18 nov". */
    dateChip: string;
    /** The countdown chip, by days left. `{n}` is the number of days. */
    dateLine: { soon: string; tomorrow: string; today: string; dayTwo: string };
    /** Intro of "who we are" on this page, where the hosts section no longer follows. */
    authorityIntro: string[];
    /** The ticket as a full offer. `notes` are the short lines under each kit card title, in the same order. */
    ticket: { includes: string; notes: string[]; zonesRow: string; dropRows: string[] };
    /** FAQ questions that state a seat number: this page shows no seats at all. */
    dropFaq: string[];
  };
  os: OsCopy;
  /** Labels of the line that joins the stations, one per link. */
  board: { path: string[] };
  desktop: {
    pilarFolder: string;
    daysFolder: string;
    enrollFolder: string;
    boardPhoto: { title: string; image: Img };
    video: { title: string; label: string; videoId: string; start: number; window: string; play: string };
    note: { title: string; lines: string[]; sign: string };
    secondPhoto: { title: string; image: Img };
    stamp: string;
    logo: Img;
    scrollHint: string;
  };
  outcomes: {
    title: string;
    intro: string;
    items: { numeral: string; text: string }[];
    photo: Img;
  };
  audience: {
    /** Accessible name of the note the reader can crumple. */
    crumpleLabel: string;
    title: string;
    question: string;
    intro: string;
    fitTitle: string;
    fit: string[];
    notFitTitle: string;
    notFit: string[];
    floor: ClaimId;
    conflict: string[];
    conflictNote: string;
  };
  manifesto: {
    title: string;
    thesis: { before: string; highlight: string; after: string };
    counter: string;
    strikes: string[];
    sortLabel: string;
    unsortLabel: string;
    sortedTitle: string;
    opening: string;
    tiredOf: string[];
    paragraph: string;
    closing: string;
  };
  casePilar: {
    title: string;
    kicker: string;
    figure: ClaimId;
    figureCaption: string;
    lead: { withClaim: string; fallback: string };
    intro: string;
    layers: string[];
    review: string[];
    closing: string;
    image: Img;
    folderLabel: string;
    folderName: string;
    folderResultLabel: string;
    folderScopeLabel: string;
    folderScope: string;
    stamp: string;
    folderCta: string;
    fileTitle: string;
    reviewTitle: string;
  };
  twoDays: {
    title: string;
    intro: string;
    image: Img;
    imageLabel: WallLabel;
    days: {
      number: string;
      title: string;
      summary: string;
      items: RichParagraph[];
    }[];
    decisionsTitle: string;
    decisions: string[];
  };
  proof: {
    title: string;
    intro: string;
    videos: { name: string; videoId: string }[];
    galleryTitle: string;
    gallery: { image: Img; caption: string }[];
  };
  hosts: {
    title: string;
    trackRecord: { before: string; claim: ClaimId; after: string };
    paragraphs: string[];
    authority: { title: string; items: { value: string; text: string; faces?: { name: string; image?: Img }[] }[] };
    ownBrandLead: string;
    ownBrandClaim: ClaimId;
    ownBrandAfter: string;
    people: { name: string; image: Img; label: string }[];
    album: Img[];
  };
  investment: {
    title: string;
    paragraphs: string[];
    selectionTitle: string;
    selection: string[];
    ticket: { name: string; detail: string; priceLabel: string; pricePending: string; stub: string };
    format: string;
  };
  faq: { title: string; items: { q: string; a: string }[] };
  /** Only the current page reads this. */
  editorial: {
    navResults: string;
    pilarName: string;
    pilarRole: string;
    pilarLead: string;
    pilarPeriod: string;
    pilarPromise: string;
    pilarFile: { intro: string; layers: string[]; share: string };
    home: { hint: string; pilar: string; lock: string; hostsIcon: string };
    authority: { title: string; proof: { lead: string; name: string; videoId: string; start: number; window: string; play: string }; intro: string[]; photos: { name: string; image: Img }[] };
    audience: { headline: { before: string; italic: string; after: string } };
    manifesto: {
      newWorld: { lead: string; text: string };
      market: {
        lead: string;
        beats: string[];
        text: string;
        contrasts: [string, string][];
        thesisPre: string;
        thesis: { before: string; highlight: string; after: string };
        counter: string;
        promise: string;
        lines: string[];
        close: [string, string];
      }; thesis: { name: string; image: Img }; promiseShot: { name: string; image: Img }; promiseTemple: { name: string; image: Img }; balance: { name: string; image: Img } };
    days: {
      title: { before: string; italic: string };
      question: string;
      intro: string;
      zones: { flag: "ar" | "co" | "es"; time: string; place: string }[];
      more: string;
      dates: { day: string; month: string; label: string; focus: string; reveal?: { before: string; figure: string; after: string }; photo: { name: string; image: Img } }[];
    };
    kit: { title: string; cards: { tag: string; title: string; text: string }[] };
    gainsShown: number[];
    gains: Img[];
    hosts: { philosophy: string[]; lead: { name: string; image: Img } };
    vip: { kicker: string; label: string; stepTitle: string; stepText: string; rows: { label: string; value: string }[]; admit: string; title: string; paragraphs: string[]; priceLabel: string; price: string; cta: string; url: string };
    enroll: { seats: string; seatsText: string; rows: { label: string; value: string }[]; faqItems: number; moreFaq: { q: string; a: string }[] };
  };
  footer: { line: string; copyright: string };
}
