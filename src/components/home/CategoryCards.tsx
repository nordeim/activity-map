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
        "flex flex-col rounded-[20px] border border-white/40 p-4",
        "shadow-[0_8px_22px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.42)]",
        "backdrop-blur-[28px] backdrop-saturate-150",
        width === "mobile" ? "w-[306px] shrink-0 snap-center bg-white/60" : "w-[263px] bg-white/35",
      ].join(" ")}
    >
      <h2 className="text-sm font-semibold text-ink">
        {counts[spec.category]} {spec.countLabel}
      </h2>

      {/* The three curated rows — 36px tall, the 124px track shows all
          three (36px rows + 8px gaps, exactly the live's track). */}
      <ul className="mt-2.5 flex h-[124px] flex-col gap-2 overflow-hidden">
        {spec.rows.map(({ icon: Icon, title, subtitle }) => (
          <li key={title} className="flex h-9 shrink-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-white/[0.52] bg-white/[0.48] text-[#111111]">
              <Icon className="h-[13px] w-[13px]" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-[#141413]">{title}</span>
              <span className="block truncate text-xs font-normal text-black/30">{subtitle}</span>
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={spec.href}
        className="mt-5 inline-flex h-9 w-full shrink-0 items-center justify-center rounded-full bg-roam text-xs font-semibold tracking-[0.03em] text-white transition-colors duration-200 hover:bg-roam-deep md:h-[54px] md:bg-[#141413] md:hover:bg-black"
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
          bottom edge (the -mt overlap above). */}
      <div className="hidden justify-center gap-5 md:flex">
        {CARDS.map((spec) => (
          <CategoryCard key={spec.category} counts={counts} spec={spec} width="desktop" />
        ))}
      </div>
    </section>
  );
}
