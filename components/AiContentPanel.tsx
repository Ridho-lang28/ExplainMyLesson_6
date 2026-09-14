// components/AiContentPanel.tsx
// ASYNC Server Component — inilah "TaskListFetcher" versi Bab VI: melakukan
// async/await langsung di server (memanggil lib/data.ts, simulasi RAG/LLM),
// dan dirender di dalam <Suspense> oleh app/dashboard/pelajar/page.tsx untuk
// Streaming SSR. TIDAK ADA useState/useEffect di sini — murni async function.

import { getAiContent, type AiMode } from "@/lib/data";
import ClaimPointsButton from "@/components/ClaimPointsButton";
import { RefreshAiButton } from "@/components/ChapterModeSelector";

export default async function AiContentPanel({
  chapterId,
  mode,
}: {
  chapterId: string;
  mode: AiMode;
}) {
  let content: { title: string; body: string[] } | null = null;
  let errorMessage: string | null = null;

  try {
    content = await getAiContent(chapterId, mode);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Gagal memuat konten AI.";
  }

  if (errorMessage || !content) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-4 py-3 rounded-lg space-y-2">
        <p>Gagal memuat konten AI: {errorMessage}</p>
        <RefreshAiButton
          label="Coba Lagi"
          pendingLabel="Memuat..."
          className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b pb-4 mb-4 gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">{content.title}</h2>
          <span className="text-xs text-gray-500">Ekstraksi otomatis RAG &amp; LLM dari dokumen modul utama</span>
        </div>
        <RefreshAiButton />
      </div>

      <div className="prose max-w-none text-xs text-gray-700 space-y-3">
        {content.body.map((paragraph, idx) => (
          <p key={idx} className="whitespace-pre-wrap">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="border-t mt-4 pt-4 flex justify-between items-center">
        <span className="text-xs text-gray-500">Selesai membaca? Klaim poin kamu!</span>
        <ClaimPointsButton />
      </div>
    </>
  );
}
