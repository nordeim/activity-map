"use client";

// The shared Eat / Stay / Do browse surface (session-8 re-measure): the
// serif headline (clamp 36→55px, ls −0.06em) + subtitle, the UNIFIED
// browse planner (one white card on phones / one sticky white pill from
// md — search + labelled date/people fields + the two circular icon
// actions; see BrowsePlanner), the horizontally-scrolling filter-chip
// row, and the max-w-7xl responsive card grid.

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { CategoryMeta, PlaceDTO } from "@/types";
import { FILTER_CHIPS, filterPlaces } from "@/lib/filters";
import { cn } from "@/lib/utils";
import { PlaceCard } from "./PlaceCard";
import { StayCard } from "./StayCard";
import { BrowsePlanner } from "@/components/planner/BrowsePlanner";

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
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-16 md:px-8 md:pt-24">
      {/* Headline — session-14 re-measure: the live's section runs
          px-5/pt-16 → md:px-8/md:pt-24 (h1 y≈168) and the heading block
          spans the full max-w-7xl width; the subtitle is 14px #3A3A3A. */}
      <section className="mx-auto mb-8 max-w-7xl text-center">
        <h1 className="mb-5 font-serif text-[clamp(42px,13vw,55px)] leading-[0.95] tracking-[-0.06em] text-ink">
          {meta.title}
        </h1>
        <p className="text-sm text-[#3A3A3A]">{meta.subtitle}</p>
      </section>

      {/* The unified browse planner (session 8): search + labelled date /
          people fields + the two icon actions in ONE container — a white
          card below md (not sticky), one sticky white pill from md. */}
      <section className="mb-5">
        <BrowsePlanner
          category={meta.key}
          searchPlaceholder={meta.searchPlaceholder}
          query={query}
          onQueryChange={setQuery}
          initialPeople={planner?.people ?? 2}
          initialStart={planner?.start ?? null}
          initialEnd={planner?.end ?? null}
        />

        {/* Filter chips — session-12 live chrome: compact 38px pills with
            12px text (the live shrank them from 40px/14px). */}
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
                    "flex h-[38px] items-center whitespace-nowrap rounded-full px-4 text-xs font-medium transition-all",
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
