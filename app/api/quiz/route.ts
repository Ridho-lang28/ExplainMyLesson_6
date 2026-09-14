// app/api/quiz/route.ts — Route Handler
// GET /api/quiz?level=1..3 — dipanggil oleh QuizClient saat naik level,
// karena level berubah akibat interaksi klien (bukan navigasi halaman).

import { NextResponse } from "next/server";
import { getQuestionsByLevel } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = Number(searchParams.get("level") ?? "1");

  try {
    const questions = await getQuestionsByLevel(level);
    return NextResponse.json({ level, questions });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memuat soal.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
