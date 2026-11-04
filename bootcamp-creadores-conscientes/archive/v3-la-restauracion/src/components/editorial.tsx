import Image from "next/image";
import { bootcamp } from "@/content/bootcamp";
import type { ClaimId, Img, Inline, RichParagraph, WallLabel as WallLabelData } from "@/content/types";
import { ctaHref, isDraft, resolveClaim, resolvePrice } from "@/lib/offer";

/* ----------------------------------------------------------------
   Pending annotation — draft-only marker with the reason attached.
----------------------------------------------------------------- */
export function Pending({ children, needs }: { children: React.ReactNode; needs: string }) {
  return (
    <>
      <span className="pending" title={needs}>
        {children}
      </span>
      <span className="pending-tag" title={needs}>
        Pendiente
        <span className="sr-only">: {needs}</span>
      </span>
    </>
  );
}

export function ClaimText({ id }: { id: ClaimId }) {
  const claim = resolveClaim(id);
  if (claim.state === "pending") return <Pending needs={claim.needs}>{claim.text}</Pending>;
  return <>{claim.text}</>;
}

/** Price, flagged in draft. Renders `fallback` when the price must stay hidden. */
export function PriceText({ fallback = null }: { fallback?: React.ReactNode }) {
  const price = resolvePrice();
  if (!price) return <>{fallback}</>;
  if (price.state === "pending") {
    return <Pending needs="Precio trabajado en la llamada, falta confirmación final.">{price.label}</Pending>;
  }
  return <>{price.label}</>;
}

export function DraftNote({ children }: { children: React.ReactNode }) {
  if (!isDraft) return null;
  return (
    <p className="mt-6 border-l-2 pl-3 text-sm" style={{ borderColor: "var(--pending)", color: "var(--pending)" }}>
      Nota de borrador — {children}
    </p>
  );
}

/* ----------------------------------------------------------------
   Rich text
----------------------------------------------------------------- */
function InlineNode({ node }: { node: Inline }) {
  return typeof node === "string" ? <>{node}</> : <strong className="font-semibold text-[var(--fg)]">{node.strong}</strong>;
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
   CTA — filled pill. Never links to a fake purchase: without a live
   checkout it scrolls to the "registration opening soon" notice.
----------------------------------------------------------------- */
export function CtaButton({ className = "", withPrice = false }: { className?: string; withPrice?: boolean }) {
  const price = resolvePrice();
  return (
    <a
      href={ctaHref}
      data-cta
      className={`btn btn-solid sheen group ${className}`}
    >
      {bootcamp.cta.label}
      {withPrice && price && (
        <span className="opacity-70">
          · {price.label}
          {price.state === "pending" && "*"}
        </span>
      )}
    </a>
  );
}

export function TextCta({ className = "" }: { className?: string }) {
  return (
    <a
      href={ctaHref}
      data-cta
      className={`text-[0.8125rem] font-medium underline-offset-4 hover:underline ${className}`}
    >
      {bootcamp.cta.label} →
    </a>
  );
}

/* ----------------------------------------------------------------
   Section label — "02 · Para quién"
----------------------------------------------------------------- */
export function SectionLabel({ number, label, className = "" }: { number: string; label: string; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 text-[var(--muted)] ${className}`} data-reveal>
      <span>{number}</span>
      <span aria-hidden className="h-px w-8 bg-[var(--rule)]" />
      <span>{label}</span>
    </p>
  );
}

/* ----------------------------------------------------------------
   Museum wall label
----------------------------------------------------------------- */
export function WallLabel({ label, fig, className = "" }: { label: WallLabelData; fig?: string; className?: string }) {
  return (
    <figcaption className={`text-[0.75rem] leading-snug ${className}`}>
      {fig && <span className="label mr-2 text-[0.625rem] text-[var(--muted)]">{fig}</span>}
      <span className="font-medium text-[var(--fg)]">{label.title}</span>
      <span className="block text-[var(--muted)]">{label.meta}</span>
    </figcaption>
  );
}

/* ----------------------------------------------------------------
   Images. `src: null` renders a labelled placeholder — never a stand-in face.
----------------------------------------------------------------- */
export function Picture({
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
      <div
        role="img"
        aria-label={`Imagen pendiente: ${image.pendingLabel ?? image.alt}`}
        className={`placeholder-hatch relative flex items-end justify-center p-4 ${className}`}
      >
        <span className="label rounded-[2px] bg-[var(--bg)] px-2 py-1 text-center text-[0.625rem] text-[var(--muted)]">
          Imagen pendiente · {image.pendingLabel ?? image.alt}
        </span>
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}

/** Round-headed niche with a hairline frame. */
export function Niche({
  image,
  sizes,
  className = "",
  priority = false,
}: {
  image: Img;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`arch-frame ${className}`}>
      <Picture image={image} sizes={sizes} priority={priority} className="arch aspect-[2/3] w-full" />
    </div>
  );
}
