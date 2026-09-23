import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1..4 → €, €€, €€€, €€€€ (the reference app's price-range display). */
export function priceRangeSymbols(range: number | null | undefined): string {
  const n = Math.max(0, Math.min(4, Math.round(range ?? 0)));
  return "€".repeat(n);
}

/** The browse-card price display (live parity): ACTIVE symbols plus DIMMED
    symbols filling to four total — `€€€` + a 30%-opacity `€`. */
export function priceRangeParts(
  range: number | null | undefined,
): { active: string; dimmed: string } {
  const n = Math.max(0, Math.min(4, Math.round(range ?? 0)));
  return { active: "€".repeat(n), dimmed: "€".repeat(Math.max(0, 4 - n)) };
}

export function formatPrice(value: number, currency = "EUR"): string {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}

/** 120 → "2 hrs"; 45 → "45 min" (the live app's browse-card wording). */
export function formatDuration(minutes: number | null | undefined): string | null {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hrs = h === 1 ? "1 hr" : `${h} hrs`;
  return m === 0 ? hrs : `${hrs} ${m} min`;
}

export function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}
