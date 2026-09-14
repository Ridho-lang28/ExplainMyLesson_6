// app/api/export/route.ts — Route Handler
// GET /api/export — menghasilkan file CSV laporan kelas untuk diunduh
// langsung oleh browser (dipanggil oleh ExportReportButton, Client Component).

import { NextResponse } from "next/server";
import { buildClassReportCsv } from "@/lib/data";

export async function GET() {
  try {
    const { fileName, content } = await buildClassReportCsv();
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal membuat laporan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
