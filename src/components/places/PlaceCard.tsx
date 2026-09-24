"use client";

// The browse-grid card for Eat / Do (re-measured from the live app,
// session 3): a fixed h-[372px] image with the NAME overlaid on the photo
// (Inter 28px, tracking −0.04em) under the sub-category eyebrow, the heart
// (36px black/45 disc) top-left, the rating pill top-right (plus a dark
// duration badge on Do cards), and a white body: map-pin + neighborhood,
// the ACTIVE+DIMMED price symbols (13px, muted), the description that
// slides away on md-hover, the tag pills (surface2), and the violet
// #571AFF "Learn More" pill (h-11) that fades in on md-hover — always
// visible on touch sizes.

import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import type { PlaceDTO } from "@/types";
import { cn, priceRangeParts, formatDuration } from "@/lib/utils";
import { SaveButton } from "./SaveButton";

export function PlaceCard({ place }: { place: PlaceDTO }) {
  const { active, dimmed } = priceRangeParts(place.priceRange);
  const tags = place.category === "eat" ? place.cuisineTags : place.vibeTags;
  const duration = formatDuration(place.durationMin);

  return (
    <article className="group h-full">
      <Link href={`/place/${place.slug}`} className="flex h-full flex-col">
        {/* Image with the overlaid name */}
        <div className="relative h-[300px] flex-shrink-0 overflow-hidden bg-surface2 sm:h-[372px]">
          {place.coverImageUrl ? (
            <img
              src={place.coverImageUrl}
              alt={place.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif text-4xl text-black/20">
              {place.name.charAt(0)}
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/[0.66] via-black/10 to-transparent"
          />

          <SaveButton
            placeId={place.id}
            initialSaved={place.saved ?? false}
            className="absolute left-4 top-4 z-10"
          />

          <div className="absolute right-4 top-4 flex items-center gap-2">
            {duration ? (
              <div className="flex items-center rounded-full bg-[#0e0e0e]/[0.42] px-3 py-1.5 text-xs font-bold text-white backdrop-blur-[14px]">
                <Clock className="mr-1 h-3 w-3" strokeWidth={2} aria-hidden />
                {duration}
              </div>
            ) : null}
            <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5">
              <Star className="h-[13px] w-[13px] fill-ink text-ink" aria-hidden />
              <span className="text-xs font-bold text-ink">{place.avgRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            {place.subCategory ? (
              <p className="mb-1 text-xs text-white/75">{place.subCategory}</p>
            ) : null}
            <h3 className="w-full text-[28px] leading-none tracking-[-0.04em] text-white">
              {place.name}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="relative flex min-h-[190px] flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted">
              <MapPin className="h-[15px] w-[15px] shrink-0" strokeWidth={2} aria-hidden />
              <span className="truncate">{place.neighborhood ?? "Augsburg"}</span>
            </div>
            <span className="shrink-0 text-[13px] text-muted">
              {active}
              <span className="opacity-30">{dimmed}</span>
            </span>
          </div>

          {place.shortDescription ? (
            <p className="text-sm leading-6 text-secondary transition-all duration-500 ease-out md:group-hover:-translate-y-4 md:group-hover:opacity-0">
              {place.shortDescription}
            </p>
          ) : null}

          {tags.length > 0 ? (
            <div className="mt-auto flex flex-wrap gap-2 transition-transform duration-500 ease-out md:group-hover:-translate-y-14">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface2 px-3 py-1.5 text-xs font-semibold text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Learn More — violet pill, revealed on md-hover. */}
          <div className="absolute bottom-5 left-5 right-5 translate-y-0 opacity-100 transition-all duration-500 ease-out md:translate-y-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <span className="inline-flex h-11 w-full items-center justify-center rounded-full bg-roam text-sm font-semibold text-white shadow-[0_12px_28px_rgba(87,26,255,0.28)]">
              Learn More
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PlaceCardSkeleton() {
  return <div className={cn("aspect-[3/5] animate-pulse rounded-3xl bg-white/60")} />;
}
