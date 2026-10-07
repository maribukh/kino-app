export interface Genre {
  id: number;
  slug: string;
  name: string;
}

export interface Format {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
}

export interface AgeRating {
  code: string;
  minAge: number;
  description: string;
}

export interface Movie {
  id: number;
  slug: string;
  title: string;
  kind: string;
  runtimeMinutes: number;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  isComingSoon: boolean;
  isNotified: boolean;
  isFeatured: boolean;
  fromPrice: number;
  ageRating: AgeRating;
  genres: Genre[];
  formats: Format[];
  synopsis: string;
}

export interface MoviesApiResponse {
  data: Movie[];
}

export const getHeroMovies = async (): Promise<Movie[]> => {
  const res = await fetch("/api/movies/hero");

  if (!res.ok) {
    throw new Error(`Failed to fetch hero movies (Status: ${res.status})`);
  }

  const responseData: MoviesApiResponse = await res.json();
  return responseData.data;
};
