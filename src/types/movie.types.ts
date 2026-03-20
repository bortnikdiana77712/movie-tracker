export interface PopularFilm {
  filmId: number;
  nameRu: string;
  nameEn: string | null;
  year: string;
  posterUrl: string;
  rating?: string;
}

export interface SearchFilm {
  kinopoiskId: number;
  nameRu: string;
  nameEn: string | null;
  year: string;
  posterUrl: string;
  ratingKinopoisk: number | null;
}

export interface Film {
  id: number;
  nameRu: string;
  nameEn?: string | null;
  year: string;
  posterUrl?: string;
  rating?: number | string | null;
}

export const formatPopularFilm = (film: PopularFilm): Film => ({
  id: film.filmId,
  nameRu: film.nameRu,
  nameEn: film.nameEn,
  year: film.year,
  posterUrl: film.posterUrl,
  rating: film.rating,
});

export const formatSearchFilm = (film: SearchFilm): Film => ({
  id: film.kinopoiskId,
  nameRu: film.nameRu,
  nameEn: film.nameEn,
  year: film.year,
  posterUrl: film.posterUrl,
  rating: film.ratingKinopoisk,
});

export interface PopularResponse {
  pagesCount: number;
  films: PopularFilm[];
  total?: number;
}

export interface SearchResponse {
  total: number;
  totalPages: number;
  items: SearchFilm[];
}
