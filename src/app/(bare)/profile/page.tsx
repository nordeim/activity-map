import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { listBookings } from "@/lib/places";
import { db } from "@/lib/db";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const [bookings, user, favourites] = await Promise.all([
    listBookings(session.uid),
    db.user.findUnique({ where: { id: session.uid }, select: { email: true, name: true, createdAt: true } }),
    db.savedPlace.count({ where: { userId: session.uid } }),
  ]);

  return (
    <ProfileView
      user={{ name: user?.name ?? session.name, email: user?.email ?? session.email }}
      bookings={bookings}
      favouriteCount={favourites}
    />
  );
}
