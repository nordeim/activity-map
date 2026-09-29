"use client";

// The home hero, re-measured from the live app (sessions 2 + 3, geometry
// re-measured sessions 10 + 22, the vh-model redesign session 31): a
// full-bleed traveller photograph, the huge WHITE LIBRE BASKERVILLE
// wordmark "Augsburg City Guide" over the photo (no subtitle — the planner
// follows the h1), and the frosted GLASS PLANNER PILL (the shared
// <TripPlanner /> — hover-revealed segment labels, invisible selects, the
// react-day-picker-style range popover, and search routing to
// /eat|/stay|/do?people&start_date&end_date).
//
// Session-31 re-measure: the live switched the hero to a
// VIEWPORT-HEIGHT-RELATIVE model with ROUNDED photo corners —
//   section: margin-top: -80px (was −73) over a content-driven height;
//   .today-hero-bg: top: calc(-80px + 0.25vh), height: calc(100% + 72px),
//     border-radius: 32px 32px 60% 60% / 32px 32px 80px 80px (big
//     elliptical rounded BOTTOM corners; 0 0 42% 42% / 0 0 48px 48px on
//     phones) — the img is object-fit FILL (width 100vw, min-height 100%,
//     object-position center top), no shade/blend overlays (the raw
//     image, which fades to cream at its own bottom edge);
//   .today-hero-content: margin-top: calc(5rem + 28vh) (the h1 −6px via
//     -translate-y-1.5, the pill mt-4);
//   the h1 font: clamp(34px, 9vw, 122px) at md+ and
//     clamp(32px, 9.2vw, 38px) below md (globals.css override — CAPPED at
//     38px; the old 9vw clamp rendered 57.6px at 640 vs the live's 38).
// The clone replicates the model with fitted calc heights (the live's
// section is content-driven: ≈714 + 0.28×vh at lg / 577 + 0.3×vh at md —
// measured 916/938/966 at 720/800/900 and 793/815/847 at md·{720,800,900}).
// At 1280×800 the formulas land EXACTLY on the session-22 values
// (h1 y≈290, the photo −86→924, the 591px phone box unchanged).
// The in-flow CONTENT layer keeps the mobile anchors (pt-203 / the 126px
// planner gap) — identical rendered geometry at 390×844.

import { TripPlanner } from "@/components/planner/TripPlanner";

export function Hero() {
  return (
    <section className="today-hero-section relative w-full md:-mt-[80px]">
      {/* Backdrop — the live app's current hero photograph. Session-31
          model: the .today-hero-bg is ABSOLUTE at every breakpoint with
          the ROUNDED-BOTTOM corner radius; at md+ it bleeds
          calc(-80px + 0.25vh) above the section top and runs
          calc(100% + 72px) tall (vh-relative — 919px @768×900 /
          1010px @1280×800 / 1038px @1280×900). Below md the globals.css
          mobile override pins it to the 591px section box with the
          42%/48px corner rounding. The img renders the live's fill model
          (width 100vw, min-height 100%, object-position center top) — no
          shade, no blend overlay (the live renders the raw image; the
          image's own cream fade handles the bottom edge). */}
      <div
        className="today-hero-bg absolute inset-x-0 overflow-hidden"
        style={{
          top: "calc(-80px + 0.25vh)",
          height: "calc(100% + 72px)",
          borderRadius: "32px 32px 60% 60% / 32px 32px 80px 80px",
        }}
      >
        <img
          src="/images/hero-live.jpg"
          alt="Traveller looking up at a modern tower against the sky"
          className="block h-auto min-h-full w-full"
          style={{ width: "100vw", maxWidth: "none", objectPosition: "center top" }}
          fetchPriority="high"
        />
      </div>

      {/* Wordmark + the planner card — the in-flow CONTENT layer that
          carries the section heights. The text container spans the full
          bleed (the live h1 measures ~1232px at 1280 — a max-w-3xl box
          would clip the nowrap wordmark). Session-14 re-measure: the
          live's content container carries px-6 (24px) at every
          breakpoint — the h1 starts at x=24 on phones AND desktop.
          Session-28: NO z-index on this wrapper — a z-10 here would CAP
          the planner popover's z-[30000] inside a stacking context that
          the category section's own z-10 (later in the DOM) paints over,
          intercepting the popover's day-cell clicks (the backdrop
          sibling is absolute/z-auto, so plain DOM order keeps the
          content on top — identical rendering, uncapped popover).
          Session-31: the heights/pt are the live's vh-relative calcs. */}
      <div className="relative flex h-[591px] flex-col px-6 pb-16 pt-[203px] md:h-[calc(577px+30vh)] md:pt-[calc(5rem+28vh)] md:pb-24 lg:h-[calc(714px+28vh)]">
        <div className="mx-auto w-full text-center">
          <h1
            className="today-hero-title font-serif whitespace-nowrap text-white md:-translate-y-1.5"
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
              The live's 126px phone gap under the 36px h1; 16px at md
              (session-31: was 24px). */}
          <TripPlanner variant="glass" className="mt-[126px] md:mt-4" />
        </div>
      </div>
    </section>
  );
}
