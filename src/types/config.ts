export interface Venue {
  id: number;
  slug: string;
  name: string;
  city: string;
  formats?: FormatConfig[];
}

export interface FormatConfig {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
}

export interface Language {
  id: number;
  slug: string;
  code: string;
  name: string;
}

export interface TimeBand {
  id: string;
  label: string;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface TicketType {
  id: number;
  slug: string;
  name: string;
  priceRatio: number;
  note: string | null;
  blockedFromRatingAge: number | null;
}

export interface AgeRatingConfig {
  code: string;
  minAge: number;
  description: string;
}

export interface BookingRules {
  maxSeatsPerOrder: number;
  holdMinutes: number;
}

export interface FilterOptions {
  venues: Venue[];
  formats: FormatConfig[];
  languages: Language[];
  timeBands: TimeBand[];
  sorts: SortOption[];
  ticketTypes: TicketType[];
  ageRatings: AgeRatingConfig[];
  maxSeatsPerOrder: number;
  holdMinutes: number;
}

export interface FilterOptionsResponse {
  data: FilterOptions;
}
