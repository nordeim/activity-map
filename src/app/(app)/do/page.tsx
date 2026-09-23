import { getSessionUser } from "@/lib/auth";
import { listPlacesForUser } from "@/lib/places";
import { CATEGORY_META } from "@/types";
import { CategoryExplorer } from "@/components/places/CategoryExplorer";

export const metadata = { title: CATEGORY_META.do.title };

export default async function DoPage() {
  const user = await getSessionUser();
  const places = await listPlacesForUser(user!.uid, "do");
  return <CategoryExplorer meta={CATEGORY_META.do} places={places} />;
}
