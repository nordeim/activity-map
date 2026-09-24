import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signSession, verifyPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(clientIp(req));
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = (await req.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Email and password are required" },
      { status: 400 },
    );
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ ok: false, error: "Incorrect email or password" }, { status: 401 });
  }

  const res = NextResponse.json({
    ok: true,
    data: { user: { id: user.id, email: user.email, name: user.name } },
  });
  res.cookies.set(SESSION_COOKIE, signSession({ uid: user.id, email: user.email, name: user.name }), sessionCookieOptions());
  return res;
}
