"use client";

import { useRef } from "react";

const DURATION = 380;
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * A native `details`, so it still opens without JavaScript. CSS cannot animate
 * to `height: auto` in every browser yet, so the height runs on the Web Animations
 * API. Only layout pixels are read: the board scales everything with a transform.
 */
export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const running = useRef<Animation | null>(null);

  const onClick = (e: React.MouseEvent) => {
    const details = detailsRef.current;
    const body = bodyRef.current;
    if (!details || !body || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();

    const closing = details.open && details.dataset.state !== "closing";
    // Read before cancelling, so a reversal starts from where the panel really is.
    const from = details.open ? parseFloat(getComputedStyle(body).height) : 0;
    running.current?.cancel();
    details.open = true;
    details.dataset.state = closing ? "closing" : "opening";

    const animation = body.animate(
      { height: [`${from}px`, closing ? "0px" : `${body.scrollHeight}px`], opacity: [closing ? 1 : 0, closing ? 0 : 1] },
      { duration: DURATION, easing: EASING },
    );
    running.current = animation;
    animation.onfinish = () => {
      if (closing) details.open = false;
      delete details.dataset.state;
      running.current = null;
    };
  };

  return (
    <details ref={detailsRef}>
      <summary onClick={onClick}>
        {question}
        <span aria-hidden className="faq-mark" />
      </summary>
      <div ref={bodyRef} className="faq-body">
        <p>{answer}</p>
      </div>
    </details>
  );
}
