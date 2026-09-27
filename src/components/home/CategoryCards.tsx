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
      <h2 className="text-sm font-semibold leading-5 text-ink md:leading-6">
        {counts[spec.category]} {spec.countLabel}
      </h2>

      {/* The three curated rows — session-25 re-measure: the live renders
          its session-10 internals at md too (36px rows, 28×28 cells, 124px
          track) and SCALES the row transform:matrix(1.15) — so the VISIBLE
          desktop contract is 41–46px rows with 32×32 cells. The clone keeps
          its 46px rows (inside the live's own per-card range) and matches
          the visible cells exactly (md:h-8 md:w-8). */}
      <ul className="mt-2.5 flex h-[124px] flex-col gap-2 overflow-hidden md:mt-[7px] md:h-[156px] md:gap-[9px]">
        {spec.rows.map(({ icon: Icon, title, subtitle }) => (
          <li key={title} className="flex h-9 shrink-0 items-center gap-2 md:h-[46px]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-white/[0.52] bg-white/[0.48] text-[#111111] md:h-8 md:w-8">
              <Icon className="h-[13px] w-[13px] md:h-[15px] md:w-[15px]" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-[#141413]">{title}</span>
              <span className="block truncate text-xs font-normal text-black/30">{subtitle}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Session-25 re-measure: the desktop View All hangs 49px PAST the
          glass card's bottom edge (its top ≈5px above the card bottom — a
          thin sliver of overlap, as the live renders after its row-scale;
          was bottom −27px/half-overlap). The pill itself stays the
          229×54 near-black pill; the MOBILE pill stays the in-flow violet
          h-9 (the live matches there). */}
      <Link
        href={spec.href}
        className="mt-2 inline-flex h-9 w-full shrink-0 items-center justify-center rounded-full bg-roam text-xs font-semibold tracking-[0.03em] text-white transition-colors duration-200 hover:bg-roam-deep md:absolute md:bottom-[-49px] md:left-1/2 md:mt-0 md:w-[229px] md:-translate-x-1/2 md:h-[54px] md:bg-[#141413] md:hover:bg-black"
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
          cards swipe sideways; no-scrollbar is the safety valve).
          Session-26 re-measure: the live's override pads the track
          18/18/40 and tightens the gap to 12px (gap-3) — the cards ride
          the hero photo's bottom edge at y≈578 (was gap-4/px-4, cards at
          y≈559). The pb stays 2: the live's pb-40 overflows its fixed-
          height hero (invisible to its flow), so matching it exactly would
          push the route trap ~50px late for no visible gain. */}
      <div
        id="category-cards"
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[18px] pt-[18px] pb-2 md:hidden"
      >
        {CARDS.map((spec) => (
          <CategoryCard key={spec.category} counts={counts} spec={spec} width="mobile" />
        ))}
      </div>

      {/* Desktop: the centered three-card row, flush with the photo's
          bottom edge (the -mt overlap above). Session-25 re-measure: the
          card-gap is ≈14px (the live's computed 12px × its 1.15 row scale
          = 13.8 visible; was gap-5/20px) — the cards land at x 231/508/786
          at 1280, matching the live's scaled row exactly. The pb clears
          the hanging View All pills (their visual bottom crosses ~9px
          into the route section's top padding, as the live's own pills
          cross its hero's bottom edge). */}
      <div className="hidden justify-center gap-3.5 pb-10 md:flex">
        {CARDS.map((spec) => (
          <CategoryCard key={spec.category} counts={counts} spec={spec} width="desktop" />
        ))}
      </div>
    </section>
  );
}
