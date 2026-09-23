"use client";

// The Recommended Route — re-measured from the live app (session 3) as a
// scroll-driven section:
//
//   1. a 140vh "heading trap" (-mb-[110vh]) whose centered
//      "Recommended Route" heading (clamp 38px→72px, ls −0.045em) stays
//      pinned while the tall section scrolls past;
//   2. the route body — a sticky route VISUAL (the winding path with the
//      five numbered waypoints and the progress pill "N% of your day
//      planned") pinned beside the scrolling stop cards (white
//      rounded-[28px] cards, 48px Libre Baskerville titles, stacked
//      "· "-prefixed meta lines, Learn More links).
//
// The progress pill fills 20% per stop that scrolls past the viewport
// (0% at rest — the live app's initial state; 100% once Dinner passes).
// Below lg the visual collapses and the progress pill rides along as a
// sticky chip under the navbar.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { priceRangeSymbols } from "@/lib/utils";
import type { PlaceDTO } from "@/types";

const STOPS: Array<{ time: string; title: string }> = [
  { time: "9:00 AM", title: "Morning Coffee" },
  { time: "1:00 PM", title: "Lunch Break" },
  { time: "4:00 PM", title: "Afternoon Culture" },
  { time: "7:00 PM", title: "Sunset Drinks" },
  { time: "9:30 PM", title: "Dinner" },
];

function stopMeta(p: PlaceDTO): string[] {
  const parts: string[] = [];
  if (p.neighborhood) parts.push(p.neighborhood);
  if (p.category === "do") {
    if (p.durationMin) parts.push(`${p.durationMin} min`);
    if (p.priceLabel) parts.push(p.priceLabel);
    else if (p.price === 0) parts.push("Free");
    else if (p.price) parts.push(`€${p.price}`);
  } else {
    if (p.avgRating) parts.push(`· ${p.avgRating} rating`);
    const symbols = priceRangeSymbols(p.priceRange);
    if (symbols) parts.push(`· ${symbols}`);
  }
  if (p.subCategory) parts.push(`· ${p.subCategory}`);
  // The first part (neighborhood) carries no dot prefix on the live card.
  return parts.map((part, i) => (i === 0 || part.startsWith("·") ? part : `· ${part}`));
}

export function RecommendedRoute({ stops }: { stops: PlaceDTO[] }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        const body = bodyRef.current;
        if (body) {
          const cards = body.querySelectorAll("[data-stop-index]");
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
  const passedStops = Math.round(progress / (100 / stops.length));

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

      {/* 2 — the route body: sticky visual + scrolling stop cards. */}
      <section id="recommended-route" className="relative bg-cream">
        <div className="flex items-start">
          {/* The route visual — pinned (lg+) with the progress pill. */}
          <div className="sticky top-0 hidden h-screen w-[46%] shrink-0 overflow-hidden lg:block">
            <svg
              aria-hidden
              viewBox="0 0 400 800"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full"
            >
              {/* The winding route path through the five waypoints. */}
              <path
                d="M 120 90 C 60 200, 300 260, 280 360 C 260 450, 90 430, 110 540 C 130 650, 300 620, 290 720"
                fill="none"
                stroke="#0e0e0e"
                strokeOpacity={passedStops > 0 ? 0.16 : 0.1}
                strokeWidth={3}
                strokeDasharray="1 10"
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

          {/* The stops panel — cards scroll while the visual stays pinned. */}
          <div ref={bodyRef} className="relative flex-1 px-4 pb-24 sm:px-6 lg:px-12">
            {/* Mobile progress chip rides under the (fixed) navbar. */}
            <div className="sticky top-[60px] z-10 -mt-2 mb-4 flex justify-center lg:hidden">
              <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-secondary shadow-float">
                {Math.round(progress)}% of your day planned
              </span>
            </div>

            {stops.map((place, i) => {
              const stop = STOPS[i] ?? { time: "", title: place.name };
              return (
                <article
                  key={place.slug}
                  data-stop-index={i}
                  className="mx-auto mt-7 block max-w-md rounded-[28px] bg-white p-5 shadow-[0_8px_22px_rgba(0,0,0,0.06)] transition-all duration-300 first:mt-0"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{stop.time}</p>
                  <h3 className="mt-1 font-serif text-[44px] leading-none tracking-[-0.02em] text-[#141413] md:text-[38.4px] lg:text-[48px]">
                    {stop.title}
                  </h3>
                  <Link
                    href={`/place/${place.slug}`}
                    className="mt-2 block text-base font-semibold text-ink transition hover:text-roam"
                  >
                    {place.name}
                  </Link>
                  <p className="mt-1 text-sm font-medium text-muted">
                    {stopMeta(place).map((line, j) => (
                      <span key={j} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  {place.shortDescription && (
                    <p className="mt-3 text-sm leading-relaxed text-secondary">{place.shortDescription}</p>
                  )}
                  <div className="mt-4">
                    <Link
                      href={`/place/${place.slug}`}
                      className="inline-flex h-9 items-center justify-center rounded-full bg-roam px-5 text-sm font-semibold text-white transition hover:bg-roam-deep"
                    >
                      Learn More
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
