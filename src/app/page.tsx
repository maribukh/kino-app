"use client";

import { HeroSection } from "@/components/movies/HeroSection";
import { RecentlyViewedSection } from "@/components/movies/RecentlyViewedSection";
import { NowPlayingSection } from "@/components/movies/NowPlayingSection";
import { ComingSoonSection } from "@/components/movies/ComindSoonSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070C1C] text-white">
      <HeroSection />
      <RecentlyViewedSection />
      <NowPlayingSection />
      <ComingSoonSection />
    </main>
  );
}
