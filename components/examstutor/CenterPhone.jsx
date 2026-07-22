import React from "react";

const PHONE_UI = "https://media.base44.com/images/public/6a4eb8c2f523d50ab206a827/5ed2032c4_IMAGE227799.png";

export default function CenterPhone() {
  return (
    <div className="relative flex justify-center">
      {/* Gold starburst glow behind phone */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 animate-glow-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(255,215,0,0.55) 0%, rgba(241,196,15,0.3) 30%, rgba(0,85,255,0.15) 55%, transparent 75%)",
        }}
      />
      <div className="relative w-[300px] max-w-full">
        <img
          src={PHONE_UI}
          alt="Mwalimu One phone interface"
          className="rounded-2xl"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}