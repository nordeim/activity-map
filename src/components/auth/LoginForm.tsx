"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";

// The login card, re-measured from the live app (session 10): the
// shadcn-style white card (radius 16, top gradient hairline, p-8 sm:p-10)
// with the circular logo image, the SANS "Welcome to Activity Map" headline
// + "Sign in to continue" sub, a "Continue with Google" button, an "or"
// divider chip, the EMAIL/PASSWORD fields with in-field Mail/Lock icons
// (h-11 sm:h-12 rounded-xl slate fields), the slate-900 Sign in button, and
// the Forgot password / Sign-up bottom row. The Google and account-recovery
// flows are hosted-platform features — in this self-hosted clone they
// render for parity but answer with an inline notice instead of navigating.

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(body.error === "RATE_LIMITED" ? "Too many attempts. Please try again later." : body.error ?? "Incorrect email or password");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)]">
      {/* The live's slate hairline across the card top. */}
      <div aria-hidden className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />

      <div className="p-8 sm:p-10">
        <div className="flex flex-col items-center space-y-6 text-center sm:space-y-8">
          {/* The circular logo (the live's 80px/96px ringed disc). */}
          <div className="group relative">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-40"
            />
            <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-lg ring-4 ring-white/50 transition-all duration-300 group-hover:shadow-xl sm:h-24 sm:w-24">
              <img src="/images/login-logo.png" alt="Activity Map logo" className="aspect-square h-full w-full object-cover" />
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="font-system text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              Welcome to Activity Map
            </h1>
            <p className="text-sm font-medium text-slate-500 sm:text-base">Sign in to continue</p>
          </div>

          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={() =>
                setNotice("Google sign-in is a hosted-platform feature — use the email sign-in below.")
              }
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-system text-base font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-6" aria-hidden>
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full shrink-0 bg-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 font-medium tracking-wider text-slate-500">or</span>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="w-full space-y-4 sm:space-y-5" noValidate>
            <div className="w-full space-y-1.5">
              <label htmlFor="email" className="font-system text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 font-system text-base text-[#0F172A] outline-none transition placeholder:text-slate-600 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40 disabled:opacity-50 sm:h-12"
                />
              </div>
            </div>

            <div className="w-full space-y-1.5">
              <label htmlFor="password" className="font-system text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 font-system text-base text-[#0F172A] outline-none transition placeholder:text-slate-600 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40 disabled:opacity-50 sm:h-12"
                />
              </div>
            </div>

            {notice ? (
              <p role="status" className="rounded-lg bg-slate-50 px-3 py-2 font-system text-xs text-slate-600">
                {notice}
              </p>
            ) : null}

            {error ? (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 font-system text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] font-system text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Sign in
            </button>
          </form>

          <div className="flex w-full items-center justify-between font-system text-sm">
            <button
              type="button"
              onClick={() =>
                setNotice("Password reset is a hosted-platform feature — use your account credentials.")
              }
              className="text-slate-500 transition hover:text-slate-700"
            >
              Forgot password?
            </button>
            <p className="text-slate-500">
              Need an account?{" "}
              <button
                type="button"
                onClick={() =>
                  setNotice("Sign-up is a hosted-platform feature — this clone ships the demo account only.")
                }
                className="font-semibold text-slate-700 underline-offset-4 transition hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
