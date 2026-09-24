"use client";

// The Recommended Route — re-measured from the live app (sessions 3 + 6) as
// a scroll-driven section:
//
//   1. a 140vh "heading trap" (-mb-[110vh]) whose centered
//      "Recommended Route" heading (clamp 38px→72px, ls −0.045em) stays
//      pinned while the tall section scrolls past;
//   2. the route body — below lg: a vertical column of PHOTO stop cards
//      (rounded-28 white cards: cover photo with the time pill + serif stop
//      title on a gradient, then the place name, the INLINE meta line
//      "Altstadt · 4.8 rating · €€ · Coffee", the description, and the
//      full-width BLACK Learn More pill) threaded on a dashed timeline;
//      from lg: a 340vh scroll trap — the route VISUAL (solid winding path
//      with five numbered waypoints + the progress pill "N% of your day
//      planned") pinned left while ONE stop card at a time fills the right
//      half, swapping as the scroll progress passes each fifth (the live
//      app's sticky card swap).
//
// The progress pill fills 20% per passed stop (0% at rest — the live app's
// initial state; 100% once Dinner passes). Below lg the visual collapses
// and the progress pill rides along as a sticky chip under the navbar.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn, priceRangeSymbols } from "@/lib/utils";
import type { PlaceDTO } from "@/types";

const STOPS: Array<{ time: string; title: string }> = [
  { time: "9:00 AM", title: "Morning Coffee" },
  { time: "1:00 PM", title: "Lunch Break" },
  { time: "4:00 PM", title: "Afternoon Culture" },
  { time: "7:00 PM", title: "Sunset Drinks" },
  { time: "9:30 PM", title: "Dinner" },
];

// The live card's INLINE meta line: "Altstadt · 4.8 rating · €€ · Coffee".
function stopMetaInline(p: PlaceDTO): string {
  const parts: string[] = [];
  if (p.neighborhood) parts.push(p.neighborhood);
  if (p.avgRating) parts.push(`${p.avgRating} rating`);
  const symbols = priceRangeSymbols(p.priceRange);
  if (symbols) parts.push(symbols);
  if (p.subCategory) parts.push(p.subCategory);
  return parts.join(" · ");
}

export function RecommendedRoute({ stops }: { stops: PlaceDTO[] }) {
  const trapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        const trap = trapRef.current;
        const isLg = window.matchMedia("(min-width: 1024px)").matches;
        if (trap && isLg && trap.offsetHeight > 0) {
          // Desktop: progress across the scroll trap (0 → 100).
          const r = trap.getBoundingClientRect();
          const total = Math.max(r.height - window.innerHeight, 1);
          const clamped = Math.min(Math.max(-r.top / total, 0), 1);
          setProgress(clamped * 100);
        } else {
          // Mobile: cards pass the 60% line, one fill step each.
          const cards = document.querySelectorAll("[data-stop-index]");
          let passed = 0;
          cards.forEach((card) => {
            const r = card.getBoundingClientRect();
            if (r.top < window.innerHeight * 0.6) passed += 1;
          });
          setProgress(Math.min(passed, stops.length) * (100 / Math.max(stops.length, 1)));
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
  }, [stops.length]);

  if (stops.length === 0) return null;
  const step = 100 / Math.max(stops.length, 1);
  const passedStops = Math.round(progress / step);
  const activeIndex = Math.min(stops.length - 1, Math.floor(progress / step));

  return (
    <>
      {/* 1 — the heading trap: tall section, pinned centered heading. */}
      <section aria-label="Recommended Route heading" className="relative -mb-[110vh] h-[140vh] bg-cream">
        <div className="pointer-events-none sticky top-0 z-20 flex justify-center px-6 pb-4 pt-[7.5rem] text-center">
          <h2 className="font-serif text-[38px] leading-none tracking-[-0.045em] text-[#141413] md:text-[clamp(38px,6vw,72px)]">
            Recommended Route
          </h2>
        </div>
      </section>

      {/* 2 — the route body: mobile = vertical photo-card column threaded
          on a dashed timeline; lg+ = a 340vh trap with the pinned visual
          and ONE swapping card. */}
      <section id="recommended-route" className="relative bg-cream">
        <div ref={trapRef} className="relative lg:h-[340vh]">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
            {/* The route visual — pinned (lg+) with the progress pill. */}
            <div className="sticky top-0 hidden h-screen w-[46%] shrink-0 overflow-hidden lg:block">
              <svg
                aria-hidden
                viewBox="0 0 400 800"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
              >
                {/* The winding route path through the five waypoints —
                    solid black base (session-6 re-measure). */}
                <path
                  d="M 120 90 C 60 200, 300 260, 280 360 C 260 450, 90 430, 110 540 C 130 650, 300 620, 290 720"
                  fill="none"
                  stroke="#0e0e0e"
                  strokeOpacity={passedStops > 0 ? 0.16 : 0.1}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <path
                  d="M 120 90 C 60 200, 300 260, 280 360 C 260 450, 90 430, 110 540 C 130 650, 300 620, 290 720"
                  fill="none"
                  stroke="#571aff"
                  strokeWidth={3}
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 900,
                    strokeDashoffset: 900 - (900 * progress) / 100,
                    transition: "stroke-dashoffset 300ms ease-out",
                    opacity: passedStops > 0 ? 1 : 0.25,
                  }}
                />
                {[
                  { x: 120, y: 90 },
                  { x: 280, y: 360 },
                  { x: 110, y: 540 },
                  { x: 200, y: 470 },
                  { x: 290, y: 720 },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={i < passedStops ? 14 : 11}
                      fill={i < passedStops ? "#571aff" : "#ffffff"}
                      stroke={i < passedStops ? "#571aff" : "#0e0e0e"}
                      strokeOpacity={i < passedStops ? 1 : 0.35}
                      strokeWidth={2.5}
                      style={{ transition: "all 300ms ease-out" }}
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill={i < passedStops ? "#ffffff" : "#0e0e0e"}
                      fillOpacity={i < passedStops ? 1 : 0.55}
                    >
                      {i + 1}
                    </text>
                  </g>
                ))}
              </svg>

              {/* The progress pill (the live app's bottom-24 centered chip). */}
              <div className="absolute inset-x-0 bottom-24 z-10 flex justify-center px-6">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-secondary shadow-float">
                  {Math.round(progress)}% of your day planned
                </span>
              </div>
            </div>

            {/* The stops column — mobile: flowing photo cards; lg+: the
                swapping stack (one absolute card visible at a time). */}
            <div className="relative flex-1 px-4 pb-24 sm:px-6 lg:flex lg:items-center lg:justify-center lg:px-12 lg:pb-0">
              {/* Mobile progress chip rides under the (fixed) navbar. */}
              <div className="sticky top-[60px] z-10 -mt-2 mb-4 flex justify-center lg:hidden">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-secondary shadow-float">
                  {Math.round(progress)}% of your day planned
                </span>
              </div>

              {/* The mobile dashed timeline threaded behind the cards. */}
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-10 left-1/2 top-16 hidden -translate-x-1/2 border-l-2 border-dashed border-black/15 lg:hidden sm:block"
              />

              <div className="relative w-full lg:min-h-[560px] lg:max-w-md">
                {stops.map((place, i) => {
                  const stop = STOPS[i] ?? { time: "", title: place.name };
                  const active = i === activeIndex;
                  return (
                    <article
                      key={place.slug}
                      data-stop-index={i}
                      data-active={active}
                      className={cn(
                        "mx-auto mt-7 block overflow-hidden rounded-[28px] bg-white shadow-[0_18px_44px_rgba(14,14,14,0.1)] first:mt-0",
                        // lg+: the swapping stack — one absolute card fills
                        // the panel; the rest fade out below.
                        "lg:absolute lg:inset-x-0 lg:top-0 lg:mt-0 lg:transition-all lg:duration-500",
                        "lg:data-[active=false]:pointer-events-none lg:data-[active=false]:translate-y-10 lg:data-[active=false]:opacity-0",
                      )}
                    >
                      {/* The cover photo with the time pill + serif stop title. */}
                      <div className="relative">
                        {place.coverImageUrl ? (
                          <img
                            src={place.coverImageUrl}
                            alt=""
                            loading="lazy"
                            className="h-44 w-full object-cover sm:h-52"
                          />
                        ) : (
                          <div className="h-44 w-full bg-[#181818] sm:h-52" />
                        )}
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-t from-black/[0.62] via-black/10 to-black/[0.18]"
                        />
                        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                          <Clock className="h-3 w-3" strokeWidth={2} aria-hidden />
                          {stop.time}
                        </span>
                        <div className="absolute bottom-4 left-5 right-5">
                          <h3 className="font-serif text-[32px] leading-[1.05] tracking-[-0.02em] text-white sm:text-[36px] lg:text-[48px]">
                            {stop.title}
                          </h3>
                        </div>
                      </div>

                      {/* The white detail panel. */}
                      <div className="p-5">
                        <Link
                          href={`/place/${place.slug}`}
                          className="block text-base font-semibold text-ink transition hover:text-roam"
                        >
                          {place.name}
                        </Link>
                        <p className="mt-1 text-sm font-medium text-muted">
                          {stopMetaInline(place)}
                        </p>
                        {place.shortDescription && (
                          <p className="mt-3 text-sm leading-relaxed text-secondary">
                            {place.shortDescription}
                          </p>
                        )}
                        <div className="mt-4">
                          <Link
                            href={`/place/${place.slug}`}
                            className="flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-black"
                          >
                            Learn More
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
