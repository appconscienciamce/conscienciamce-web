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
export interface Img {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** Placeholder label while `src` is null. */
  pendingLabel?: string;
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
  previewNotice: string;
  brand: { name: string; mark: Img; wordmark: Img };
  cta: { label: string; pendingNoticeTitle: string; pendingNoticeBody: string };
  hero: {
    eyebrow: string;
    title: { before: string; italic: string; after: string };
    promise: string;
    wordmark: [string, string];
    image: Img;
    label: WallLabel;
    /** The painting under the overpaint, and what the reader does to it. */
    art: Img;
    artLabel: string;
    promiseEnd: string;
    seoTitle: string;
    artAlt: string;
    audience: string;
    hosts: string;
    words: string[];
    secondaryCta: string;
    scrollNote: string;
    criteria: string;
  };
  outcomes: { title: string; intro: string; items: { text: string; image: string; alt: string }[] };
  audience: {
    title: string;
    question: string;
    intro: string;
    fitTitle: string;
    fit: string[];
    notFitTitle: string;
    notFit: string[];
    test: {
      title: string;
      intro: string;
      idle: { title: string; body: string };
      partial: { title: string; body: string };
      fit: { title: string; body: string };
      notFit: { title: string; body: string };
    };
  };
  interlude: { image: Img; label: WallLabel; statement: string; counter: string; rules: string };
  manifesto: {
    title: string;
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
    stratigraphyLabel: string;
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
      draftNote?: string;
    }[];
    decisionsTitle: string;
    decisions: string[];
  };
  proof: {
    title: string;
    intro: string;
    videos: { name: string; videoId: string }[];
    galleryTitle: string;
    galleryHint: string;
    gallery: { image: Img; caption: string }[];
  };
  hosts: {
    title: string;
    trackRecord: { before: string; claim: ClaimId; after: string };
    paragraphs: string[];
    ownBrandLead: string;
    ownBrandClaim: ClaimId;
    ownBrandAfter: string;
    people: { name: string; image: Img; label: string }[];
  };
  investment: {
    title: string;
    oneOnOne: { claim: ClaimId };
    paragraphs: string[];
    selectionTitle: string;
    selection: string[];
    ticket: { name: string; detail: string; priceLabel: string; pricePending: string };
    image: Img;
    imageLabel: WallLabel;
    touchHint: string;
  };
  faq: { title: string; items: { q: string; a: string; pending?: string }[] };
  footer: { line: string; legal: string };
}
