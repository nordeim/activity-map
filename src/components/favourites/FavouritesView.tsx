"use client";

// The Favourites canvas (session-12 re-measure, session-14 geometry): the
// cream page whose graph-paper grid texture (the live regained it — an 18px
// crossing overlay, rgba(20,20,19,0.055) lines at 40% opacity) is scoped
// INSIDE the overflow-hidden heading section (the live's texture covers
// the heading block only, h≈299 — not the whole page), the serif title at
// the live's declared scale (text-[55px], leading 0.92, tracking −0.06em)
// riding the session-14 pt-16/md:pt-24 block (h1 y≈244) + the 14px #3A3A3A
// subtitle, and either the saved-place grid (cards reuse the browse
// PlaceCard) or the measured empty state (48px cream icon circle + 28px
// heart + Inter 20px/600 "No favourites yet").

import { Heart } from "lucide-react";
import type { PlaceDTO } from "@/types";
import { PlaceCard } from "@/components/places/PlaceCard";

export function FavouritesView({ places }: { places: PlaceDTO[] }) {
  return (
    <main className="relative min-h-[calc(100dvh-84px)] bg-cream px-5 pb-20 md:px-8">
      {/* Session-14 re-measure: the live scopes the 18px grid overlay to
          the HEADING SECTION (an overflow-hidden block — the texture stops
          after the subtitle; the cards below sit on plain cream) and the
          section runs pt-16 → md:pt-24 (h1 y≈244). */}
      <section className="relative overflow-hidden px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(20,20,19,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,20,19,0.055)_1px,transparent_1px)] [background-size:18px_18px]"
        />
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-float">
            <Heart className="h-6 w-6 fill-ink text-ink" strokeWidth={1.5} aria-hidden />
          </span>
          <h1 className="mb-3 font-serif text-[55px] leading-[0.92] tracking-[-0.06em] text-ink">
            Favourites
          </h1>
          <p className="text-sm text-[#3A3A3A]">
            All saved restaurants, hotels, and places in one calm collection.
          </p>
        </div>
      </section>

      {/* The saved collection (or the empty state) sits below the textured
          heading block on plain cream. */}
      <div className="relative mx-auto mt-6 max-w-[1100px]">
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
