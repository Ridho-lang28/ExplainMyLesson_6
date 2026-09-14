"use client";

// app/dashboard/error.tsx — Error Boundary segmen /dashboard.
// WAJIB "use client": React Error Boundary hanya bisa diimplementasikan
// sebagai Client Component (butuh lifecycle/hook di sisi klien).

import { useEffect } from "react";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-3">
        <p className="text-rose-700 font-semibold text-sm">Terjadi kesalahan saat memuat halaman ini.</p>
        <p className="text-rose-500 text-xs">{error.message}</p>
        <button onClick={() => reset()} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg">
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
