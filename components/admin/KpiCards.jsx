import React from "react";
import { Users, FileQuestion, Target, CreditCard, TrendingUp, DollarSign } from "lucide-react";

const CARDS = [
  { key: "total_users", label: "Total Users", icon: Users, color: "#3B82F6" },
  { key: "total_questions", label: "Questions", icon: FileQuestion, color: "#FACC15" },
  { key: "total_attempts", label: "Attempts", icon: Target, color: "#3B82F6" },
  { key: "active_subscriptions", label: "Active Subs", icon: CreditCard, color: "#FACC15" },
  { key: "overall_accuracy", label: "Accuracy", icon: TrendingUp, color: "#3B82F6", suffix: "%" },
  { key: "estimated_revenue", label: "Revenue", icon: DollarSign, color: "#FACC15", prefix: "$" }
];

export default function KpiCards({ kpis }) {
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {CARDS.map(({ key, label, icon: Icon, color, prefix, suffix }) => (
        <div key={key} className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <Icon className="h-5 w-5" style={{ color }} />
          <p className="mt-2 text-[18px] font-bold text-[#DC2626]">
            {prefix}{kpis[key] ?? 0}{suffix}
          </p>
          <p className="text-[18px] font-bold text-[#1D4ED8]">{label}</p>
        </div>
      ))}
    </div>
  );
}