/** Desktop folder. Sheets rise and the front tilts when the link that wraps it is hovered. */
export function MacFolder() {
  return (
    <span className="mac-folder" aria-hidden>
      <svg className="mf-back" viewBox="0 0 96 76">
        <path d="M7 4h24.5c1.9 0 3.7.8 5 2.3l3 3.4c1.3 1.5 3.1 2.3 5 2.3H89a5 5 0 0 1 5 5v50a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V9a5 5 0 0 1 5-5z" />
      </svg>
      <span className="mf-sheet mf-sheet-a" />
      <span className="mf-sheet mf-sheet-b" />
      <span className="mf-front" />
    </span>
  );
}
