import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { SaveButton } from "@/components/places/SaveButton";
import type { PlaceDTO } from "@/types";

// The Highlighted Sights grid — six calm stops (Fuggerei → Schaezlerpalais)
// as image cards with the rating badge and heart overlay measured on the
// live home page, closing with the "More Things to Do" hand-off to /do.

export function HighlightedSights({ sights }: { sights: PlaceDTO[] }) {
  if (sights.length === 0) return null;
  return (
    <section id="highlighted-sights" className="mx-auto max-w-[1100px] px-4 pb-6 sm:px-6">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="font-serif text-4xl leading-tight tracking-tight text-ink sm:text-6xl md:text-7xl">
          Highlighted Sights
        </h2>
        <p className="mt-4 text-sm font-light text-black/60 sm:text-base">
          Six calm stops for a scenic Augsburg route between meals, stays, and evening plans.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sights.map((sight) => (
          <li key={sight.slug}>
            <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-float transition-shadow hover:shadow-card">
              <div className="relative">
                <Link href={`/place/${sight.slug}`} className="block overflow-hidden">
                          <img
                    src={sight.coverImageUrl ?? ""}
                    alt={sight.name}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </Link>
                <SaveButton
                  placeId={sight.id}
                  initialSaved={sight.saved ?? false}
                  className="absolute left-3 top-3"
                />
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-float">
                  <Star className="h-3 w-3 fill-ink text-ink" aria-hidden />
                  {sight.avgRating.toFixed(1)}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl text-ink">{sight.name}</h3>
                <p className="mt-1 text-xs font-medium text-black/50">
                  {[sight.neighborhood, sight.subCategory].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3.5">
                  <Link
                    href={`/place/${sight.slug}`}
                    className="text-sm font-semibold text-roam underline-offset-4 transition hover:text-roam-deep hover:underline"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* The More Things to Do hand-off */}
      <div className="mt-12 flex justify-center pb-4">
        <Link
          href="/do"
          className="group flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-ink shadow-float transition hover:border-ink"
        >
          More Things to Do
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
