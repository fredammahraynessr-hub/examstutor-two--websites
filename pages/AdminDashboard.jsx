import React, { useState, useEffect } from "react";
import { Loader2, Lock, RefreshCw, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TopBar from "@/components/examstutor/TopBar";
import FooterHUD from "@/components/examstutor/FooterHUD";
import KpiCards from "@/components/admin/KpiCards";
import CompliancePanel from "@/components/admin/CompliancePanel";
import AdvertiserList from "@/components/admin/AdvertiserList";
import ActivityFeed from "@/components/admin/ActivityFeed";
import SubscriptionBreakdown from "@/components/admin/SubscriptionBreakdown";
import StudentTable from "@/components/admin/StudentTable";
import RecentAttempts from "@/components/admin/RecentAttempts";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("getAdminFeeds", {});
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.error || "Access denied. Admins only.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F9FAFB] font-body text-[#1D4ED8]" style={{ fontSize: "18px", fontWeight: 700 }}>
      <TopBar />
      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pb-28 pt-24">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-[22px] font-bold text-[#1D4ED8]">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Link to="/system-files" className="flex items-center gap-2 rounded-md border border-[#3B82F6]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#3B82F6] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#3B82F6]/5">
              <FolderOpen className="h-3 w-3" /> System Files
            </Link>
            <button onClick={load} disabled={loading} className="flex items-center gap-2 rounded-md border border-[#3B82F6]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#3B82F6] shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-[#3B82F6]/5 disabled:opacity-50">
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-20 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
            <p className="text-[#1D4ED8]">Loading dashboard…</p>
          </div>
        )}

        {error && !loading && (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <Lock className="h-10 w-10 text-[#FACC15]" />
            <p className="text-[#1D4ED8]">{error}</p>
            <p className="text-[#1D4ED8]">You must be logged in as an admin to view this page.</p>
          </div>
        )}

        {data && !loading && (
          <div className="mt-6 space-y-6">
            <KpiCards kpis={data.kpis} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <CompliancePanel />
              <AdvertiserList advertisers={data.advertisers} onRefresh={load} />
              <ActivityFeed logs={data.recent_activity} />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <StudentTable students={data.students} />
              <RecentAttempts attempts={data.recent_attempts} />
            </div>
            <SubscriptionBreakdown breakdown={data.subscription_breakdown} />
          </div>
        )}
      </main>
      <FooterHUD />
    </div>
  );
}