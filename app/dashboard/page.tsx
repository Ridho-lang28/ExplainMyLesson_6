// app/dashboard/page.tsx — Server Component. /dashboard sendiri bukan
// halaman final, hanya mengalihkan ke sub-dashboard sesuai role di cookie
// (dibaca ulang di sini karena layout tidak meneruskan role via props ke page).

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session";

export default function DashboardIndexPage() {
  const role = cookies().get(SESSION_COOKIE)?.value ?? "pelajar";
  redirect(`/dashboard/${role}`);
}
