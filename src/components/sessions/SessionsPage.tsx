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

const getNextDays = (count = 7) => {
  const dates = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      dateStr: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
    });
  }
  return dates;
};

export const SessionsPage = ({
  initialParams,
  initialDate,
}: SessionsPageProps) => {
  const { options, loading: optionsLoading } = useConfig();
  const [date, setDate] = useState(
    firstParam(initialParams.date) || initialDate || today(),
  );
  const [selectedVenues, setSelectedVenues] = useState<string[]>(
    initialParams["venues[]"]
      ? Array.isArray(initialParams["venues[]"])
        ? (initialParams["venues[]"] as string[])
        : [initialParams["venues[]"] as string]
      : [],
  );
  const [selectedFormats, setSelectedFormats] = useState<string[]>(
    initialParams["formats[]"]
      ? Array.isArray(initialParams["formats[]"])
        ? (initialParams["formats[]"] as string[])
        : [initialParams["formats[]"] as string]
      : [],
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    initialParams["languages[]"]
      ? Array.isArray(initialParams["languages[]"])
        ? (initialParams["languages[]"] as string[])
        : [initialParams["languages[]"] as string]
      : [],
  );
  const [selectedBands, setSelectedBands] = useState<string[]>(
    initialParams["bands[]"]
      ? Array.isArray(initialParams["bands[]"])
        ? (initialParams["bands[]"] as string[])
        : [initialParams["bands[]"] as string]
      : [],
  );
  const [search, setSearch] = useState(firstParam(initialParams.search));
  const [sort, setSort] = useState(
    firstParam(initialParams.sort) || "time_asc",
  );
  const [page, setPage] = useState(Number(firstParam(initialParams.page)) || 1);

  const filters = useMemo(
    () => ({
      date,
      venues: selectedVenues.length ? selectedVenues : undefined,
      formats: selectedFormats.length ? selectedFormats : undefined,
      languages: selectedLanguages.length ? selectedLanguages : undefined,
      bands: selectedBands.length ? selectedBands : undefined,
      search: search || undefined,
      sort: sort || undefined,
      page,
    }),
    [
      date,
      selectedVenues,
      selectedFormats,
      selectedLanguages,
      selectedBands,
      search,
      sort,
      page,
    ],
  );

  const { result, isLoading, error } = useSessionList(filters);
  const dateList = useMemo(() => getNextDays(7), []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("date", date);
    selectedVenues.forEach((v) => params.append("venues[]", v));
    selectedFormats.forEach((f) => params.append("formats[]", f));
    selectedLanguages.forEach((l) => params.append("languages[]", l));
    selectedBands.forEach((b) => params.append("bands[]", b));
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const nextUrl = `/sessions?${params.toString()}`;
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.pushState(null, "", nextUrl);
    }
  }, [
    date,
    selectedVenues,
    selectedFormats,
    selectedLanguages,
    selectedBands,
    search,
    sort,
    page,
  ]);

  const toggleArrayItem = (
    list: string[],
    setter: (val: string[]) => void,
    item: string,
  ) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
    setPage(1);
  };

  const activeFiltersCount =
    selectedVenues.length +
    selectedFormats.length +
    selectedLanguages.length +
    selectedBands.length;

  return (
    <section className="min-h-screen bg-[#070b1b] px-4 pb-20 pt-28 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
              <p className="mt-1 text-xs text-white/40">
                Browse showtimes across all venues
              </p>
            </div>

            <div className="space-y-6 rounded-2xl bg-bg-card p-5 mt-[20px]">
              <div>
                <h2 className="text-xl font-bold text-white">Filters</h2>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  VENUE
                </p>
                <div className="space-y-3">
                  {options?.venues.map((venue) => {
                    const checked = selectedVenues.includes(venue.slug);
                    return (
                      <label
                        key={venue.id}
                        className="flex cursor-pointer items-center justify-between text-xs text-white/90 hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleArrayItem(
                                selectedVenues,
                                setSelectedVenues,
                                venue.slug,
                              )
                            }
                            className="h-4 w-4 rounded border-white/20 bg-[#070b1b] text-[#ec3013] accent-[#ec3013] focus:ring-0"
                          />
                          <span className="font-semibold">{venue.name}</span>
                        </div>
                        <span className="text-[11px] text-white/30">
                          {venue.city}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/5 py-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  DATE
                </p>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                  {dateList.map((item) => {
                    const active = date === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => {
                          setDate(item.dateStr);
                          setPage(1);
                        }}
                        className={`flex min-w-[38px] flex-col items-center justify-center rounded-xl py-2 transition-all ${
                          active
                            ? "bg-[#ec3013] text-white"
                            : "bg-[#1c2235] text-white/60 hover:text-white"
                        }`}
                      >
                        <span className="text-[9px] font-medium uppercase">
                          {item.weekday}
                        </span>
                        <span className="mt-0.5 text-xs font-bold">
                          {item.day}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/5 py-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  FORMAT
                </p>
                <div className="space-y-3">
                  {options?.formats.map((format) => {
                    const checked = selectedFormats.includes(format.slug);
                    return (
                      <label
                        key={format.id}
                        className="flex cursor-pointer items-center gap-2.5 text-xs text-white/90 hover:text-white"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleArrayItem(
                              selectedFormats,
                              setSelectedFormats,
                              format.slug,
                            )
                          }
                          className="h-4 w-4 rounded border-white/20 bg-[#070b1b] text-[#ec3013] accent-[#ec3013] focus:ring-0"
                        />
                        <span className="font-semibold">{format.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/5 py-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  LANGUAGE
                </p>
                <div className="space-y-3">
                  {options?.languages.map((lang) => {
                    const checked = selectedLanguages.includes(lang.slug);
                    return (
                      <label
                        key={lang.id}
                        className="flex cursor-pointer items-center gap-2.5 text-xs text-white/90 hover:text-white"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleArrayItem(
                              selectedLanguages,
                              setSelectedLanguages,
                              lang.slug,
                            )
                          }
                          className="h-4 w-4 rounded border-white/20 bg-[#070b1b] text-[#ec3013] accent-[#ec3013] focus:ring-0"
                        />
                        <span className="font-semibold">{lang.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/5 py-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  TIME OF DAY
                </p>
                <div className="space-y-3">
                  {options?.timeBands.map((band) => {
                    const checked = selectedBands.includes(band.id);
                    return (
                      <label
                        key={band.id}
                        className="flex cursor-pointer items-center justify-between text-xs text-white/90 hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleArrayItem(
                                selectedBands,
                                setSelectedBands,
                                band.id,
                              )
                            }
                            className="h-4 w-4 rounded border-white/20 bg-[#070b1b] text-[#ec3013] accent-[#ec3013] focus:ring-0"
                          />
                          <span className="font-semibold">{band.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[11px] text-white/30">
                  {activeFiltersCount} filters active
                </p>
              </div>
            </div>
          </aside>

          <main className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-[24px]">
              <p className="text-xs font-bold text-white">
                Showing {result?.meta?.totalSessions || 12} sessions
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Sort:</span>
                <select
                  aria-label="Sort sessions"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="time_asc">Showtime: earliest first</option>
                  {options?.sorts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {optionsLoading && !options && (
              <p className="text-xs text-white/40">Loading filters...</p>
            )}

            {isLoading ? (
              <div className="space-y-4" aria-label="Loading sessions">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl bg-bg-card"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-[#ec3013]/10 p-5 text-sm text-[#ec3013]">
                {error}
              </div>
            ) : result?.data.length ? (
              <div className="space-y-6">
                {result.data.map((group) => (
                  <MovieSessionCard
                    key={group.movie.id}
                    movie={group.movie}
                    screenings={group.sessions}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-bg-card px-6 py-14 text-center">
                <h2 className="text-base font-bold">No sessions available</h2>
                <p className="mt-1 text-xs text-white/40">
                  Try selecting another date or adjusting filters.
                </p>
              </div>
            )}

            <div className="border-t border-white/5 pt-8">
              <nav
                aria-label="Session pages"
                className="flex items-center justify-center gap-3"
              >
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-[#1c2235] text-xs font-bold text-white/60 transition-all hover:text-white disabled:opacity-30"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={() => setPage(1)}
                  className={`text-xs font-bold ${
                    page === 1 ? "text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setPage(2)}
                  className={`text-xs font-bold ${
                    page === 2 ? "text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  2
                </button>

                <button
                  type="button"
                  onClick={() => setPage(3)}
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition-all ${
                    page === 3
                      ? "bg-[#ec3013] text-white shadow-lg"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  3
                </button>

                <span className="text-xs text-white/40">...</span>

                <button
                  type="button"
                  onClick={() => setPage(10)}
                  className={`text-xs font-bold ${
                    page === 10
                      ? "text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  10
                </button>

                <button
                  type="button"
                  disabled={page === 10}
                  onClick={() => setPage((p) => p + 1)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-[#1c2235] text-xs font-bold text-white/60 transition-all hover:text-white disabled:opacity-30"
                >
                  ›
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

const MovieSessionCard = ({
  movie,
  screenings,
}: {
  movie: Screening["movie"];
  screenings: Screening[];
}) => {
  return (
    <article className="space-y-3 mb-[16px]">
      <div className="flex items-center gap-3 mb-[16px]">
        <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-bg-card">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={`/movies/${movie.slug}`}
              className="text-lg font-bold text-white hover:text-[#ec3013]"
            >
              {movie.title}
            </Link>
            <span className="rounded bg-[#ec3013]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#ec3013]">
              {movie.ageRating?.code || "12+"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/40">
            {movie.runtimeMinutes} min
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {screenings.map((session) => (
          <Link
            key={session.id}
            href={session.isSoldOut ? "#sessions" : `/booking/${session.id}`}
            onClick={(e) => {
              if (session.isSoldOut) e.preventDefault();
            }}
            className={`relative flex items-center rounded-2xl bg-bg-card transition-all ${
              session.isSoldOut
                ? "cursor-not-allowed opacity-30"
                : "hover:border-[#ec3013]/50"
            }`}
          >
            <div className="flex min-w-[120px] flex-col justify-center px-4 py-3">
              <span className="text-lg font-extrabold text-white">
                {session.time}
              </span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/40">
                {session.format?.name || "Standard"}
              </span>
              <span className="mt-2 text-[10px] text-white/50">
                {session.venue?.name || "Galleria Tbilisi"} · Hall{" "}
                {session.hall?.name || "D"}
              </span>
            </div>

            <div className="relative flex h-full items-center">
              <div className="absolute -left-1 -top-2.5 h-2.5 w-2.5 rounded-full bg-[#070b1b]" />
              <div className="h-10 border-r border-dashed border-white/10" />
              <div className="absolute -bottom-2.5 -left-1 h-2.5 w-2.5 rounded-full bg-[#070b1b]" />
            </div>

            <div className="flex min-w-[90px] flex-col items-end justify-center px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-white/70">
                  {session.format?.name || "Standard"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-[#22c55e]">
                <span>◆</span>
                <span>{session.seatsLeft ?? 21} left</span>
              </div>
              <span className="mt-1 text-sm font-extrabold text-white">
                ₾{session.price}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
};
