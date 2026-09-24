"use client";

// The Highlighted Restaurants band — the live app's vivid blue section
// (measured rgb(77,97,255)), redesigned in session 5:
//
// - Mobile (<md): a STACKED CARD DECK — browse-style cards (cover photo
//   with gradient, heart top-left, white rating pill top-right, the 28px
//   white title on the photo, then the white body with neighborhood · €
//   meta, description, tag pills, and the violet full-width Learn More)
//   sliding over each other as the section scrolls (sticky stacking).
//
// - Desktop (md+): a scroll-driven carousel inside a tall trap — the serif
//   headline + white View All pill, the restaurant names as a large
//   watermark (the active name solid white, the rest faint), floating
//   tilted photos, and one frosted-glass DETAIL CARD (address, € symbols,
//   ★★★★★, rating, "Book a Table" white pill + "Learn More" glass
//   outline) that swaps with the active restaurant as you scroll.
//
// Reduced motion / pre-hydration fallback: the desktop stage renders the
// same content statically (the first restaurant active).

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn, priceRangeSymbols } from "@/lib/utils";
import { SaveButton } from "@/components/places/SaveButton";
import type { PlaceDTO } from "@/types";

// Deterministic scatter for the floating photos (no Math.random — the
// layout must be stable between renders and test runs).
function photoPlacement(i: number): { left: string; top: string; rotate: number; width: number } {
  const left = 6 + ((i * 61) % 84); // 6%..90%
  const top = 8 + ((i * 37) % 52); // 8%..60%
  const rotate = ((i * 29) % 13) - 6; // -6°..+6°
  const width = 250 + ((i * 17) % 90); // 250..340px
  return { left: `${left}%`, top: `${top}%`, rotate, width };
}

export function HighlightedRestaurants({ restaurants }: { restaurants: PlaceDTO[] }) {
  const trapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        const trap = trapRef.current;
        const isMd = window.matchMedia("(min-width: 768px)").matches;
        if (trap && isMd && trap.offsetHeight > 0) {
          const r = trap.getBoundingClientRect();
          const total = Math.max(r.height - window.innerHeight, 1);
          const clamped = Math.min(Math.max(-r.top / total, 0), 1);
          setProgress(clamped * 100);
        }
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  if (restaurants.length === 0) return null;

  const step = 100 / Math.max(restaurants.length, 1);
  const activeIndex = Math.min(restaurants.length - 1, Math.floor(progress / step));
  const active = restaurants[activeIndex];

  return (
    <section id="highlighted-restaurants" className="bg-electric">
      {/* ---------- Desktop (md+): the scroll-driven carousel ---------- */}
      <div ref={trapRef} className="relative hidden md:block md:h-[300vh]">
        <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
          {/* Heading + white View All pill. */}
          <div className="mx-auto flex max-w-[1000px] items-end justify-between gap-4 px-6 pt-20">
            <h2 className="font-serif text-[42px] leading-[1.05] tracking-[-0.055em] text-white sm:text-[clamp(42px,7vw,104px)]">
              Highlighted Restaurants
            </h2>
            <Link
              href="/eat"
              className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#141413] transition hover:bg-white/90"
            >
              View All
            </Link>
          </div>

          {/* The name watermark — the active name solid, the rest faint. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none px-6"
          >
            <p className="flex flex-wrap items-baseline justify-center gap-x-8 gap-y-1 text-center">
              {restaurants.map((r, i) => (
                <span
                  key={r.slug}
                  className={cn(
                    "font-serif leading-none tracking-[-0.04em] transition-colors duration-500",
                    i === activeIndex
                      ? "text-[clamp(64px,8vw,104px)] text-white"
                      : "text-[clamp(40px,5vw,64px)] text-white/15",
                  )}
                >
                  {r.name}
                </span>
              ))}
            </p>
          </div>

          {/* The floating tilted photos. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            {restaurants.map((r, i) => {
              const place = photoPlacement(i);
              const isActive = i === activeIndex;
              return (
                <img
                  key={r.slug}
                  src={r.coverImageUrl ?? ""}
                  alt=""
                  loading="lazy"
                  className="absolute rounded-[18px] object-cover shadow-[0_18px_44px_rgba(14,14,14,0.28)] transition-all duration-500"
                  style={{
                    left: place.left,
                    top: place.top,
                    width: place.width,
                    transform: `rotate(${place.rotate}deg) scale(${isActive ? 1.08 : 0.94})`,
                    opacity: isActive ? 1 : 0.35,
                  }}
                />
              );
            })}
          </div>

          {/* The frosted-glass detail card (the active restaurant). */}
          {active && (
            <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center px-6">
              <div className="w-full max-w-[560px] rounded-[28px] bg-white/12 p-6 shadow-[0_18px_44px_rgba(14,14,14,0.22)] backdrop-blur-xl">
                <h3 className="font-serif text-3xl text-white">{active.name}</h3>
                {active.address && (
                  <p className="mt-1 text-sm text-white/75">{active.address}</p>
                )}
                <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                  <span>{priceRangeSymbols(active.priceRange)}</span>
                  <span aria-hidden className="tracking-[0.12em] text-amber-300">
                    ★★★★★
                  </span>
                  <span className="font-semibold text-white">{active.avgRating.toFixed(1)}</span>
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {active.isBookable && (
                    <Link
                      href={`/place/${active.slug}#book-now`}
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#141413] transition hover:bg-white/90"
                    >
                      Book a Table
                    </Link>
                  )}
                  <Link
                    href={`/place/${active.slug}`}
                    className="rounded-full border border-white/45 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Mobile (<md): the stacked card deck ---------- */}
      <div className="px-4 pb-16 pt-16 md:hidden">
        <h2 className="mb-8 text-center font-serif text-[42px] leading-[1.05] tracking-[-0.055em] text-white">
          Highlighted Restaurants
        </h2>

        <div className="relative">
          {restaurants.map((r, i) => (
            <article
              key={r.slug}
              className="relative sticky top-[64px] block overflow-hidden rounded-[28px] bg-white"
              style={{ zIndex: 10 + i, marginBottom: i === restaurants.length - 1 ? 0 : -290 }}
            >
              <Link href={`/place/${r.slug}`} className="flex h-full flex-col">
                {/* Photo with gradient, rating pill, overlaid title (the
                    heart overlay is a SIBLING of the link — a button inside
                    an anchor is invalid HTML). */}
                <div className="relative h-[300px] shrink-0 overflow-hidden bg-surface2">
                  {r.coverImageUrl ? (
                    <img src={r.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : null}
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/[0.66] via-black/10 to-black/[0.18]" />
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5">
                    <Star className="h-[13px] w-[13px] fill-ink text-ink" aria-hidden />
                    <span className="text-xs font-bold text-ink">{r.avgRating.toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                      {r.subCategory}
                    </p>
                    <h3 className="mt-1 w-full text-[28px] leading-none tracking-[-0.04em] text-white">
                      {r.name}
                    </h3>
                  </div>
                </div>

                {/* White body: meta, description, tag pills, Learn More. */}
                <div className="relative flex min-h-[190px] flex-1 flex-col p-5">
                  <p className="mb-3 flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-roam">
                      <span className="truncate">{r.neighborhood}</span>
                    </span>
                    <span className="shrink-0 text-sm text-black/60">{priceRangeSymbols(r.priceRange)}</span>
                  </p>
                  {r.shortDescription && (
                    <p className="line-clamp-2 text-sm leading-6 text-secondary">
                      {r.shortDescription}
                    </p>
                  )}
                  {r.cuisineTags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.cuisineTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-surface2 px-3 py-1.5 text-xs font-semibold text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="inline-flex h-11 w-full items-center justify-center rounded-full bg-roam text-sm font-semibold text-white transition hover:bg-roam-deep">
                      Learn More
                    </span>
                  </div>
                </div>
              </Link>
              {/* The heart overlay — sibling of the card link. */}
              <div className="absolute left-4 top-4 z-10">
                <SaveButton placeId={r.id} initialSaved={r.saved ?? false} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
