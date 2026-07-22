import React from "react";
import { motion } from "framer-motion";

export default function GoalProgress({ value = 455, goal = 1000 }) {
  const pct = Math.min(100, (value / goal) * 100);
  return (
    <div className="mx-auto w-full max-w-[420px] text-center">
      <p className="mb-2 text-base font-bold text-white">
        Today&apos;s Goal: <span className="text-[#FFD700]">1000 Questions</span>
      </p>
      <div className="relative h-5 overflow-hidden rounded-full border border-[#0033FF]/60 bg-[#00113a]/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="animate-glow-pulse h-full rounded-full bg-gradient-to-r from-[#0033FF] to-[#00CFFF] shadow-[0_0_16px_rgba(0,207,255,0.8)]"
        />
      </div>
      <p className="mt-2 text-sm font-semibold tracking-wide text-[#00CFFF]">
        {value} / {goal}
      </p>
    </div>
  );
}