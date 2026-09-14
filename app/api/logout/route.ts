// app/api/logout/route.ts — Route Handler
// POST /api/logout — menghapus cookie sesi.

import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
