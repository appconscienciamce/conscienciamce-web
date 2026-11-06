import Image from "next/image";
import { bootcamp } from "@/content/bootcamp";
import { CtaButton, Print } from "@/components/editorial";
import { DesktopFolder, DesktopSticker, DesktopWindow } from "./desktop-window";
import { StatusGlyphs } from "./glyphs";
import { MenuBar, type MenuGroup } from "./menu-bar";
import { PhoneHome, type PhoneApp } from "./phone-home";
import { isDraft, resolveRegistrationClose, resolveSeats } from "@/lib/offer";
import { SoundControl } from "./sound-control";
import { SystemCountdown } from "./system-countdown";
import { SystemSeats } from "./system-seats";

export function SystemBar() {
  const { os, hero, brand, chapters } = bootcamp;
  // The places left take the clock's place. Without a cap, the countdown or the clock.
  const seats = resolveSeats();
  const groups: MenuGroup[] = os.nav.map(({ label, href, items, chapters: withChapters }) => ({
    label,
    href,
    items: withChapters
      ? chapters.map((chapter, i) => ({ label: chapter.label, href: `#${chapter.id}`, hint: chapter.number, station: i }))
      : items,
  }));
  return (
    <header className="sys-bar">
      <a href="#inicio" className="sys-brand">
        <Image src={brand.mark.src!} alt="" width={brand.mark.width} height={brand.mark.height} />
        <span>{hero.programName}</span>
      </a>
      <MenuBar groups={groups} label={os.navLabel} />
      <div className="sys-right">
        <span className="sys-live">{os.liveBadge}</span>
        <SoundControl ui={os.sound} />
        <StatusGlyphs />
        {seats ? (
          <SystemSeats from={seats.left} low={seats.low} copy={os.seats} />
        ) : (
          <SystemCountdown closesAt={resolveRegistrationClose()} preview={isDraft} copy={os.countdown} />
        )}
      </div>
    </header>
  );
}

/** The home screen of the phone reading. */
export function PhoneShell() {
  const { os, casePilar, hosts, proof } = bootcamp;
  const { apps } = os.phone;
  const portrait = hosts.people[0].image.src!;
  const grid: PhoneApp[] = [
    { id: "para-quien", label: apps.para, icon: { kind: "folder" } },
    { id: "manifiesto", label: apps.manifesto, icon: { kind: "note" } },
    { id: "caso-pilar", label: apps.pilar, icon: { kind: "photo", src: casePilar.image.src! } },
    { id: "expediente", label: apps.file, icon: { kind: "folder" } },
    { id: "dos-dias", label: apps.days, icon: { kind: "folder" } },
    { id: "que-te-llevas", label: apps.outcomes, icon: { kind: "folder" } },
    { id: "quienes", label: apps.hosts, icon: { kind: "photo", src: portrait } },
    { id: "testimonios", label: apps.testimonials, icon: { kind: "photo", src: proof.gallery[2].image.src! } },
  ];
  return <PhoneHome apps={grid} label={os.chaptersLabel} enterLabel={os.phone.enter} />;
}

/** The dark room behind the map. Only present while the board layout is active. */
export function DesktopShell() {
  const { desktop, os } = bootcamp;
  const stampText = desktop.stamp.repeat(2);
  return (
    <div className="desktop" data-board-desktop>
      <ul className="desk-folders">
        <li>
          <DesktopFolder href="#caso-pilar" label={desktop.pilarFolder} />
        </li>
        <li>
          <DesktopFolder href="#dos-dias" label={desktop.daysFolder} />
        </li>
        <li>
          <DesktopFolder href="#inscripcion" label={desktop.enrollFolder} />
        </li>
      </ul>

      <DesktopWindow
        title={desktop.boardPhoto.title}
        closeLabel={os.closeWindow}
        className="dwin-photo"
        style={{ top: "9%", left: "calc(21.6vw - 176px)", width: 170 }}
      >
        <Print image={desktop.boardPhoto.image} sizes="170px" className="dwin-print" />
      </DesktopWindow>

      <DesktopWindow
        title={desktop.video.title}
        closeLabel={os.closeWindow}
        className="dwin-video"
        style={{ bottom: "7%", right: "2.4vw", width: "min(19vw, 300px)" }}
      >
        <div className="video-empty">
          <span aria-hidden className="video-empty-play">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <p>{desktop.video.label}</p>
          <small>{desktop.video.status}</small>
        </div>
      </DesktopWindow>

      <DesktopWindow
        title={desktop.note.title}
        closeLabel={os.closeWindow}
        className="dwin-note"
        style={{ top: "12%", right: "3.4vw", width: 236 }}
      >
        <p className="note-hand">
          {desktop.note.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <p className="note-sign">{desktop.note.sign}</p>
      </DesktopWindow>

      <DesktopWindow
        title={desktop.secondPhoto.title}
        closeLabel={os.closeWindow}
        className="dwin-second"
        style={{ bottom: "6%", left: "calc(21.6vw - 168px)", width: 156 }}
      >
        <Print image={desktop.secondPhoto.image} sizes="156px" className="dwin-print" objectPosition="50% 72%" />
      </DesktopWindow>

      <DesktopSticker className="desk-stamp">
        <svg viewBox="0 0 200 200" aria-hidden>
          <defs>
            <path id="stamp-ring" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
          </defs>
          <circle cx="100" cy="100" r="97" />
          <text className="desk-stamp-ring">
            <textPath href="#stamp-ring">{stampText}</textPath>
          </text>
          <text x="100" y="120" textAnchor="middle" className="desk-stamp-n">
            2
          </text>
        </svg>
      </DesktopSticker>

      <DesktopSticker className="desk-logo">
        <Image src={desktop.logo.src!} alt={desktop.logo.alt} width={desktop.logo.width} height={desktop.logo.height} draggable={false} />
      </DesktopSticker>

      <p className="scroll-hint" aria-hidden>
        {desktop.scrollHint}
        <svg viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M6 1v15M1.5 11.5 6 16l4.5-4.5" />
        </svg>
      </p>
    </div>
  );
}

export function FlowBar({ price }: { price: string | null }) {
  return (
    <div className="flow-bar" data-flow-bar>
      <CtaButton note={price ?? undefined} />
    </div>
  );
}
