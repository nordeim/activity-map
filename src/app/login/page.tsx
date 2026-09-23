import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-cream px-4 py-10">
      {/* Soft photographic wash behind the card — same travel mood as the app. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.16]"
        style={{ backgroundImage: "url(/images/hero-augsburg.jpg)" }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/80 to-cream" />

      <div className="relative z-10 w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
