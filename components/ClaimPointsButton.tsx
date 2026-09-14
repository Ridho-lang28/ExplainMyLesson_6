"use client";

// components/ClaimPointsButton.tsx — Client Component (leaf, paling ujung
// hirarki). Status "sudah diklaim" tetap lokal. Saat ditekan, komponen ini
// POST ke Route Handler /api/points (poin diubah & disimpan di server, lihat
// lib/data.ts), lalu memanggil router.refresh() supaya seluruh Server
// Component di halaman ini (termasuk PointsBadge di hero section) ikut
// menampilkan angka poin terbaru — pola yang sama seperti UploadModal.tsx.

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClaimPointsButton() {
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClaim() {
    if (claimed || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/points", { method: "POST" });
      if (!res.ok) throw new Error("Gagal mengklaim poin.");
      setClaimed(true);
      router.refresh();
    } catch {
      // Biarkan tombol tetap aktif supaya pengguna bisa coba lagi.
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClaim}
      disabled={claimed || loading}
      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm"
    >
      {claimed ? "✓ Poin Diklaim (+10 pts)" : loading ? "Menyimpan..." : "Tandai Sudah Paham (+10 pts)"}
    </button>
  );
}
