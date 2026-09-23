import { getSessionUser } from "@/lib/auth";
import { countPlaces } from "@/lib/places";
import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";

export default async function HomePage() {
  const [counts, user] = await Promise.all([countPlaces(), getSessionUser()]);

  return (
    <main className="pb-16">
      <Hero />
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <CategoryCards counts={counts} signedInName={user?.name ?? null} />
      </div>
    </main>
  );
}
