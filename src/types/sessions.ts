import { Movie } from "@/types/movie";
import { Venue } from "@/types/config";

export interface Screening {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  timeBand: string;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: {
    id: number;
    name: string;
    venue: Venue;
  };
  venue: Venue;
  format: {
    id: number;
    slug: string;
    name: string;
    priceUplift: number;
  };
  language: {
    id: number;
    slug: string;
    name: string;
    code: string;
  };
  movie: Movie;
}

export interface MovieScreenings {
  movie: Movie;
  sessions: Screening[];
}

export interface SessionListResponse {
  data: MovieScreenings[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    totalSessions: number;
    totalMovies: number;
    date: string;
  };
}

export interface MovieVenueScreenings {
  venue: Venue;
  sessions: Screening[];
}
