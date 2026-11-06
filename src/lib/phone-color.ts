/**
 * The photos are printed in black and white, and on a computer the pointer brings
 * their colour back. A phone has no pointer: the colour comes back to the photo
 * the reader is looking at, the one in the middle of the screen, and leaves again
 * once it has gone by.
 */

const PHOTOS = ".ed .print img";
/** The middle of the screen: a photo is lit while any part of it is in this band. */
const BAND = "-26% 0px -26% 0px";

/** Starts watching every photo. Returns what stops it. */
export function startColor() {
  const seen = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.target.toggleAttribute("data-lit", entry.isIntersecting)),
    { rootMargin: BAND },
  );
  const watch = (root: ParentNode) => root.querySelectorAll(PHOTOS).forEach((img) => seen.observe(img));
  watch(document);

  return () => {
    seen.disconnect();
    document.querySelectorAll("[data-lit]").forEach((img) => img.removeAttribute("data-lit"));
  };
}
