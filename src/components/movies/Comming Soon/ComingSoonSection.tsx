import Link from "next/link";
import { useComingSoon } from "@/hooks/useComingSoon"; // или используемый hook
import { ComingSoonCard } from "./ComingSoonCard";
import { Button } from "@/components/ui/Button";
import { ScrollBlurOverlay } from "@/components/ui/ScrollBlurOverlay";

export const ComingSoonSection = () => {
  const { movies, loading, error, isEmpty, refetch } = useComingSoon();

  return (
    <section className="max-w-[1920px] w-full mx-auto px-16.75 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-black text-white uppercase tracking-wider">
          COMING SOON...
        </h2>
        <Link
          href="/coming-soon"
          className="text-[#EC3013] text-[13px] font-bold  transition-all"
        >
          See all
        </Link>
      </div>

      {loading && (
        <div className="flex gap-5 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-[470px] h-[184px] bg-white/5 animate-pulse rounded-2xl flex-shrink-0"
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
          No upcoming movies found.
        </div>
      )}

      {!loading && !error && !isEmpty && (
        <div className="relative w-full">
          <ScrollBlurOverlay />

          <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide pb-2 pt-1">
            {movies.map((movie) => (
              <ComingSoonCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
