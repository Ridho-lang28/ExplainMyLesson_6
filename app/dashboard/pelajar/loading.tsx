// app/dashboard/pelajar/loading.tsx — fallback Streaming SSR untuk seluruh
// segmen /dashboard/pelajar (dipakai Next.js otomatis lewat React Suspense).

export default function PelajarLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-72 bg-gray-200 rounded-xl" />
        <div className="lg:col-span-8 h-72 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
