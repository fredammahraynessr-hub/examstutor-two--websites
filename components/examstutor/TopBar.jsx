import React from "react";
import { Radio, LogIn } from "lucide-react";

export default function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[#0033FF]/50 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#00CFFF] to-[#0033FF] text-base">
            🎓
          </span>
          <span className="text-xl font-black text-white">
            <span className="text-[#00CFFF]">Mwalimu</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#00CFFF]/40 bg-[#001133]/60 px-4 py-1.5">
            <Radio className="h-4 w-4 animate-glow-pulse text-[#00CFFF]" />
            <span className="text-xs font-semibold text-white">
              Live Visitors: <span className="text-[#FFD700]">128</span>
            </span>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-[#FFD700] px-4 py-1.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-transform hover:scale-105">
            <LogIn className="h-4 w-4" /> Login
          </button>
        </div>
      </div>
    </header>
  );
}