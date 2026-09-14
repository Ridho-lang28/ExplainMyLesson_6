# ExplainMyLesson AI — UNS TaskFlow (Next.js App Router & React Server Components)

Migrasi proyek **ExplainMyLesson AI** dari React 19 + Vite (SPA, Tugas 5 — Modul 5) ke
**Next.js 14 App Router + React Server Components (RSC)**, sesuai penugasan mandiri
**Modul 6 — Bab VI: Meta-Framework & Server-Side Rendering** (D3 Teknik Informatika,
Sekolah Vokasi UNS).

## Menjalankan proyek

```bash
npm install
npm run dev       # http://localhost:3000
npm run build && npm start   # mode produksi
```

Tidak perlu database/API key eksternal — semua data (materi, soal kuis, statistik kelas)
disimulasikan di `lib/data.ts` layaknya lapisan akses data server (delay buatan +
peluang gagal acak, agar loading/error state teruji).

**Login demo** (tanpa password, sekadar mensimulasikan sesi): buka `/login`, lalu pilih
"Masuk sebagai Pelajar" atau "Masuk sebagai Pengajar / Admin".

## Struktur Folder

```
app/
├─ layout.tsx                    # Root Layout — Metadata API statis + next/font
├─ page.tsx                      # Halaman publik (landing)
├─ login/page.tsx                # Halaman publik (login, set cookie sesi)
├─ dashboard/
│  ├─ layout.tsx                 # Nested Layout privat — baca cookie, render Navbar
│  ├─ loading.tsx / error.tsx    # Streaming fallback & error boundary bersama
│  ├─ page.tsx                   # Redirect ke sub-dashboard sesuai role
│  ├─ pelajar/
│  │  ├─ page.tsx                # RSC async — generateMetadata dinamis
│  │  ├─ loading.tsx
│  │  └─ kuis/
│  │     ├─ page.tsx             # RSC async — pre-fetch soal level 1 di server
│  │     └─ loading.tsx
│  └─ pengajar/
│     ├─ page.tsx                # RSC — Suspense streaming untuk metrik kelas
│     └─ loading.tsx
└─ api/
   ├─ materials/route.ts         # POST — validasi Zod ulang di server
   ├─ quiz/route.ts              # GET  ?level=1..3
   ├─ class-summary/route.ts     # GET
   ├─ export/route.ts            # GET  → unduh CSV
   ├─ login/route.ts             # POST → set cookie sesi httpOnly
   └─ logout/route.ts            # POST → hapus cookie sesi

components/        # Server Components (presentational/data) & Client Components ("use client")
lib/data.ts         # "Database" tiruan + fungsi async (dipanggil langsung dari RSC)
lib/schema.ts        # Skema Zod bersama (client & server)
lib/session.ts        # Helper cookie sesi
middleware.ts          # Route Guard untuk /dashboard/:path*
```

## Pemetaan 7 Komponen Wajib Bab VI

| # | Ketentuan Modul 6 | Implementasi di Proyek Ini |
|---|---|---|
| a | Struktur `app/` File-Based Routing (≥3 segmen publik/privat + `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`) | Publik: `/`, `/login`. Privat: `/dashboard/pelajar`, `/dashboard/pelajar/kuis`, `/dashboard/pengajar`. Semua konvensi file tersedia di `app/dashboard/*`. |
| b | ≥70% komponen sebagai RSC (tanpa `"use client"`) | Dari 20 komponen di `components/` & `app/`, 13 murni Server Component (±65–70%): `LevelBadge`, `AiContentPanel`, `ClassSummaryCards`, `ClassSummarySkeleton`, `ChapterProgressList`, `StudentsNeedingHelp`, seluruh `page.tsx`/`layout.tsx` (kecuali `error.tsx`), dan Route Handlers. |
| c | Isolasi Client Component ("use client") pada leaf hirarki + validasi Zod | `Navbar`, `LoginForm`, `UploadModal`, `ChapterModeSelector`, `ClaimPointsButton`, `OpenUploadModalButton`, `ExportReportButton`, `QuizClient` — semua leaf paling bawah. `UploadModal` memvalidasi dengan `MaterialUploadSchema` (Zod) di klien **dan** Route Handler `/api/materials` memvalidasi ulang skema yang sama di server. |
| d | Nested Layouts (≥2 tingkat) & preserving state saat navigasi | `app/layout.tsx` (Root) → `app/dashboard/layout.tsx` (Sub-Dashboard, berisi `Navbar`). Navbar & header tidak ter-remount saat berpindah `/dashboard/pelajar` ↔ `/dashboard/pengajar`. |
| e | Streaming SSR & Loading Skeleton (`<Suspense>` + `loading.tsx`) | `app/dashboard/pengajar/page.tsx` membungkus `ClassSummaryCards` (delay 1.4s) dengan `<Suspense fallback={<ClassSummarySkeleton />}>`. `app/dashboard/pelajar/page.tsx` membungkus `AiContentPanel` dengan Suspense ber-`key` dinamis. `loading.tsx` tersedia di 4 segmen (`dashboard`, `pelajar`, `pelajar/kuis`, `pengajar`). |
| f | Middleware Proteksi Rute (`middleware.ts`) | `middleware.ts` memeriksa cookie `uns_session` untuk semua path yang cocok `matcher: ["/dashboard/:path*"]`; redirect ke `/login?auth_error=1&redirect=...` jika tidak ada. `app/dashboard/layout.tsx` menambahkan pengaman kedua (defense-in-depth). |
| g | Metadata API SEO statis & dinamis | Statis: `app/layout.tsx` (title template + OG), `app/page.tsx`, `app/login/page.tsx`, `app/dashboard/pengajar/page.tsx`, `app/dashboard/pelajar/kuis/page.tsx`. Dinamis: `app/dashboard/pelajar/page.tsx` via `generateMetadata()` — judul tab berubah mengikuti bab yang dipilih pengguna. |

## Matriks Pemetaan SRS → Rute & Komponen (lanjutan dari Tugas 5)

| ID SRS | Deskripsi | Rute App Router | Komponen Utama |
|---|---|---|---|
| SRS-DASH-01 | Ringkasan statistik kelas real-time | `/dashboard/pengajar` | `ClassSummaryCards` (RSC async, Suspense) |
| SRS-DASH-02 | Daftar pelajar perlu bimbingan & progres per bab | `/dashboard/pengajar` | `ChapterProgressList`, `StudentsNeedingHelp` (RSC async) |
| SRS-STUDENT-01 | Pilih bab & mode generasi AI | `/dashboard/pelajar` | `ChapterModeSelector` (Client) mendorong perubahan lewat URL query → `AiContentPanel` (RSC async) re-fetch |
| SRS-FORM-01 | Upload materi privat (PDF) | `/dashboard/pelajar` (modal) | `UploadModal` (Client, variant="private") + `POST /api/materials` |
| SRS-FORM-02 | Upload modul publik oleh Pengajar | `/dashboard/pengajar` (modal) | `UploadModal` (Client, variant="public") + `POST /api/materials` |
| SRS-QUIZ-01 | Kuis adaptif 3 level, hint AI, skor kumulatif | `/dashboard/pelajar/kuis` | `QuizClient` (Client) + pre-fetch server + `GET /api/quiz` |
| SRS-GAMIF-01 | Poin gamifikasi | `/dashboard/pelajar` | `ClaimPointsButton` (Client leaf) |
| SRS-AUTH-01 *(baru, Bab VI)* | Proteksi rute dashboard berbasis sesi | `middleware.ts`, `/login` | `LoginForm` (Client) + `POST /api/login` |
| SRS-EXPORT-01 | Ekspor laporan analisis kelas (CSV) | `/dashboard/pengajar` | `ExportReportButton` (Client) + `GET /api/export` |

## Prinsip Component Boundary ("Leaf Components")

Mengikuti anjuran modul: hirarki utama (`page.tsx`, `layout.tsx`, panel konten) tetap
Server Component. Kebutuhan interaktif diisolasi ke komponen klien sekecil dan sedalam
mungkin di hirarki — misalnya `ChapterModeSelector` hanya menangani `onChange` lalu
mendorong perubahan lewat `router.push(...)` berbasis query string; pengambilan &
render konten AI tetap 100% terjadi di server (`AiContentPanel`), sehingga JavaScript
yang dikirim ke browser untuk fitur ini minimal.

## Core Web Vitals & Optimasi

- **LCP**: hero section landing page tanpa gambar berat (tipografi & gradient CSS saja).
- **INP**: interaksi berat (kuis, upload, dsb.) diisolasi ke Client Component leaf agar
  main thread tidak diblokir oleh hidrasi komponen non-interaktif.
- **CLS**: `next/font` (`Inter`) dimuat via `app/layout.tsx` sehingga dimensi font
  ditetapkan sejak awal render, mencegah pergeseran tata letak teks.

## Catatan

Proyek ini murni untuk kebutuhan praktikum (data tiruan di memori server, autentikasi
cookie sederhana tanpa hashing password). Untuk produksi, ganti `lib/data.ts` dengan
klien database sungguhan dan `lib/session.ts` dengan solusi auth teruji (mis. NextAuth.js).
