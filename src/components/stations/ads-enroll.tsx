import { bootcamp } from "@/content/bootcamp";
import { Piece, Station } from "@/components/board/primitives";
import { CtaContent } from "@/components/cta-content";
import { FaqItem } from "@/components/faq-item";
import { ADS_TICKET_ANCHOR, REGISTRATION_ANCHOR, adsTicketCtaLabel, checkoutLive, ctaHref, priceExact } from "@/lib/offer";
import { EdEnroll } from "./phone-editorial";

/** The questions of the current page, without the ones that state a seat number: the ticket says the real one. */
function questions() {
  const { faq, editorial, ads } = bootcamp;
  const more = editorial.enroll.moreFaq.filter((item) => !ads.dropFaq.includes(item.q));
  return [...faq.items.slice(0, editorial.enroll.faqItems), ...more];
}

function Check() {
  return (
    <svg className="ticket-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** "AR 15:00 · CO 13:00 · ES 19:00", from the zones the page already shows. */
function zonesLine() {
  return bootcamp.editorial.days.zones.map((zone) => `${zone.flag.toUpperCase()} ${zone.time}`).join(" · ");
}

/**
 * The last station of the paid-traffic page: the whole offer on the ticket, then the questions.
 * The ticket's button is the only link to the checkout on the page.
 */
export function AdsEnrollStation() {
  const { investment, hero, editorial, ads: copy } = bootcamp;
  const price = priceExact();
  const rows = editorial.enroll.rows
    .filter((row) => !copy.ticket.dropRows.includes(row.label))
    .map((row) => (row.label === copy.ticket.zonesRow ? { ...row, value: zonesLine() } : row));
  return (
    <Station index={7} titleId="enroll-title" className="st-enroll">
      <EdEnroll titleId="enroll-title" />
      <Piece x={40} y={232} w={1120} id={ADS_TICKET_ANCHOR} className="ticket-wrap ph-keep">
        <article className="ticket ticket-offer">
          <div className="ticket-main">
            <p className="ticket-format">{investment.format}</p>
            <p className="ticket-name">{investment.ticket.name}</p>
            <p className="ticket-detail">{hero.title.before + hero.title.italic + hero.title.after}</p>
            <p className="ticket-hosts">{hero.hosts}</p>
            <h3 className="ticket-includes-title">{copy.ticket.includes}</h3>
            <ul className="ticket-includes">
              {editorial.kit.cards.map((card, i) => (
                <li key={card.title}>
                  <Check />
                  <span>
                    <strong>{card.title}</strong>
                    <small>{copy.ticket.notes[i]}</small>
                  </span>
                </li>
              ))}
            </ul>
            <dl className="ticket-rows">
              {rows.map((row) => (
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
              <strong>{price ?? investment.ticket.pricePending}</strong>
            </p>
            <a href={checkoutLive ? ctaHref : `#${REGISTRATION_ANCHOR}`} data-track="pricing_cta_click" className="btn btn-solid ticket-cta">
              <CtaContent label={adsTicketCtaLabel()} />
            </a>
            {!checkoutLive && <p className="ticket-notice">{bootcamp.cta.pendingNoticeBody}</p>}
            <span aria-hidden className="ticket-barcode" />
          </div>
        </article>
      </Piece>

      <div className="ed ed-dark ed-faq-wrap" id="preguntas">
        <section className="faq">
          <h3 className="display-sm">{bootcamp.faq.title}</h3>
          {questions().map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </section>
      </div>
    </Station>
  );
}
