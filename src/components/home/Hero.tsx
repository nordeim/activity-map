"use client";

// The home hero: full-bleed Augsburg photograph, the huge white serif
// wordmark "Augsburg City Guide", and the frosted trip-planner pill
// (Select dates · 2 guests · Restaurants · search). Mirrors the reference
// dashboard measured at 1440×900 and 390×844.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Users, UtensilsCrossed, BedDouble, Compass, Search } from "lucide-react";

const CATEGORIES = [
  { value: "eat", label: "Restaurants", icon: UtensilsCrossed },
  { value: "stay", label: "Hotels", icon: BedDouble },
  { value: "do", label: "Experiences", icon: Compass },
] as const;

export function Hero() {
  const router = useRouter();
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("2");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["value"]>("eat");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dates) params.set("dates", dates);
    params.set("guests", guests);
    params.set("category", category);
    router.push(`/map?${params.toString()}`);
  }

  return (
    <section className="relative">
      {/* Backdrop */}
      <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden sm:h-[70vh]">
        <img
          src="/images/hero-augsburg.jpg"
          alt="Augsburg cityscape with the town hall skyline"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div aria-hidden className="hero-shade absolute inset-0" />

        {/* Wordmark + planner */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-24 pt-10 text-center sm:pb-28">
          <h1 className="font-serif text-[44px] leading-[1.05] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:text-7xl md:text-8xl">
            Augsburg City Guide
          </h1>
          <p className="mt-4 max-w-xl text-sm font-light text-white/85 drop-shadow sm:text-base">
            Restaurants, boutique stays and slow-city experiences — all in one calm guide.
          </p>

          {/* Trip planner pill */}
          <form
            onSubmit={submit}
            className="mt-8 flex w-full max-w-2xl flex-col divide-y divide-black/10 overflow-hidden rounded-3xl bg-white/80 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md sm:rounded-full sm:divide-x sm:divide-y-0"
          >
            <div className="flex flex-1 items-stretch sm:flex-row">
              <label className="flex flex-1 cursor-pointer items-center gap-2.5 px-3.5 py-3.5 text-left transition hover:bg-black/[0.03] sm:px-5">
                <Calendar className="h-4 w-4 shrink-0 text-black/50" strokeWidth={1.5} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-black/40">
                    Dates
                  </span>
                  <input
                    type="text"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="Select dates"
                    className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-black/60"
                  />
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2.5 border-t border-black/10 px-3.5 py-3.5 text-left transition hover:bg-black/[0.03] sm:border-l sm:border-t-0 sm:px-5">
                <Users className="h-4 w-4 shrink-0 text-black/50" strokeWidth={1.5} aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-black/40">
                    Guests
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-14 bg-transparent text-sm font-medium text-ink outline-none"
                    aria-label="Guests"
                  />
                </span>
              </label>

              <label className="relative flex cursor-pointer items-center gap-2.5 border-t border-black/10 px-3.5 py-3.5 text-left transition hover:bg-black/[0.03] sm:border-l sm:border-t-0 sm:px-5">
                {(() => {
                  const Icon = CATEGORIES.find((c) => c.value === category)!.icon;
                  return <Icon className="h-4 w-4 shrink-0 text-black/50" strokeWidth={1.5} aria-hidden />;
                })()}
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-black/40">
                    What
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as typeof category)}
                    className="w-full appearance-none bg-transparent text-[13px] font-medium text-ink outline-none sm:text-sm"
                    aria-label="Category"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-ink px-8 py-4 text-sm font-semibold text-white transition hover:bg-black sm:py-0"
            >
              <Search className="h-4 w-4" strokeWidth={2} aria-hidden />
              <span className="sm:hidden">Search the guide</span>
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Soft blend into the paper canvas */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
