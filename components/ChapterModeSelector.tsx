"use client";

// components/ChapterModeSelector.tsx — Client Component (leaf)
// Prinsip Component Boundary: komponen ini HANYA menangani interaksi
// (onChange radio/select) dan mendorong perubahan ke URL lewat
// useRouter().push(). Ia TIDAK menyimpan/menampilkan konten AI apa pun —
// pengambilan & rendering konten tetap 100% terjadi di Server Component
// (lihat app/dashboard/pelajar/page.tsx + components/AiContentPanel.tsx),
// sehingga bundle JS klien tetap minimal ("Leaf Components" pattern).
//
// RefreshAiButton digabung di file yang sama karena sama-sama kontrol kecil
// yang memanipulasi query string (chapter/mode/refresh) untuk memicu ulang
// data fetching di AiContentPanel — mengelompokkan dua leaf client yang
// erat kaitannya dalam satu boundary "use client" (bukan file terpisah)
// supaya proporsi Server Component di project tetap dominan.

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { availableChapters, aiModes, type AiMode } from "@/lib/data";

export default function ChapterModeSelector({
  chapter,
  mode,
}: {
  chapter: string;
  mode: AiMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(next: { chapter?: string; mode?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.chapter) params.set("chapter", next.chapter);
    if (next.mode) params.set("mode", next.mode);
    router.push(`/dashboard/pelajar?${params.toString()}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="selectBab" className="block text-xs font-bold text-gray-700 mb-2">
          Pilih Bab / Modul Publik
        </label>
        <select
          id="selectBab"
          value={chapter}
          onChange={(e) => updateQuery({ chapter: e.target.value })}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          {availableChapters.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="block text-xs font-bold text-gray-700 mb-2">Pilih Mode Generasi AI</legend>
        <div className="space-y-2 text-xs">
          {aiModes.map((m) => (
            <label
              key={m.value}
              className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                mode === m.value ? "border-blue-200 bg-blue-50/50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="ai_mode"
                value={m.value}
                checked={mode === m.value}
                onChange={(e) => updateQuery({ mode: e.target.value })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2.5 font-medium text-gray-800">
                {m.icon} {m.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function RefreshAiButton({
  label = "Refresh AI",
  pendingLabel = "Memuat...",
  className,
}: {
  label?: string;
  pendingLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("refresh", Date.now().toString());
    startTransition(() => {
      router.push(`/dashboard/pelajar?${params.toString()}`);
    });
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      aria-label="Refresh konten AI"
      className={
        className ??
        "flex items-center space-x-1 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 shrink-0"
      }
    >
      <span className={isPending ? "animate-spin" : ""}>🔄</span>
      <span>{isPending ? pendingLabel : label}</span>
    </button>
  );
}
