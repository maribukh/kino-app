import Image from "next/image";
import { ViewedMovie } from "@/types/profile";

interface RecentlyViewedCardProps {
  movie: ViewedMovie;
}

export const RecentlyViewedCard = ({ movie }: RecentlyViewedCardProps) => {
  return (
    <div className="flex-shrink-0 w-[280px] bg-bg-card border border-overlay-border rounded-2xl p-3 flex gap-3 items-center hover:border-color-red/50 transition-all cursor-pointer">
      <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-[10px] px-1.5 py-0.5 bg-tint-red text-color-red rounded-md font-bold w-fit mb-1">
          {movie.ageRating}
        </span>
        <h4 className="text-[14px] font-bold text-text-primary truncate">
          {movie.title}
        </h4>
        <p className="text-[12px] text-text-secondary truncate">
          {movie.genre} · {movie.duration}
        </p>
      </div>
    </div>
  );
};
