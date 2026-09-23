import { getSessionUser } from "@/lib/auth";
import { listPlacesForUser } from "@/lib/places";
import { MapExplorer } from "@/components/map/MapExplorer";

export const metadata = { title: "Map" };

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ place?: string; dates?: string; guests?: string; category?: string }>;
}) {
  const [user, sp] = await Promise.all([getSessionUser(), searchParams]);
  const places = await listPlacesForUser(user!.uid);

  const initialCategory =
    sp.category === "eat" || sp.category === "stay" || sp.category === "do" ? sp.category : null;

  return (
    <MapExplorer
      places={places}
      focusSlug={sp.place ?? null}
      initialCategory={initialCategory}
      planner={{ dates: sp.dates ?? null, guests: sp.guests ?? null }}
    />
  );
}
