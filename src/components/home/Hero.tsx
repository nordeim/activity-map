"use client";

// The home hero, re-measured from the live app (sessions 2 + 3): a
// full-bleed traveller photograph, the huge WHITE LIBRE BASKERVILLE
// wordmark "Augsburg City Guide" sitting low over the photo (no subtitle —
// the planner follows the h1 directly), and the frosted GLASS PLANNER PILL
// (the shared <TripPlanner /> — hover-revealed segment labels, invisible
// selects, the react-day-picker-style range popover, and search routing to
// /eat|/stay|/do?people&start_date&end_date). The pill wraps 2×2 at 390px.

import { TripPlanner } from "@/components/planner/TripPlanner";

export function Hero() {
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
            <TripPlanner variant="glass" className="mt-4" />
          </div>
        </div>
      </div>

      {/* Soft blend into the paper canvas */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
