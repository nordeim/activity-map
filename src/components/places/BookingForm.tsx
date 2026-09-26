"use client";

// The booking request form on the place detail page — re-measured from the
// live app (session 3, re-measured sessions 14 + 18): a SEPARATE white
// card (aside, rounded-28, black/8 hairline, no shadow — session-18: the
// card moved BELOW the hero photo into the detail grid's form column)
// leading with the "Book Now" 18px/600 h3 + the "Send your booking request
// for <place>." 14px #888580 subtitle, then Name*, Surname*, Dates*
// ("Choose dates"), Time* ("Choose time"), Phone, Email*, Message — all
// SINGLE-COLUMN full-width 44px fields with 16px corner radii (session-18:
// the live moved off rounded-full) — and the violet #571AFF 48px "Book
// Now" submit (a full pill, unchanged). Submitting posts to
// /api/bookings (guests stay server-clamped; the request fields are
// persisted on the Booking row).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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

export function BookingForm({ place }: { place: BookablePlace }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dates, setDates] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [note, setNote] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!place.isBookable || status === "busy") return;
    setStatus("busy");
    setNote(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: place.id,
          startDate: dates || null,
          endDate: dates || null,
          guests: 2,
          name,
          surname,
          time,
          phone,
          email,
          message,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setNote(body.error ?? "Could not send the booking request.");
        return;
      }
      setStatus("done");
      setNote("Request sent — see it under Profile → My bookings.");
      router.refresh();
    } catch {
      setStatus("error");
      setNote("Could not reach the server. Please try again.");
    }
  }

  if (!place.isBookable) {
    return (
      <aside
        id="book-now-card"
        className="scroll-mt-24 rounded-[28px] border border-[rgba(14,14,14,0.08)] bg-white p-6 md:p-8"
      >
        <p className="text-sm leading-relaxed text-secondary">
          This stop is browse-only — drop by any time, no reservation needed.
        </p>
      </aside>
    );
  }

  // Session-14 re-measure: the live's fields are single-column 44px rows
  // (was a 2-column 48px grid); the Dates/Time pickers carry the 600-weight
  // #888580 "Choose …" placeholder text like the live's picker buttons.
  // Session-18 re-measure: the field corners are 16px radii (the live moved
  // off rounded-full); the textarea matches at 16px.
  const field =
    "flex h-11 w-full items-center rounded-[16px] border border-black/10 bg-white px-5 text-sm font-medium text-ink outline-none transition placeholder:text-black/35 focus:border-roam/50";
  const pickerField =
    "flex h-11 w-full items-center rounded-[16px] border border-black/10 bg-white px-5 text-sm font-medium text-ink outline-none transition placeholder:font-semibold placeholder:text-[#888580] focus:border-roam/50";
  const label = "mb-1.5 block text-sm font-semibold text-ink";

  return (
    <aside
      id="book-now-card"
      className="scroll-mt-24 rounded-[28px] border border-[rgba(14,14,14,0.08)] bg-white p-6 md:p-8"
    >
      {/* Session-14 re-measure: the live leads with the 18px "Book Now"
          heading and demoted the request line to a 14px #888580 subtitle.
          Session-18: the live renders it as an h3 inside the aside card. */}
      <h3 className="text-lg font-semibold text-ink">Book Now</h3>
      <p className="mt-1 text-sm text-[#888580]">
        Send your booking request for {place.name}.
      </p>

      <form id="book-now" onSubmit={submit} className="mt-6 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={label} htmlFor="booking-name">
            Name<span className="text-roam" aria-hidden>*</span>
          </label>
          <input
            id="booking-name"
            aria-label="Name"
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </div>
        <div>
          <label className={label} htmlFor="booking-surname">
            Surname<span className="text-roam" aria-hidden>*</span>
          </label>
          <input
            id="booking-surname"
            aria-label="Surname"
            className={field}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>
        <div>
          <label className={label} htmlFor="booking-dates">
            Dates<span className="text-roam" aria-hidden>*</span>
          </label>
          <input
            id="booking-dates"
            aria-label="Dates"
            className={pickerField}
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder="Choose dates"
            required
          />
        </div>
        <div>
          <label className={label} htmlFor="booking-time">
            Time<span className="text-roam" aria-hidden>*</span>
          </label>
          <input
            id="booking-time"
            aria-label="Time"
            className={pickerField}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Choose time"
            required
          />
        </div>
        <div>
          <label className={label} htmlFor="booking-phone">
            Phone
          </label>
          <input
            id="booking-phone"
            aria-label="Phone"
            className={field}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            autoComplete="tel"
          />
        </div>
        <div>
          <label className={label} htmlFor="booking-email">
            Email<span className="text-roam" aria-hidden>*</span>
          </label>
          <input
            id="booking-email"
            aria-label="Email"
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className={label} htmlFor="booking-message">
            Message
          </label>
          <textarea
            id="booking-message"
            aria-label="Message"
            className="min-h-[106px] w-full rounded-[16px] border border-black/10 bg-white px-5 py-4 text-sm font-medium text-ink outline-none transition placeholder:text-black/35 focus:border-roam/50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything the host should know?"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "busy"}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-roam text-sm font-semibold text-white shadow-[0_12px_28px_rgba(87,26,255,0.28)] transition hover:bg-roam-deep disabled:opacity-60"
      >
        {status === "busy" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Book Now
      </button>

      {note ? (
        <p
          role="status"
          className={
            status === "error"
              ? "mt-4 rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-700"
              : "mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-center text-xs text-emerald-700"
          }
        >
          {note}
        </p>
      ) : null}
      </form>
    </aside>
  );
}
