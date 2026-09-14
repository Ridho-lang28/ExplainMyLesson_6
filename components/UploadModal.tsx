"use client";

// components/UploadModal.tsx — Client Component
// SRS-FORM-01 (materi privat, Pelajar) & SRS-FORM-02 (modul publik, Pengajar)
// digabung dalam satu komponen reusable via prop `variant`.
//
// Menerapkan: validasi klien dengan Zod (umpan balik instan), lalu
// POST ke Route Handler /api/materials yang MEVALIDASI ULANG dengan skema
// Zod yang sama persis di server (prinsip "never trust the client").
//
// OpenUploadModalButton (di bawah, satu file yang sama) adalah tombol kecil
// yang membuka modal ini — digabung supaya tombol pemicu & modalnya tetap
// dalam satu boundary "use client" (bukan file terpisah), sehingga jumlah
// file Client Component di project tetap minimal.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialUploadSchema } from "@/lib/schema";
import { availableChapters } from "@/lib/data";

type Variant = "private" | "public";

interface Props {
  open: boolean;
  onClose: () => void;
  variant: Variant;
}

const initialForm = { title: "", chapter: availableChapters[0]?.value ?? "", file: null as File | null };

export function UploadModal({ open, onClose, variant }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (!open) return null;

  const isPublic = variant === "public";

  function resetAndClose() {
    setForm(initialForm);
    setErrors({});
    setStatus("idle");
    setMessage(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = MaterialUploadSchema.safeParse({
      title: form.title,
      fileName: form.file?.name ?? "",
      chapter: isPublic ? form.chapter : undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((issue) => {
        const key = String(issue.path[0] ?? "title");
        fieldErrors[key === "fileName" ? "file" : key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (form.file && form.file.type !== "application/pdf") {
      setErrors({ file: "Format file harus PDF." });
      return;
    }

    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengunggah.");

      setStatus("success");
      router.refresh(); // re-fetch Server Component induk (RSC data segar)
      setTimeout(resetAndClose, 1200);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-gray-900 text-sm">
            {isPublic ? "Unggah Modul Baru (Materi Publik)" : "Upload Materi Privat (Opsional)"}
          </h3>
          <button onClick={resetAndClose} aria-label="Tutup" className="text-gray-400 hover:text-gray-600 font-bold text-lg">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="docTitle" className="block text-xs font-semibold text-gray-700 mb-1">
              {isPublic ? "Judul Modul" : "Judul Catatan / Dokumen Privat"}
            </label>
            <input
              id="docTitle"
              type="text"
              placeholder={isPublic ? "Contoh: Bab 4 - Software Testing & QA" : "Contoh: Catatan Tambahan Pertemuan 3"}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={`w-full border rounded-lg p-2 text-xs focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? "border-rose-400" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
          </div>

          {isPublic && (
            <div>
              <label htmlFor="docChapter" className="block text-xs font-semibold text-gray-700 mb-1">
                Bab Tujuan
              </label>
              <select
                id="docChapter"
                value={form.chapter}
                onChange={(e) => setForm((f) => ({ ...f, chapter: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                {availableChapters.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="docFile" className="block text-xs font-semibold text-gray-700 mb-1">
              Pilih File PDF
            </label>
            <input
              id="docFile"
              type="file"
              accept=".pdf"
              onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
              className={`w-full border rounded-lg p-2 text-xs text-gray-600 bg-gray-50 ${
                errors.file ? "border-rose-400" : "border-gray-300"
              }`}
            />
            <p className="text-[10px] text-gray-500 mt-1">
              {isPublic
                ? "Modul ini akan tampil publik dan bisa diakses oleh seluruh pelajar di kelas."
                : "Dokumen ini bersifat privat dan hanya bisa diakses oleh akun Anda."}
            </p>
            {errors.file && <p className="text-[11px] text-rose-600 mt-1">{errors.file}</p>}
          </div>

          {status === "error" && (
            <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">{message}</p>
          )}
          {status === "success" && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              Dokumen berhasil diunggah &amp; diindeks oleh RAG Engine!
            </p>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              {status === "loading" ? "Mengunggah..." : isPublic ? "Unggah Modul" : "Simpan Privat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OpenUploadModalButton({
  variant,
  label,
  className,
}: {
  variant: Variant;
  label: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      <UploadModal open={open} onClose={() => setOpen(false)} variant={variant} />
    </>
  );
}
