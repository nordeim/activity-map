import Link from "next/link";
import { Clock } from "lucide-react";
import { priceRangeSymbols } from "@/lib/utils";
import type { PlaceDTO } from "@/types";

// The Recommended Route — the timed itinerary measured from the live home
// page: a progress line ("100% of your day planned") and five stops
// (9:00 AM Morning Coffee → 9:30 PM Dinner), each with place name, meta
// (neighborhood · rating · €€ · tag — or duration/price for culture stops),
// a one-line description, and a Learn More link into the place page.

const STOPS: Array<{ time: string; title: string }> = [
  { time: "9:00 AM", title: "Morning Coffee" },
  { time: "1:00 PM", title: "Lunch Break" },
  { time: "4:00 PM", title: "Afternoon Culture" },
  { time: "7:00 PM", title: "Sunset Drinks" },
  { time: "9:30 PM", title: "Dinner" },
];

function stopMeta(p: PlaceDTO): string {
  const parts: string[] = [];
  if (p.neighborhood) parts.push(p.neighborhood);
  if (p.category === "do") {
    if (p.durationMin) parts.push(`${p.durationMin} min`);
    if (p.priceLabel) parts.push(p.priceLabel);
    else if (p.price === 0) parts.push("Free");
    else if (p.price) parts.push(`€${p.price}`);
  } else {
    if (p.avgRating) parts.push(`${p.avgRating} rating`);
    const symbols = priceRangeSymbols(p.priceRange);
    if (symbols) parts.push(symbols);
  }
  if (p.subCategory) parts.push(p.subCategory);
  return parts.join(" · ");
}

export function RecommendedRoute({ stops }: { stops: PlaceDTO[] }) {
  if (stops.length === 0) return null;
  return (
    <section id="recommended-route" className="mx-auto max-w-[1000px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-4xl leading-tight tracking-tight text-ink sm:text-6xl md:text-7xl">
          Recommended Route
        </h2>
        <p className="mt-4 text-sm font-medium text-black/55 sm:text-base">
          100% of your day planned
        </p>
      </div>

      <ol className="relative space-y-10 sm:space-y-14">
        {/* The timeline spine */}
        <span aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-black/10 sm:left-[23px]" />
        {stops.map((place, i) => {
          const stop = STOPS[i] ?? { time: "", title: place.name };
          return (
            <li key={place.slug} className="relative flex gap-4 sm:gap-8">
              {/* Time chip on the spine */}
              <div className="relative z-10 flex w-10 shrink-0 flex-col items-center sm:w-12">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white shadow-float sm:h-12 sm:w-12">
                  <Clock className="h-4 w-4 text-ink/70" strokeWidth={1.6} aria-hidden />
                </span>
              </div>

              {/* Stop card */}
              <div className="min-w-0 flex-1 rounded-3xl border border-black/5 bg-white p-5 shadow-float sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-serif text-2xl text-ink sm:text-3xl">{stop.title}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-black/45">
                    {stop.time}
                  </span>
                </div>
                <Link
                  href={`/place/${place.slug}`}
                  className="mt-2 block text-lg font-semibold text-ink transition hover:text-roam sm:text-xl"
                >
                  {place.name}
                </Link>
                <p className="mt-1 text-xs font-medium text-black/50 sm:text-sm">{stopMeta(place)}</p>
                {place.shortDescription && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/65">
                    {place.shortDescription}
                  </p>
                )}
                <div className="mt-4">
                  <Link
                    href={`/place/${place.slug}`}
                    className="text-sm font-semibold text-roam underline-offset-4 transition hover:text-roam-deep hover:underline"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
