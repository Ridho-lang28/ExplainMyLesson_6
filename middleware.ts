// middleware.ts — Server-Side Access Control & Route Guard
//
// Dieksekusi di Edge Runtime SEBELUM permintaan mencapai komponen halaman
// mana pun di bawah /dashboard. Memverifikasi cookie sesi ("uns_session")
// dan mengalihkan (redirect) pengguna yang belum terautentikasi ke /login,
// sesuai Modul 6 poin G (Route Handlers, Middleware, & Proteksi Server-Side).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/session";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get(SESSION_COOKIE)?.value;
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("auth_error", "1");
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Header kustom sekadar contoh manipulasi header di layer middleware.
  const response = NextResponse.next();
  response.headers.set("x-uns-taskflow", "app-router");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
