import React from "react";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <div className="relative z-20 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-black leading-tight text-white drop-shadow-[0_0_20px_rgba(0,207,255,0.4)] sm:text-5xl md:text-6xl"
      >
        Ace Your <span className="text-[#00CFFF]">WAEC</span> Exams
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-2 text-xl font-extrabold tracking-[0.25em] text-[#FFC107] drop-shadow-[0_0_12px_rgba(255,193,7,0.5)] sm:text-2xl"
      >
        WITH MWALIMU ONE
      </motion.p>


    </div>
  );
}