// app/api/points/route.ts — Route Handler (Web API standar Request/Response)
// Menangani POST /api/points, dipanggil oleh ClaimPointsButton (Client
// Component) saat mahasiswa menekan "Tandai Sudah Paham". Poin disimpan &
// dimutasi di server (lib/data.ts), bukan di state klien — konsisten dengan
// pola Route Handler lain di project (bandingkan app/api/materials/route.ts).

import { NextResponse } from "next/server";
import { claimUnderstandingPoints } from "@/lib/data";

export async function POST() {
  const points = await claimUnderstandingPoints(10);
  return NextResponse.json({ points }, { status: 200 });
}
