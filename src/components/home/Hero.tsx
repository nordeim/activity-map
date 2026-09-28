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
//
// Session-22 re-measure: the live's hero photo FRAMING — the
// .today-hero-section pulls itself up (mt −80px, landing at page y≈−8) and
// its .today-hero-bg is ABSOLUTE with inset −78px 0 6px, so the photo box
// spans page −86→924 at 1280 (1010px, cover-cropped ≈7.7% more zoomed than
// a full-container framing). The clone replicates the geometry with the
// section pinned at page y=0 (its own −mt-[73px] under the 73px in-flow
// sticky header strip) and the backdrop absolute at −top-[86px]/bottom-[14px]
// — the SAME page-space box (−86→924 @1280, −86→886 @768) while the h1
// keeps its measured pt-290/pt-203 anchors.

import { TripPlanner } from "@/components/planner/TripPlanner";

export function Hero() {
  return (
    <section className="today-hero-section relative w-full md:-mt-[73px]">
      {/* Backdrop — the live app's current hero photograph. The live's
          .today-hero-bg is ABSOLUTE at EVERY breakpoint: inset 0 on phones
          (the 591px section box), and from md it bleeds 86px ABOVE the
          section top, stopping 14px short of its bottom — the photo box
          is 972px @md / 1010px @lg, cover-cropped to the live's
          more-zoomed framing. The in-flow CONTENT layer below carries the
          section heights. */}
      <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden md:-top-[86px] md:bottom-[14px]">
        <img
          src="/images/hero-live.jpg"
          alt="Traveller looking up at a modern tower against the sky"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div aria-hidden className="hero-shade absolute inset-0" />
      </div>

      {/* Wordmark + the planner card — the in-flow CONTENT layer that
          carries the section heights (591 / 900 / 938). The text container
          spans the full bleed (the live h1 measures ~1232px at 1280 — a
          max-w-3xl box would clip the nowrap wordmark). Session-14
          re-measure: the live's content container carries px-6 (24px) at
          every breakpoint — the h1 starts at x=24 on phones AND desktop.
          Session-28: NO z-index on this wrapper — a z-10 here would CAP
          the planner popover's z-[30000] inside a stacking context that
          the category section's own z-10 (later in the DOM) paints over,
          intercepting the popover's day-cell clicks (the backdrop sibling
          is absolute/z-auto, so plain DOM order keeps the content on top
          — identical rendering, uncapped popover). */}
      <div className="relative flex h-[591px] flex-col px-6 pb-16 pt-[203px] md:h-[900px] md:pt-[290px] md:pb-24 lg:h-[938px]">
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

      {/* Soft blend into the paper canvas */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
