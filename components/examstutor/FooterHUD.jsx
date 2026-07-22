import React from "react";
import { Link } from "react-router-dom";
import GoalProgress from "@/components/examstutor/GoalProgress";

export default function FooterHUD() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-[#0033FF]/50 bg-black/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1280px] grid-cols-3 items-center gap-2 px-6 py-2">
        <div className="flex justify-start">
          <Link
            to="/"
            className="rounded-md border border-[#0033FF]/40 bg-[#001133]/60 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white transition-colors hover:text-[#00CFFF] sm:text-sm"
          >
            HOME
          </Link>
        </div>
        <div className="flex justify-center">
          <GoalProgress value={455} goal={1000} />
        </div>
        <div className="flex justify-end">
          <Link
            to="/admin"
            className="rounded-md border border-[#FFD700]/40 bg-[#001133]/60 px-4 py-2 text-xs font-bold tracking-[0.15em] text-white transition-colors hover:text-[#FFD700] sm:text-sm"
          >
            ADMINISTRATION DASHBOARD
          </Link>
        </div>
      </div>
    </footer>
  );
}