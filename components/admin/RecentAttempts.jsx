import React from "react";
import { ListChecks } from "lucide-react";

export default function RecentAttempts({ attempts }) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5 text-center text-[18px] font-bold text-[#1D4ED8] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        No attempts recorded yet.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-[#FACC15]" />
        <h3 className="text-[20px] font-bold text-[#1D4ED8]">Recent Attempts</h3>
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto">
        {attempts.map((a, i) => (
          <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
            <div>
              <p className="text-[18px] font-bold text-[#1D4ED8]">{a.user}</p>
              <p className="text-[18px] font-bold text-[#1D4ED8]">{a.subject}{a.topic ? ` · ${a.topic}` : ""}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase ${a.is_correct ? "text-green-500" : "text-red-500"}`}>
              {a.is_correct ? "Correct" : "Wrong"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}