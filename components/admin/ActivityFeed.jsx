import React from "react";
import { Activity } from "lucide-react";

const SEVERITY_COLORS = {
  info: "text-[#3B82F6]",
  warning: "text-[#FACC15]",
  error: "text-red-500",
  critical: "text-red-600"
};

export default function ActivityFeed({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5 text-center text-[18px] font-bold text-[#1D4ED8] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        No recent activity.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-5 w-5 text-[#3B82F6]" />
        <h3 className="text-[20px] font-bold text-[#1D4ED8]">Recent Activity</h3>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="border-b border-gray-100 pb-2 last:border-0">
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-bold text-[#1D4ED8]">{log.action}</p>
              <span className={`text-[10px] font-bold uppercase ${SEVERITY_COLORS[log.severity] || "text-gray-500"}`}>{log.severity}</span>
            </div>
            {log.details && <p className="text-[18px] font-bold text-[#1D4ED8]">{log.details}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}