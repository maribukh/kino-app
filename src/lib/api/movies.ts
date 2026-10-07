import { apiClient } from "./client";
import { Movie, MoviesApiResponse } from "@/types/movie";

export const moviesApi = {
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
};
