"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

export const RecentlyViewedSection = () => {
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recently_viewed_movies");
    if (saved) {
      try {
        setRecentMovies(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recently viewed movies", e);
      }
    }
  }, []);

  if (recentMovies.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1920px] w-full mx-auto px-16.75 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-black text-white uppercase tracking-wider">
          RECENTLY VIEWED
        </h2>
      </div>

      <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide pb-2">
        {recentMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} variant="now-playing" />
        ))}
      </div>
    </section>
  );
};
