import React from "react";

const POSTER =
  "https://media.base44.com/images/public/6a4eb8c2f523d50ab206a827/ca983adac_image227733poster.png";

export default function BrandPoster() {
  return (
    <div className="flex shrink-0">
      <div className="relative w-[160px] overflow-hidden rounded-2xl border border-[#00CFFF]/40 bg-black/60 p-1 shadow-[0_0_24px_rgba(0,207,255,0.35)]">
        <img
          src={POSTER}
          alt="Mwalimu One branding poster"
          className="h-auto w-full rounded-xl object-cover"
        />
      </div>
    </div>
  );
}