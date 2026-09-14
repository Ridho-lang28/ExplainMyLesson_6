// lib/data.ts
//
// "Server-side data layer" — mensimulasikan akses langsung ke database /
// RAG Engine dari dalam React Server Component (RSC), sesuai Modul 6 poin D:
// "Async/Await langsung di dalam Server Component manapun" (tanpa getServerSideProps,
// tanpa useState/useEffect). Fungsi-fungsi ini HANYA dipanggil dari Server Components
// atau Route Handlers — TIDAK PERNAH dikirim ke bundle klien.

export type AiMode = "ringkasan" | "analogi" | "mindmap" | "contoh";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  hint: string;
}

export interface ChapterProgress {
  id: number;
  name: string;
  percent: number;
  tone: "high" | "good" | "warning";
}

export interface StudentHelp {
  id: string;
  name: string;
  chapter: string;
  score: number;
  outOf: number;
}

export interface ClassSummary {
  totalStudents: number;
  averageComprehension: number;
  activeModules: number;
  studentsNeedingIntervention: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// "Database" poin gamifikasi — disimpan sebagai state modul di server (bukan
// di Client Component), sejalan dengan mock DB lain di file ini. Dibaca oleh
// PointsBadge (Server Component) & diubah lewat Route Handler /api/points
// yang dipanggil ClaimPointsButton, lalu di-refresh via router.refresh().
let currentPoints = 420;

export const availableChapters = [
  { value: "1", label: "Bab 1: Pengantar Software Engineering" },
  { value: "2", label: "Bab 2: Agile, Scrum & AI Assessment" },
  { value: "3", label: "Bab 3: Software Requirements & SKPL" },
];

export const aiModes: { value: AiMode; icon: string; label: string }[] = [
  { value: "ringkasan", icon: "📄", label: "Ringkasan (200 hlm → 2 hlm)" },
  { value: "analogi", icon: "💡", label: "Analogi Sederhana" },
  { value: "mindmap", icon: "🧠", label: "Mind Map / Hierarki" },
  { value: "contoh", icon: "✍️", label: "Contoh Soal & Pembahasan" },
];

const chapterProgressDb: ChapterProgress[] = [
  { id: 1, name: "Bab 1: Pengantar Software Engineering", percent: 88, tone: "high" },
  { id: 2, name: "Bab 2: Agile, Scrum & AI Assessment", percent: 58, tone: "warning" },
  { id: 3, name: "Bab 3: Software Requirements & SKPL", percent: 76, tone: "good" },
];

const studentsNeedingHelpDb: StudentHelp[] = [
  { id: "s1", name: "Ridho Asykuri", chapter: "Bab 2", score: 2, outOf: 10 },
  { id: "s2", name: "Siswa B", chapter: "Bab 2", score: 5, outOf: 10 },
];

const aiContentLibrary: Record<string, Record<AiMode, { title: string; body: string[] }>> = {
  "1": {
    ringkasan: {
      title: "Ringkasan — Bab 1: Pengantar Software Engineering",
      body: [
        "Software Engineering adalah pendekatan sistematis untuk merancang, mengembangkan, dan memelihara perangkat lunak.",
        "Siklus hidup perangkat lunak mencakup analisis kebutuhan, desain, implementasi, pengujian, dan pemeliharaan.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 1: Pengantar Software Engineering",
      body: [
        "Bayangkan membangun perangkat lunak seperti membangun rumah: butuh rancangan (desain), fondasi yang kuat (implementasi inti), dan pengecekan kualitas sebelum ditempati (pengujian).",
        "Tanpa tahapan yang jelas, software yang dibangun tanpa proses SE yang benar akan sulit dipelihara.",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 1: Pengantar Software Engineering",
      body: [
        "🔹 Software Engineering",
        "  ├─ Analisis Kebutuhan — mengumpulkan apa yang diinginkan pengguna",
        "  ├─ Desain — merancang arsitektur & struktur sistem",
        "  ├─ Implementasi — menulis kode program",
        "  ├─ Pengujian — memastikan sistem bebas dari bug",
        "  └─ Pemeliharaan — perbaikan & pembaruan setelah rilis",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 1: Pengantar Software Engineering",
      body: [
        "Soal: Tahap apa yang bertujuan memastikan perangkat lunak bebas dari kesalahan sebelum dirilis?",
        "Pembahasan: Jawabannya adalah tahap Pengujian (Testing), yang memverifikasi sistem sesuai spesifikasi kebutuhan.",
      ],
    },
  },
  "2": {
    ringkasan: {
      title: "Ringkasan — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Agile adalah metodologi pengembangan perangkat lunak yang berfokus pada iterasi cepat, kolaborasi tim, dan adaptabilitas.",
        "RAG (Retrieval-Augmented Generation) membantu membedah dokumen modul panjang menjadi materi ringkas yang personal.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Scrum itu seperti memasak dalam porsi kecil bertahap (Sprint), bukan menyiapkan pesta besar sekaligus.",
        "Product Owner ibarat kepala koki yang menentukan menu prioritas, Scrum Master menjaga dapur tetap lancar.",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "🔹 Agile & Scrum",
        "  ├─ Sprint — siklus kerja 1–4 minggu",
        "  ├─ Scrum Master — memfasilitasi & menghilangkan hambatan",
        "  ├─ Product Owner — mengelola prioritas backlog",
        "  └─ AI Assessment — RAG meringkas materi panjang jadi ringkas",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Soal: Siapa yang bertanggung jawab mengelola Product Backlog dalam Scrum?",
        "Pembahasan: Product Owner — mewakili suara pengguna/bisnis dan menentukan prioritas fitur.",
      ],
    },
  },
  "3": {
    ringkasan: {
      title: "Ringkasan — Bab 3: Software Requirements & SKPL",
      body: [
        "SKPL mendokumentasikan kebutuhan fungsional dan non-fungsional sebuah sistem.",
        "Kebutuhan yang tertulis jelas menjadi dasar penerjemahan ke komponen UI yang terstruktur.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 3: Software Requirements & SKPL",
      body: [
        "SKPL itu seperti cetak biru (blueprint) sebelum membangun gedung.",
        "Kebutuhan fungsional adalah 'apa yang harus dilakukan', non-fungsional adalah 'seberapa baik ia bekerja'.",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 3: Software Requirements & SKPL",
      body: [
        "🔹 SKPL",
        "  ├─ Kebutuhan Fungsional — fitur & perilaku sistem",
        "  ├─ Kebutuhan Non-Fungsional — performa, keamanan, usability",
        "  └─ Penerjemahan ke UI — struktur komponen mengikuti dokumen SKPL",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 3: Software Requirements & SKPL",
      body: [
        "Soal: Apa perbedaan kebutuhan fungsional dan non-fungsional dalam SKPL?",
        "Pembahasan: Fungsional menjelaskan fitur/perilaku sistem, non-fungsional menjelaskan kualitas seperti performa & keamanan.",
      ],
    },
  },
};

const mockQuestions: Record<number, Question[]> = {
  1: Array.from({ length: 10 }, (_, i) => ({
    id: `q1_${i + 1}`,
    question: `[Level 1 - Soal ${i + 1}] Apa prinsip utama Agile Manifesto?`,
    options: [
      "Individu dan interaksi lebih dari proses dan sarana",
      "Dokumentasi menyeluruh lebih dari perangkat lunak yang berfungsi",
      "Negosiasi kontrak lebih dari kolaborasi pelanggan",
      "Mengikuti rencana lebih dari tanggap terhadap perubahan",
    ],
    correctOption: 0,
    hint: "Utamakan komunikasi antar manusia dibandingkan aturan yang kaku.",
  })),
  2: Array.from({ length: 10 }, (_, i) => ({
    id: `q2_${i + 1}`,
    question: `[Level 2 - Soal ${i + 1}] Siapa yang bertanggung jawab mengelola Product Backlog dalam Scrum?`,
    options: ["Scrum Master", "Product Owner", "Development Team", "Stakeholder"],
    correctOption: 1,
    hint: "Peran ini mewakili suara pengguna dan menentukan prioritas fitur.",
  })),
  3: Array.from({ length: 10 }, (_, i) => ({
    id: `q3_${i + 1}`,
    question: `[Level 3 - Soal ${i + 1}] Bagaimana AI dapat membantu dalam estimasi Sprint Planning?`,
    options: [
      "Menggantikan seluruh anggota tim developer",
      "Menganalisis histori velocity dan kompleksitas tugas secara presisi",
      "Menghapus kebutuhan Daily Standup",
      "Membuat keputusan produk tanpa persetujuan PO",
    ],
    correctOption: 1,
    hint: "AI berperan sebagai asisten berbasis data historis, bukan pengganti peran manusia.",
  })),
};

export async function getChapterProgress(): Promise<ChapterProgress[]> {
  await delay(500);
  return chapterProgressDb;
}

export async function getStudentsNeedingHelp(): Promise<StudentHelp[]> {
  await delay(500);
  return studentsNeedingHelpDb;
}

// Sengaja diberi delay lebih lama untuk mendemonstrasikan Streaming SSR +
// <Suspense> pada app/dashboard/pengajar/page.tsx (lihat loading.tsx & fallback).
export async function getClassSummary(): Promise<ClassSummary> {
  await delay(1400);
  return {
    totalStudents: 50,
    averageComprehension: 78.4,
    activeModules: 6,
    studentsNeedingIntervention: studentsNeedingHelpDb.length,
  };
}

export async function getAiContent(chapterId: string, mode: AiMode) {
  await delay(900);
  const content = aiContentLibrary[chapterId]?.[mode];
  if (!content) {
    throw new Error("Konten untuk kombinasi Bab & Mode ini belum tersedia.");
  }
  return content;
}

export async function getPoints(): Promise<number> {
  await delay(150);
  return currentPoints;
}

export async function claimUnderstandingPoints(amount = 10): Promise<number> {
  await delay(300);
  currentPoints += amount;
  return currentPoints;
}

export async function getQuestionsByLevel(level: number): Promise<Question[]> {
  await delay(600);
  const data = mockQuestions[level];
  if (!data) {
    throw new Error(`Soal untuk level ${level} tidak ditemukan.`);
  }
  return data;
}

export async function saveMaterial(payload: { title: string; fileName: string }) {
  await delay(900);
  if (Math.random() < 0.15) {
    throw new Error("Gagal mengindeks dokumen ke RAG Engine. Coba lagi.");
  }
  return {
    id: `doc_${Date.now()}`,
    title: payload.title,
    fileName: payload.fileName,
    indexedAt: new Date().toISOString(),
  };
}

export async function buildClassReportCsv() {
  await delay(700);
  const summary = await getClassSummary();
  const chapters = await getChapterProgress();
  const students = await getStudentsNeedingHelp();

  const rows: (string | number)[][] = [];
  rows.push(["Laporan Analisis & Pemahaman Kelas"]);
  rows.push(["Diekspor pada", new Date().toLocaleString("id-ID")]);
  rows.push([]);
  rows.push(["Ringkasan Umum"]);
  rows.push(["Total Pelajar Terdaftar", summary.totalStudents]);
  rows.push(["Rata-Rata Pemahaman Kelas (%)", summary.averageComprehension]);
  rows.push(["Materi Aktif di-Upload", summary.activeModules]);
  rows.push(["Pelajar Perlu Intervensi", summary.studentsNeedingIntervention]);
  rows.push([]);
  rows.push(["Tingkat Pemahaman Per Bab"]);
  rows.push(["Bab", "Persentase (%)"]);
  chapters.forEach((c) => rows.push([c.name, c.percent]));
  rows.push([]);
  rows.push(["Pelajar Perlu Bimbingan"]);
  rows.push(["Nama", "Bab", "Skor Kuis"]);
  students.forEach((s) => rows.push([s.name, s.chapter, `${s.score}/${s.outOf}`]));

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  return { fileName: `Laporan_Analisis_Kelas_${Date.now()}.csv`, content: csv };
}
