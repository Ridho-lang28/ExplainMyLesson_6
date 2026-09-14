// app/dashboard/pelajar/kuis/page.tsx — Server Component (async function)
// Mem-pre-fetch soal Level 1 LANGSUNG DI SERVER (async/await, lib/data.ts)
// sebelum HTML pertama dikirim, lalu menyerahkan interaktivitas berikutnya
// ke QuizClient (Client Component). Ini contoh pola hybrid: server untuk
// initial data (cepat & SEO-friendly), client untuk state interaktif.

import type { Metadata } from "next";
import { getQuestionsByLevel } from "@/lib/data";
import QuizClient from "@/components/QuizClient";

export const metadata: Metadata = {
  title: "Kuis Adaptif — Bab 2: Agile & Scrum",
  description: "Kuis adaptif 3 level dengan hint AI dan skor kumulatif, dimuat secara asinkron per level.",
};

export default async function KuisAdaptifPage() {
  const initialQuestions = await getQuestionsByLevel(1);
  return <QuizClient initialQuestions={initialQuestions} />;
}
