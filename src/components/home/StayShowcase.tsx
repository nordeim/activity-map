import { StayCard } from "@/components/places/StayCard";
import type { PlaceDTO } from "@/types";

// The Choose Your Vibe stay showcase — re-measured from the live app
// (session 6): the big serif headline ("Choose Your Vibe, Select The Dates
// & Enjoy Your Ultimate Getaway", #1A1A1A), a one-line mood sub, and all
// twelve stays as SQUARE photo cards (the shared StayCard design: aspect 1/1,
// rounded 24, dark bg, white Inter 18px title overlaid at the photo bottom,
// address + "€€€ · ★ rating" meta, ghost Learn More + white Book Now pills,
// heart overlay) in a 3-column grid from md — one column on phones.

export function StayShowcase({ stays }: { stays: PlaceDTO[] }) {
  if (stays.length === 0) return null;
  return (
    <section id="stay-showcase" className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="font-serif text-[40px] leading-[1.08] tracking-[-0.06em] text-[#1A1A1A] sm:text-[clamp(40px,7.2vw,112px)]">
          Choose Your Vibe, Select The Dates &amp; Enjoy Your Ultimate Getaway
        </h2>
        <p className="mt-5 text-sm font-light text-black/60 sm:text-base">
          Pick a stay that matches your mood, from quiet design hotels to rooftop city escapes.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stays.map((stay) => (
          <li key={stay.slug}>
            <StayCard place={stay} home />
          </li>
        ))}
      </ul>
    </section>
  );
}
