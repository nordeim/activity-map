import { getSessionUser } from "@/lib/auth";
import { listPlacesForUser } from "@/lib/places";
import { CATEGORY_META } from "@/types";
import { CategoryExplorer } from "@/components/places/CategoryExplorer";

export const metadata = { title: CATEGORY_META.stay.title };

export default async function StayPage() {
  const user = await getSessionUser();
  const places = await listPlacesForUser(user!.uid, "stay");
  return <CategoryExplorer meta={CATEGORY_META.stay} places={places} />;
}
