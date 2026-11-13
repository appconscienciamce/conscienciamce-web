import Image from "@/components/safe-image";
import { bootcamp } from "@/content/bootcamp";
import type { Variant } from "@/content/types";
import { CtaButton, Print } from "@/components/editorial";
import { DesktopFolder, DesktopSticker, DesktopWindow } from "./desktop-window";
import { StatusGlyphs } from "./glyphs";
import { MenuBar, type MenuGroup } from "./menu-bar";
import { PhoneHome, type PhoneApp } from "./phone-home";
import { SoundControl } from "./sound-control";
import { SystemCountdown } from "./system-countdown";
import { VideoCard } from "@/components/video-card";

export function SystemBar({ variant }: { variant: Variant }) {
  const { os, hero, brand, chapters, offer, editorial } = bootcamp;
  const current = variant === "current";
  const groups: MenuGroup[] = os.nav.map(({ label, href, items, chapters: withChapters }) => ({
    label,
    href,
    items: withChapters
      ? chapters.map((chapter, i) => ({ label: chapter.label, href: `#${chapter.id}`, hint: chapter.number, station: i }))
      : items?.map((item) => (current && item.href === "#testimonios" ? { ...item, label: editorial.navResults } : item)),
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
        <SystemCountdown dates={offer.eventDates} copy={os.countdown} dated={current} />
      </div>
    </header>
  );
}

/** The home screen of the phone reading. */
export function PhoneShell({ variant }: { variant: Variant }) {
  const { os, casePilar, hosts, proof, editorial } = bootcamp;
  const { apps } = os.phone;
  const current = variant === "current";
  const portrait = current ? editorial.home.hostsIcon : hosts.people[0].image.src!;
  const audience: PhoneApp = { id: "para-quien", label: apps.para, icon: { kind: "folder" } };
  const grid: PhoneApp[] = [
    ...(current ? [] : [audience]),
    { id: "manifiesto", label: apps.manifesto, icon: { kind: "note" } },
    { id: "caso-pilar", label: apps.pilar, icon: { kind: "photo", src: casePilar.image.src! }, ...(current && { badge: { text: editorial.home.pilar } }) },
    { id: "expediente", label: apps.file, icon: { kind: "folder" }, ...(current && { badge: { lock: editorial.home.lock } }) },
    { id: "dos-dias", label: apps.days, icon: { kind: "folder" } },
    { id: "que-te-llevas", label: apps.outcomes, icon: { kind: "folder" }, ...(current && { tone: "gold" as const }) },
    { id: "quienes", label: apps.hosts, icon: { kind: "photo", src: portrait } },
    current
      ? { id: "inscripcion", label: apps.enroll, icon: { kind: "ticket" } }
      : { id: "testimonios", label: apps.testimonials, icon: { kind: "photo", src: proof.gallery[2].image.src! } },
  ];
  // The current page reads manifesto, days, Pilar, who it is for, the kit, the ticket and, last, the hosts.
  if (current) {
    const at = (id: string) => grid.find((app) => app.id === id)!;
    grid.splice(0, grid.length, ...["manifiesto", "dos-dias", "caso-pilar", "expediente", "para-quien", "que-te-llevas", "inscripcion", "quienes"].map((id) => (id === "para-quien" ? audience : at(id))));
  }
  return <PhoneHome apps={grid} label={os.chaptersLabel} scrollLabel={os.phone.next} editorial={current} hint={current ? editorial.home.hint : undefined} />;
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
        <VideoCard
          name={desktop.video.label}
          videoId={desktop.video.videoId}
          start={desktop.video.start}
          closeLabel={os.closeWindow}
          windowTitle={desktop.video.window}
          playLabel={desktop.video.play}
        />
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

export function FlowBar({ price, label, href }: { price: string | null; label?: string; href?: string }) {
  return (
    <div className="flow-bar" data-flow-bar>
      <CtaButton label={label} note={price ?? undefined} href={href} />
    </div>
  );
}
