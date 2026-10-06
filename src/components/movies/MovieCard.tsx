import { Movie } from "@/types/movie";
import { NowPlayingCard } from "./NowPlayingCard";
import { ComingSoonCard } from "./ComingSoonCard";

export interface MovieCardProps {
  movie: Movie;
  variant?: "now-playing" | "coming-soon";
}

export const MovieCard = ({
  movie,
  variant = "now-playing",
}: MovieCardProps) => {
  if (variant === "coming-soon") {
    return <ComingSoonCard movie={movie} />;
  }

  return <NowPlayingCard movie={movie} />;
};
