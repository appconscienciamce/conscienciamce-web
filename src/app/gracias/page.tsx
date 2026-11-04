import type { Metadata } from "next";
import Image from "next/image";
import { ActionLink } from "@/components/thanks/action-link";
import { Checklist } from "@/components/thanks/checklist";
import { RoadmapForm } from "@/components/thanks/roadmap-form";
import { SiteFooter } from "@/components/site-footer";
import { VideoCard } from "@/components/video-card";
import { SystemClock } from "@/components/os/system-clock";
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
  const { hero, checklist, roadmap, whatsapp, videos, upsell } = thanks;
  const { brand, os } = bootcamp;
  const steps = [
    { id: roadmap.id, label: roadmap.label },
    { id: whatsapp.id, label: whatsapp.label },
    { id: videos.id, label: videos.label },
    { id: upsell.id, label: upsell.label, optional: checklist.optional },
  ];

  return (
    <div className="thanks-shell">
      <header className="sys-bar">
        <span className="sys-brand">
          <Image src={brand.mark.src!} alt="" width={brand.mark.width} height={brand.mark.height} />
          {bootcamp.hero.programName}
        </span>
        <div className="sys-right">
          <SystemClock />
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

            <StepWindow id={upsell.id} number={4} title={upsell.title} text={upsell.text} badge={checklist.optional}>
              <div className="thanks-upsell">
                {upsell.videoId ? (
                  <VideoCard
                    name={upsell.videoTitle}
                    videoId={upsell.videoId}
                    closeLabel={os.closeWindow}
                    caption={false}
                    windowTitle={upsell.videoTitle}
                    playLabel={`Reproducir: ${upsell.videoTitle}`}
                  />
                ) : (
                  <div className="thanks-vsl-empty">
                    <span aria-hidden className="video-empty-play">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <p>{upsell.videoPending}</p>
                  </div>
                )}
                <div className="thanks-action">
                  {upsell.price && upsell.url && <p className="thanks-price">{upsell.price}</p>}
                  <ActionLink href={upsell.url} label={upsell.cta} unavailable={upsell.unavailable} event="upsell_click" />
                </div>
              </div>
            </StepWindow>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
