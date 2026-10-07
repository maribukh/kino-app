import { RecentlyViewedSectionProps } from "@/types/profile";
import { RecentlyViewedCard } from "./RecentlyViewedCard";

export const RecentlyViewedSection = ({
  movies = [],
}: RecentlyViewedSectionProps) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="w-full px-8 py-6">
      <h3 className="text-h2 font-bold text-text-primary mb-4">
        Recently viewed
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {movies.map((movie) => (
          <RecentlyViewedCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};
