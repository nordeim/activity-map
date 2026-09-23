import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { listBookings } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  const bookings = await listBookings(user.uid);
  return NextResponse.json({ ok: true, data: { bookings } });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  let body: {
    placeId?: string;
    startDate?: string | null;
    endDate?: string | null;
    guests?: number;
    name?: string | null;
    surname?: string | null;
    time?: string | null;
    phone?: string | null;
    email?: string | null;
    message?: string | null;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const placeId = typeof body.placeId === "string" && body.placeId.length > 0 ? body.placeId : null;
  if (!placeId) {
    return NextResponse.json({ ok: false, error: "placeId is required" }, { status: 400 });
  }

  const place = await db.place.findUnique({ where: { id: placeId }, select: { id: true, isBookable: true } });
  if (!place) {
    return NextResponse.json({ ok: false, error: "Place not found" }, { status: 404 });
  }
  if (!place.isBookable) {
    return NextResponse.json({ ok: false, error: "Place is not bookable" }, { status: 400 });
  }

  const guests =
    typeof body.guests === "number" && Number.isFinite(body.guests)
      ? Math.max(1, Math.min(12, Math.round(body.guests)))
      : 2;

  const parseDate = (v: string | null | undefined): Date | null => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const startDate = parseDate(body.startDate);
  const endDate = parseDate(body.endDate);
  if (startDate && endDate && endDate < startDate) {
    return NextResponse.json(
      { ok: false, error: "Checkout must be after check-in" },
      { status: 400 },
    );
  }

  const strField = (v: unknown, max = 200): string | null =>
    typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, max) : null;

  const booking = await db.booking.create({
    data: {
      userId: user.uid,
      placeId,
      startDate,
      endDate,
      guests,
      name: strField(body.name),
      surname: strField(body.surname),
      time: strField(body.time, 20),
      phone: strField(body.phone, 40),
      email: strField(body.email, 120),
      message: strField(body.message, 1000),
    },
  });

  return NextResponse.json(
    { ok: true, data: { booking: { id: booking.id, placeId, guests, status: booking.status } } },
    { status: 201 },
  );
}
