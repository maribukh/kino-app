import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Movie } from "@/types/movie";

interface ComingSoonCardProps {
  movie: Movie;
}

export const ComingSoonCard = ({ movie }: ComingSoonCardProps) => {
  const genreName = movie.genres?.[0]?.name || "Drama";

  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
      })
    : "OCTOBER";

  return (
    <div className="flex-shrink-0 w-[380px] bg-[#0E152D] rounded-2xl p-4 flex gap-4 border border-white/5">
      <div className="relative w-[130px] h-[160px] rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0">
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

        <Button variant="ghost" size="sm" className="w-fit text-[12px] gap-2">
          🔔 Notify Me
        </Button>
      </div>
    </div>
  );
};
