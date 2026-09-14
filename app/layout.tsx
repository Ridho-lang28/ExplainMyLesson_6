// app/layout.tsx — Root Layout (Server Component)
// Metadata API statis (SEO) + optimasi font next/font (mencegah CLS, sesuai
// Modul 6 poin F). Root Layout ini TIDAK di-render ulang saat navigasi
// antarrute di bawahnya (preserving state), sesuai Modul 6 poin D.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://uns-taskflow.vercel.app"),
  title: {
    default: "ExplainMyLesson AI — UNS TaskFlow",
    template: "%s | ExplainMyLesson AI",
  },
  description:
    "Platform pembelajaran adaptif berbasis AI (RAG/LLM) untuk mahasiswa D3 Teknik Informatika Sekolah Vokasi UNS — dibangun dengan Next.js App Router & React Server Components.",
  keywords: ["UNS", "Sekolah Vokasi", "Teknik Informatika", "Next.js", "App Router", "React Server Components"],
  authors: [{ name: "Lab RPL & Front-End Engineering SV UNS" }],
  openGraph: {
    title: "ExplainMyLesson AI — UNS TaskFlow",
    description: "Dari 200 halaman jadi 2 halaman — pahami materi kuliah tanpa pusing, ditenagai AI.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50 text-gray-800 antialiased`}>{children}</body>
    </html>
  );
}
