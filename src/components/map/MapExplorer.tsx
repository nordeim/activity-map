"use client";

// The map view (measured from the reference): serif "Map" headline + the
// calm subheading, a white search bar ("Try: romantic hotels with a pool"),
// the category filter pills (All Places / Restaurants / Hotels / Sights),
// the rounded Leaflet canvas with black dot markers, and the
// "0 events · N places" status badge. The Leaflet bundle is browser-only,
// so the inner map mounts through next/dynamic with ssr:false.

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Search, MapPin, Star, X } from "lucide-react";
import type { PlaceCategory, PlaceDTO } from "@/types";
import { cn, priceRangeSymbols } from "@/lib/utils";

const LeafletCanvas = dynamic(() => import("./LeafletCanvas").then((m) => m.LeafletCanvas), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-cream-deep text-sm text-black/40">
      Loading map…
    </div>
  ),
});

const FILTERS: { label: string; value: PlaceCategory | "all" }[] = [
  { label: "All Places", value: "all" },
  { label: "Restaurants", value: "eat" },
  { label: "Hotels", value: "stay" },
  { label: "Sights", value: "do" },
];

export function MapExplorer({
  places,
  focusSlug,
  initialCategory,
  planner,
}: {
  places: PlaceDTO[];
  focusSlug: string | null;
  initialCategory: PlaceCategory | null;
  planner: { dates: string | null; guests: string | null };
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PlaceCategory | "all">(initialCategory ?? "all");
  const [active, setActive] = useState<string | null>(focusSlug);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (!q) return true;
      return [p.name, p.neighborhood, p.subCategory, p.vibeTags.join(" "), p.cuisineTags.join(" "), p.tags.join(" "), p.amenities.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [places, query, filter]);

  // Derived (not state-synced): the active selection only counts when the
  // current filter keeps the place visible.
  const activeVisible = active ? visible.some((p) => p.slug === active) : false;
  const activePlace = active && activeVisible ? places.find((p) => p.slug === active) ?? null : null;

  return (
    <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      {/* Headline */}
      <section className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="mb-4 font-serif text-5xl leading-tight tracking-tight text-ink sm:text-6xl md:text-7xl">
          Map
        </h1>
        <p className="text-base font-light text-black/60 sm:text-lg">
          Augsburg restaurants, hotels and experiences plotted across the old town.
        </p>
      </section>

      {/* Search bar */}
      <section className="mb-5">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-black/5 bg-white px-5 py-3.5 shadow-float">
          <Search className="h-5 w-5 shrink-0 text-black/35" strokeWidth={1.8} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: romantic hotels with a pool"
            aria-label="Search the map"
            className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-black/40"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black/40 hover:bg-black/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
        </div>

        {/* Filter pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                filter === value
                  ? "bg-ink text-white shadow-sm"
                  : "border border-black/10 bg-white text-black/70 hover:border-black/25",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Map canvas */}
      <section className="relative">
        <div className="h-[62vh] min-h-[420px] overflow-hidden rounded-3xl border border-black/5 shadow-card">
          <LeafletCanvas places={visible} activeSlug={active} onSelect={(slug) => setActive(slug)} />
        </div>

        {/* Status badge */}
        <div className="absolute right-4 top-4 z-10 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-lg">
          0 events · {visible.length} {visible.length === 1 ? "place" : "places"}
        </div>
      </section>

      {/* Selected place card */}
      {activePlace ? (
        <section className="mx-auto mt-6 max-w-xl">
          <Link
            href={`/place/${activePlace.slug}`}
            className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-4 shadow-card transition hover:-translate-y-0.5"
          >
            {activePlace.coverImageUrl ? (
              <img
                src={activePlace.coverImageUrl}
                alt={activePlace.name}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-black/40">
                {activePlace.subCategory ?? activePlace.category}
              </p>
              <h2 className="truncate text-lg font-semibold text-ink">{activePlace.name}</h2>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-black/50">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-ink text-ink" aria-hidden />
                  {activePlace.avgRating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                  {activePlace.neighborhood ?? "Augsburg"}
                </span>
                <span className="tracking-widest">{priceRangeSymbols(activePlace.priceRange)}</span>
              </p>
            </div>
          </Link>
        </section>
      ) : (
        <p className="mt-6 text-center text-sm text-black/40">
          {planner.dates || planner.guests
            ? `Planning ${planner.guests ?? "2"} guests${planner.dates ? ` · ${planner.dates}` : ""} — tap a dot to preview a place.`
            : "Tap a dot to preview a place."}
        </p>
      )}
    </main>
  );
}
