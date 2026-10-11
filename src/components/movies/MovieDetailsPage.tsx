"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { moviesApi } from "@/lib/api/movies";
import { Movie } from "@/types/movie";
import { MovieVenueScreenings } from "@/types/sessions";

const localToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
};

const dateLabel = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    day: date.getDate(),
  };
};

const formatDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const MovieDetailsPage = ({ slug }: { slug: string }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [venues, setVenues] = useState<MovieVenueScreenings[]>([]);
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadMovie = async () => {
      try {
        const result = await moviesApi.getMovie(slug);
        if (!active) return;
        setMovie(result);
        const dates = result.availableDates || [];
        setSelectedDate(
          dates.includes(localToday())
            ? localToday()
            : dates[0] || localToday(),
        );
      } catch (requestError: unknown) {
        if (active)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "We could not load this movie.",
          );
      } finally {
        if (active) setIsLoadingMovie(false);
      }
    };
    void loadMovie();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!movie || !selectedDate) return;

    let active = true;

    moviesApi
      .getMovieSessions(slug, selectedDate)
      .then((result) => {
        if (active) {
          setVenues(result);
        }
      })
      .catch((requestError: unknown) => {
        if (!active) return;

        setVenues([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load showtimes.",
        );
      })
      .finally(() => {
        if (active) {
          setIsLoadingSessions(false);
        }
      });

    return () => {
      active = false;
    };
  }, [movie, selectedDate, slug]);

  if (isLoadingMovie)
    return <section className="min-h-screen animate-pulse bg-bg-page" />;

  if (!movie) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-bg-page px-5 text-center text-white">
        <div>
          <h1 className="text-2xl font-bold">Movie not found</h1>
          {error && <p className="mt-3 text-sm text-white/50">{error}</p>}
          <Link
            href="/sessions"
            className="mt-5 inline-flex rounded-full bg-color-red px-5 py-3 text-sm font-semibold"
          >
            Browse sessions
          </Link>
        </div>
      </section>
    );
  }

  const dates = movie.availableDates?.length
    ? movie.availableDates
    : [localToday()];
  const allSessions = venues.flatMap(({ sessions }) => sessions);
  const lowestPrice =
    movie.fromPrice ??
    Math.min(...allSessions.map((session) => session.price), 0);
  const runtime = `${movie.runtimeMinutes} Min`;
  const ratingCode = movie.ageRating?.code || "16+";

  return (
    <main className="min-h-screen overflow-hidden bg-[#070b1b] pb-20 text-white">
      <section className="relative isolate min-h-[430px] overflow-hidden sm:min-h-[470px]">
        {movie.backdropUrl && (
          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-center blur-[2px]"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,53,73,.97)_0%,rgba(7,15,30,.83)_43%,rgba(7,15,30,.32)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070b1b] via-transparent to-black/20" />
        <div className="mx-auto flex min-h-[430px] max-w-[1920px] items-end gap-6 px-15 pb-8 pt-28 sm:min-h-[470px] sm:gap-7 sm:pb-8 lg:gap-8">
          <div className="relative hidden aspect-[2/3] w-[200px] shrink-0 overflow-hidden rounded-xl shadow-2xl sm:block lg:w-[224px]">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              sizes="224px"
              className="object-cover"
              priority
            />
          </div>
          <div className="max-w-2xl pb-1">
            <span className="mb-3 inline-flex rounded-full bg-[#ec3013]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#ff381e]">
              Now playing
            </span>
            <h1 className="text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              {movie.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85">
              {movie.synopsis}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="rounded-full bg-[#ec3013]/15 px-3 py-1 text-[#ff381e]">
                {ratingCode}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
                ◷ {runtime}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
                PANORAMA
              </span>
            </div>
            <div className="mt-5 sm:hidden">
              <Link
                href="#sessions"
                className="inline-flex rounded-full bg-color-red px-5 py-3 text-sm font-bold"
              >
                View sessions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1920px] gap-10 px-15 pt-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
        <section id="sessions" className="min-w-0">
          <div className="pb-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">Sessions</h2>
                <p className="mt-1 text-xs text-white/50">
                  Choose a date and book your seats
                </p>
              </div>
              <p className="text-xs text-white/45">
                {allSessions.length} sessions available
              </p>
            </div>
            <div className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto pb-1">
              {dates.map((date) => {
                const { weekday, day } = dateLabel(date);
                const active = selectedDate === date;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => {
                      if (selectedDate === date) return;

                      setIsLoadingSessions(true);
                      setError(null);
                      setSelectedDate(date);
                    }}
                    className={`flex h-[62px] min-w-[64px] flex-col items-center justify-center rounded-xl transition-all duration-300 ${active ? "bg-[#ec3013] text-white w-[110px]" : "bg-[#1e2031] text-white/65 hover:text-white"}`}
                  >
                    <span className="text-[10px] font-medium">{weekday}</span>
                    <span className="mt-0.5 text-base font-bold">{day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {isLoadingSessions ? (
            <div className="space-y-4 py-6">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-[#1e2031]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-6 rounded-xl bg-[#ec3013]/10 p-4 text-sm text-white/75">
              {error}
            </div>
          ) : venues.length ? (
            <div className="space-y-6 pt-6">
              {venues.map(({ venue, sessions }) => {
                const sessionsByHall = sessions.reduce(
                  (acc, session) => {
                    const hallName = session.hall?.name || "Main Hall";
                    if (!acc[hallName]) acc[hallName] = [];
                    acc[hallName].push(session);
                    return acc;
                  },
                  {} as Record<string, typeof sessions>,
                );
                return (
                  <section key={venue.id} className="space-y-3 mb-[17px]">
                    <h3 className="text-sm font-bold mb-[12px]">
                      {venue.name}
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(sessionsByHall).map(
                        ([hallName, hallSessions]) => (
                          <div
                            key={hallName}
                            className="rounded-2xl bg-[#1e2031] p-3 sm:p-4 mb-[17px]"
                          >
                            <p className="mb-3 text-[10px] font-semibold text-white/65">
                              {hallName}
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {hallSessions.map((session) => (
                                <Link
                                  key={session.id}
                                  href={
                                    session.isSoldOut
                                      ? "#sessions"
                                      : `/booking/${session.id}`
                                  }
                                  aria-disabled={session.isSoldOut}
                                  onClick={(event) => {
                                    if (session.isSoldOut)
                                      event.preventDefault();
                                  }}
                                  className={`relative flex items-center rounded-xl bg-[#070b1b] transition-opacity ${session.isSoldOut ? "cursor-not-allowed opacity-40" : "hover:opacity-90"}`}
                                >
                                  <div className="px-4 py-3 flex flex-col justify-center min-w-[110px]">
                                    <span className="text-base font-bold">
                                      {session.time}
                                    </span>
                                    <span className="mt-1 flex items-center gap-1.5 text-[9px] uppercase text-white/45">
                                      <span>
                                        {session.language?.name || "ENG"}
                                      </span>
                                      <span>
                                        {session.format?.name || "MAX"}
                                      </span>
                                    </span>
                                  </div>

                                  <div className="relative h-full flex items-center">
                                    <div className="absolute -top-3 -left-1.5 w-3 h-3 rounded-full bg-[#1e2031]" />
                                    <div className="h-8 border-r border-dashed border-white/20" />
                                    <div className="absolute -bottom-3 -left-1.5 w-3 h-3 rounded-full bg-[#1e2031]" />
                                  </div>

                                  <div className="px-4 py-3 flex flex-col items-center justify-center min-w-[90px]">
                                    <span className="text-sm font-bold text-[#ff381e]">
                                      ₾ {session.price}
                                    </span>
                                    <span className="mt-1 flex items-center gap-1 text-[9px] text-white/45 whitespace-nowrap">
                                      {session.isSoldOut ? (
                                        "Sold out"
                                      ) : (
                                        <>
                                          <Image
                                            src="/images/icons/ticket.svg"
                                            alt=""
                                            width={12}
                                            height={12}
                                            className="opacity-60"
                                          />
                                          45 left
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold">No showtimes available</p>
              <p className="mt-2 text-xs text-white/45">
                Try selecting another date.
              </p>
            </div>
          )}
        </section>

        <aside className="lg:pt-1">
          <div className="p-5">
            <h2 className="text-lg font-bold">Details</h2>
            <div className="pt-[17px]">
              {movie.director && (
                <Detail label="Director" value={movie.director} />
              )}
              {movie.cast && <Detail label="Main cast" value={movie.cast} />}
              <Detail
                label="Duration"
                value={`${movie.runtimeMinutes} minutes`}
              />
              {movie.releaseDate && (
                <Detail
                  label="Release date"
                  value={formatDate(movie.releaseDate)}
                />
              )}
              <Detail
                label="Formats"
                value={
                  Array.from(
                    new Set(
                      allSessions
                        .map((session) => session.format?.name)
                        .filter(Boolean),
                    ),
                  ).join(", ") || "Standard, MAX, ATMOS"
                }
              />
              <Detail label="From" value={`₾ ${lowestPrice}`} accent />
            </div>
          </div>
          <div className="rounded-xl bg-[#251b15] p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#ff9500]">
              Rating note
            </p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-[#ffad42]">
              {ratingCode} Not recommended for under-16s. Tickets require an
              account aged 16 or over.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

const Detail = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary mb-[17px]">
      {label}
    </p>
    <p
      className={`mt-1 text-xs font-semibold leading-relaxed ${accent ? "text-[#ff381e]" : "text-white"}`}
    >
      {value}
    </p>
  </div>
);
