"use client";

// The Highlighted Restaurants band — the live app's vivid blue section
// (measured rgb(77,97,255)), redesigned in session 5 + re-measured sessions
// 18 + 29:
//
// - Mobile (<md): a STICKY STACKING deck (session-26 re-measure) — the
//   FIRST SIX restaurants flow as plain cards (browse-style: cover photo
//   with gradient, heart top-left, white rating pill top-right, the 28px
//   white title on the photo, then the white body with neighborhood · €
//   meta, description, tag pills, and the violet full-width Learn More)
//   620px apart, each card pinning at viewport y≈88 (the live implements
//   the same pin via its own JS transforms — the CSS-sticky here is the
//   documented visual equivalent).
//
// - Desktop (md+): a scroll-driven carousel inside a tall trap (session-29
//   re-measure) — the restaurant names as a centered FIVE-NAME sliding
//   window (uniform Inter clamp(24px,2.6vw,40px) 400, gap 34 — the active
//   solid white, the rest white/0.32, the row centers as a group), floating
//   tilted photos, a sticky CENTERED heading column (the h2
//   clamp(46px,7vw,104px) + the white View All pill below at gap 24) that
//   FADES OUT through the first ~45% of the trap, and one COMPACT
//   frosted-glass detail card (min-w 330 at bottom 9vh: the address line +
//   the centered €·★·rating meta row + two flex-1 h-38 buttons — NO name)
//   that fades IN as the heading fades out.
//   Session-18 re-measure: the band RISES over the route trap's tail
//   (lg:-mt-[800px]) — its top starts at the route sticky's release point,
//   exactly like the live (band top ≈ route release, ~800px overlap).
//
// Reduced motion / pre-hydration fallback: the desktop stage renders the
// same content statically (the first restaurant active, the heading
// visible, the card at opacity 0 — the crossfade only engages on scroll).

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

  // Session-8 re-measure: the live mobile deck carries the FIRST SIX
  // restaurants (Volta, Roux, Aura, Garbo, Kōan, Ember) — the desktop
  // carousel still iterates all sixteen.
  const deck = restaurants.slice(0, 6);

  const step = 100 / Math.max(restaurants.length, 1);
  const activeIndex = Math.min(restaurants.length - 1, Math.floor(progress / step));
  const active = restaurants[activeIndex];

  // Session-29 re-measure: the heading layer and the featured card
  // CROSSFADE through the first half of the trap — the centered heading
  // column fades OUT (1 → 0 between progress 30% and 45%) while the
  // compact featured card fades IN (the live's sampled curve: heading 1
  // @21%, 0.63 @35%, 0 @49% — card 0 @21%, 1 @49%).
  const cardFade = Math.min(Math.max((progress - 30) / 15, 0), 1);
  const headingOpacity = 1 - cardFade;

  // Session-29 re-measure (F2): the names watermark is a FIVE-name sliding
  // window — 2 before + the active + 2 after (circular wrap: at rest the
  // row reads Granary, Faro, VOLTA, Roux, Aura). One centered row, every
  // name the SAME uniform Inter size (the active is NOT bigger), the
  // active solid white, the rest white/0.32.
  const len = restaurants.length;
  const nameWindow =
    len >= 5
      ? [-2, -1, 0, 1, 2].map((k) => restaurants[(activeIndex + k + len) % len])
      : restaurants;

  return (
    <section
      id="highlighted-restaurants"
      className="relative z-10 bg-electric lg:-mt-[800px]"
    >
      {/* ---------- Desktop (md+): the scroll-driven carousel ---------- */}
      <div ref={trapRef} className="relative hidden md:block md:h-[460vh]">
        <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
          {/* Session-29 re-measure (F1): the heading layer is a sticky,
              vertically + horizontally CENTERED column — the h2
              clamp(46px,7vw,104px) lh 1.02 tracking -0.055em text-center
              with the white View All pill BELOW it (gap 24, h 44, 13px/600,
              tracking 0.02em). The layer FADES OUT through the first ~45%
              of the trap (the live's 120ms linear transition). */}
          <div
            data-band-heading
            className="absolute inset-0 z-[8] flex flex-col items-center justify-center gap-6 transition-opacity duration-100 ease-linear"
            style={{
              opacity: headingOpacity,
              pointerEvents: headingOpacity > 0.5 ? "auto" : "none",
            }}
          >
            <h2 className="text-center font-serif text-[clamp(46px,7vw,104px)] leading-[1.02] tracking-[-0.055em] text-white">
              Highlighted Restaurants
            </h2>
            <Link
              href="/eat"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 text-[13px] font-semibold tracking-[0.02em] text-[#141413] transition hover:bg-white/90"
            >
              View All
            </Link>
          </div>

          {/* Session-29 re-measure (F2): the names watermark — the centered
              FIVE-name sliding window. The row centers AS A GROUP (the
              active lands near — not exactly at — the viewport center,
              matching the live's asymmetric-name layout). Uniform Inter
              clamp(24px,2.6vw,40px) 400 at tracking -0.02em, gap 34. */}
          <div
            data-band-names
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none"
          >
            <p className="flex items-center justify-center gap-[34px] font-sans text-[clamp(24px,2.6vw,40px)] font-normal tracking-[-0.02em]">
              {nameWindow.map((r, i) => (
                <span
                  key={`${r.slug}-${i}`}
                  className={cn(
                    "whitespace-nowrap transition-colors duration-500",
                    i === 2 ? "text-white" : "text-white/[0.32]",
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

          {/* Session-29 re-measure (F3): the featured detail card — the
              live's compact centered model. min-width 330 at bottom 9vh,
              pad 16, radius 28, bg white/0.08 + the 1px white/0.16 border +
              blur 18 + the 0 18 48 /0.35 shadow, TEXT-CENTER: the address
              line (12px tracking 0.04em white/0.56) + the centered meta row
              (gap 14, 13px: € + the 4px dot + ★★★★★ gold #F7D774 + rating)
              + two flex-1 h-38 buttons (Book a Table white with the 1px
              white/0.28 border 12px/600; Learn More white/0.08 12px/500).
              NO name inside (the name lives in the watermark only). The
              card fades IN as the heading column fades out. */}
          {active && (
            <div
              data-featured-card
              className="absolute bottom-[9vh] left-1/2 z-10 min-w-[330px] -translate-x-1/2 rounded-[28px] border border-white/[0.16] bg-white/[0.08] p-4 text-center shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur-[18px] transition-opacity duration-100 ease-linear"
              style={{ opacity: cardFade }}
            >
              <p className="mb-2 truncate px-6 text-xs tracking-[0.04em] text-white/[0.56]">
                {active.address ?? "Augsburg"}
              </p>
              <p className="flex items-center justify-center gap-[14px] text-[13px] text-white/[0.86]">
                <span>{priceRangeSymbols(active.priceRange)}</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-white/[0.35]" />
                <span aria-hidden className="tracking-[0.08em] text-[#F7D774]">
                  ★★★★★
                </span>
                <span>{active.avgRating.toFixed(1)}</span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                {active.isBookable && (
                  <Link
                    href={`/place/${active.slug}#book-now`}
                    className="flex h-[38px] flex-1 items-center justify-center rounded-full border border-white/[0.28] bg-white px-[14px] text-xs font-semibold text-black transition hover:bg-white/90"
                  >
                    Book a Table
                  </Link>
                )}
                <Link
                  href={`/place/${active.slug}`}
                  className="flex h-[38px] flex-1 items-center justify-center rounded-full bg-white/[0.08] px-[14px] text-xs font-medium text-white transition hover:bg-white/[0.16]"
                >
                  Learn More
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Mobile (<md): the flowing card list (session 18) ---------- */}
      {/* Session-26 re-measure: the live's mobile-restaurant-stack
          returned to a STICKY STACKING deck — the section pads 56/18/0
          (pt-14, px-[18px], no bottom pad) and each card is
          `sticky top-[88px]` (the live's pin offset below the 52px
          tab-bar): a card pins at viewport y=88 and the next flows up
          OVER it (DOM order paints the later card above). The flow gap
          stays 130px (620px advances). */}
      <div className="px-[18px] pt-14 md:hidden">
        <h2 className="mb-8 text-center font-serif text-[42px] leading-[1.05] tracking-[-0.055em] text-white">
          Highlighted Restaurants
        </h2>

        <div className="relative">
          {deck.map((r, i) => (
            <article
              key={r.slug}
              className="sticky top-[88px] block overflow-hidden rounded-[28px] bg-white"
              style={{ marginBottom: i === deck.length - 1 ? 0 : 130 }}
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
