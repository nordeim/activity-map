import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh bg-cream">
      <Navbar userName={user.name} />
      {children}
    </div>
  );
}
