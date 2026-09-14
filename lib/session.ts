// lib/session.ts
//
// Helper autentikasi sederhana berbasis cookie httpOnly, dikonsumsi oleh
// middleware.ts (proteksi rute) dan Server Components (personalisasi UI).
// Cocok untuk lingkungan praktikum — bukan implementasi produksi.

export const SESSION_COOKIE = "uns_session";

export type Role = "pelajar" | "pengajar";

export function isValidRole(value: string | undefined): value is Role {
  return value === "pelajar" || value === "pengajar";
}
