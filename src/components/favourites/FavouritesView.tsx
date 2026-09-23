"use client";

// The Favourites canvas: the graph-paper background, the solid-heart chip,
// the serif title + calm subtitle, and either the saved-place grid (cards
// reuse the browse PlaceCard) or the measured empty state
// ("No favourites yet — tap a heart on any …").

import { Heart } from "lucide-react";
import type { PlaceDTO } from "@/types";
import { PlaceCard } from "@/components/places/PlaceCard";

export function FavouritesView({ places }: { places: PlaceDTO[] }) {
  return (
    <main className="bg-grid min-h-[calc(100dvh-84px)] px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-[1100px]">
        <section className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-float">
            <Heart className="h-6 w-6 fill-ink text-ink" strokeWidth={1.5} aria-hidden />
          </span>
          <h1 className="mb-3 font-serif text-5xl leading-tight tracking-tight text-ink sm:text-6xl md:text-7xl">
            Favourites
          </h1>
          <p className="text-base font-light text-black/60 sm:text-lg">
            All saved restaurants, hotels, and places in one calm collection.
          </p>
        </section>

        {places.length === 0 ? (
          <section className="mx-auto max-w-md">
            <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center shadow-card">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cream-deep">
                <Heart className="h-6 w-6 text-black/35" strokeWidth={1.5} aria-hidden />
              </span>
              <h2 className="font-serif text-2xl text-ink">No favourites yet</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-black/50">
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
