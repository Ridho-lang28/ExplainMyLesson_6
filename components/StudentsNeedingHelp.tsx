// components/StudentsNeedingHelp.tsx — ASYNC Server Component
import { getStudentsNeedingHelp } from "@/lib/data";

export default async function StudentsNeedingHelp() {
  const students = await getStudentsNeedingHelp();

  return (
    <div className="space-y-3">
      {students.map((student) => (
        <div key={student.id} className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{student.name}</p>
            <p className="text-xs text-amber-700">
              {student.chapter} — Skor Kuis: {student.score}/{student.outOf}
            </p>
          </div>
          <button className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2.5 py-1 rounded font-medium">Bimbing</button>
        </div>
      ))}
    </div>
  );
}
