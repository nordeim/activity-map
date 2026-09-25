import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh bg-cream">
      {/* Session-12: the avatar disc initial derives from the EMAIL (the
          live shows "S" for sepnetflix… while the profile h1 shows the
          account NAME "Explorer") — so the navbar receives the email. */}
      <Navbar userEmail={user.email} />
      {children}
      <SiteFooter />
    </div>
  );
}
