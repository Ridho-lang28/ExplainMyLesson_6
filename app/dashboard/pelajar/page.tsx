// app/dashboard/pelajar/page.tsx — React Server Component (async function)
// Data fetching langsung di server (chapter progress-nya sendiri statis di
// bagian atas; konten AI diambil oleh AiContentPanel di dalam <Suspense>,
// poin gamifikasi diambil oleh PointsBadge — keduanya Server Component
// async yang self-fetching, tanpa state klien).
// generateMetadata bersifat DINAMIS: judul tab browser berubah mengikuti
// bab & mode yang dipilih pengguna lewat query string — Metadata API SEO
// dinamis sesuai Modul 6 poin F.

import { Suspense } from "react";
import type { Metadata } from "next";
import ChapterModeSelector from "@/components/ChapterModeSelector";
import AiContentPanel from "@/components/AiContentPanel";
import OpenUploadModalButton from "@/components/UploadModal";
import LevelBadge from "@/components/LevelBadge";
import PointsBadge from "@/components/PointsBadge";
import { availableChapters, type AiMode } from "@/lib/data";
import Link from "next/link";

interface PageProps {
  searchParams: { chapter?: string; mode?: string; refresh?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const chapterId = searchParams.chapter ?? "2";
  const chapterLabel = availableChapters.find((c) => c.value === chapterId)?.label ?? "Dashboard Pelajar";
  return {
    title: `Pelajar — ${chapterLabel}`,
    description: `Materi ${chapterLabel} yang dirangkum otomatis oleh AI (RAG/LLM) untuk mahasiswa D3 Teknik Informatika SV UNS.`,
  };
}

export default function PelajarDashboardPage({ searchParams }: PageProps) {
  const chapter = searchParams.chapter ?? "2";
  const mode = (searchParams.mode ?? "ringkasan") as AiMode;
  const refresh = searchParams.refresh ?? "0";
  // key unik per kombinasi chapter+mode+refresh memaksa React membuat ulang
  // batas Suspense (dan menampilkan fallback lagi) setiap kali pilihan
  // berubah ATAU saat tombol "Refresh AI" ditekan (lihat RefreshAiButton,
  // digabung di dalam components/ChapterModeSelector.tsx).
  const suspenseKey = `${chapter}-${mode}-${refresh}`;

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang Kembali!</h1>
          <p className="text-blue-100 text-sm mt-1">Dari 200 Halaman jadi 2 Halaman — Pahami Materi Tanpa Pusing</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 flex items-center space-x-4">
          <div className="text-2xl">🏆</div>
          <div>
            <p className="text-xs text-blue-100">Total Poin Gamifikasi</p>
            <PointsBadge />
          </div>
          <div className="border-l border-white/20 pl-4">
            <p className="text-xs text-blue-100">Level Saat Ini</p>
            <LevelBadge level="MEDIUM" />
          </div>
        </div>
      </section>

      <aside className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <span className="text-amber-600 font-bold text-lg">⚠️</span>
          <div>
            <h2 className="font-semibold text-amber-900 text-sm">Rekomendasi Belajar Otomatis</h2>
            <p className="text-xs text-amber-700 mt-0.5">
              Nilai Kuis Anda 2 &lt; 60 pada Bab 2: Agile, Scrum &amp; AI Assessment. Yuk pelajari ulang bab ini!
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/pelajar?chapter=2&mode=ringkasan"
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          Pelajari Yang Direkomendasikan
        </Link>
      </aside>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="block text-xs font-bold text-gray-700">Upload Materi Privat (Opsional)</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Catatan Pribadi</span>
            </div>
            <OpenUploadModalButton
              variant="private"
              label="📎 Unggah PDF Privat Kamu"
              className="w-full border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50 text-blue-700 font-semibold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center space-x-2"
            />
          </div>

          <ChapterModeSelector chapter={chapter} mode={mode} />

          <div className="pt-2">
            <Link
              href="/dashboard/pelajar/kuis"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm flex items-center justify-center space-x-2"
            >
              <span>🎯</span>
              <span>Mulai Kuis Adaptif 3 Level (+Poin)</span>
            </Link>
          </div>
        </aside>

        <article className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <Suspense
            key={suspenseKey}
            fallback={
              <div className="space-y-3 animate-pulse">
                <div className="h-5 w-2/3 bg-gray-200 rounded mb-4" />
                <div className="h-3 w-5/6 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
              </div>
            }
          >
            <AiContentPanel chapterId={chapter} mode={mode} />
          </Suspense>
        </article>
      </div>
    </div>
  );
}
