// The three category cards anchored at the home hero's bottom edge —
// re-measured from the live app (session 10): glass cards (bg white/58
// mobile · white/35 desktop, blur 28, saturate 1.6, radius 20) carrying the
// Inter 14px/600 count label ("12 Hotels") and THREE curated rows — each a
// 28×28 rounded-8 glass icon cell (white/0.48 + white/0.52 border, 13px
// lucide icon, stroke #111111) beside a 12px/500 title (ink, ellipsis) with
// a 12px 30%-black subtitle. The View All pill is violet #571AFF
// full-width h-9 on phones; near-black #141413 full-width h-[54px] from md.
//
// Mobile layout: a horizontal SNAP CAROUSEL — the live's
// today-category-cards row scrolls sideways (three 306px cards, snap-center,
// no-scrollbar). Desktop: the centered three-card row (263px each) that
// ends flush with the hero photo's bottom edge (the -mt overlap in the
// page).

import Link from "next/link";
import {
  Building2, BedDouble, Sparkles, UtensilsCrossed, Wine, Coffee, Landmark, Palette, FerrisWheel,
} from "lucide-react";
import type { PlaceCategory } from "@/types";

interface CardSpec {
  category: PlaceCategory;
  href: string;
  countLabel: string;
  rows: { icon: React.ElementType; title: string; subtitle: string }[];
}

const CARDS: CardSpec[] = [
  {
    category: "stay",
    href: "/stay",
    countLabel: "Hotels",
    rows: [
      { icon: Building2, title: "Design hotels", subtitle: "City center" },
      { icon: BedDouble, title: "Boutique stays", subtitle: "Old Town" },
      { icon: Sparkles, title: "Top rated rooms", subtitle: "Tonight" },
    ],
  },
  {
    category: "eat",
    href: "/eat",
    countLabel: "Places to Eat",
    rows: [
      { icon: UtensilsCrossed, title: "Fine dining", subtitle: "Rathausplatz" },
      { icon: Wine, title: "Casual bistros", subtitle: "Maximilianstraße" },
      { icon: Coffee, title: "Street food & cafés", subtitle: "Altstadt" },
    ],
  },
  {
    category: "do",
    href: "/do",
    countLabel: "Sights to Discover",
    rows: [
      { icon: Landmark, title: "Dom & Old Town", subtitle: "History" },
      { icon: Palette, title: "Fuggerei quarter", subtitle: "Art" },
      { icon: FerrisWheel, title: "Rathausplatz views", subtitle: "Fun" },
    ],
  },
];

function CategoryCard({
  counts,
  spec,
  width,
}: {
  counts: Record<PlaceCategory, number>;
  spec: CardSpec;
  width: "mobile" | "desktop";
}) {
  return (
    <article
      data-category-card
      className={[
        // Session-12: the live's compact shell — 14px top / 14px sides /
        // 12px bottom padding (was uniform p-4). Session-16: the mobile
        // glass card carries radius 24 (the desktop card keeps 20); the
        // card is relative so the desktop View All can hang past its
        // bottom edge.
        "relative flex flex-col rounded-[24px] border border-white/40 pt-[14px] px-[14px] pb-[12px] md:rounded-[20px]",
        "shadow-[0_8px_22px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.42)]",
        "backdrop-blur-[28px] backdrop-saturate-150",
        width === "mobile" ? "w-[306px] shrink-0 snap-center bg-white/60" : "w-[263px] bg-white/35",
      ].join(" ")}
    >
      <h2 className="text-sm font-semibold leading-5 text-ink md:leading-8">
        {counts[spec.category]} {spec.countLabel}
      </h2>

      {/* The three curated rows — session-16 re-measure: the live grew the
          DESKTOP rows to ≈46px at 9px gaps (156px track) with 34×35 icon
          cells; the MOBILE carousel keeps the session-10 internals (36px
          rows, 8px gaps, 124px track, 28×28 cells — the live's mobile card
          measures 227px). */}
      <ul className="mt-2.5 flex h-[124px] flex-col gap-2 overflow-hidden md:mt-[7px] md:h-[156px] md:gap-[9px]">
        {spec.rows.map(({ icon: Icon, title, subtitle }) => (
          <li key={title} className="flex h-9 shrink-0 items-center gap-2 md:h-[46px]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-white/[0.52] bg-white/[0.48] text-[#111111] md:h-[35px] md:w-[34px]">
              <Icon className="h-[13px] w-[13px]" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-[#141413]">{title}</span>
              <span className="block truncate text-xs font-normal text-black/30">{subtitle}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Session-16 re-measure: the desktop View All HANGS BELOW the glass
          card's bottom edge (a 229×54 near-black pill half-overlapping the
          card onto the hero photo — absolute so it leaves the card's flow,
          shrinking the glass to ≈231px); the MOBILE pill stays the in-flow
          violet h-9 (the live matches there). */}
      <Link
        href={spec.href}
        className="mt-3 inline-flex h-9 w-full shrink-0 items-center justify-center rounded-full bg-roam text-xs font-semibold tracking-[0.03em] text-white transition-colors duration-200 hover:bg-roam-deep md:absolute md:bottom-[-27px] md:left-1/2 md:mt-0 md:w-[229px] md:-translate-x-1/2 md:h-[54px] md:bg-[#141413] md:hover:bg-black"
      >
        View All
      </Link>
    </article>
  );
}

export function CategoryCards({
  counts,
}: {
  counts: Record<PlaceCategory, number>;
  signedInName?: string | null;
}) {
  return (
    <section aria-label="Browse the guide" className="relative z-10 -mt-8 md:-mt-[261px]">
      {/* Mobile: the horizontal snap carousel (session-10 live parity — the
          cards swipe sideways; no-scrollbar is the safety valve). */}
      <div
        id="category-cards"
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:hidden"
      >
        {CARDS.map((spec) => (
          <CategoryCard key={spec.category} counts={counts} spec={spec} width="mobile" />
        ))}
      </div>

      {/* Desktop: the centered three-card row, flush with the photo's
          bottom edge (the -mt overlap above). Session-16: the row gains
          ~40px bottom clearance — the desktop View All pills now hang
          BELOW the glass cards (absolute, half-overlapping the photo) and
          must not collide with the route section's content. */}
      <div className="hidden justify-center gap-5 pb-10 md:flex">
        {CARDS.map((spec) => (
          <CategoryCard key={spec.category} counts={counts} spec={spec} width="desktop" />
        ))}
      </div>
    </section>
  );
}
