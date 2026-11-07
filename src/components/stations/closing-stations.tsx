import { bootcamp } from "@/content/bootcamp";
import { ClaimText, PhotoStack, PriceText, Print } from "@/components/editorial";
import { Piece, Station } from "@/components/board/primitives";
import { CtaContent } from "@/components/cta-content";
import { FaqItem } from "@/components/faq-item";
import { HalftoneImage } from "@/components/halftone-image";
import { VideoCard } from "@/components/video-card";
import type { Variant } from "@/content/types";
import { EdEnroll, EdHosts } from "./phone-editorial";
import { REGISTRATION_ANCHOR, checkoutLive, ctaHref, resolveLogistics } from "@/lib/offer";

export function HostsStation({ variant }: { variant: Variant }) {
  const { hosts, proof, os } = bootcamp;
  const [santiago, oriana] = hosts.people;
  return (
    <Station index={6} titleId="hosts-title" className="st-hosts">
      {variant === "current" && <EdHosts />}
      <Piece x={36} y={34} w={640}>
        <h2 id="hosts-title" className="display-md">
          {hosts.title}
        </h2>
      </Piece>
      <Piece x={36} y={236} w={610} className="hosts-copy">
        <p>
          {hosts.trackRecord.before}
          <ClaimText id={hosts.trackRecord.claim} />
          {hosts.trackRecord.after}
        </p>
        {hosts.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Piece>

      <Piece x={700} y={22} w={216} r={-1.2} movable as="figure" className="snap">
        <HalftoneImage src={santiago.image.src!}>
          <Print image={santiago.image} sizes="216px" className="snap-photo-host" />
        </HalftoneImage>
        <figcaption>
          <strong>{santiago.name}</strong>
          <span className="mono-note">{santiago.label}</span>
        </figcaption>
      </Piece>
      <Piece x={946} y={22} w={216} r={1.2} movable as="figure" className="snap">
        <Print image={oriana.image} sizes="216px" className="snap-photo-host" />
        <figcaption>
          <strong>{oriana.name}</strong>
          <span className="mono-note">{oriana.label}</span>
        </figcaption>
      </Piece>

      <Piece x={700} y={470} w={462} className="hosts-album">
        <PhotoStack photos={hosts.album} />
      </Piece>

      {variant === "current" ? (
        <Piece x={1316} y={40} w={1100} id="testimonios" className="authority">
          <h3 className="display-sm">{hosts.authority.title}</h3>
          <dl>
            {hosts.authority.items.map((item) => (
              <div key={item.value}>
                <dt>{item.value}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </Piece>
      ) : (
        <>
          <Piece x={700} y={470} w={462} movable className="paper-note note-tape own-brand">
            <p>
              <strong>{hosts.ownBrandLead}</strong> <ClaimText id={hosts.ownBrandClaim} />
            </p>
            <p>{hosts.ownBrandAfter}</p>
          </Piece>

          <Piece x={1316} y={30} w={760} id="testimonios">
            <h3 className="display-sm">{proof.title}</h3>
            <p className="mono-note">{proof.intro}</p>
          </Piece>
          <Piece x={1316} y={140} w={760} as="ul" className="video-grid">
            {proof.videos.map((video) => (
              <li key={video.videoId}>
                <VideoCard name={video.name} videoId={video.videoId} closeLabel={os.closeWindow} />
              </li>
            ))}
          </Piece>
          <Piece x={2110} y={36} w={340} id="galeria" className="contact-sheet">
            <h3 className="mono-note">{proof.galleryTitle}</h3>
            <ul>
              {proof.gallery.map((item) => (
                <li key={item.caption} style={{ "--ratio": `${item.image.width} / ${item.image.height}` } as React.CSSProperties}>
                  <Print image={item.image} sizes="(max-width: 900px) 100vw, 110px" className="contact-photo" />
                  <span>{item.caption}</span>
                </li>
              ))}
            </ul>
          </Piece>
        </>
      )}
    </Station>
  );
}

export function EnrollStation({ variant }: { variant: Variant }) {
  const { investment, cta, faq, hero, editorial } = bootcamp;
  const current = variant === "current";
  // The first row is the format, already printed on the ticket.
  const logistics = current ? editorial.enroll.rows : resolveLogistics().slice(1);
  const questions = current ? [...faq.items.slice(0, editorial.enroll.faqItems), ...editorial.enroll.moreFaq] : faq.items;
  return (
    <Station index={7} titleId="enroll-title" className="st-enroll">
      {current && <EdEnroll />}
      <Piece x={40} y={30} w={760}>
        <h2 id="enroll-title" className="display-md">
          {investment.title}
        </h2>
      </Piece>
      <Piece x={840} y={46} w={320} className="enroll-copy">
        {investment.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Piece>

      <Piece x={40} y={232} w={1120} className="ticket-wrap ph-keep">
        <article className="ticket">
          <div className="ticket-main">
            <p className="ticket-format">{investment.format}</p>
            <p className="ticket-name">{investment.ticket.name}</p>
            <p className="ticket-detail">{hero.title.before + hero.title.italic + hero.title.after}</p>
            <p className="ticket-hosts">{hero.hosts}</p>
            <dl className="ticket-rows">
              {logistics.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="ticket-stub">
            <p className="ticket-admit">{investment.ticket.stub}</p>
            <p className="ticket-price">
              <span>{investment.ticket.priceLabel}</span>
              <strong>
                <PriceText fallback={investment.ticket.pricePending} />
              </strong>
            </p>
            <a
              href={checkoutLive ? ctaHref : `#${REGISTRATION_ANCHOR}`}
              data-track="pricing_cta_click"
              className="btn btn-solid ticket-cta"
            >
              <CtaContent label={cta.label} />
            </a>
            {!checkoutLive && <p className="ticket-notice">{cta.pendingNoticeBody}</p>}
            <span aria-hidden className="ticket-barcode" />
          </div>
        </article>
      </Piece>

      {!current && (
        <Piece x={1320} y={40} w={460} movable className="paper-note note-tape selection-note">
          <h3>{investment.selectionTitle}</h3>
          {investment.selection.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Piece>
      )}

      <Piece x={current ? 1320 : 1830} y={24} w={620} id="preguntas" className="faq ph-keep">
        <h3 className="display-sm">{faq.title}</h3>
        {questions.map((item) => (
          <FaqItem key={item.q} question={item.q} answer={item.a} />
        ))}
      </Piece>
    </Station>
  );
}
