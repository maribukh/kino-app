import Link from "next/link";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { MovieCard } from "./MovieCard";
import { Button } from "@/components/ui/Button";

export const NowPlayingSection = () => {
  const { movies, loading, error, isEmpty, refetch } = useNowPlaying();

  return (
    <section className="max-w-[1920px] w-full mx-auto px-16.75 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-black text-white uppercase tracking-wider">
          NOW PLAYING
        </h2>
        <Link
          href="/sessions"
          className="text-[#EC3013] text-[13px] font-bold hover:underline"
        >
          See all
        </Link>
      </div>

      {loading && (
        <div className="flex gap-5 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-[240px] h-[410px] bg-white/5 animate-pulse rounded-2xl flex-shrink-0"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-10 bg-white/5 rounded-2xl">
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="secondary" onClick={refetch}>
            Try Again
          </Button>
        </div>
      )}

      {isEmpty && (
        <div className="text-center py-10 text-white/50">
          No movies currently playing.
        </div>
      )}

      {!loading && !error && !isEmpty && (
        <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide pb-2">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="now-playing" />
          ))}
        </div>
      )}
    </section>
  );
};
