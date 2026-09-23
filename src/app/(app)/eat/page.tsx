import { getSessionUser } from "@/lib/auth";
import { listPlacesForUser } from "@/lib/places";
import { CATEGORY_META } from "@/types";
import { CategoryExplorer } from "@/components/places/CategoryExplorer";

export const metadata = { title: CATEGORY_META.eat.title };

export default async function EatPage() {
  const user = await getSessionUser();
  const places = await listPlacesForUser(user!.uid, "eat");
  return <CategoryExplorer meta={CATEGORY_META.eat} places={places} />;
}
