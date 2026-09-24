"use client";

// LetterReveal — the live app's per-letter scroll reveal for the big
// "Choose Your Vibe, Select The Dates & Enjoy Your Ultimate Getaway"
// heading (session-8 re-measure): each letter is its own span whose color
// animates cream (#F8F7F4 — invisible on the cream canvas) → ink
// (#1A1A1A). The reveal tracks the heading's position in the viewport:
// letters FILL IN ORDER while the heading rises into view, hold dark
// while it is comfortably on screen, and ERASE in order as it exits the
// top — the live's fill/un-fill scroll choreography.
//
// Degradation contract: SSR and pre-hydration render solid INK (the
// heading is always readable — no invisible text for crawlers/no-JS);
// prefers-reduced-motion pins the solid-ink state permanently (checked in
// a ref, re-read on every scroll frame and on media changes — no state
// cascades). The color transition is a plain CSS transition (400ms
// ease-out) so the per-letter stagger stays smooth without any animation
// library.

import { useEffect, useRef, useState } from "react";

const CREAM = "rgb(248, 247, 244)";
const INK = "rgb(26, 26, 26)";

export function LetterReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducedRef = useRef(false);
  const [reveal, setReveal] = useState(1); // SSR + first paint: solid ink.

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reducedRef.current = mq.matches;
    };
    syncReduced();
    mq.addEventListener("change", syncReduced);

    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        if (reducedRef.current) {
          setReveal((prev) => (prev === 1 ? prev : 1));
          raf = null;
          return;
        }
        const el = ref.current;
        if (el) {
          const r = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const h = r.height;
          // Fill 0→1 as the heading rises from the viewport bottom to 30%;
          // erase 1→0 as its top passes above the fold heading out.
          const enter = (vh - r.top) / (vh * 0.7);
          const exit = (r.top + h + vh * 0.25) / (vh * 0.35);
          const next = Math.max(0, Math.min(1, Math.min(enter, exit)));
          setReveal((prev) => (Math.abs(prev - next) > 0.01 ? next : prev));
        }
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", syncReduced);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const letters = Array.from(text);
  const darkCount = Math.round(reveal * letters.length);

  return (
    <h2 ref={ref} className={className}>
      {letters.map((ch, i) => (
        <span
          key={i}
          data-letter={i}
          aria-hidden
          style={{
            color: i < darkCount ? INK : CREAM,
            transition: "color 400ms ease-out",
          }}
        >
          {ch}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </h2>
  );
}
