"use client";

// The Favourites canvas (session-10 re-measure): the plain cream page
// (the graph-paper grid is gone — the live has no grid here), the serif
// title at the live's rendered scale (text-[50px] → 50.7px in Chromium,
// leading 0.92, tracking −0.06em) + calm subtitle, and either the
// saved-place grid (cards reuse the browse PlaceCard) or the measured
// empty state (48px cream icon circle + 28px heart + Inter 20px/600
// "No favourites yet").

import { Heart } from "lucide-react";
import type { PlaceDTO } from "@/types";
import { PlaceCard } from "@/components/places/PlaceCard";

export function FavouritesView({ places }: { places: PlaceDTO[] }) {
  return (
    <main className="min-h-[calc(100dvh-84px)] bg-cream px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-[1100px]">
        <section className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-float">
            <Heart className="h-6 w-6 fill-ink text-ink" strokeWidth={1.5} aria-hidden />
          </span>
          <h1 className="mb-3 font-serif text-[55px] leading-[0.92] tracking-[-0.06em] text-ink">
            Favourites
          </h1>
          <p className="text-sm font-light text-black/60 sm:text-base">
            All saved restaurants, hotels, and places in one calm collection.
          </p>
        </section>

        {places.length === 0 ? (
          <section className="mx-auto max-w-md">
            <div className="flex flex-col items-center rounded-[28px] border border-black/[0.08] bg-white px-6 py-16 text-center shadow-card">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F7F4]">
                <Heart className="h-7 w-7 text-[#0E0E0E]" strokeWidth={1.8} aria-hidden />
              </span>
              <h2 className="font-sans text-xl font-semibold text-ink">No favourites yet</h2>
              <p className="mt-1 text-sm text-muted">
                Tap a heart on any restaurant, hotel, or place card to save it here.
              </p>
            </div>
          </section>
        ) : (
          <>
            <p className="mb-5 text-sm text-black/45" aria-live="polite">
              {places.length} saved {places.length === 1 ? "place" : "places"}
            </p>
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
