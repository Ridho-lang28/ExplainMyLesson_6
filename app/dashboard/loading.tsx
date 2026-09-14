// app/dashboard/loading.tsx — Streaming Skeleton Fallback UI otomatis
// (React Suspense bawaan Next.js) yang tampil instan saat Server Component
// di bawah segmen /dashboard masih memuat data.

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-32 bg-gray-200 rounded-xl" />
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  );
}
