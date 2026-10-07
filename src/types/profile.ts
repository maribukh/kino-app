export interface ViewedMovie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  ageRating: string;
  posterUrl: string;
}

export interface RecentlyViewedSectionProps {
  movies?: ViewedMovie[];
}
