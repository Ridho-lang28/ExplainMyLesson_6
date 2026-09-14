// app/dashboard/pengajar/page.tsx — Server Component. Metadata API statis.
// Bagian metrik kelas (ClassSummaryCards) sengaja lambat (lib/data.ts) dan
// dibungkus <Suspense> agar bagian lain halaman (progres per bab, daftar
// pelajar perlu bimbingan) tetap streaming lebih dulu tanpa menunggunya —
// demonstrasi nyata Streaming SSR Modul 6 poin E.

import { Suspense } from "react";
import type { Metadata } from "next";
import ClassSummaryCards from "@/components/ClassSummaryCards";
import ClassSummarySkeleton from "@/components/ClassSummarySkeleton";
import ChapterProgressList from "@/components/ChapterProgressList";
import StudentsNeedingHelp from "@/components/StudentsNeedingHelp";
import OpenUploadModalButton from "@/components/UploadModal";
import ExportReportButton from "@/components/ExportReportButton";

export const metadata: Metadata = {
  title: "Dashboard Pengajar — Analisis Kelas",
  description: "Pantau progres pemahaman pelajar per bab dan daftar pelajar yang perlu bimbingan secara real-time.",
};

export default function PengajarDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analisis &amp; Pemahaman Kelas</h1>
          <p className="text-sm text-gray-500">Pantau progres pemahaman pelajar dan lakukan intervensi tepat sasaran.</p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportReportButton />
          <OpenUploadModalButton
            variant="public"
            label="➕ Unggah Modul Baru"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
          />
        </div>
      </div>

      <Suspense fallback={<ClassSummarySkeleton />}>
        <ClassSummaryCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-gray-800">Tingkat Pemahaman Per Bab</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded">Rata-rata Kuis</span>
          </div>
          <ChapterProgressList />
        </section>

        <section className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h2 className="font-bold text-gray-800">Pelajar Perlu Bimbingan</h2>
            <p className="text-xs text-gray-500">Terdeteksi skor kuis &lt; 60</p>
          </div>
          <StudentsNeedingHelp />
        </section>
      </div>
    </div>
  );
}
