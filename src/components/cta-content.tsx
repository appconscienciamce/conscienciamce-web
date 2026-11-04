const POINTS = Array.from({ length: 10 }, (_, i) => i);

/** Inside of the primary button: rising points, label and arrow. */
export function CtaContent({ label }: { label: string }) {
  return (
    <>
      <span aria-hidden className="btn-points">
        {POINTS.map((point) => (
          <i key={point} />
        ))}
      </span>
      <span className="btn-label">
        {label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </>
  );
}
