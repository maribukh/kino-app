export interface Venue {
  id: number;
  slug: string;
  name: string;
  city: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  fullName?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  age?: number;
  preferredVenue?: Venue;
  profileComplete: boolean;
}

export interface ApiValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}
