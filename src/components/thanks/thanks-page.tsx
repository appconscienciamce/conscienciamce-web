import Image from "next/image";
import { ActionLink } from "@/components/thanks/action-link";
import { Checklist } from "@/components/thanks/checklist";
import { RoadmapFile } from "@/components/thanks/roadmap-file";
import { RoadmapForm } from "@/components/thanks/roadmap-form";
import { SiteFooter } from "@/components/site-footer";
import { VideoCard } from "@/components/video-card";
import { SystemClock } from "@/components/os/system-clock";
import { SystemCountdown } from "@/components/os/system-countdown";
import { bootcamp } from "@/content/bootcamp";
import { thanks, thanksCurrent } from "@/content/thanks";
import type { Variant } from "@/content/types";

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

/** The thank-you page: the roadmap as a closed file, one video and no call. `/evento/gracias` keeps the previous one. */
export function ThanksPage({ variant }: { variant: Variant }) {
  const current = variant === "current";
  const { hero, checklist, roadmap, whatsapp, videos, upsell } = thanks;
  const { brand, os, offer } = bootcamp;
  const video = current ? { ...videos, ...thanksCurrent.videos, items: videos.items.slice(0, thanksCurrent.videos.count) } : videos;
  // The current page sends people to the group first: many will not have their birth time at hand.
  const steps = current
    ? [
        { id: whatsapp.id, label: whatsapp.label },
        { id: roadmap.id, label: roadmap.label },
      ]
    : [
        { id: roadmap.id, label: roadmap.label },
        { id: whatsapp.id, label: whatsapp.label },
        { id: videos.id, label: video.label },
        { id: upsell.id, label: upsell.label, optional: checklist.optional },
      ];
  const roadmapStep = (
    <StepWindow id={roadmap.id} number={current ? 2 : 1} title={roadmap.title} text={current ? thanksCurrent.text : roadmap.text} tone="paper">
      {current ? <RoadmapFile copy={{ ...roadmap, ...thanksCurrent }} /> : <RoadmapForm copy={roadmap} />}
    </StepWindow>
  );
  const whatsappStep = (
    <StepWindow id={whatsapp.id} number={current ? 1 : 2} title={whatsapp.title} text={current ? thanksCurrent.whatsappText : whatsapp.text}>
      <div className="thanks-action">
        <ActionLink href={whatsapp.url} label={whatsapp.cta} unavailable={whatsapp.unavailable} event="whatsapp_click" />
      </div>
    </StepWindow>
  );

  return (
    <div className={current ? "thanks-shell v-current" : "thanks-shell"}>
      <header className="sys-bar">
        <span className="sys-brand">
          <Image src={brand.mark.src!} alt="" width={brand.mark.width} height={brand.mark.height} />
          {bootcamp.hero.programName}
        </span>
        <div className="sys-right">
          {current ? <SystemCountdown dates={offer.eventDates} copy={os.countdown} dated /> : <SystemClock />}
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
            {current ? whatsappStep : roadmapStep}
            {current ? roadmapStep : whatsappStep}

            {!current && (
            <StepWindow id={videos.id} number={3} title={video.title} text={video.text}>
              <ul className="thanks-videos">
                {video.items.map((item) => (
                  <li key={item.videoId}>
                    <VideoCard name={item.title} videoId={item.videoId} closeLabel={os.closeWindow} windowTitle={item.title} playLabel={`Reproducir: ${item.title}`} />
                  </li>
                ))}
              </ul>
            </StepWindow>
            )}

            {!current && (
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
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
