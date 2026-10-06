import { useState, useEffect, useCallback } from "react";
import { moviesApi } from "@/lib/api/movies";
import { Movie } from "@/types/movie";

const AUTO_PLAY_INTERVAL = 5000;

export const useHeroMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        const data = await moviesApi.getHeroMovies();
        setMovies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroMovies();
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  }, [movies.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  }, [movies.length]);

  const setSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (movies.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [movies.length, handleNext]);

  return {
    movies,
    currentMovie: movies[currentIndex] || null,
    currentIndex,
    loading,
    handlePrev,
    handleNext,
    setSlide,
  };
};
