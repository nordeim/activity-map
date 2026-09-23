// Pure planner seam — the trip-planner pill's param + label logic,
// measured from the live app (session 3):
//   • Search routes to /eat|/stay|/do?people=N[&start_date=…&end_date=…]
//     (bundle: Hotels→/stay, Attractions→/do, Restaurants→/eat).
//   • The dates segment renders "15/09/2026 — 18/09/2026" (DD/MM/YYYY,
//     em-dash joined) once a range is chosen; "Select dates" at rest.

export type PlannerType = "Restaurants" | "Hotels" | "Attractions";

export const PLANNER_TYPES: PlannerType[] = ["Restaurants", "Hotels", "Attractions"];

/** The browse route a planner search lands on for the selected type. */
export function plannerRoute(type: PlannerType): string {
  if (type === "Hotels") return "/stay";
  if (type === "Attractions") return "/do";
  return "/eat";
}

/** ISO date (YYYY-MM-DD) → DD/MM/YYYY (the live app's display format). */
export function formatPlannerDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** The dates segment label: "from — to", "from" alone, or "Select dates". */
export function plannerDateLabel(start?: string | null, end?: string | null): string {
  const from = formatPlannerDate(start ?? "");
  const to = end ? formatPlannerDate(end) : "";
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(from)) return "Select dates";
  return to && /^\d{2}\/\d{2}\/\d{4}$/.test(to) ? `${from} — ${to}` : from;
}

/** The search target: /eat?people=2&start_date=…&end_date=… (people always,
 *  dates only when chosen — exactly the live app's URLSearchParams build). */
export function plannerSearchUrl(
  type: PlannerType,
  people: number,
  start?: string | null,
  end?: string | null,
): string {
  const params = new URLSearchParams({ people: String(people) });
  if (start) params.set("start_date", start);
  if (end) params.set("end_date", end);
  return `${plannerRoute(type)}?${params.toString()}`;
}

/** The search button is "ready" once any date is chosen (live data-ready). */
export function plannerIsReady(start?: string | null, end?: string | null, people = 2, type: PlannerType = "Restaurants"): boolean {
  return Boolean(start || end || people !== 2 || type !== "Restaurants");
}
