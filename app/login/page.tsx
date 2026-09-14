// app/login/page.tsx — Halaman publik. Server Component yang membaca
// searchParams (?redirect=, ?auth_error=) lalu merender Client Component
// LoginForm untuk menangani interaksi (fetch ke /api/login).

import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke ExplainMyLesson AI sebagai Pelajar atau Pengajar.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { auth_error?: string; redirect?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-lg font-bold text-gray-900">ExplainMyLesson AI</h1>
          <p className="text-xs text-gray-500">Masuk untuk melanjutkan ke dashboard Anda</p>
        </div>

        {searchParams.auth_error && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
            Sesi Anda berakhir atau belum masuk. Silakan masuk kembali untuk mengakses halaman tersebut.
          </p>
        )}

        <LoginForm redirectTo={searchParams.redirect ?? null} />
      </div>
    </main>
  );
}
