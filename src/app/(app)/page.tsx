import { getSessionUser } from "@/lib/auth";
import { countPlaces, listHomePlaces, listPlacesForUser } from "@/lib/places";
import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { RecommendedRoute } from "@/components/home/RecommendedRoute";
import { HighlightedRestaurants } from "@/components/home/HighlightedRestaurants";
import { StayShowcase } from "@/components/home/StayShowcase";
import { HighlightedSights } from "@/components/home/HighlightedSights";

// The Highlights page, structured exactly like the live app's home (session 2
// parity): photo hero + glass planner pill → the three category cards → the
// Recommended Route itinerary → the blue Highlighted Restaurants band → the
// Choose Your Vibe stay showcase → the Highlighted Sights grid → the More
// Things to Do hand-off → the site footer.

export default async function HomePage() {
  const user = await getSessionUser();
  const uid = user?.uid;
  const [counts, route, sights, restaurants, stays] = await Promise.all([
    countPlaces(),
    listHomePlaces("home-route-"),
    listHomePlaces("home-sight-", uid),
    listHomePlaces("home-restaurant-"),
    listPlacesForUser(uid ?? "", "stay"),
  ]);

  return (
    <>
      <main className="pb-16">
        <Hero />
        <CategoryCards counts={counts} signedInName={user?.name ?? null} />
        <RecommendedRoute stops={route} />
        <HighlightedRestaurants restaurants={restaurants} />
        <StayShowcase stays={stays} />
        <HighlightedSights sights={sights} />
      </main>
      {/* The footer is a sibling of <main> — a footer nested inside <main>
          loses its contentinfo landmark role. */}
    </>
  );
}
