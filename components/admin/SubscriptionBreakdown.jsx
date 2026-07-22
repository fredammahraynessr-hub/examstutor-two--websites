import React from "react";
import { CreditCard } from "lucide-react";

const PLANS = [
  { key: "free", label: "Free", color: "#3B82F6" },
  { key: "basic", label: "Basic", color: "#FACC15" },
  { key: "premium", label: "Premium", color: "#3B82F6" }
];

export default function SubscriptionBreakdown({ breakdown }) {
  if (!breakdown) return null;
  const total = Object.values(breakdown).reduce((s, n) => s + n, 0) || 1;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="mb-3 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-[#FACC15]" />
        <h3 className="text-[20px] font-bold text-[#1D4ED8]">Subscriptions</h3>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
        {PLANS.map(({ key, color }) => (
          breakdown[key] > 0 && (
            <div key={key} style={{ width: `${(breakdown[key] / total) * 100}%`, backgroundColor: color }} />
          )
        ))}
      </div>
      <div className="mt-3 flex justify-around">
        {PLANS.map(({ key, label, color }) => (
          <div key={key} className="text-center">
            <p className="text-[18px] font-bold text-[#DC2626]">{breakdown[key] || 0}</p>
            <p className="text-[18px] font-bold" style={{ color }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}