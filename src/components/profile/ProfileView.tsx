"use client";

// The Profile canvas (measured from the reference): graph-paper background,
// the avatar chip + handle/email, the Trips / My bookings tab pair, the
// Upcoming (0) / Past (0) booking counts, the empty-reservation state
// ("No upcoming reservations. Time to explore."), and the sign-out action.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, LogOut, Compass, MapPin, Users, Sparkles } from "lucide-react";
import type { BookingDTO } from "@/types";
import { cn, initials } from "@/lib/utils";

export function ProfileView({
  user,
  bookings,
}: {
  user: { name: string; email: string };
  bookings: BookingDTO[];
  favouriteCount: number | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"trips" | "bookings">("trips");

  const now = Date.now();
  const upcoming = bookings.filter(
    (b) => (b.startDate ? new Date(b.startDate).getTime() : Infinity) >= now,
  );
  const past = bookings.filter(
    (b) => b.startDate ? new Date(b.startDate).getTime() < now : false,
  );

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="bg-grid min-h-[calc(100dvh-84px)] px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-[960px]">
        {/* Identity card */}
        <section className="mb-8 flex flex-col items-center gap-5 rounded-3xl bg-white p-8 text-center shadow-card sm:flex-row sm:p-10 sm:text-left">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink text-2xl font-bold text-white">
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold text-ink">{user.name}</h1>
            <p className="mt-1 truncate text-sm text-black/50">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-black/45 sm:justify-start">
              <span className="flex items-center gap-1 rounded-full bg-cream-deep px-3 py-1.5 font-medium">
                <MapPin className="h-3 w-3" strokeWidth={1.8} aria-hidden /> Augsburg, Germany
              </span>
              <span className="flex items-center gap-1 rounded-full bg-cream-deep px-3 py-1.5 font-medium">
                <Users className="h-3 w-3" strokeWidth={1.8} aria-hidden /> {upcoming.length} upcoming trips
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-black/30"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} aria-hidden /> Sign out
          </button>
        </section>

        {/* Tabs */}
        <div className="mb-6 flex items-center justify-center gap-2 rounded-full bg-white p-1.5 shadow-float sm:w-fit sm:mx-auto" role="tablist" aria-label="Profile sections">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "trips"}
            onClick={() => setTab("trips")}
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition",
              tab === "trips" ? "bg-ink text-white" : "text-black/60 hover:text-ink",
            )}
          >
            <Compass className="h-4 w-4" strokeWidth={1.8} aria-hidden /> Trips
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "bookings"}
            onClick={() => setTab("bookings")}
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition",
              tab === "bookings" ? "bg-ink text-white" : "text-black/60 hover:text-ink",
            )}
          >
            <CalendarDays className="h-4 w-4" strokeWidth={1.8} aria-hidden /> My bookings
          </button>
        </div>

        {tab === "trips" ? (
          <TripsTab upcoming={upcoming} />
        ) : (
          <BookingsTab upcoming={upcoming} past={past} />
        )}
      </div>
    </main>
  );
}

function TripsTab({ upcoming }: { upcoming: BookingDTO[] }) {
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-card md:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Upcoming ({upcoming.length})</h2>
          <Link href="/map" className="text-sm font-semibold text-roam hover:underline">
            Plan a trip
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl bg-cream px-6 py-10 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-float">
              <Sparkles className="h-5 w-5 text-black/40" strokeWidth={1.5} aria-hidden />
            </span>
            <p className="text-sm text-black/55">No upcoming reservations. Time to explore.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink">Past (0)</h2>
          <p className="mt-2 text-sm text-black/50">Trips you have taken will appear here.</p>
        </div>
        <div className="rounded-3xl bg-ink p-6 text-white shadow-card">
          <h2 className="font-serif text-xl">Slow-city checklist</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>· Rathausplatz golden hall</li>
            <li>· Fuggerei evening walk</li>
            <li>· Lech canals brunch</li>
          </ul>
          <Link
            href="/do"
            className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-cream"
          >
            Browse experiences
          </Link>
        </div>
      </div>
    </section>
  );
}

function BookingsTab({ upcoming, past }: { upcoming: BookingDTO[]; past: BookingDTO[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <div className="mb-5 flex items-center gap-6 border-b border-black/5 pb-4">
        <span className="text-sm font-semibold text-ink">Upcoming ({upcoming.length})</span>
        <span className="text-sm font-medium text-black/45">Past ({past.length})</span>
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-cream px-6 py-12 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-float">
            <CalendarDays className="h-5 w-5 text-black/40" strokeWidth={1.5} aria-hidden />
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
          {[...upcoming, ...past].map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </ul>
      )}
    </section>
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
            {booking.startDate ? new Date(booking.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Date to be decided"}
            {booking.endDate
              ? ` – ${new Date(booking.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
              : ""}
            {" · "}
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black/50 shadow-float">
          {booking.placeCategory}
        </span>
      </Link>
    </li>
  );
}
