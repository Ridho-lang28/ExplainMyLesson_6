"use client";

// components/QuizClient.tsx — Client Component
// Kuis adaptif butuh interaktivitas tinggi (pilih jawaban, hint, skor
// berjalan, perpindahan level) sehingga diisolasi penuh sebagai Client
// Component. Soal level pertama sudah di-fetch di SERVER (lihat
// app/dashboard/pelajar/kuis/page.tsx, async Server Component) dan
// dilewatkan sebagai `initialQuestions` — soal level 2 & 3 diambil lewat
// Route Handler GET /api/quiz saat pengguna naik level (perubahan yang
// murni terjadi di sisi klien, tidak butuh navigasi halaman penuh).

import { useRouter } from "next/navigation";
import { useState } from "react";
import LevelBadge from "@/components/LevelBadge";
import type { Question } from "@/lib/data";

const LEVEL_KEY: Record<number, string> = { 1: "EASY", 2: "MEDIUM", 3: "HARD" };

type QuizState =
  | { status: "success"; data: Question[] }
  | { status: "loading" }
  | { status: "error"; message: string };

export default function QuizClient({ initialQuestions }: { initialQuestions: Question[] }) {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({ status: "success", data: initialQuestions });

  async function loadLevel(nextLevel: number) {
    setQuizState({ status: "loading" });
    setQuestionIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    try {
      const res = await fetch(`/api/quiz?level=${nextLevel}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal memuat soal.");
      setQuizState({ status: "success", data: payload.questions });
    } catch (err) {
      setQuizState({ status: "error", message: err instanceof Error ? err.message : "Terjadi kesalahan." });
    }
  }

  function handleSubmitAnswer() {
    if (quizState.status !== "success") return;
    if (selectedOption === null) {
      setFeedback("Pilih salah satu jawaban!");
      return;
    }

    const currentQuestion = quizState.data[questionIndex];
    if (!currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correctOption;
    const nextScore = isCorrect ? score + 10 : score;
    if (isCorrect) setScore(nextScore);

    setFeedback(null);
    setSelectedOption(null);
    setShowHint(false);

    const nextIndex = questionIndex + 1;
    if (nextIndex >= quizState.data.length) {
      if (level < 3) {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        loadLevel(nextLevel);
      } else {
        alert(`Kuis Selesai! Total Skor: ${nextScore}`);
        router.push("/dashboard/pelajar");
      }
    } else {
      setQuestionIndex(nextIndex);
    }
  }

  function handleExit() {
    if (confirm("Keluar dari kuis?")) router.push("/dashboard/pelajar");
  }

  const totalQuestions = quizState.status === "success" ? quizState.data.length : 10;
  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);
  const currentQuestion = quizState.status === "success" ? quizState.data[questionIndex] : null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <LevelBadge level={LEVEL_KEY[level]} />
          <h1 className="text-base font-bold text-gray-900 mt-2">Bab 2: Agile, Scrum &amp; AI Assessment</h1>
        </div>
        <div className="w-full sm:w-48">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progres Soal</span>
            <span>
              Soal {questionIndex + 1} dari {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <button onClick={handleExit} className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 border rounded-md">
          Keluar Kuis
        </button>
      </section>

      <article className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        {quizState.status === "loading" && (
          <div className="py-10 text-center text-sm text-gray-500 animate-pulse">Memuat soal...</div>
        )}

        {quizState.status === "error" && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-3 rounded-lg">
            Gagal memuat kuis: {quizState.message}
          </div>
        )}

        {quizState.status === "success" && currentQuestion && (
          <>
            <h2 className="text-sm font-bold text-gray-900 leading-relaxed">{currentQuestion.question}</h2>

            <fieldset>
              <legend className="sr-only">Pilihan Jawaban</legend>
              <div className="space-y-3 text-xs">
                {currentQuestion.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      selectedOption === idx ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz_option"
                      value={idx}
                      checked={selectedOption === idx}
                      onChange={() => {
                        setSelectedOption(idx);
                        setFeedback(null);
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2.5 text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <aside className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-lg flex items-start justify-between gap-3">
              <div className="text-xs text-indigo-900">
                <span className="font-bold flex items-center gap-1 text-indigo-700">💡 AI Hint (Petunjuk Asisten)</span>
                <p className="mt-1 text-indigo-800">{showHint ? currentQuestion.hint : "Klik tombol di samping untuk meminta bantuan AI."}</p>
              </div>
              <button
                onClick={() => setShowHint(true)}
                className="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded transition whitespace-nowrap"
              >
                Minta Hint AI
              </button>
            </aside>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">{feedback ?? `Skor sementara: ${score} poin`}</span>
              <button onClick={handleSubmitAnswer} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm">
                Jawab &amp; Lanjut
              </button>
            </div>
          </>
        )}
      </article>
    </main>
  );
}
