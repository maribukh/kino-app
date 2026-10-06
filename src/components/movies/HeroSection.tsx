"use client";

import Image from "next/image";
import Link from "next/link";
import { useHeroMovies } from "@/hooks/useHeroMovies";
import { HeroControls } from "./HeroControls";

export const HeroSection = () => {
  const {
    movies,
    currentMovie,
    currentIndex,
    loading,
    handlePrev,
    handleNext,
    setSlide,
  } = useHeroMovies();

  if (loading || !currentMovie) {
    return <section className="w-full min-h-170 bg-[#070C1C] animate-pulse" />;
  }

  const releaseText = currentMovie.releaseDate
    ? new Date(currentMovie.releaseDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "NOW SHOWING";

  return (
    <section className="relative w-full min-h-170 bg-[#070C1C] overflow-hidden flex flex-col justify-between pt-32 pb-12">
      <div className="absolute inset-0 z-0">
        {currentMovie.backdropUrl && (
          <Image
            src={currentMovie.backdropUrl}
            alt={currentMovie.title}
            fill
            priority
            className="object-cover object-top opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-[#070C1C] via-[#070C1C]/60 to-transparent w-2/3" />
        <div className="absolute inset-0 bg-linear-to-r from-[#070C1C] via-transparent to-transparent h-1/2 bottom-0" />
      </div>

      <div className="relative z-10 max-w-[1920px] w-full mx-auto px-16.75 flex-1 flex flex-col justify-end pb-8">
        <div className="max-w-140">
          <span className="inline-block bg-[#EC3013]/20 text-[#EC3013] text-[12px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
            PREMIERE · {releaseText}
          </span>

          <h1 className="text-[48px] font-black text-white uppercase tracking-tight leading-none mb-4">
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-2 mb-6 font-semibold flex-wrap">
            {currentMovie.ageRating?.code && (
              <span className="bg-[#EC3013]/20 text-[#EC3013] text-[12px] font-semibold px-2 py-0.5 rounded-full">
                {currentMovie.ageRating.code}
              </span>
            )}
            <span className="bg-white/10 text-white text-[12px] px-3 py-1 rounded-full">
              ⏱ {currentMovie.runtimeMinutes} Min
            </span>
            {currentMovie.formats?.map((format) => (
              <span
                key={format.id}
                className="bg-white/10 text-white text-[12px] px-3 py-1 rounded-full"
              >
                {format.name}
              </span>
            ))}
          </div>

          <p className="text-white text-[14px] leading-relaxed mb-6 line-clamp-4">
            {currentMovie.synopsis}
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={`/movies/${currentMovie.slug}`}
              className="bg-[#EC3013] text-white text-[14px] font-bold px-6 h-12 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/icons/ticket.svg"
                alt="ticket icon"
                width={16}
                height={16}
              />
              Buy tickets
            </Link>
            <Link
              href="/sessions"
              className="bg-white/10 text-white text-[14px] font-bold px-6 h-12 rounded-full hover:bg-white/70 transition-colors flex items-center justify-center"
            >
              All sessions
            </Link>
          </div>
        </div>
      </div>

      <HeroControls
        total={movies.length}
        currentIndex={currentIndex}
        onSelect={setSlide}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
};
