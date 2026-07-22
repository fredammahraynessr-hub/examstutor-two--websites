import React from "react";
import { ShieldAlert } from "lucide-react";

export default function WaecDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <p className="mx-auto max-w-2xl px-4 text-center text-[11px] leading-relaxed text-white/40">
        Examstutor2 is an independent WAEC practice platform and is not affiliated with, endorsed by, or connected to the West African Examinations Council (WAEC). Questions are for practice only.
      </p>
    );
  }
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-[#FFD700]/20 bg-[#001133]/60 px-5 py-4 text-center backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-center gap-2">
        <ShieldAlert className="h-4 w-4 text-[#FFD700]" />
        <span className="text-sm font-bold text-[#FFD700]">Legal Disclaimer</span>
      </div>
      <p className="text-xs leading-relaxed text-white/70">
        Examstutor2 is an independent educational practice platform and is{" "}
        <span className="font-semibold text-white">not affiliated with, endorsed by, sponsored by, or connected to</span>{" "}
        the West African Examinations Council (WAEC) or any official examination body. All questions and content are
        independently created for practice purposes and do not represent actual past examination papers unless explicitly
        labeled. Trademarks and names referenced belong to their respective owners. Use of this platform does not
        guarantee examination success.
      </p>
    </div>
  );
}