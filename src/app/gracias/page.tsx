import type { Metadata } from "next";
import Image from "next/image";
import { ActionLink } from "@/components/thanks/action-link";
import { Checklist } from "@/components/thanks/checklist";
import { RoadmapForm } from "@/components/thanks/roadmap-form";
import { SiteFooter } from "@/components/site-footer";
import { VideoCard } from "@/components/video-card";
import { SystemCountdown } from "@/components/os/system-countdown";
import { bootcamp } from "@/content/bootcamp";
import { thanks } from "@/content/thanks";

export const metadata: Metadata = {
  title: thanks.seo.title,
  // Reached after paying: it has no place in a search result.
  robots: { index: false, follow: false },
};

function StepWindow({
  id,
  number,
  title,
  text,
  badge,
  tone = "dark",
  children,
}: {
  id: string;
  number: number;
  title: string;
  text: string;
  badge?: string;
  tone?: "dark" | "paper";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="thanks-window" data-tone={tone} aria-labelledby={`${id}-title`}>
      <div className="thanks-window-bar" aria-hidden>
        <span className="traffic is-small">
          <span className="tl tl-off" />
          <span className="tl tl-off" />
          <span className="tl tl-off" />
        </span>
        <span>{thanks.windowTitle}</span>
      </div>
      <div className="thanks-window-body">
        <header>
          <span aria-hidden className="thanks-number">
            {number}
          </span>
          <div>
            <h2 id={`${id}-title`}>
              {title}
              {badge && <small>{badge}</small>}
            </h2>
            <p>{text}</p>
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

export default function ThanksPage() {
  const { hero, checklist, roadmap, whatsapp, videos } = thanks;
  const { brand, os, offer } = bootcamp;
  const steps = [
    { id: roadmap.id, label: roadmap.label },
    { id: whatsapp.id, label: whatsapp.label },
    { id: videos.id, label: videos.label },
  ];

  return (
    <div className="thanks-shell">
      <header className="sys-bar">
        <span className="sys-brand">
          <Image src={brand.mark.src!} alt="" width={brand.mark.width} height={brand.mark.height} />
          {bootcamp.hero.programName}
        </span>
        <div className="sys-right">
          <SystemCountdown dates={offer.eventDates} copy={os.countdown} />
        </div>
      </header>

      <main className="thanks-page">
        <div className="thanks-hero">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>

        <div className="thanks-layout">
          <Checklist title={checklist.title} steps={steps} />

          <div className="thanks-steps">
            <StepWindow id={roadmap.id} number={1} title={roadmap.title} text={roadmap.text} tone="paper">
              <RoadmapForm copy={roadmap} />
            </StepWindow>

            <StepWindow id={whatsapp.id} number={2} title={whatsapp.title} text={whatsapp.text}>
              <div className="thanks-action">
                <ActionLink href={whatsapp.url} label={whatsapp.cta} unavailable={whatsapp.unavailable} event="whatsapp_click" />
              </div>
            </StepWindow>

            <StepWindow id={videos.id} number={3} title={videos.title} text={videos.text}>
              <ul className="thanks-videos">
                {videos.items.map((video) => (
                  <li key={video.videoId}>
                    <VideoCard name={video.title} videoId={video.videoId} closeLabel={os.closeWindow} windowTitle={video.title} playLabel={`Reproducir: ${video.title}`} />
                  </li>
                ))}
              </ul>
            </StepWindow>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
