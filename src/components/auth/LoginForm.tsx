"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// The login card, re-measured from the live app (session 6): the
// "Welcome to Activity Map" serif headline + "Sign in to continue" sub, a
// "Continue with Google" button, an "or" divider, the EMAIL/PASSWORD
// fields, the black Sign in pill, and the Forgot password / Sign-up
// chrome. The Google and account-recovery flows are hosted-platform
// features — in this self-hosted clone they render for parity but answer
// with an inline notice instead of navigating.

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
    <div className="rounded-[28px] border border-black/5 bg-white/95 p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)]">
      <div className="mb-7 flex flex-col items-center text-center">
        <h1 className="font-serif text-3xl text-ink">Welcome to Activity Map</h1>
        <p className="mt-2 text-sm text-black/50">Sign in to continue</p>
      </div>

      <button
        type="button"
        onClick={() =>
          setNotice("Google sign-in is a hosted-platform feature — use the email sign-in below.")
        }
        className="flex w-full items-center justify-center gap-3 rounded-full border border-black/10 bg-white py-3 text-sm font-semibold text-ink transition hover:border-black/30"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
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

      <div className="my-5 flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-black/10" />
        <span className="text-xs font-medium text-black/40">or</span>
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-black/50">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-roam focus:bg-white focus:ring-2 focus:ring-roam/20"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-black/50">
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                setNotice("Password reset is a hosted-platform feature — use your account credentials.")
              }
              className="text-xs font-medium text-roam transition hover:text-roam-deep"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-roam focus:bg-white focus:ring-2 focus:ring-roam/20"
          />
        </div>

        {notice ? (
          <p role="status" className="rounded-lg bg-cream px-3 py-2 text-xs text-black/60">
            {notice}
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Sign in
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-black/50">
        Need an account?{" "}
        <button
          type="button"
          onClick={() =>
            setNotice("Sign-up is a hosted-platform feature — this clone ships the demo account only.")
          }
          className="font-semibold text-roam transition hover:text-roam-deep"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
