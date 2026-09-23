import Link from "next/link";
import { Star } from "lucide-react";
import { priceRangeSymbols } from "@/lib/utils";
import type { PlaceDTO } from "@/types";

// The Choose Your Vibe stay showcase — the live home page's full hotel
// spread: a big serif headline, a one-line mood sub, and all twelve stays
// as rounded image cards (street address, € symbols · ★ rating) with
// Learn More + Book Now actions into the real place pages.

export function StayShowcase({ stays }: { stays: PlaceDTO[] }) {
  if (stays.length === 0) return null;
  return (
    <section id="stay-showcase" className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="font-serif text-4xl leading-[1.12] tracking-tight text-ink sm:text-5xl md:text-6xl">
          Choose Your Vibe, Select The Dates &amp; Enjoy Your Ultimate Getaway
        </h2>
        <p className="mt-5 text-sm font-light text-black/60 sm:text-base">
          Pick a stay that matches your mood, from quiet design hotels to rooftop city escapes.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stays.map((stay) => (
          <li key={stay.slug}>
            <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-float transition-shadow hover:shadow-card">
              <Link href={`/place/${stay.slug}`} className="block overflow-hidden">
                      <img
                  src={stay.coverImageUrl ?? ""}
                  alt={stay.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </Link>
              <div className="p-5">
                <h3 className="font-serif text-xl text-ink">{stay.name}</h3>
                {stay.address && (
                  <p className="mt-1 text-xs font-medium text-black/50">{stay.address}</p>
                )}
                <p className="mt-2.5 flex items-center gap-2 text-sm text-black/70">
                  <span>{priceRangeSymbols(stay.priceRange)}</span>
                  <span aria-hidden>·</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden />
                    <span className="font-semibold text-ink">{stay.avgRating.toFixed(1)}</span>
                  </span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link
                    href={`/place/${stay.slug}`}
                    className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink"
                  >
                    Learn More
                  </Link>
                  {stay.isBookable && (
                    <Link
                      href={`/place/${stay.slug}#book-now`}
                      className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
