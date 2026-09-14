"use client";

// components/Navbar.tsx — Client Component (leaf)
// Butuh usePathname() (hook) untuk menyorot tab aktif, sehingga wajib
// "use client". Menerima `role` dari Server Component induk (layout.tsx)
// yang membacanya dari cookie via next/headers — bukan dari state klien.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({ role }: { role: "pelajar" | "pengajar" }) {
  const pathname = usePathname();
  const router = useRouter();
  const isTeacher = role === "pengajar";

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            ExplainMyLesson AI
          </Link>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
              isTeacher ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            {isTeacher ? "Pengajar / Admin" : "Pelajar"}
          </span>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/dashboard/pelajar"
            className={`text-sm font-medium ${
              pathname.startsWith("/dashboard/pelajar") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Pelajar
          </Link>
          <Link
            href="/dashboard/pengajar"
            className={`text-sm font-medium ${
              pathname.startsWith("/dashboard/pengajar") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Pengajar
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-gray-500 hover:text-rose-600 border border-gray-300 hover:border-rose-300 px-3 py-1.5 rounded-md transition"
          >
            Keluar
          </button>
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm ${
              isTeacher ? "bg-purple-600" : "bg-blue-600"
            }`}
          >
            {isTeacher ? "P" : "R"}
          </div>
        </nav>
      </div>
    </header>
  );
}
