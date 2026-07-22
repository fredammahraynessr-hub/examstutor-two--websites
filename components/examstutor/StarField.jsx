import React, { useEffect, useState } from "react";

const BG = "https://media.base44.com/images/public/6a4eb8c2f523d50ab206a827/d0032160f_generated_e5263811.png";

export default function StarField() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.1);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${BG})`, transform: `translateY(${offset}px) scale(1.1)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
    </div>
  );
}