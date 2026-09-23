"use client";

// The booking card on the place detail page (right column): price line,
// rating summary, Check-in / Checkout / Guests fields, the black primary
// action and the "You won't be charged yet" reassurance — mirroring the
// reference app's reservation card.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, CalendarDays, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { PlaceCategory } from "@/types";

export interface BookablePlace {
  id: string;
  slug: string;
  name: string;
  category: PlaceCategory;
  isBookable: boolean;
  nightlyPrice: number | null;
  price: number | null;
  priceLabel: string | null;
  currency: string;
  avgRating: number;
  reviewCount: number;
  minParty: number | null;
  maxParty: number | null;
}

function actionLabel(category: PlaceCategory): string {
  if (category === "stay") return "Check Availability";
  if (category === "eat") return "Reserve a Table";
  return "Book Experience";
}

export function BookingForm({ place }: { place: BookablePlace }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const priceLine =
    place.category === "stay"
      ? place.nightlyPrice
        ? `${formatPrice(place.nightlyPrice, place.currency)} / night`
        : null
      : place.price != null
        ? `${formatPrice(place.price, place.currency)} / person`
        : place.priceLabel ?? null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!place.isBookable || status === "busy") return;
    setStatus("busy");
    setMessage(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: place.id,
          startDate: startDate || null,
          endDate: endDate || null,
          guests,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(body.error ?? "Could not save the reservation.");
        return;
      }
      setStatus("done");
      setMessage("Reserved — see it under Profile → My bookings.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  }

  if (!place.isBookable) {
    return (
      <div className="rounded-2xl border border-black/5 bg-cream p-6">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-ink">{priceLine ?? "Visit"}</span>
          {place.reviewCount > 0 ? (
            <span className="flex items-center gap-1 text-sm text-black/60">
              <Star className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden />
              {place.avgRating.toFixed(1)} ({place.reviewCount})
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-black/55">
          This stop is browse-only — drop by any time, no reservation needed.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-black/5 bg-cream p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
    >
      <div className="mb-5 flex items-center justify-between">
        {priceLine ? (
          <span className="text-2xl font-bold text-ink">{priceLine.split(" / ")[0]}</span>
        ) : (
          <span className="text-2xl font-bold text-ink">Reserve</span>
        )}
        {priceLine?.includes("/") ? (
          <span className="text-sm text-black/50">/ {priceLine.split(" / ")[1]}</span>
        ) : null}
        {place.reviewCount > 0 ? (
          <span className="flex items-center gap-1 text-sm text-black/60">
            <Star className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden />
            {place.avgRating.toFixed(1)} ({place.reviewCount})
          </span>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="cursor-pointer rounded-xl border border-black/10 bg-white p-3 transition hover:border-black/25">
            <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-black/40">
              <CalendarDays className="h-3 w-3" strokeWidth={1.8} aria-hidden /> Check-in
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
            />
          </label>
          <label className="cursor-pointer rounded-xl border border-black/10 bg-white p-3 transition hover:border-black/25">
            <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-black/40">
              <CalendarDays className="h-3 w-3" strokeWidth={1.8} aria-hidden /> Checkout
            </span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
            />
          </label>
        </div>

        <label className="block cursor-pointer rounded-xl border border-black/10 bg-white p-3 transition hover:border-black/25">
          <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-black/40">
            <Users className="h-3 w-3" strokeWidth={1.8} aria-hidden /> Guests
          </span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full appearance-none bg-transparent text-sm font-semibold text-ink outline-none"
          >
            {Array.from(
              { length: (place.maxParty ?? 8) - (place.minParty ?? 1) + 1 },
              (_, i) => (place.minParty ?? 1) + i,
            ).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={status === "busy"}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-black disabled:opacity-60"
        >
          {status === "busy" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {actionLabel(place.category)}
        </button>

        <p className="text-center text-xs text-black/45">You won&apos;t be charged yet</p>

        {message ? (
          <p
            role="status"
            className={
              status === "error"
                ? "rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-700"
                : "rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs text-emerald-700"
            }
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
