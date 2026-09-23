"use client";

// The shared Eat / Stay / Do browse surface, re-measured from the live app
// (session 3): the serif headline (clamp 36→55px, ls −0.06em) + subtitle,
// the WHITE search pill (h-12 with the round filters button), the STICKY
// trip-planner shell (planner-filter-shell, top-24 — pre-filled from the
// URL params the home planner forwarded), the horizontally-scrolling
// filter-chip row, and the max-w-7xl responsive card grid.

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { CategoryMeta, PlaceDTO } from "@/types";
import { FILTER_CHIPS, filterPlaces } from "@/lib/filters";
import { cn } from "@/lib/utils";
import { PlaceCard } from "./PlaceCard";
import { StayCard } from "./StayCard";
import { TripPlanner } from "@/components/planner/TripPlanner";

export function CategoryExplorer({
  meta,
  places,
  planner,
}: {
  meta: CategoryMeta;
  places: PlaceDTO[];
  planner?: { people: number; start: string | null; end: string | null };
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
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 md:pt-16">
      {/* Headline */}
      <section className="mx-auto mb-8 max-w-3xl text-center">
        <h1 className="mb-4 font-serif text-[36px] leading-[1.08] tracking-[-0.06em] text-ink sm:text-[clamp(36px,4.3vw,55px)]">
          {meta.title}
        </h1>
        <p className="text-sm font-light text-black/60 sm:text-base">{meta.subtitle}</p>
      </section>

      {/* Search row — the white pill + the round filters button. */}
      <section className="mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-12 flex-1 items-center rounded-full border border-black/5 bg-white px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <Search className="mr-3 h-4 w-4 shrink-0 text-muted" strokeWidth={1.8} aria-hidden />
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
                className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-muted transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_18px_rgba(14,14,14,0.12)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={`Open ${meta.label} filters`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/5 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-ink hover:text-white"
          >
            <SlidersHorizontal className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        {/* The sticky planner shell — pre-filled from the forwarded params. */}
        <div className="planner-filter-shell sticky top-[70px] z-40 mt-4 md:top-24">
          <TripPlanner
            variant="white"
            initialPeople={planner?.people ?? 2}
            initialStart={planner?.start ?? null}
            initialEnd={planner?.end ?? null}
            className="mt-0"
          />
        </div>

        {/* Filter chips */}
        <div className="relative mt-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-1 pb-2">
            {chipsAvailable.map(({ label, kind }) => {
              const active = chips.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleChip(label)}
                  aria-pressed={active}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-ink text-white"
                      : "bg-white text-secondary hover:shadow-[0_8px_18px_rgba(14,14,14,0.1)]",
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
      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "place" : "places"}
      </p>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((place) =>
          meta.key === "stay" ? (
            <StayCard key={place.id} place={place} />
          ) : (
            <PlaceCard key={place.id} place={place} />
          ),
        )}
      </section>

      {visible.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-card">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface2">
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
