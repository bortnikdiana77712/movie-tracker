export type MovieStatus =
  | "want_to_watch"
  | "watching"
  | "watched"
  | "abandoned";

export interface UserMovieData {
  movieId: number;
  userId: string;
  status: MovieStatus;
  rating: number | null;
  notes: string;
  addedToLibraryAt: Date;
  updatedAt: Date;
  collections?: string[];
}
