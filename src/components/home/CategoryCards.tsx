// The three category cards anchored below the home hero — re-measured
// from the live app (sessions 3 + 6): near-opaque white cards (bg white/58,
// radius 24px, the planner card's shadow with the inset highlight), Inter
// 14px/600 headings ("12 Hotels" …), three curated rows with 13px icons,
// and the View All pill (36px, 12px/600, ls 0.03em) — VIOLET #571AFF
// below md (session-6 re-measure) and near-black #141413 from md up. The
// cards tilt in 3D on hover (the live app's rotateY perspective on the
// outer cards).

import Link from "next/link";
import { Building2, BedDouble, Sparkles, UtensilsCrossed, Mic, Landmark, Clock, ArrowRight } from "lucide-react";
import type { PlaceCategory } from "@/types";

interface CardSpec {
  category: PlaceCategory;
  href: string;
  countLabel: string;
  perspective: "left" | "none" | "right";
  rows: { icon: React.ElementType; title: string; subtitle: string }[];
}

const CARDS: CardSpec[] = [
  {
    category: "stay",
    href: "/stay",
    countLabel: "Hotels",
    perspective: "left",
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
    perspective: "none",
    rows: [
      { icon: UtensilsCrossed, title: "Fine dining", subtitle: "Rathausplatz" },
      { icon: Mic, title: "Casual bistros", subtitle: "Maximilianstraße" },
      { icon: Sparkles, title: "Street food & cafés", subtitle: "Altstadt" },
    ],
  },
  {
    category: "do",
    href: "/do",
    countLabel: "Sights to Discover",
    perspective: "right",
    rows: [
      { icon: Landmark, title: "Dom & Old Town", subtitle: "History" },
      { icon: Clock, title: "Fuggerei quarter", subtitle: "Art" },
      { icon: Sparkles, title: "Rathausplatz views", subtitle: "Fun" },
    ],
  },
];

export function CategoryCards({
  counts,
}: {
  counts: Record<PlaceCategory, number>;
  signedInName?: string | null;
}) {
  return (
    <section aria-label="Browse the guide" className="relative z-10 -mt-10 sm:-mt-16">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 [perspective:1200px]">
        {CARDS.map(({ category, href, countLabel, rows, perspective }) => (
          <article
            key={category}
            className="group flex flex-col rounded-[24px] border border-white/40 bg-white/60 p-5 shadow-[0_8px_22px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-[28px] backdrop-saturate-150 transition-transform duration-500 ease-out sm:p-6 md:bg-white/35"
            style={{ transform: perspective === "none" ? undefined : "rotateY(0deg)" }}
            data-tilt={perspective}
          >
            <h2 className="text-sm font-semibold text-ink">
              {counts[category]} {countLabel}
            </h2>

            <ul className="mt-4 flex-1 space-y-2">
              {rows.map(({ icon: Icon, title, subtitle }) => (
                <li key={title} className="flex h-9 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface2 text-ink">
                    <Icon className="h-[13px] w-[13px]" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{title}</span>
                    <span className="block truncate text-xs text-muted">{subtitle}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={href}
              className="mt-5 inline-flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-roam px-6 text-xs font-semibold tracking-[0.03em] text-white transition-colors duration-200 hover:bg-roam-deep md:mx-auto md:w-auto md:bg-[#141413] md:hover:bg-black"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
