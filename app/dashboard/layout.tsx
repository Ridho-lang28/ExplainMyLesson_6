// app/dashboard/layout.tsx — Nested Layout (Server Component)
// Dibagikan oleh SEMUA sub-rute privat (/dashboard/pelajar, /dashboard/pengajar,
// /dashboard/pelajar/kuis). Membaca cookie sesi via next/headers untuk
// menentukan role, lalu meneruskannya ke Navbar (Client Component leaf).
// layout.tsx TIDAK ikut re-render saat berpindah antar sub-rute yang sama
// (state Navbar/DOM header tetap terjaga), sesuai Modul 6 poin D.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SESSION_COOKIE, isValidRole } from "@/lib/session";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const roleCookie = cookies().get(SESSION_COOKIE)?.value;

  // Pengaman kedua di luar middleware.ts (defense in depth): jika cookie ada
  // tapi nilainya tidak valid, tetap redirect ke /login.
  if (!isValidRole(roleCookie)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={roleCookie} />
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
