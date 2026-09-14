// components/ChapterProgressList.tsx — ASYNC Server Component
import { getChapterProgress } from "@/lib/data";

const TONE_STYLES: Record<string, { bar: string; text: string; label: string }> = {
  high: { bar: "bg-emerald-500", text: "text-emerald-600", label: "Tinggi" },
  good: { bar: "bg-blue-500", text: "text-blue-600", label: "Baik" },
  warning: { bar: "bg-amber-500", text: "text-amber-600", label: "Perlu Perhatian" },
};

export default async function ChapterProgressList() {
  const chapters = await getChapterProgress();

  return (
    <div className="space-y-4 pt-2">
      {chapters.map((chapter) => {
        const tone = TONE_STYLES[chapter.tone] ?? TONE_STYLES.good;
        return (
          <div key={chapter.id}>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span>{chapter.name}</span>
              <span className={`font-bold ${tone.text}`}>
                {chapter.percent}% ({tone.label})
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className={`${tone.bar} h-3 rounded-full transition-all duration-500`} style={{ width: `${chapter.percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
