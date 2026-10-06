import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Movie } from "@/types/movie";

interface NowPlayingCardProps {
  movie: Movie;
}

export const NowPlayingCard = ({ movie }: NowPlayingCardProps) => {
  const genreName = movie.genres?.[0]?.name || "Thriller";

  return (
    <div className="flex-shrink-0 w-[240px] bg-[#0E152D] rounded-2xl p-3 flex flex-col justify-between border border-white/5 group hover:border-white/15 transition-all">
      <div>
        <div className="relative w-full h-[320px] rounded-xl overflow-hidden mb-3 bg-white/5">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h3 className="text-white text-[16px] font-bold truncate mb-1">
          {movie.title}
        </h3>

        <div className="flex items-center gap-2 text-white/60 text-[12px] mb-3">
          <span>{genreName}</span>
          <span>·</span>
          <span>{movie.runtimeMinutes} min</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          {movie.ageRating?.code && (
            <Badge variant="accent">{movie.ageRating.code}</Badge>
          )}
          <span className="text-white font-semibold text-[14px]">
            From ₾{movie.fromPrice}
          </span>
        </div>
      </div>

      <Link href={`/movies/${movie.slug}`}>
        <Button variant="primary" size="md" className="w-full">
          Buy Ticket
        </Button>
      </Link>
    </div>
  );
};
