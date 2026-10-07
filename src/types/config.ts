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
  code: string;
  name: string;
}

export interface TimeBand {
  id: string;
  name: string;
  startHour: number;
  endHour: number;
}

export interface SortOption {
  key: string;
  label: string;
}

export interface TicketType {
  id: string;
  name: string;
  description?: string;
}

export interface AgeRatingConfig {
  code: string;
  minAge: number;
  description: string;
}

export interface BookingRules {
  maxSeatsPerOrder: number;
  holdDurationMinutes: number;
}

export interface FilterOptions {
  venues: Venue[];
  formats: FormatConfig[];
  languages: Language[];
  timeBands: TimeBand[];
  sorts: SortOption[];
  ticketTypes: TicketType[];
  ageRatings: AgeRatingConfig[];
  rules: BookingRules;
}

export interface FilterOptionsResponse {
  data: FilterOptions;
}
