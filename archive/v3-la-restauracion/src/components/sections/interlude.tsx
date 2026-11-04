import { bootcamp } from "@/content/bootcamp";
import { AthensCrumble } from "@/components/experience/athens-crumble";

const { interlude } = bootcamp;

export function Interlude() {
  return (
    <AthensCrumble
      image="/media/hero/athens-sepia.webp"
      sky={interlude.image.src!}
      skyAlt={interlude.image.alt}
      rules={interlude.rules}
      statement={interlude.statement}
      counter={interlude.counter}
      label={`${interlude.label.title} · ${interlude.label.meta}`}
    />
  );
}
