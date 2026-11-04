import { bootcamp } from "@/content/bootcamp";
import { GalleryWalk } from "@/components/experience/gallery-walk";

const { outcomes } = bootcamp;

export function Outcomes() {
  return <GalleryWalk title={outcomes.title} intro={outcomes.intro} items={outcomes.items} />;
}
