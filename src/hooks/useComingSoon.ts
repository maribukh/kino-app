import { useState, useEffect, useCallback } from "react";
import { moviesApi } from "@/lib/api/movies";
import { Movie } from "@/types/movie";

export const useComingSoon = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComingSoon = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await moviesApi.getComingSoon();
      setMovies(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load coming soon movies",
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
        const data = await moviesApi.getComingSoon();
        if (isMounted) setMovies(data);
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load coming soon movies",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
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
    refetch: fetchComingSoon,
  };
};
