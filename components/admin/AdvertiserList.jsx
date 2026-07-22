import React from "react";
import { Megaphone } from "lucide-react";
import AddAdvertiserDialog from "@/components/admin/AddAdvertiserDialog";

const STATUS_COLORS = {
  active: "text-green-500",
  pending: "text-[#FACC15]",
  paused: "text-gray-500",
  ended: "text-red-500"
};

export default function AdvertiserList({ advertisers, onRefresh }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-[#3B82F6]" />
          <h3 className="text-[20px] font-bold text-[#1D4ED8]">Advertisers</h3>
        </div>
        <AddAdvertiserDialog onSaved={onRefresh} />
      </div>
      {(!advertisers || advertisers.length === 0) ? (
        <p className="text-center text-[18px] font-bold text-[#1D4ED8]">No advertisers yet.</p>
      ) : (
        <div className="space-y-2">
          {advertisers.map((a, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
              <div>
                <p className="text-[18px] font-bold text-[#1D4ED8]">{a.brand_name}</p>
                <p className="text-[18px] font-bold text-[#1D4ED8] capitalize">{a.placement_side} placement</p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-[#DC2626]">${a.amount_paid || 0}</p>
                <p className={`text-[10px] font-bold capitalize ${STATUS_COLORS[a.status] || "text-gray-500"}`}>{a.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}