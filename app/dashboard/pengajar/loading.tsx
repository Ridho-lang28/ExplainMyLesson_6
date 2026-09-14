export default function PengajarLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-14 bg-gray-200 rounded-xl w-2/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-64 bg-gray-200 rounded-xl" />
        <div className="lg:col-span-4 h-64 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
