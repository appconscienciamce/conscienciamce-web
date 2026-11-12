/** Real seat counter. The page shows nothing about seats unless this answers with a real number. */
const SEATS_URL = "https://api.conscienciamce.com/api/bootcamp/seats";
const TIMEOUT_MS = 2000;
const REVALIDATE_S = 60;

/**
 * Seats left, from the API: `{ "data": { "total": number, "left": number } }`.
 * Any failure (network, timeout, non-200, bad shape) or nothing left returns `null`.
 * There is no fallback number: a missing line is better than an invented one.
 */
export async function getSeatsLeft(): Promise<number | null> {
  try {
    const res = await fetch(SEATS_URL, {
      next: { revalidate: REVALIDATE_S },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/json" },
    });
    if (res.status !== 200) return null;

    const body: unknown = await res.json();
    const data = (body as { data?: { total?: unknown; left?: unknown } } | null)?.data;
    const total = data?.total;
    const left = data?.left;
    if (typeof total !== "number" || typeof left !== "number") return null;
    if (!Number.isInteger(total) || !Number.isInteger(left) || left > total) return null;

    return left > 0 ? left : null;
  } catch {
    return null;
  }
}
