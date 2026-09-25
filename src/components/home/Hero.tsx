"use client";

// The home hero, re-measured from the live app (sessions 2 + 3, geometry
// re-measured session 10): a full-bleed traveller photograph, the huge WHITE
// LIBRE BASKERVILLE wordmark "Augsburg City Guide" over the photo (no
// subtitle — the planner follows the h1), and the frosted GLASS PLANNER PILL
// (the shared <TripPlanner /> — hover-revealed segment labels, invisible
// selects, the react-day-picker-style range popover, and search routing to
// /eat|/stay|/do?people&start_date&end_date).
//
// Session-10 geometry (measured on the live): the photo is 591px on phones /
// 900px at md / 938px at lg — much taller than the old vh build — and from
// md the photo slides UNDER the sticky transparent header (the live runs
// its photo 78px above the hero top, behind the 72px header strip, so the
// photo shows through around the white pill). Content positions: the h1
// tops at viewport y≈203 (phones) / y≈290 (desktop); the planner follows
// the 36px h1 with the live's 126px gap on phones / ~22px at md.

import { TripPlanner } from "@/components/planner/TripPlanner";

export function Hero() {
  return (
    <section className="today-hero-section relative w-full">
      {/* Backdrop — the live app's current hero photograph. */}
      <div className="relative h-[591px] w-full overflow-hidden md:-mt-[73px] md:h-[900px] lg:h-[938px]">
        <img
          src="/images/hero-live.jpg"
          alt="Traveller looking up at a modern tower against the sky"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div aria-hidden className="hero-shade absolute inset-0" />

        {/* Wordmark + the planner card. The text container spans the full
            bleed (the live h1 measures ~1232px at 1280 — a max-w-3xl box
            would clip the nowrap wordmark). Session-14 re-measure: the
            live's content container carries px-6 (24px) at every
            breakpoint — the h1 starts at x=24 on phones AND desktop. */}
        <div className="relative z-10 flex h-full flex-col px-6 pb-16 pt-[203px] md:pt-[290px] md:pb-24">
          <div className="mx-auto w-full text-center">
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

            {/* Trip planner — the frosted glass pill (measured tokens).
                The live's 126px phone gap under the 36px h1; ~22px at md. */}
            <TripPlanner variant="glass" className="mt-[126px] md:mt-6" />
          </div>
        </div>
      </div>

      {/* Soft blend into the paper canvas */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
