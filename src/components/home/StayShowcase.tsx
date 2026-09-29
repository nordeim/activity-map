"use client";

import { StayCard } from "@/components/places/StayCard";
import { LetterReveal } from "./LetterReveal";
import { useParallax } from "./useParallax";
import type { PlaceDTO } from "@/types";

// The Choose Your Vibe stay showcase — re-measured from the live app
// (sessions 6 + 8 + 12 + 31): the big serif headline ("Choose Your Vibe,
// Select The Dates & Enjoy Your Ultimate Getaway", #1A1A1A) with the
// live's per-letter scroll reveal (cream → ink, LetterReveal) — session-31:
// the heading block is CENTER-ALIGNED (the live changed it from the
// session-12 left-aligned model) with the subtitle a centered 14px
// #888580 line — and all twelve stays as SQUARE photo cards (the shared
// StayCard design: aspect 1/1, rounded 24, dark bg, white Inter 18px dsk
// / 24px mob title overlaid at the photo bottom, address + "€€€ · ★
// rating" meta, ghost Learn More + white Book Now pills, heart overlay).
// Session-14: the grid fills COLUMN-MAJOR from md (grid-rows-4 +
// grid-flow-col — the live's 3 columns × 4 stacked cards; visual row 1
// reads Courtyard | Maison | Velvet) over the BARE 1178px grid (no
// container side padding) at an 18px gap → 381px cards; one column on
// phones (row flow — DOM order == visual order below md). Session-31: a
// client component — the section owns the parallax listener driving its
// cards' [data-parallax] imgs (the 1.16 zoom + the scroll ty).

export function StayShowcase({ stays }: { stays: PlaceDTO[] }) {
  const parallaxRef = useParallax<HTMLElement>();
  if (stays.length === 0) return null;
  return (
    <section id="stay-showcase" ref={parallaxRef} className="w-full pt-[112px]">
      {/* Session-31 re-measure: the live now CENTER-ALIGNS the heading
          text — the container pads px-[18px] and the h2 carries
          mx-auto max-w-[94vw] (at 1280 the box lands 1203 wide @x=38 with
          20.4px auto margins; below ~640 the container inner width binds
          and the box is full-bleed-inset). The rendered lines sit
          symmetrically; the subtitle stays centered. */}
      <div className="w-full px-[18px] text-center">
        <LetterReveal
          text="Choose Your Vibe, Select The Dates & Enjoy Your Ultimate Getaway"
          className="mx-auto max-w-[94vw] font-serif text-[40px] leading-[1.08] tracking-[-0.06em] text-[#1A1A1A] sm:text-[clamp(40px,7.2vw,112px)]"
        />
        <p className="mx-auto mt-5 max-w-md text-sm text-[#8A8780]">
          Pick a stay that matches your mood, from quiet design hotels to rooftop city escapes.
        </p>
      </div>

      {/* Session-14: the 1178px grid carries NO horizontal padding at
          md+ (the live's grid box IS 1178 — 381px cards at an 18px gap) and
          fills column-major from md (grid-rows-4 + grid-flow-col).
          Session-26: below md the live's mobile grid pads px-[18px] —
          the cards render INSET (354 wide at 390), not full-bleed. */}
      <div className="mx-auto w-full max-w-[1178px] pb-[144px]">
        <ul className="grid grid-cols-1 gap-[18px] px-[18px] md:grid-cols-3 md:grid-rows-4 md:px-0 md:[grid-auto-flow:column]">
          {stays.map((stay) => (
            <li key={stay.slug}>
              <StayCard place={stay} home />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
