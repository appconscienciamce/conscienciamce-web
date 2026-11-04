import { bootcamp } from "@/content/bootcamp";
import { VideoCard } from "@/components/video-card";
import { WorkTable } from "@/components/experience/work-table";

const { proof } = bootcamp;

export function Proof() {
  const prints = proof.gallery.map((g) => ({ src: g.image.src!, alt: g.image.alt, caption: g.caption }));
  return (
    <section aria-labelledby="proof-title" className="surface-putty px-[var(--gutter)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[76rem] text-center">
        <h2 id="proof-title" data-reveal className="display text-[clamp(2.75rem,6.5vw,6rem)]">
          {proof.title}
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-[34rem] text-lg text-[var(--muted)]">
          {proof.intro}
        </p>
      </div>

      <ul className="mt-16 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {proof.videos.map((v, i) => (
          <li key={v.videoId} data-reveal style={{ "--delay": `${(i % 3) * 90}ms` } as React.CSSProperties}>
            <VideoCard name={v.name} videoId={v.videoId} />
          </li>
        ))}
      </ul>

      <WorkTable title={proof.galleryTitle} hint={proof.galleryHint} prints={prints} />
    </section>
  );
}
