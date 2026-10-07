"use client";

import { HeroSection } from "@/components/movies/HeroSection";
import { RecentlyViewedSection } from "@/components/profile/RecentlyViewedSection";
import { NowPlayingSection } from "@/components/movies/Now Playing/NowPlayingSection";
import { ComingSoonSection } from "@/components/movies/Comming Soon/ComingSoonSection";

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
