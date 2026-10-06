import { useState, useEffect, useCallback } from "react";
import { moviesApi } from "@/lib/api/movies";
import { Movie } from "@/types/movie";

export const useNowPlaying = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await moviesApi.getNowPlaying();
      setMovies(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed: We can'nt load now playing movies",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setError(null);
      try {
        const data = await moviesApi.getNowPlaying();
        if (isMounted) {
          setMovies(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed: We can'nt load now playing movies",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    movies,
    loading,
    error,
    isEmpty: !loading && !error && movies.length === 0,
    refetch: fetchNowPlaying,
  };
};
