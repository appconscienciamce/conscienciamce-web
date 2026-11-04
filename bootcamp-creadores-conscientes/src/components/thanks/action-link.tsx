"use client";

import { CtaContent } from "@/components/cta-content";
import { track, type TrackEvent } from "@/lib/analytics";

/** Primary action that leaves the page. Off, and saying so, until its link exists. */
export function ActionLink({
  href,
  label,
  unavailable,
  event,
}: {
  href: string | null;
  label: string;
  unavailable: string;
  event: TrackEvent;
}) {
  if (!href) {
    return (
      <>
        <button type="button" className="btn btn-solid" disabled>
          <CtaContent label={label} />
        </button>
        <p className="thanks-note">{unavailable}</p>
      </>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className="btn btn-solid" onClick={() => track(event)}>
      <CtaContent label={label} />
    </a>
  );
}
