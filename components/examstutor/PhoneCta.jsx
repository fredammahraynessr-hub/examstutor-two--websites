import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Route constants — update these to ET1 URLs when ET1 is live
const LOGIN_ROUTE = "/login";
const STUDY_ROUTE = "/";

export default function PhoneCta() {
  const navigate = useNavigate();
  return (
    <div className="mt-6 flex flex-col items-center gap-4 text-center">
      <p className="text-base font-semibold text-white sm:text-lg">
        Mwalimu One helps students prepare for WAEC exams.
      </p>
      <div className="flex items-center gap-4">
        <motion.button
          onClick={() => navigate(LOGIN_ROUTE)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="rounded-full px-8 py-3 text-sm font-bold uppercase text-black shadow-[0_4px_20px_rgba(255,215,0,0.45)]"
          style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFAC00 100%)" }}
        >
          LOGIN
        </motion.button>
        <motion.button
          onClick={() => navigate(STUDY_ROUTE)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="rounded-full px-8 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,85,255,0.45)]"
          style={{ background: "linear-gradient(135deg, #0055FF 0%, #0022AA 100%)" }}
        >
          Back to Study
        </motion.button>
      </div>
    </div>
  );
}