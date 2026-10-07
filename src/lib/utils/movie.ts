import { Movie } from "@/types/movie";

export const getMovieMinPrice = (movie: Movie, fallback = 14): number => {
  if (!movie) return fallback;
  return movie.fromPrice ?? fallback;
};

export const getMovieGenre = (movie: Movie, fallback = "Thriller"): string => {
  return movie.genres?.[0]?.name || fallback;
};

export const getMovieDuration = (
  movie: Movie,
  fallback = "102 min",
): string => {
  return movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : fallback;
};

export const getMovieAgeRating = (movie: Movie, fallback = "16+"): string => {
  return movie.ageRating?.code || fallback;
};

export const formatReleaseDate = (
  releaseDate?: string,
  fallback = "OCTOBER",
  locale = "en-US",
): string => {
  if (!releaseDate) return fallback;

  const date = new Date(releaseDate);
  if (isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
  });
};
