import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-4 py-10">
      {/* Session-10 re-measure: the live login page is a PLAIN white page —
          no photographic wash, no gradient. The card is centered at
          max-w-[448px]. */}
      <div className="relative z-10 w-full max-w-[448px]">
        <LoginForm />
      </div>
    </main>
  );
}
