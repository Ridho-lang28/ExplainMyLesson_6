// app/page.tsx — Halaman publik (landing). React Server Component murni,
// tanpa "use client" — mencontohkan segmen rute PUBLIK sebagai pembanding
// segmen /dashboard/* yang PRIVAT (dilindungi middleware.ts).

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda",
  description: "Ubah 200 halaman modul kuliah jadi ringkasan AI 2 halaman, lengkap kuis adaptif & dashboard analitik kelas.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="max-w-7xl mx-auto w-full px-4 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600">ExplainMyLesson AI</span>
        <Link href="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 px-4 py-2 rounded-lg">
          Masuk
        </Link>
      </header>

      <section className="flex-1 flex items-center">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            Next.js App Router · React Server Components
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Dari 200 Halaman jadi 2 Halaman — <br className="hidden md:block" />
            Pahami Materi Kuliah Tanpa Pusing
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            ExplainMyLesson AI meringkas modul praktikum panjang menjadi ringkasan, analogi, mind map,
            dan contoh soal secara otomatis, dilengkapi kuis adaptif 3 level dan dashboard analitik
            pemahaman kelas untuk pengajar — seluruhnya dirender langsung dari server (RSC).
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm">
              Mulai Belajar
            </Link>
            <Link href="/login" className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-6 py-3 rounded-lg">
              Masuk sebagai Pengajar
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 py-6">
        Modul Praktikum Bab VI — Meta-Framework &amp; SSR (Next.js App Router &amp; RSC) · D3 TI SV UNS
      </footer>
    </main>
  );
}
