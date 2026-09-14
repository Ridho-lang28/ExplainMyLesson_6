// components/ClassSummarySkeleton.tsx
// Server Component statis dipakai sebagai `fallback` <Suspense> di halaman
// Pengajar — dirender instan sebelum ClassSummaryCards (async) selesai.

export default function ClassSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-pulse">
          <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
