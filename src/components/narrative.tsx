'use client';

import { useEffect, useRef, useState } from 'react';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

/**
 * Narrative copy revealed phrase by phrase as it scrolls into view.
 *
 * TextGenerateEffect animates per word; feeding it one phrase at a time keeps
 * the reveal readable over long copy instead of trickling through every word
 * of a paragraph.
 *
 * The effect runs on mount, so each block waits until it is actually on
 * screen — otherwise everything below the fold would have finished animating
 * before the reader arrived.
 */
export function Narrative({
  phrases,
  className,
}: {
  phrases: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setVisible(true);
          observer.disconnect();
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {phrases.map((phrase, index) =>
        visible ? (
          <TextGenerateEffect
            key={phrase}
            words={phrase}
            duration={0.6}
            className="mce-narrative-line"
          />
        ) : (
          // Placeholder keeps layout stable before the reveal starts. It stays
          // readable to assistive tech — only its visual opacity is dropped.
          <p key={phrase} className="mce-narrative-line is-pending">
            {phrase}
          </p>
        )
      )}
    </div>
  );
}
