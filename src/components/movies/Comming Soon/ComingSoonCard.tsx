import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Movie } from "@/types/movie";
import { getMovieGenre, formatReleaseDate } from "@/lib/utils/movie";

interface ComingSoonCardProps {
  movie: Movie;
}

export const ComingSoonCard = ({ movie }: ComingSoonCardProps) => {
  const genreName = getMovieGenre(movie, "Drama");
  const formattedDate = formatReleaseDate(movie.releaseDate);

  return (
    <div className="flex-shrink-0 w-[470px] bg-[#1E2031] rounded-2xl p-3 flex gap-3.75">
      <div className="relative w-[230px] h-[160px] rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
        {movie.posterUrl && (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          <span className="text-[#EC3013] text-[11px] font-bold uppercase tracking-wider block mb-1">
            IN CINEMAS {formattedDate}
          </span>
          <h3 className="text-white text-[16px] font-bold truncate mb-1">
            {movie.title}
          </h3>
          <p className="text-white/60 text-[12px] mb-2 truncate">
            {genreName} · {movie.runtimeMinutes} min
          </p>
          {movie.ageRating?.code && (
            <Badge variant="accent">{movie.ageRating.code}</Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-fit text-[12px] gap-2 h-auto text-white font-bold border border-white/30 hover:border-white/60 hover:bg-white/5 bg-transparent overflow-hidden"
        >
          <Image
            src="/images/icons/notification.svg"
            alt="notification icon"
            width={16}
            height={16}
          />
          <span className="transition-transform duration-200 hover:scale-105 inline-block">
            Notify Me
          </span>
        </Button>
      </div>
    </div>
  );
};
