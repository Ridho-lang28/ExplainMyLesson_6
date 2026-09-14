// components/ClassSummaryCards.tsx
// ASYNC Server Component — sengaja memiliki latensi (lihat lib/data.ts,
// delay 1400ms) untuk mendemonstrasikan Streaming SSR: kerangka halaman
// app/dashboard/pengajar/page.tsx tampil instan, lalu bagian ini "menyusul"
// dan disisipkan browser via <Suspense> tanpa memblokir seluruh halaman.

import { getClassSummary } from "@/lib/data";

function MetricCard({
  label,
  value,
  valueClass = "text-gray-900",
  note,
  noteClass = "text-gray-400",
  warn = false,
}: {
  label: string;
  value: string | number;
  valueClass?: string;
  note: string;
  noteClass?: string;
  warn?: boolean;
}) {
  return (
    <div className={`p-5 rounded-xl border shadow-sm ${warn ? "border-amber-200 bg-amber-50/30" : "bg-white border-gray-200"}`}>
      <p className={`text-xs font-medium ${warn ? "text-amber-800" : "text-gray-500"}`}>{label}</p>
      <p className={`text-2xl font-bold mt-1 ${valueClass}`}>{value}</p>
      <span className={`text-xs font-medium mt-1 inline-block ${noteClass}`}>{note}</span>
    </div>
  );
}

export default async function ClassSummaryCards() {
  const summary = await getClassSummary();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard label="Total Pelajar Terdaftar" value={summary.totalStudents} note="● Aktif semester ini" noteClass="text-emerald-600" />
      <MetricCard
        label="Rata-Rata Pemahaman Kelas"
        value={`${summary.averageComprehension}%`}
        valueClass="text-blue-600"
        note="↑ +2.1% dari minggu lalu"
        noteClass="text-blue-600"
      />
      <MetricCard label="Materi Aktif di-Upload" value={`${summary.activeModules} Modul`} note="Format PDF terverifikasi RAG" />
      <MetricCard
        label="Pelajar Perlu Intervensi"
        value={`${summary.studentsNeedingIntervention} Pelajar`}
        valueClass="text-amber-600"
        note="⚠️ Nilai Kuis < 60"
        noteClass="text-amber-700"
        warn
      />
    </div>
  );
}
