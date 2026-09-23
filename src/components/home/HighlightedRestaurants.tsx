"use client";

// The Highlighted Restaurants band — the live app's vivid blue section
// (measured rgb(77,97,255)): a white serif headline, a horizontal restaurant
// strip (tap a card to feature it), and the featured card with address,
// price symbols, the five-star row, the rating value, and Book a Table /
// Learn More actions. A View All link hands off to the Eat browse.

import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn, priceRangeSymbols } from "@/lib/utils";
import type { PlaceDTO } from "@/types";

export function HighlightedRestaurants({ restaurants }: { restaurants: PlaceDTO[] }) {
  const [selectedSlug, setSelectedSlug] = useState(restaurants[0]?.slug ?? "");
  const featured = restaurants.find((r) => r.slug === selectedSlug) ?? restaurants[0];
  if (restaurants.length === 0 || !featured) return null;

  return (
    <section id="highlighted-restaurants" className="bg-electric">
      <div className="mx-auto max-w-[1000px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-[42px] leading-[1.05] tracking-[-0.055em] text-white sm:text-[clamp(42px,7vw,104px)]">
            Highlighted Restaurants
          </h2>
          <Link
            href="/eat"
            className="text-sm font-semibold text-white underline-offset-4 transition hover:underline"
          >
            View All
          </Link>
        </div>

        {/* grid-cols-1 = minmax(0,1fr): without it the implicit auto track
            sizes to the featured image's intrinsic width (2400px) and blows
            the page out horizontally — on a phone this also drags the fixed
            navbar off-canvas (ICB re-anchoring). */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          {/* Featured card */}
          <article className="overflow-hidden rounded-3xl bg-white/10 p-2 backdrop-blur-sm">
              <img
              src={featured.coverImageUrl ?? ""}
              alt={featured.name}
              className="aspect-[4/3] w-full rounded-[20px] object-cover"
            />
            <div className="px-4 pb-3 pt-4">
              <h3 className="font-serif text-2xl text-white sm:text-3xl">{featured.name}</h3>
              {featured.address && (
                <p className="mt-1 text-sm text-white/75">{featured.address}</p>
              )}
              <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                <span>{priceRangeSymbols(featured.priceRange)}</span>
                <span aria-hidden className="tracking-[0.12em] text-amber-300">
                  ★★★★★
                </span>
                <span className="font-semibold text-white">{featured.avgRating.toFixed(1)}</span>
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {featured.isBookable && (
                  <Link
                    href={`/place/${featured.slug}#book-now`}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-electric transition hover:bg-white/90"
                  >
                    Book a Table
                  </Link>
                )}
                <Link
                  href={`/place/${featured.slug}`}
                  className="rounded-full border border-white/45 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </article>

          {/* The strip — tap to feature */}
          <div className="lg:pt-2">
            <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {restaurants.map((r) => (
                <li key={r.slug} className="w-[136px] shrink-0 snap-start sm:w-[152px]">
                  <button
                    type="button"
                    onClick={() => setSelectedSlug(r.slug)}
                    aria-pressed={r.slug === featured.slug}
                    className={cn(
                      "group block w-full overflow-hidden rounded-2xl text-left transition",
                      r.slug === featured.slug
                        ? "ring-2 ring-white ring-offset-2 ring-offset-electric"
                        : "opacity-85 hover:opacity-100",
                    )}
                  >
                              <img
                      src={r.coverImageUrl ?? ""}
                      alt={r.name}
                      className="aspect-[4/5] w-full object-cover"
                    />
                    <span className="block bg-white/10 px-3 py-2.5 text-sm font-semibold text-white">
                      {r.name}
                      <span className="mt-0.5 flex items-center gap-1 text-xs font-medium text-white/70">
                        <Star className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden />
                        {r.avgRating.toFixed(1)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 hidden text-sm text-white/70 lg:block">
              Tap a table to feature it — every card opens the full restaurant page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
