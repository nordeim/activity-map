import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listPlacesForUser } from "@/lib/places";
import type { PlaceCategory } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const cat = req.nextUrl.searchParams.get("category");
  const category: PlaceCategory | undefined =
    cat === "eat" || cat === "stay" || cat === "do" ? cat : undefined;

  const places = await listPlacesForUser(user.uid, category);
  return NextResponse.json({ ok: true, data: { places } });
}
