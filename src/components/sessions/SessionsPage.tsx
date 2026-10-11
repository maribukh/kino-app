"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { useSessionList } from "@/hooks/useSessionList";
import { Screening } from "@/types/sessions";

const today = () => new Date().toISOString().slice(0, 10);
const firstParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] || "" : value || "";

interface SessionsPageProps {
  initialParams: Record<string, string | string[] | undefined>;
  initialDate: string;
}

const formatDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export const SessionsPage = ({
  initialParams,
  initialDate,
}: SessionsPageProps) => {
  const { options, loading: optionsLoading } = useConfig();
  const [date, setDate] = useState(
    firstParam(initialParams.date) || initialDate || today(),
  );
  const [venueSlug, setVenueSlug] = useState(
    firstParam(initialParams["venues[]"]),
  );
  const [formatSlug, setFormatSlug] = useState(
    firstParam(initialParams["formats[]"]),
  );
  const [languageSlug, setLanguageSlug] = useState(
    firstParam(initialParams["languages[]"]),
  );
  const [timeBand, setTimeBand] = useState(
    firstParam(initialParams["bands[]"]),
  );
  const [search, setSearch] = useState(firstParam(initialParams.search));
  const [searchDraft, setSearchDraft] = useState(
    firstParam(initialParams.search),
  );
  const [sort, setSort] = useState(
    firstParam(initialParams.sort) || "time_asc",
  );
  const [page, setPage] = useState(Number(firstParam(initialParams.page)) || 1);
  const filters = useMemo(
    () => ({
      date,
      venues: venueSlug ? [venueSlug] : undefined,
      formats: formatSlug ? [formatSlug] : undefined,
      languages: languageSlug ? [languageSlug] : undefined,
      bands: timeBand ? [timeBand] : undefined,
      search: search || undefined,
      sort: sort || undefined,
      page,
    }),
    [date, venueSlug, formatSlug, languageSlug, timeBand, search, sort, page],
  );
  const { result, isLoading, error } = useSessionList(filters);
  const availableFormats = venueSlug
    ? options?.venues.find((venue) => venue.slug === venueSlug)?.formats || []
    : options?.formats || [];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchDraft.trim());
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchDraft]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("date", date);
    if (venueSlug) params.append("venues[]", venueSlug);
    if (formatSlug) params.append("formats[]", formatSlug);
    if (languageSlug) params.append("languages[]", languageSlug);
    if (timeBand) params.append("bands[]", timeBand);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const nextUrl = `/sessions?${params.toString()}`;
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.pushState(null, "", nextUrl);
    }
  }, [date, venueSlug, formatSlug, languageSlug, timeBand, search, sort, page]);

  useEffect(() => {
    const restoreFilters = () => {
      const params = new URLSearchParams(window.location.search);
      const restoredSearch = params.get("search") || "";
      setDate(params.get("date") || today());
      setVenueSlug(params.get("venues[]") || "");
      setFormatSlug(params.get("formats[]") || "");
      setLanguageSlug(params.get("languages[]") || "");
      setTimeBand(params.get("bands[]") || "");
      setSearch(restoredSearch);
      setSearchDraft(restoredSearch);
      setSort(params.get("sort") || "time_asc");
      setPage(Number(params.get("page")) || 1);
    };

    window.addEventListener("popstate", restoreFilters);
    return () => window.removeEventListener("popstate", restoreFilters);
  }, []);

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-bg-page px-4 pb-20 pt-32 text-white sm:px-8 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-color-red">
              Kino XII
            </p>
            <h1 className="text-3xl font-bold">Sessions</h1>
          </div>
          {result?.meta && (
            <p className="text-sm text-white/50">
              {result.meta.totalSessions} showtimes · {result.meta.totalMovies}{" "}
              films
            </p>
          )}
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/2.5 p-4 sm:grid-cols-2 lg:grid-cols-6">
          <label className="flex flex-col gap-2 text-[11px] text-white/55">
            Film
            <input
              aria-label="Search films"
              value={searchDraft}
              onChange={(event) => {
                setSearchDraft(event.target.value);
                setPage(1);
              }}
              placeholder="Search films"
              maxLength={100}
              className="h-11 rounded-xl border border-white/10 bg-bg-card px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-color-red"
            />
          </label>
          <label className="flex flex-col gap-2 text-[11px] text-white/55">
            Date
            <input
              aria-label="Date"
              type="date"
              value={date}
              onChange={(event) => updateFilter(setDate, event.target.value)}
              className="h-11 rounded-xl border border-white/10 bg-bg-card px-3 text-sm text-white outline-none focus:border-color-red"
            />
          </label>
          <label className="flex flex-col gap-2 text-[11px] text-white/55">
            Cinema
            <select
              aria-label="Cinema"
              value={venueSlug}
              onChange={(event) => {
                const nextVenueSlug = event.target.value;
                const venueFormats = options?.venues.find(
                  (venue) => venue.slug === nextVenueSlug,
                )?.formats;
                if (
                  formatSlug &&
                  venueFormats &&
                  !venueFormats.some((format) => format.slug === formatSlug)
                ) {
                  setFormatSlug("");
                }
                updateFilter(setVenueSlug, nextVenueSlug);
              }}
              className="h-11 rounded-xl border border-white/10 bg-bg-card px-3 text-sm text-white outline-none focus:border-color-red"
            >
              <option value="">All cinemas</option>
              {options?.venues.map((venue) => (
                <option key={venue.id} value={venue.slug}>
                  {venue.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[11px] text-white/55">
            Format
            <select
              aria-label="Format"
              value={formatSlug}
              onChange={(event) =>
                updateFilter(setFormatSlug, event.target.value)
              }
              className="h-11 rounded-xl border border-white/10 bg-bg-card px-3 text-sm text-white outline-none focus:border-color-red"
            >
              <option value="">All formats</option>
              {availableFormats.map((format) => (
                <option key={format.id} value={format.slug}>
                  {format.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[11px] text-white/55">
            Language
            <select
              aria-label="Language"
              value={languageSlug}
              onChange={(event) =>
                updateFilter(setLanguageSlug, event.target.value)
              }
              className="h-11 rounded-xl border border-white/10 bg-bg-card px-3 text-sm text-white outline-none focus:border-color-red"
            >
              <option value="">All languages</option>
              {options?.languages.map((language) => (
                <option key={language.id} value={language.slug}>
                  {language.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[11px] text-white/55">
            Time
            <select
              aria-label="Time of day"
              value={timeBand}
              onChange={(event) =>
                updateFilter(setTimeBand, event.target.value)
              }
              className="h-11 rounded-xl border border-white/10 bg-bg-card px-3 text-sm text-white outline-none focus:border-color-red"
            >
              <option value="">Any time</option>
              {options?.timeBands.map((band) => (
                <option key={band.id} value={band.id}>
                  {band.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-[11px] text-white/55">
            Sort
            <select
              aria-label="Sort sessions"
              value={sort}
              onChange={(event) => updateFilter(setSort, event.target.value)}
              className="h-11 rounded-xl border border-white/10 bg-bg-card px-3 text-sm text-white outline-none focus:border-color-red"
            >
              <option value="">Recommended</option>
              {options?.sorts.map((sortOption) => (
                <option key={sortOption.id} value={sortOption.id}>
                  {sortOption.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {optionsLoading && !options && (
          <p className="mb-4 text-xs text-white/40">Loading filters...</p>
        )}

        {isLoading ? (
          <div className="space-y-4" aria-label="Loading sessions">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/3"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-color-red/30 bg-tint-red p-5">
            <p className="text-sm">{error}</p>
          </div>
        ) : result?.data.length ? (
          <div className="space-y-3">
            {result.data.map((group) => (
              <MovieSessionCard
                key={group.movie.id}
                movie={group.movie}
                screenings={group.sessions}
                date={date}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 px-6 py-14 text-center">
            <h2 className="text-lg font-semibold">No sessions for this date</h2>
            <p className="mt-2 text-sm text-white/50">
              Try another date or clear one of the filters.
            </p>
          </div>
        )}

        {result && result.meta.lastPage > 1 && (
          <nav
            aria-label="Session pages"
            className="mt-8 flex items-center justify-center gap-5"
          >
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="text-sm text-white/65 transition-colors hover:text-white disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-sm text-white/50">
              {result.meta.currentPage} / {result.meta.lastPage}
            </span>
            <button
              type="button"
              disabled={page === result.meta.lastPage}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="text-sm text-white/65 transition-colors hover:text-white disabled:opacity-30"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </section>
  );
};

const MovieSessionCard = ({
  movie,
  screenings,
  date,
}: {
  movie: Screening["movie"];
  screenings: Screening[];
  date: string;
}) => {
  const venues = Array.from(
    new Set(screenings.map((session) => session.venue.id)),
  );

  return (
    <article className="grid gap-4 rounded-2xl border border-white/10 bg-white/2.5 p-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-5 sm:p-5">
      <Link
        href={`/movies/${movie.slug}`}
        className="relative aspect-3/4 w-28 overflow-hidden rounded-xl bg-bg-card"
      >
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Link
              href={`/movies/${movie.slug}`}
              className="text-lg font-bold text-white transition-colors hover:text-color-red"
            >
              {movie.title}
            </Link>
            <p className="mt-1 text-xs text-white/45">
              {movie.genres.map((genre) => genre.name).join(" · ")} ·{" "}
              {movie.runtimeMinutes} min · {movie.ageRating.code}
            </p>
          </div>
          <span className="text-xs text-white/45">{formatDate(date)}</span>
        </div>
        <div className="mt-4 space-y-3">
          {venues.map((venueId) => {
            const venueSessions = screenings.filter(
              (session) => session.venue.id === venueId,
            );
            const venue = venueSessions[0].venue;
            return (
              <div
                key={venueId}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/8 pt-3 first:border-0 first:pt-0"
              >
                <div className="min-w-36 flex-1">
                  <p className="text-sm font-semibold text-white">
                    {venue.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {venue.city}
                  </p>
                </div>
                {venueSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/booking/${session.id}`}
                    aria-disabled={session.isSoldOut}
                    className={`min-w-20 rounded-lg border px-3 py-2 text-center transition-colors ${
                      session.isSoldOut
                        ? "cursor-not-allowed border-white/5 text-white/25"
                        : "border-white/12 text-white hover:border-color-red hover:bg-tint-red"
                    }`}
                    onClick={(event) => {
                      if (session.isSoldOut) event.preventDefault();
                    }}
                  >
                    <span className="block text-sm font-semibold">
                      {session.time}
                    </span>
                    <span className="mt-1 block text-[10px] text-white/45">
                      {session.format.name}
                    </span>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
};
