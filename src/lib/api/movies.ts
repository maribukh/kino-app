import { apiClient } from "./client";
import { Movie, MoviesApiResponse } from "@/types/movie";
import { MovieVenueScreenings } from "@/types/sessions";

interface MovieApiResponse {
  data: Movie;
}

interface MovieSessionsApiResponse {
  data: MovieVenueScreenings[];
}

export const moviesApi = {
  search: async (query: string): Promise<Movie[]> => {
    const response = await apiClient<MoviesApiResponse>("/search", {
      params: { q: query },
    });
    return response.data;
  },

  getHeroMovies: async (): Promise<Movie[]> => {
    const response = await apiClient<MoviesApiResponse>("/movies/featured");
    return response.data;
  },

  getNowPlaying: async (): Promise<Movie[]> => {
    const response = await apiClient<MoviesApiResponse>("/movies/now-playing");
    return response.data;
  },

  getComingSoon: async (): Promise<Movie[]> => {
    const response = await apiClient<MoviesApiResponse>("/movies/coming-soon");
    return response.data;
  },

  getMovie: async (slug: string): Promise<Movie> => {
    const response = await apiClient<MovieApiResponse>(`/movies/${slug}`);
    return response.data;
  },

  getMovieSessions: async (
    slug: string,
    date: string,
  ): Promise<MovieVenueScreenings[]> => {
    const response = await apiClient<MovieSessionsApiResponse>(
      `/movies/${slug}/sessions`,
      { params: { date } },
    );
    return response.data;
  },
};
