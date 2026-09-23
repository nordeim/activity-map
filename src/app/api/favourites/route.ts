import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { listFavourites } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  const places = await listFavourites(user.uid);
  return NextResponse.json({ ok: true, data: { places } });
}

async function readPlaceId(req: NextRequest): Promise<string | null> {
  try {
    const body = (await req.json()) as { placeId?: string };
    return typeof body.placeId === "string" && body.placeId.length > 0 ? body.placeId : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const placeId = await readPlaceId(req);
  if (!placeId) {
    return NextResponse.json({ ok: false, error: "placeId is required" }, { status: 400 });
  }

  const place = await db.place.findUnique({ where: { id: placeId }, select: { id: true } });
  if (!place) {
    return NextResponse.json({ ok: false, error: "Place not found" }, { status: 404 });
  }

  await db.savedPlace.upsert({
    where: { userId_placeId: { userId: user.uid, placeId } },
    create: { userId: user.uid, placeId },
    update: { userId: user.uid, placeId },
  });

  return NextResponse.json({ ok: true, data: { placeId, saved: true } }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const placeId = await readPlaceId(req);
  if (!placeId) {
    return NextResponse.json({ ok: false, error: "placeId is required" }, { status: 400 });
  }

  await db.savedPlace.deleteMany({ where: { userId: user.uid, placeId } });
  return NextResponse.json({ ok: true, data: { placeId, saved: false } });
}
