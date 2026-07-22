import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import StarField from "@/components/examstutor/StarField";

export default function ThankYou() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black font-body text-white">
      <StarField />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="h-16 w-16 text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]" />
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Payment Received</h1>
        <div className="mt-3 flex items-center gap-2 text-[#00CFFF]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-semibold">Confirming your subscription…</span>
        </div>
        <p className="mt-2 max-w-md text-sm text-white/70">
          Your WAEC practice access is being activated. You can start practicing shortly.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-md bg-gradient-to-r from-[#FFD700] to-[#f0b400] px-6 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(255,215,0,0.5)] transition-transform hover:scale-105"
        >
          Back to Home
        </Link>
      </main>
    </div>
  );
}