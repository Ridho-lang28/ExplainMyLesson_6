// app/api/class-summary/route.ts — Route Handler
// GET /api/class-summary — endpoint publik demi kelengkapan Bab VI (route.ts
// GET/POST). Halaman app/dashboard/pengajar/page.tsx sendiri TIDAK memakai
// endpoint ini; ia memanggil lib/data.ts langsung dari Server Component
// (lebih efisien, tanpa round-trip HTTP tambahan).

import { NextResponse } from "next/server";
import { getClassSummary } from "@/lib/data";

export async function GET() {
  const summary = await getClassSummary();
  return NextResponse.json(summary);
}
