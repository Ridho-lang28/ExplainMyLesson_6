"use client";

// components/LoginForm.tsx — Client Component (leaf)
// Interaktif: menangani klik & fetch ke Route Handler /api/login, lalu
// mengarahkan pengguna ke area /dashboard yang dilindungi middleware.ts.

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ redirectTo }: { redirectTo: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"pelajar" | "pengajar" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(role: "pelajar" | "pengajar") {
    setLoading(role);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Gagal masuk. Coba lagi.");

      const target =
        redirectTo && redirectTo.startsWith("/dashboard")
          ? redirectTo
          : `/dashboard/${role}`;
      router.push(target);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
          {error}
        </p>
      )}
      <button
        onClick={() => handleLogin("pelajar")}
        disabled={loading !== null}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition"
      >
        {loading === "pelajar" ? "Memproses..." : "Masuk sebagai Pelajar"}
      </button>
      <button
        onClick={() => handleLogin("pengajar")}
        disabled={loading !== null}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition"
      >
        {loading === "pengajar" ? "Memproses..." : "Masuk sebagai Pengajar / Admin"}
      </button>
      <p className="text-[11px] text-gray-400 text-center pt-1">
        Demo praktikum — tanpa kata sandi, sesi disimpan pada cookie httpOnly.
      </p>
    </div>
  );
}
