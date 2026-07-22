import React from "react";
import { Users } from "lucide-react";

export default function StudentTable({ students }) {
  if (!students || students.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5 text-center text-[18px] font-bold text-[#1D4ED8] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        No student practice data yet.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="mb-3 flex items-center gap-2">
        <Users className="h-5 w-5 text-[#3B82F6]" />
        <h3 className="text-[20px] font-bold text-[#1D4ED8]">Student Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-2 text-[18px] font-bold text-[#1D4ED8]">Student</th>
              <th className="pb-2 text-right text-[18px] font-bold text-[#1D4ED8]">Attempts</th>
              <th className="pb-2 text-right text-[18px] font-bold text-[#1D4ED8]">Accuracy</th>
              <th className="pb-2 text-[18px] font-bold text-[#1D4ED8]">Subjects</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-2 text-[18px] font-bold text-[#1D4ED8]">{s.name}</td>
                <td className="py-2 text-right text-[18px] font-bold text-[#DC2626]">{s.total_attempts}</td>
                <td className="py-2 text-right text-[18px] font-bold text-[#DC2626]">{s.accuracy}%</td>
                <td className="py-2 text-[18px] font-bold text-[#DC2626]">{s.subjects.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}