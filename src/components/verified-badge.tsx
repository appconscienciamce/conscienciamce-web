/** The blue check of a verified account, drawn once so the phone and the board share it. */
export function VerifiedBadge({ className = "ed-verified" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label="Verificado">
      <polygon fill="#0095f6" points="12.00,0.00 14.69,1.95 18.00,1.61 19.35,4.65 22.39,6.00 22.05,9.31 24.00,12.00 22.05,14.69 22.39,18.00 19.35,19.35 18.00,22.39 14.69,22.05 12.00,24.00 9.31,22.05 6.00,22.39 4.65,19.35 1.61,18.00 1.95,14.69 0.00,12.00 1.95,9.31 1.61,6.00 4.65,4.65 6.00,1.61 9.31,1.95" />
      <path d="M7.2 12.3l3.1 3.1 6.5-6.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
