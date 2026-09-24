"use client";

// The Profile canvas — re-measured from the live app (session 3): the
// Sign-out action on top, the PROFILE eyebrow with the "Explorer" title,
// "Your Roam account" + Augsburg, the stat chips ("N day streak", the
// Explorer badge, "Saved places"), the TRIPS / My bookings section with
// Upcoming (n) / Past (n) / All tabs and the Eat / Stay / Do category
// filters, and the empty state "No upcoming reservations. Time to explore."

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, LogOut, MapPin, Sparkles, Flame, Compass } from "lucide-react";
import type { BookingDTO, PlaceCategory } from "@/types";
import { cn } from "@/lib/utils";

type BookingTab = "upcoming" | "past" | "all";
type CategoryFilter = PlaceCategory | "all";

export function ProfileView({
  user,
  bookings,
  favouriteCount,
}: {
  user: { name: string; email: string };
  bookings: BookingDTO[];
  favouriteCount: number | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<BookingTab>("upcoming");
  const [cat, setCat] = useState<CategoryFilter>("all");

  const now = Date.now();
  const upcoming = bookings.filter(
    (b) => (b.startDate ? new Date(b.startDate).getTime() : Infinity) >= now,
  );
  const past = bookings.filter((b) =>
    b.startDate ? new Date(b.startDate).getTime() < now : false,
  );

  const byCategory = (list: BookingDTO[]) =>
    cat === "all" ? list : list.filter((b) => b.placeCategory === cat);
  const shown =
    tab === "upcoming" ? byCategory(upcoming) : tab === "past" ? byCategory(past) : byCategory(bookings);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="bg-grid min-h-[calc(100dvh-84px)] px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-[960px]">
        {/* Sign out — the live app's top-right action. */}
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-black/30"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} aria-hidden /> Sign out
          </button>
        </div>

        {/* Identity — the live app's PROFILE block. */}
        <section className="mb-10 flex flex-col items-center text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-black/35">Profile</p>
          <h1 className="font-serif text-[clamp(42px,13vw,55px)] leading-[0.98] tracking-[-0.06em] text-ink">
            {user.name}
          </h1>
          <p className="mt-3 text-sm text-black/50">
            Your Roam account{user.email ? ` · ${user.email}` : ""}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-black/55">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden /> Augsburg
          </p>

          {/* Stat chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 font-medium text-black/55 shadow-float">
              <Flame className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden /> 0 day streak
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 font-semibold text-white">
              <Compass className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden /> Explorer
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 font-medium text-black/55 shadow-float">
              Saved places · {favouriteCount ?? 0}
            </span>
          </div>
        </section>

        {/* Bookings — TRIPS / My bookings with tabs + category filters. */}
        <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <div className="mb-5 flex items-end justify-between border-b border-black/5 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-black/35">Trips</h2>
            <span className="text-sm font-semibold text-ink">
              My bookings {shown.length}
            </span>
          </div>

          <div
            className="mb-4 flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Booking filters"
          >
            {(
              [
                ["upcoming", `Upcoming (${upcoming.length})`],
                ["past", `Past (${past.length})`],
                ["all", "All"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  tab === value ? "bg-ink text-white" : "text-black/60 hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-black/10 sm:block" />
            {(["all", "eat", "stay", "do"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCat(value)}
                aria-pressed={cat === value}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium capitalize transition",
                  cat === value
                    ? "border-ink bg-ink text-white"
                    : "border-black/10 text-black/60 hover:border-black/30",
                )}
              >
                {value === "all" ? "All" : value}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl bg-cream px-6 py-12 text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-float">
                <Sparkles className="h-5 w-5 text-black/40" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="text-sm text-black/55">No upcoming reservations. Time to explore.</p>
              <Link
                href="/stay"
                className="mt-5 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Find a stay
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {shown.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function BookingRow({ booking }: { booking: BookingDTO }) {
  return (
    <li>
      <Link
        href={`/place/${booking.placeSlug}`}
        className="flex items-center gap-4 rounded-2xl bg-cream p-3.5 transition hover:bg-cream-deep"
      >
        {booking.coverImageUrl ? (
          <img
            src={booking.coverImageUrl}
            alt={booking.placeName}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{booking.placeName}</p>
          <p className="mt-0.5 text-xs text-black/50">
            {booking.startDate
              ? new Date(booking.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
              : "Date to be decided"}
            {booking.endDate
              ? ` – ${new Date(booking.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
              : ""}
            {booking.time ? ` · ${booking.time}` : ""}
            {booking.name ? ` · ${booking.name}${booking.surname ? ` ${booking.surname}` : ""}` : ""}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black/50 shadow-float">
          <CalendarDays className="h-3 w-3" aria-hidden />
          {booking.placeCategory}
        </span>
      </Link>
    </li>
  );
}
