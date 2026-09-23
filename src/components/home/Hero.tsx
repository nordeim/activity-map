"use client";

// The home hero, re-measured from the live app (session 2): a full-bleed
// traveller photograph, the huge WHITE LIBRE BASKERVILLE wordmark
// "Augsburg City Guide" sitting low over the photo (no subtitle — the
// planner follows the h1 directly), and the frosted GLASS PLANNER PILL:
//
//   ( Let's Plan Your Trip · Select dates | People 2 | Restaurants | ⌕ )
//
// rounded-full, border-white/35, bg #F8F7F4/35, backdrop-blur — a 4-column
// segment grid on desktop that wraps 2×2 at 390px (measured: 258/76 px
// cells). Submitting routes to the map with the chosen prefs.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Users, UtensilsCrossed, BedDouble, Landmark, Search } from "lucide-react";

const TYPES = [
  { value: "eat", label: "Restaurants", icon: UtensilsCrossed },
  { value: "stay", label: "Hotels", icon: BedDouble },
  { value: "do", label: "Attractions", icon: Landmark },
] as const;

export function Hero() {
  const router = useRouter();
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("2");
  const [type, setType] = useState<(typeof TYPES)[number]["value"]>("eat");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dates) params.set("dates", dates);
    params.set("guests", guests);
    params.set("category", type);
    router.push(`/map?${params.toString()}`);
  }

  const TypeIcon = TYPES.find((t) => t.value === type)!.icon;

  return (
    <section className="today-hero-section relative w-full">
      {/* Backdrop — the live app's current hero photograph. */}
      <div className="relative h-[86vh] min-h-[560px] w-full overflow-hidden sm:h-[92vh]">
        <img
          src="/images/hero-live.jpg"
          alt="Traveller looking up at a modern tower against the sky"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div aria-hidden className="hero-shade absolute inset-0" />

        {/* Wordmark (low over the photo) + glass planner pill. */}
        <div className="relative z-10 flex h-full flex-col px-4 pb-16 pt-[38vh] sm:pb-24">
          <div className="mx-auto w-full max-w-3xl text-center">
            <h1
              className="font-serif whitespace-nowrap text-white"
              style={{
                fontSize: "clamp(34px, 9vw, 122px)",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                textShadow: "rgba(80, 60, 100, 0.18) 0px 2px 24px",
              }}
            >
              Augsburg City Guide
            </h1>

            {/* Trip planner — the frosted glass pill (measured tokens). */}
            <form
              onSubmit={submit}
              aria-label="Trip planner"
              className="mx-auto mt-4 grid w-full max-w-[548px] grid-cols-2 gap-1 rounded-full border border-white/35 bg-[#F8F7F4]/35 p-1 shadow-[0_8px_22px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-[28px] backdrop-saturate-150 sm:grid-cols-[minmax(42px,220px)_minmax(42px,90px)_minmax(42px,170px)_48px]"
            >
              {/* Dates — the lead segment carries the planner title. */}
              <label
                aria-label="Choose trip dates"
                className="group relative flex min-h-[40px] cursor-pointer flex-col justify-center rounded-full border border-transparent bg-transparent px-4 py-2 text-left transition-all duration-300 hover:border-white/60 hover:bg-[#F8F7F4]/50 sm:col-span-1"
              >
                <span className="pointer-events-none absolute left-1/2 top-1 hidden -translate-x-1/2 whitespace-nowrap text-[12px] font-medium text-black/45 sm:block">
                  Let&apos;s Plan Your Trip
                </span>
                <span className="flex items-center gap-2 pt-2 text-sm font-medium text-ink sm:pt-3.5">
                  <Calendar className="h-4 w-4 shrink-0 text-black/55" strokeWidth={1.6} aria-hidden />
                  <input
                    type="text"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="Select dates"
                    className="w-full min-w-0 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-black/70"
                  />
                </span>
                <span className="sr-only sm:hidden">Let&apos;s Plan Your Trip</span>
              </label>

              {/* People 1–8. */}
              <label
                aria-label="Number of people"
                className="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full border border-transparent bg-transparent px-4 py-2 transition-all duration-300 hover:border-white/60 hover:bg-[#F8F7F4]/50"
              >
                <Users className="h-4 w-4 shrink-0 text-black/55" strokeWidth={1.6} aria-hidden />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full min-w-0 appearance-none bg-transparent text-sm font-medium text-ink outline-none"
                >
                  {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="hidden text-xs text-black/45 sm:inline">People</span>
                <span className="sr-only sm:hidden">People</span>
              </label>

              {/* Type of activities. */}
              <label
                aria-label="Type of Activities"
                className="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full border border-transparent bg-transparent px-4 py-2 transition-all duration-300 hover:border-white/60 hover:bg-[#F8F7F4]/50"
              >
                <TypeIcon className="h-4 w-4 shrink-0 text-black/55" strokeWidth={1.6} aria-hidden />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                  className="w-full min-w-0 appearance-none bg-transparent text-sm font-medium text-ink outline-none"
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Search — the round accent button. */}
              <button
                type="submit"
                aria-label="Search trip matches"
                className="flex min-h-[40px] items-center justify-center rounded-full bg-ink/85 text-white transition hover:bg-ink"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Soft blend into the paper canvas */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
