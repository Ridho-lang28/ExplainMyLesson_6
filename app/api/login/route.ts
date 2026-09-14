// app/api/login/route.ts — Route Handler
// POST /api/login { role } — men-set cookie sesi httpOnly yang kemudian
// diperiksa oleh middleware.ts pada setiap permintaan ke /dashboard/*.

import { NextResponse } from "next/server";
import { SESSION_COOKIE, isValidRole } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const role = body?.role;

  if (!isValidRole(role)) {
    return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, role });
  response.cookies.set(SESSION_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 jam
  });
  return response;
}
