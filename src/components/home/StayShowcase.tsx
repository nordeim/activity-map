import { StayCard } from "@/components/places/StayCard";
import { LetterReveal } from "./LetterReveal";
import type { PlaceDTO } from "@/types";

// The Choose Your Vibe stay showcase — re-measured from the live app
// (sessions 6 + 8 + 12): the big serif headline ("Choose Your Vibe, Select The
// Dates & Enjoy Your Ultimate Getaway", #1A1A1A) with the live's per-letter
// scroll reveal (cream → ink, LetterReveal) — session-12: the heading block
// is FULL-WIDTH and LEFT-ALIGNED (no max-w-3xl centering) with the subtitle
// a centered 14px #888580 line — and all twelve stays as SQUARE photo cards
// (the shared StayCard design: aspect 1/1, rounded 24, dark bg, white Inter
// 18px dsk / 24px mob title overlaid at the photo bottom, address +
// "€€€ · ★ rating" meta, ghost Learn More + white Book Now pills, heart
// overlay) in a full-bleed 3-column grid from md (the live's 1178px inner
// grid, wrapper pt-112/pb-144) — one column on phones.

export function StayShowcase({ stays }: { stays: PlaceDTO[] }) {
  if (stays.length === 0) return null;
  return (
    <section id="stay-showcase" className="w-full pt-[112px]">
      {/* Session-12: the heading spans the full viewport width, left-aligned
          (the live's h2 starts at x≈38); the subtitle stays centered. */}
      <div className="w-full px-4 text-left sm:px-6">
        <LetterReveal
          text="Choose Your Vibe, Select The Dates & Enjoy Your Ultimate Getaway"
          className="font-serif text-[40px] leading-[1.08] tracking-[-0.06em] text-[#1A1A1A] sm:text-[clamp(40px,7.2vw,112px)]"
        />
        <p className="mx-auto mt-5 max-w-md text-sm text-[#8A8780]">
          Pick a stay that matches your mood, from quiet design hotels to rooftop city escapes.
        </p>
      </div>

      <div className="mx-auto w-full max-w-[1178px] px-4 pb-[144px] sm:px-6">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
