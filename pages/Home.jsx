import React from "react";
import StarField from "@/components/examstutor/StarField";
import TopBar from "@/components/examstutor/TopBar";
import HeroBanner from "@/components/examstutor/HeroBanner";
import CenterPhone from "@/components/examstutor/CenterPhone";
import FooterHUD from "@/components/examstutor/FooterHUD";
import AdvertPanel from "@/components/examstutor/AdvertPanel";
import BrandPoster from "@/components/examstutor/BrandPoster";
import BrandPosterLeft from "@/components/examstutor/BrandPosterLeft";
import PhoneCta from "@/components/examstutor/PhoneCta";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-auto bg-black font-body text-white">
      <StarField />
      <TopBar />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 pb-28 pt-24">
        <HeroBanner />

        {/* Far-left brand poster + phone flanked by advertiser panels + far-right brand poster */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <BrandPosterLeft />
          <AdvertPanel side="left" />
          <CenterPhone />
          <AdvertPanel side="right" />
          <BrandPoster />
        </div>

        <PhoneCta />
      </main>

      <FooterHUD />
    </div>
  );
}