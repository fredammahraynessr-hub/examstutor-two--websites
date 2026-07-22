import React, { useState } from "react";
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function CompliancePanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("validateCompliance", {});
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || "Access denied. Admins only.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#FACC15]" />
          <h3 className="text-[20px] font-bold text-[#1D4ED8]">Compliance Re-Check</h3>
        </div>
        <button
          onClick={runCheck}
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-[#FFD700] px-3 py-1.5 text-xs font-bold text-black transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
          {loading ? "Checking…" : "Run Check"}
        </button>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-2 text-[18px] font-bold text-red-500">
          <AlertTriangle className="h-3 w-3" /> {error}
        </p>
      )}

      {result && (
        <div className="mt-4">
          <div className={`flex items-center gap-2 text-[18px] font-bold ${result.status === "compliant" ? "text-green-500" : "text-[#FACC15]"}`}>
            {result.status === "compliant" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {result.status === "compliant" ? "All Content Compliant" : <><span className="text-[#DC2626]">{result.flagged_questions}</span> Question(s) Flagged</>}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div><p className="text-[18px] font-bold text-[#DC2626]">{result.total_questions}</p><p className="text-[18px] font-bold text-[#1D4ED8]">Total</p></div>
            <div><p className="text-[18px] font-bold text-[#DC2626]">{result.clean_questions}</p><p className="text-[18px] font-bold text-[#1D4ED8]">Clean</p></div>
            <div><p className="text-[18px] font-bold text-[#DC2626]">{result.flagged_questions}</p><p className="text-[18px] font-bold text-[#1D4ED8]">Flagged</p></div>
          </div>
        </div>
      )}
    </div>
  );
}