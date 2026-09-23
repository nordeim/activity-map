import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPlaceBySlug } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const { slug } = await params;
  const place = await getPlaceBySlug(slug, user.uid);
  if (!place) {
    return NextResponse.json({ ok: false, error: "Place not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, data: { place } });
}
