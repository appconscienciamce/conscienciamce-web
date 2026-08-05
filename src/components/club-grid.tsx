import {
  CalendarClock,
  Compass,
  ListChecks,
  Smartphone,
  Ticket,
  Users,
} from 'lucide-react';

/**
 * What the Club includes.
 *
 * Card markup is the reference landing's benefit cards, reproduced verbatim —
 * the dots, the icon rings and the lines are all part of that structure, and
 * the CSS targets them by class. Only the copy and the icons are ours.
 */

type Card = {
  id: string;
  icon: React.ReactNode;
  heading: string;
  description: string;
};

const ICON_CLASS = 'mce-fp-icon';

const CARDS: Card[] = [
  {
    id: 'app',
    icon: <Smartphone className={ICON_CLASS} aria-hidden="true" />,
    heading: 'La app',
    description:
      'La herramienta que sostiene cada día lo que entrenás. El Club produce la transformación; la app te permite mantenerla.',
  },
  {
    id: 'mentorias',
    icon: <CalendarClock className={ICON_CLASS} aria-hidden="true" />,
    heading: '2 mentorías semanales',
    description:
      'Acompañamiento en vivo todas las semanas, para trabajar sobre lo que te está limitando en ese momento.',
  },
  {
    id: 'filosofia',
    icon: <Compass className={ICON_CLASS} aria-hidden="true" />,
    heading: 'La filosofía, tecnología, principios y valores de MCE',
    description:
      'Identidad, consciencia, principios, propósito y visión: la base sobre la que se construye todo lo demás.',
  },
  {
    id: 'protocolos',
    icon: <ListChecks className={ICON_CLASS} aria-hidden="true" />,
    heading: 'Protocolos prácticos',
    description:
      'Metas, hábitos y sistemas internos que traducen la filosofía en algo aplicable, para que aprendas a entrenarte solo.',
  },
  {
    id: 'comunidad',
    icon: <Users className={ICON_CLASS} aria-hidden="true" />,
    heading: 'Comunidad de líderes y emprendedores conscientes',
    description:
      'El entorno importa: te mantiene en otra frecuencia y sostiene un estándar más alto que el que sostendrías solo.',
  },
  {
    id: 'eventos',
    icon: <Ticket className={ICON_CLASS} aria-hidden="true" />,
    heading: 'Acceso a nuestros eventos privados',
    description:
      'Encuentros presenciales del ecosistema, donde la transformación deja de ser teoría y se vuelve experiencia.',
  },
];

function BenefitCard({ card }: { card: Card }) {
  return (
    <div className="fp-card scroll-bottom">
      <div className="fp-dot1" />
      <div className="fp-dot2" />
      <div className="fp-dot3" />
      <div className="fp-dot4" />
      <div className="fp-icon-line-wrapper">
        <div className="fp-icon-main">
          <div className="fp-dot1xy" />
          <div className="fp-dot2xy" />
          <div className="fp-dot3xy" />
          <div className="fp-dot4xy" />
          <div className="fp-icon-inner">
            <div className="fp-icon-core">
              <div className="fp-icon-fa">{card.icon}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="fp-content">
        <h3 className="fp-heading">{card.heading}</h3>
        <p className="fp-description">{card.description}</p>
      </div>
    </div>
  );
}

export function ClubGrid() {
  return (
    <div className="fp-benefits-wrapper">
      {/* One grid rather than two rows of three: split into rows, each row
          sized its own track height, so cards in the top row never matched
          the bottom one. A single grid makes every card share the tallest
          row's height and keeps one gap under one declaration. */}
      <div className="fp-grid reveal-stagger">
        {CARDS.map((card) => (
          <BenefitCard card={card} key={card.id} />
        ))}
      </div>
    </div>
  );
}
