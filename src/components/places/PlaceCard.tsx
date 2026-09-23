"use client";

// The browse-grid card (measured from the reference Eat/Stay/Do views):
// full-bleed 4:5 image, dark gradient overlay, sub-category eyebrow + name
// set in white over the image, heart top-left, rating badge top-right, and
// a white footer with neighborhood + price symbols + a clamped description.

import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import type { PlaceDTO } from "@/types";
import { cn, priceRangeSymbols, formatDuration } from "@/lib/utils";
import { SaveButton } from "./SaveButton";

export function PlaceCard({ place }: { place: PlaceDTO }) {
  return (
    <article className="group h-full">
      <Link
        href={`/place/${place.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-12px_rgba(0,0,0,0.16)]"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-deep">
          {place.coverImageUrl ? (
            <img
              src={place.coverImageUrl}
              alt={place.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-serif text-4xl text-black/20">
              {place.name.charAt(0)}
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/60"
          />

          <SaveButton placeId={place.id} initialSaved={place.saved ?? false} className="absolute left-4 top-4" />

          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden />
            <span className="text-xs font-bold text-ink">
              {place.avgRating.toFixed(1)}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 pt-16">
            {place.subCategory ? (
              <p className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-white/80">
                {place.subCategory}
              </p>
            ) : null}
            <h3 className="text-2xl font-medium leading-tight text-white drop-shadow-md">
              {place.name}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <div className="flex items-center justify-between text-sm text-black/55">
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
              <span className="truncate">{place.neighborhood ?? "Augsburg"}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {place.durationMin ? (
                <span className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                  {formatDuration(place.durationMin)}
                </span>
              ) : null}
              <span className="tracking-widest text-xs font-medium text-black/45">
                {priceRangeSymbols(place.priceRange)}
              </span>
            </span>
          </div>
          {place.shortDescription ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-black/60">
              {place.shortDescription}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export function PlaceCardSkeleton() {
  return <div className={cn("aspect-[3/5] animate-pulse rounded-3xl bg-white/60")} />;
}
