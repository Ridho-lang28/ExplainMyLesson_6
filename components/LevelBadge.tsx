// components/LevelBadge.tsx
// Server Component murni — presentational, tanpa state/event, tidak perlu
// "use client". Dipakai di dalam Server Component (pelajar/page) maupun
// dilewatkan sebagai children ke Client Component (QuizClient).

const LEVEL_STYLES: Record<string, string> = {
  EASY: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-indigo-100 text-indigo-800",
  HARD: "bg-rose-100 text-rose-800",
};

const LEVEL_TEXT: Record<string, string> = {
  EASY: "Level 1: Mudah",
  MEDIUM: "Level 2: Menengah",
  HARD: "Level 3: Sulit",
};

export default function LevelBadge({ level = "EASY" }: { level?: string }) {
  return (
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded ${LEVEL_STYLES[level] ?? LEVEL_STYLES.EASY}`}
    >
      {LEVEL_TEXT[level] ?? LEVEL_TEXT.EASY}
    </span>
  );
}
