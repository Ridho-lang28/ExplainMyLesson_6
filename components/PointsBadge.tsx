// components/PointsBadge.tsx
// ASYNC Server Component — pola sama seperti AiContentPanel: async/await
// langsung di server (lib/data.ts), TANPA useState/useEffect/context. Setiap
// kali route ini di-render ulang oleh server (mis. dipicu router.refresh()
// dari ClaimPointsButton), angka poin di badge otomatis ikut segar.

import { getPoints } from "@/lib/data";

export default async function PointsBadge() {
  const points = await getPoints();
  return <p className="text-xl font-extrabold text-white">{points} pts</p>;
}
