// app/api/materials/route.ts — Route Handler (Web API standar Request/Response)
// Menangani POST /api/materials, dipanggil oleh UploadMaterialModal &
// UploadModuleModal (Client Components).

import { NextResponse } from "next/server";
import { MaterialUploadSchema } from "@/lib/schema";
import { saveMaterial } from "@/lib/data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = MaterialUploadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Data tidak valid." },
      { status: 400 }
    );
  }

  try {
    const result = await saveMaterial(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengunggah dokumen.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
