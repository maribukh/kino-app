import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { Badge } from "../../ui/Badge";
import {
  getMovieGenre,
  getMovieDuration,
  getMovieAgeRating,
} from "@/lib/utils/movie";

interface NowPlayingCardProps {
  movie: Movie;
}

export const NowPlayingCard = ({ movie }: NowPlayingCardProps) => {
  const genre = getMovieGenre(movie, "Thriller");
  const duration = getMovieDuration(movie, "102 min");
  const ageRating = getMovieAgeRating(movie, "16+");

  const imageUrl = movie.posterUrl || movie.backdropUrl;

  return (
    <div className="group relative flex-shrink-0 w-[260px] hover:w-[340px] h-[452px] bg-[#1E2031] rounded-[20px] p-3.5 flex flex-col justify-between transition-all duration-300 ease-in-out overflow-hidden">
      <div>
        <div className="relative w-full h-[280px] group-hover:h-[230px] rounded-xl overflow-hidden mb-3 bg-white/5 transition-all duration-300 ease-in-out flex-shrink-0">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300"
            />
          )}
        </div>

        <h3 className="text-white font-bold text-[16px] mb-0.5 line-clamp-1">
          {movie.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[12px] text-white/50 mb-2">
          <span>{genre}</span>
          <span>·</span>
          <span>{duration}</span>
        </div>

        <Badge variant="accent" className="mb-2 py-0.5 px-2">
          {ageRating}
        </Badge>

        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out">
          <div className="overflow-hidden">
            <p className="text-white/60 text-[12px] leading-relaxed line-clamp-3">
              {movie.synopsis}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 mt-auto">
        <span className="text-white text-[13px] font-medium">
          From <span className="font-bold">₾ {movie.fromPrice}</span>
        </span>
        <Link
          href={`/movies/${movie.slug}`}
          className="bg-[#EC3013] text-white text-[12px] font-bold px-4 py-2 rounded-full hover:bg-[#d4280f] transition-colors"
        >
          Buy Ticket
        </Link>
      </div>
    </div>
  );
};
