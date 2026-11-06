/** Small flags drawn in SVG: emoji flags do not show on every system. */
export function Flag({ code }: { code: "ar" | "co" | "es" }) {
  switch (code) {
    case "ar":
      return (
        <svg className="flag" viewBox="0 0 30 20" aria-hidden>
          <rect width="30" height="20" fill="#74acdf" />
          <rect y="6.67" width="30" height="6.66" fill="#fff" />
          <circle cx="15" cy="10" r="2.2" fill="#f6b40e" />
        </svg>
      );
    case "co":
      return (
        <svg className="flag" viewBox="0 0 30 20" aria-hidden>
          <rect width="30" height="20" fill="#ce1126" />
          <rect width="30" height="15" fill="#003893" />
          <rect width="30" height="10" fill="#fcd116" />
        </svg>
      );
    default:
      return (
        <svg className="flag" viewBox="0 0 30 20" aria-hidden>
          <rect width="30" height="20" fill="#aa151b" />
          <rect y="5" width="30" height="10" fill="#f1bf00" />
        </svg>
      );
  }
}
