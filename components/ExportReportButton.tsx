"use client";

// components/ExportReportButton.tsx — Client Component (leaf)
// Memanggil Route Handler GET /api/export dan memicu unduhan file CSV
// nyata di browser (butuh document/Blob — API browser, wajib "use client").

import { useState } from "react";

export default function ExportReportButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleExport() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error("Gagal mengekspor laporan.");

      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="(.+)"/);
      const fileName = match?.[1] ?? "Laporan_Analisis_Kelas.csv";

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setStatus("success");
      setMessage(`Laporan berhasil diunduh: ${fileName}`);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setTimeout(() => setStatus("idle"), 3500);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleExport}
        disabled={status === "loading"}
        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
      >
        📄 {status === "loading" ? "Mengekspor..." : "Ekspor Laporan"}
      </button>
      {status === "success" && <span className="text-[11px] text-emerald-700">{message}</span>}
      {status === "error" && <span className="text-[11px] text-rose-600">{message}</span>}
    </div>
  );
}
