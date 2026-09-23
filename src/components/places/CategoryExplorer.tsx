"use client";

// The shared Eat / Stay / Do browse surface: the serif headline + subtitle,
// the white search pill (query + trip dates + guests + view toggles), the
// horizontally-scrolling filter-chip row, and the responsive card grid.
// Mirrors the reference views measured at 1440×900.

import { useMemo, useState } from "react";
import { Search, Calendar, Users, SlidersHorizontal, LayoutGrid, X } from "lucide-react";
import type { CategoryMeta, PlaceDTO } from "@/types";
import { FILTER_CHIPS, filterPlaces } from "@/lib/filters";
import { cn } from "@/lib/utils";
import { PlaceCard } from "./PlaceCard";

export function CategoryExplorer({
  meta,
  places,
  dates,
  guests,
}: {
  meta: CategoryMeta;
  places: PlaceDTO[];
  dates?: string;
  guests?: string;
}) {
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const chipsAvailable = FILTER_CHIPS[meta.key];

  const visible = useMemo(() => filterPlaces(places, query, chips), [places, query, chips]);

  function toggleChip(label: string) {
    setChips((prev) => {
      if (label === "All") return prev.includes("All") ? [] : ["All"];
      const withoutAll = prev.filter((c) => c !== "All");
      return withoutAll.includes(label)
        ? withoutAll.filter((c) => c !== label)
        : [...withoutAll, label];
    });
  }

  return (
    <main className="mx-auto max-w-[1100px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      {/* Headline */}
      <section className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="mb-5 font-serif text-5xl leading-tight tracking-tight text-ink sm:text-6xl md:text-7xl">
          {meta.title}
        </h1>
        <p className="text-base font-light text-black/60 sm:text-lg">{meta.subtitle}</p>
      </section>

      {/* Search pill */}
      <section className="mb-6">
        <div className="mb-6 flex flex-col items-stretch gap-2 rounded-3xl border border-black/5 bg-white p-2 shadow-float md:flex-row md:items-center md:rounded-full">
          <div className="flex flex-1 items-center rounded-full px-4 py-2 transition hover:bg-black/[0.02]">
            <Search className="mr-3 h-5 w-5 shrink-0 text-black/35" strokeWidth={1.8} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={meta.searchPlaceholder}
              aria-label="Search places"
              className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-black/40"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black/40 hover:bg-black/5 hover:text-ink"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : null}
          </div>

          <div className="hidden h-8 w-px bg-black/10 md:block" />

          <div className="flex items-center justify-between gap-3 rounded-full border-t border-black/5 px-4 py-2 md:justify-start md:border-l md:border-t-0">
            <div>
              <span className="block text-xs font-medium text-black/40">Let&apos;s Plan Your Trip</span>
              <span className="flex items-center gap-1 text-sm font-medium text-ink">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                {dates || "Select dates"}
              </span>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-black/10 md:block" />

          <div className="flex items-center gap-2 rounded-full border-t border-black/5 px-4 py-2 md:border-l md:border-t-0">
            <div>
              <span className="block text-xs font-medium text-black/40">People</span>
              <span className="flex items-center gap-1 text-sm font-medium text-ink">
                <Users className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                {guests || "2"}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1 pl-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-black/45"
                title="Filters"
              >
                <SlidersHorizontal className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-ink"
                title="Grid view"
              >
                <LayoutGrid className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="relative">
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-1 pb-2">
            {chipsAvailable.map(({ label, kind }) => {
              const active = chips.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleChip(label)}
                  aria-pressed={active}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium transition-all",
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-black/10 bg-white text-black/70 hover:border-black/25 hover:shadow-sm",
                    kind === "special" && !active && "text-ink",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 bottom-2 hidden w-8 bg-gradient-to-l from-cream to-transparent md:block"
          />
        </div>
      </section>

      {/* Results */}
      <p className="mb-5 text-sm text-black/45" aria-live="polite">
        {visible.length} {visible.length === 1 ? "place" : "places"}
        {query || chips.filter((c) => c !== "All").length > 0 ? " match your filters" : ""}
      </p>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </section>

      {visible.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-card">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream-deep">
            <Search className="h-5 w-5 text-black/40" strokeWidth={1.5} aria-hidden />
          </span>
          <h2 className="font-serif text-2xl text-ink">No matches</h2>
          <p className="mt-2 max-w-sm text-sm text-black/50">
            Nothing in the guide fits that combination — try removing a filter or two.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setChips([]);
            }}
            className="mt-6 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
          >
            Reset filters
          </button>
        </div>
      ) : null}
    </main>
  );
}
