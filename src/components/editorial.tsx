import { CtaContent } from "@/components/cta-content";
import Image from "@/components/safe-image";
import { bootcamp } from "@/content/bootcamp";
import type { ClaimId, Img, Inline, RichParagraph } from "@/content/types";
import { ctaHref, resolveClaim, resolvePrice } from "@/lib/offer";

/* ----------------------------------------------------------------
   Gated text. What is still unapproved is tracked in
   PENDIENTES_SANTIAGO.md; the page itself carries no marks.
----------------------------------------------------------------- */
export function ClaimText({ id }: { id: ClaimId }) {
  return <>{resolveClaim(id).text}</>;
}

/** Price. Renders `fallback` when the price must stay hidden. */
export function PriceText({ fallback = null }: { fallback?: React.ReactNode }) {
  const price = resolvePrice();
  return <>{price ? price.label : fallback}</>;
}

/* ----------------------------------------------------------------
   Rich text
----------------------------------------------------------------- */
function InlineNode({ node }: { node: Inline }) {
  return typeof node === "string" ? <>{node}</> : <strong>{node.strong}</strong>;
}

export function Rich({ paragraph, as: Tag = "p" }: { paragraph: RichParagraph; as?: "p" | "span" }) {
  return (
    <Tag>
      {paragraph.map((node, i) => (
        <InlineNode key={i} node={node} />
      ))}
    </Tag>
  );
}

/* ----------------------------------------------------------------
   CTA. Never links to a fake purchase: without a live checkout it goes
   to the "registration opening soon" notice in the last station.
----------------------------------------------------------------- */
export function CtaButton({
  className = "",
  label = bootcamp.cta.label,
  track = "cta_click",
  note,
  href = ctaHref,
}: {
  className?: string;
  label?: string;
  track?: string;
  note?: string;
  /** Where it goes. Defaults to the checkout. */
  href?: string;
}) {
  return (
    <a href={href} data-track={track} className={`btn btn-solid ${className}`}>
      <CtaContent label={label} note={note} />
    </a>
  );
}

/* ----------------------------------------------------------------
   Photographic print. `src: null` renders an empty frame with initials,
   never a stand-in face.
----------------------------------------------------------------- */
/** Photos held to the page with paper clips, one over the other. */
export function PhotoStack({ photos }: { photos: Img[] }) {
  return (
    <ul className="photo-stack" data-count={photos.length}>
      {photos.map((image) => (
        <li key={image.src}>
          <Print image={image} sizes="(max-width: 900px) 60vw, 180px" />
          <svg className="paperclip" viewBox="0 0 24 64" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 16v32a6 6 0 0 0 12 0V12a9 9 0 0 0-18 0v38" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

export function Print({
  image,
  sizes,
  className = "",
  priority = false,
  objectPosition,
}: {
  image: Img;
  sizes: string;
  className?: string;
  priority?: boolean;
  objectPosition?: string;
}) {
  if (!image.src) {
    return (
      <div role="img" aria-label={image.alt} className={`print print-empty ${className}`}>
        <span aria-hidden>{image.pendingLabel}</span>
      </div>
    );
  }
  return (
    <div className={`print ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        quality={90}
        priority={priority}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
