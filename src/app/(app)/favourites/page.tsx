import { getSessionUser } from "@/lib/auth";
import { listFavourites } from "@/lib/places";
import { FavouritesView } from "@/components/favourites/FavouritesView";

export const metadata = { title: "Favourites" };

export default async function FavouritesPage() {
  const user = await getSessionUser();
  const places = await listFavourites(user!.uid);
  return <FavouritesView places={places} />;
}
