// The three frosted category cards anchored below the home hero
// (measured from the reference dashboard): "12 Hotels", "12 Places to Eat",
// "18 Sights to Discover" — each with three curated list rows and the
// violet VIEW ALL button (#5A18FB, the app's accent).

import Link from "next/link";
import { Building2, BedDouble, Sparkles, UtensilsCrossed, Mic, Landmark, Clock, ArrowRight } from "lucide-react";
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
      { icon: Mic, title: "Casual bistros", subtitle: "Maximilianstraße" },
      { icon: Sparkles, title: "Street food & cafés", subtitle: "Stadtmarkt" },
    ],
  },
  {
    category: "do",
    href: "/do",
    countLabel: "Sights to Discover",
    rows: [
      { icon: Landmark, title: "Dom & Old Town", subtitle: "History" },
      { icon: Clock, title: "Fuggerei quarter", subtitle: "Art" },
      { icon: Sparkles, title: "Rathausplatz views", subtitle: "Golden hall" },
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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {CARDS.map(({ category, href, countLabel, rows }) => (
          <article
            key={category}
            className="flex flex-col rounded-3xl bg-white p-5 shadow-card transition-transform duration-300 hover:-translate-y-1 sm:p-6"
          >
            <h2 className="text-lg font-bold text-ink">
              {counts[category]} {countLabel}
            </h2>

            <ul className="mt-4 flex-1 space-y-3.5">
              {rows.map(({ icon: Icon, title, subtitle }) => (
                <li key={title} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-deep text-ink">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{title}</span>
                    <span className="block truncate text-xs text-black/50">{subtitle}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={href}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-roam py-3 text-sm font-semibold text-white transition hover:bg-roam-deep"
            >
              View All
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
