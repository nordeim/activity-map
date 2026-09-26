"use client";

// The Recommended Route — re-measured from the live app (sessions 3 + 6 + 8 + 18):
// a scroll-driven section.
//
//   1. a 140vh "heading trap" (-mb-[110vh]) whose centered
//      "Recommended Route" heading (clamp 38px→72px, ls −0.045em) stays
//      pinned while the tall section scrolls past;
//   2. the route body — below lg (session-18 re-measure): a FULL-VIEWPORT
//      route visual (the winding-path svg with five numbered waypoints)
//      pinned sticky for ~208vh BEFORE the text stop cards flow (no
//      mobile progress chip, no dashed timeline — the live dropped both);
//      each card = the white time pill (9:00 AM + clock, radius 999) above
//      the dark serif stop title (44px, #141413) above a white rounded-28
//      info card with the 30px/600 place name, the INLINE meta line
//      "Altstadt · 4.8 rating · €€ · Coffee" (16px), the description
//      (14px) and the full-width BLACK Learn More pill (h-11, radius 999);
//      from lg: a 420vh scroll trap — the route VISUAL (solid winding
//      path with five numbered waypoints + the progress pill "N% of your
//      day planned") pinned left while ONE stop card (max-w 576) at a time
//      fills the right half, pinning EARLY (top of the trap, live parity)
//      and swapping as the scroll progress passes each fifth.
//
// The desktop progress pill fills 20% per passed stop (0% at rest — the
// live app's initial state; 100% once Dinner passes). Below lg the visual
// now fills by the same card-passing rule (the mobile svg's violet path).

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
  const mobileTrapRef = useRef<HTMLDivElement>(null);
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
          // Mobile (session-18): progress across the pinned route VISUAL's
          // scroll region — the live's svg fills while the region scrolls
          // (0% at rest, 100% as the visual releases into the stop cards).
          const region = mobileTrapRef.current;
          if (region && region.offsetHeight > 0) {
            const r = region.getBoundingClientRect();
            const total = Math.max(r.height - window.innerHeight, 1);
            const clamped = Math.min(Math.max(-r.top / total, 0), 1);
            setProgress(clamped * 100);
          }
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

      {/* 2 — the route body — session-18 re-measure: below lg the live
          pins a FULL-VIEWPORT route visual (the winding-path svg with the
          five numbered waypoints, sticky for ~208vh) BEFORE the stop cards
          flow — no mobile progress chip, no dashed timeline; the stop
          link-cards are rounded-28. lg+ = a 420vh trap with the pinned
          visual and ONE swapping card pinned EARLY (top of the trap). */}
      <section id="recommended-route" className="relative bg-cream">
        <div ref={trapRef} className="relative lg:h-[420vh]">
          {/* Session-18: the live's mobile route visual — full-bleed,
            sticky while its ~208vh region scrolls, then releases. */}
          <div ref={mobileTrapRef} className="relative h-[208vh] lg:hidden">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
              <svg
                aria-hidden
                viewBox="0 0 400 800"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
              >
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
            </div>
          </div>

          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-start">
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

            {/* The stops column — mobile (session-18): the flowing text
                cards BELOW the pinned route visual (no chip, no dashed
                timeline — the live dropped both); lg+: the swapping stack
                pinned EARLY (top of the trap, live parity). */}
            <div className="relative flex-1 px-4 pb-24 pt-6 sm:px-6 lg:flex lg:items-start lg:justify-center lg:px-12 lg:pb-0 lg:pt-24">
              <div className="relative w-full lg:min-h-[560px] lg:max-w-[576px]">
                {stops.map((place, i) => {
                  const stop = STOPS[i] ?? { time: "", title: place.name };
                  const active = i === activeIndex;
                  return (
                    <article
                      key={place.slug}
                      data-stop-index={i}
                      data-active={active}
                      className={cn(
                        "mx-auto mt-10 block first:mt-0",
                        // lg+: the swapping stack — one card fills the panel;
                        // the rest fade out below.
                        "lg:absolute lg:inset-x-0 lg:top-0 lg:mt-0 lg:transition-all lg:duration-500",
                        "lg:data-[active=false]:pointer-events-none lg:data-[active=false]:translate-y-10 lg:data-[active=false]:opacity-0",
                      )}
                    >
                      {/* The time pill — white, radius 999 (session-8
                          re-measure: the live's text-only card header). */}
                      <span
                        data-stop-time={stop.time}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#141413] shadow-[0_6px_16px_rgba(14,14,14,0.08)]"
                      >
                        <Clock className="h-3 w-3" strokeWidth={2} aria-hidden />
                        {stop.time}
                      </span>

                      {/* The serif stop title — dark on cream (no photo).
                          Session-10: h2, matching the live's stop headings. */}
                      <h2 className="mt-3 font-serif text-[44px] font-normal leading-[1.05] tracking-[-0.02em] text-[#141413] lg:text-[48px]">
                        {stop.title}
                      </h2>

                      {/* The white info card (the live's link card) —
                          session-18: rounded-28 with the 30px place title
                          (the live's mobile waypoint cards). */}
                      <Link
                        href={`/place/${place.slug}`}
                        className="mt-4 block rounded-[28px] bg-white p-5 shadow-[0_18px_44px_rgba(14,14,14,0.1)] sm:p-6"
                      >
                        <span className="block text-[30px] font-semibold leading-tight text-[#141413]">
                          {place.name}
                        </span>
                        <span className="mt-1 block text-[16px] font-normal text-[#0e0e0e]">
                          {stopMetaInline(place)}
                        </span>
                        {place.shortDescription && (
                          <span className="mt-3 block text-sm leading-relaxed text-[#3a3a3a]">
                            {place.shortDescription}
                          </span>
                        )}
                        <span
                          data-learn-more
                          className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-black"
                        >
                          Learn More
                        </span>
                      </Link>
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
