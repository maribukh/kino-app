"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { moviesApi } from "@/lib/api/movies";
import { Movie } from "@/types/movie";

export const HeaderSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeOverlay = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;

    let isCurrentRequest = true;
    const timeoutId = window.setTimeout(async () => {
      try {
        const movies = await moviesApi.search(normalizedQuery);
        if (isCurrentRequest) setResults(movies.slice(0, 6));
      } catch {
        if (isCurrentRequest) setError("Search is temporarily unavailable.");
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }, 250);

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeOverlay();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeOverlay();
        inputRef.current?.blur();
      }
    };

    window.addEventListener("pointerdown", closeOnOutsidePointer, true);
    window.addEventListener("keydown", closeOnEscape, true);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutsidePointer, true);
      window.removeEventListener("keydown", closeOnEscape, true);
    };
  }, []);

  const goToSessions = () => {
    closeOverlay();
    setQuery("");
    setResults([]);
    router.push("/sessions");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      router.push(`/movies/${results[activeIndex].slug}`);
      closeOverlay();
    } else if (results[0]) {
      router.push(`/movies/${results[0].slug}`);
      closeOverlay();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeOverlay();
      inputRef.current?.blur();
    } else if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((currentIndex) => (currentIndex + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        currentIndex <= 0 ? results.length - 1 : currentIndex - 1,
      );
    } else if (event.key === "Enter" && results.length) {
      event.preventDefault();
      const selectedMovie = results[activeIndex >= 0 ? activeIndex : 0];
      router.push(`/movies/${selectedMovie.slug}`);
      closeOverlay();
    }
  };

  return (
    <div ref={rootRef} className="relative z-60 w-28 shrink-0 sm:w-56 lg:w-95">
      <form role="search" onSubmit={handleSubmit}>
        <Image
          src="/images/icons/search.svg"
          alt=""
          width={16}
          height={16}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 opacity-70"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search films and live events"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="header-search-results"
          aria-activedescendant={
            activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
          }
          autoComplete="off"
          value={query}
          onFocus={() => setIsOpen(true)}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget as Node | null;
            if (!nextTarget || !rootRef.current?.contains(nextTarget)) {
              closeOverlay();
            }
          }}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setActiveIndex(-1);
            setIsOpen(true);
            setError(null);
            if (!nextQuery.trim()) {
              setResults([]);
              setIsLoading(false);
            } else {
              setIsLoading(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search films and live events"
          className="h-10 w-full rounded-full border border-transparent bg-white/10 pl-11 pr-4 text-[13px] text-white outline-none transition-colors placeholder:text-white/70 focus:bg-white/15"
        />
      </form>

      {isOpen && (
        <section
          id="header-search-results"
          aria-label="Film search results"
          className="absolute left-0 right-0 top-full z-100 mt-1.5 max-h-[min(560px,calc(100vh-88px))] w-full overflow-y-auto rounded-2xl border border-overlay-border bg-bg-page shadow-2xl"
        >
          {isLoading ? (
            <div role="status" aria-label="Searching" className="space-y-3 p-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-lg bg-white/5"
                />
              ))}
            </div>
          ) : error ? (
            <p role="status" className="px-4 py-5 text-sm text-text-secondary">
              {error}
            </p>
          ) : results.length ? (
            <>
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                  Films &amp; events
                </h2>
                <span className="text-xs text-text-secondary">
                  {results.length} {results.length === 1 ? "result" : "results"}
                </span>
              </div>
              <ul className="divide-y divide-white/5 py-1">
                {results.map((movie, index) => (
                  <li key={movie.id}>
                    <Link
                      id={`search-result-${index}`}
                      role="option"
                      aria-selected={activeIndex === index}
                      href={`/movies/${movie.slug}`}
                      onClick={closeOverlay}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${activeIndex === index ? "bg-bg-raised" : "hover:bg-bg-card"}`}
                    >
                      <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-bg-card">
                        {movie.posterUrl && (
                          <Image
                            src={movie.posterUrl}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white">
                          {movie.title}
                        </span>
                        <span className="mt-1 block truncate text-xs text-text-secondary">
                          Film · {movie.ageRating?.code || "NR"} ·{" "}
                          {movie.runtimeMinutes} min
                        </span>
                      </span>
                      <span
                        className={`shrink-0 text-xs font-semibold ${movie.isComingSoon ? "text-color-orange" : "text-white"}`}
                      >
                        {movie.isComingSoon
                          ? "Coming Soon"
                          : `from ₾${movie.fromPrice}`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : query.trim() ? (
            <div className="px-4 py-5">
              <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                Films &amp; events
              </h2>
              <p role="status" className="mt-3 text-sm text-text-secondary">
                No results for &ldquo;{query.trim()}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 py-6 text-center">
              <EmptySearchIcon />
              <h2 className="mt-4 text-base font-bold text-white">
                What do you want to watch?
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Search by title, director or cast
              </p>
              <button
                type="button"
                onClick={goToSessions}
                className="mt-5 h-11 w-full rounded-full bg-bg-raised px-5 text-sm font-bold text-white transition-colors hover:bg-bg-card active:scale-[0.99]"
              >
                Browse all sessions
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

const EmptySearchIcon = () => (
  <span className="grid h-24 w-24 place-items-center rounded-full bg-bg-raised text-white">
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      fill="none"
      className="h-10 w-10"
    >
      <path
        d="M12 15h16l-1.4 17H13.4L12 15Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M11 15c-3-1-2-5 1-5 0-4 5-5 7-2 2-4 8-2 8 2 4-1 5 4 2 5M17 19v9m6-9v9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);
