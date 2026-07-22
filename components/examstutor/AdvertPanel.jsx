import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const TILE_STYLE = {
  width: "120px",
  height: "80px",
  background: "#F5F5F5",
  border: "1px solid #DDDDDD",
  color: "#000000",
  fontFamily: "Inter, sans-serif",
  fontWeight: 700,
  fontSize: "12px",
};

export default function AdvertPanel({ side = "left" }) {
  const [advertisers, setAdvertisers] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await base44.functions.invoke("getAdvertisers", { side });
        if (active && res?.data?.advertisers) {
          setAdvertisers(res.data.advertisers);
        }
      } catch (e) {
        // Default tiles remain on error
      }
    })();
    return () => {
      active = false;
    };
  }, [side]);

  const tiles = Array.from({ length: 6 }, (_, i) => advertisers[i] || null);

  return (
    <div className="flex flex-col gap-2">
      {tiles.map((ad, i) => {
        if (ad) {
          return (
            <a
              key={i}
              href={ad.link_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded px-1 text-center"
              style={{
                ...TILE_STYLE,
                background: ad.image_url
                  ? `url(${ad.image_url}) center/cover`
                  : TILE_STYLE.background,
              }}
            >
              {!ad.image_url && ad.title}
            </a>
          );
        }
        return (
          <Link
            key={i}
            to="/admin/advertisers"
            className="flex items-center justify-center rounded px-1 text-center"
            style={TILE_STYLE}
          >
            Advertise Your Brand Here
          </Link>
        );
      })}
    </div>
  );
}