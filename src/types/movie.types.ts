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

export interface MovieGenre {
  genre: string;
}

export interface MovieCountry {
  country: string;
}

export interface MovieDetails {
  kinopoiskId: number;
  nameRu: string;
  nameEn?: string;
  description?: string;
  year?: string;
  ratingKinopoisk?: number;
  posterUrl?: string;
  posterUrlPreview?: string;
  genres?: MovieGenre[];
  countries?: MovieCountry[];
  filmLength?: number;
  slogan?: string;
  nameOriginal?: string;
  ratingImdb?: number;
  webUrl?: string;
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

export interface SimilarFilm {
  filmId: number;
  nameRu: string;
  nameEn: string | null;
  posterUrl: string;
  relationType: string;
}

export interface SimilarFilmsResponse {
  total: number;
  items: SimilarFilm[];
}

export const convertToFilm = (details: MovieDetails): Film => ({
  id: details.kinopoiskId,
  nameRu: details.nameRu,
  nameEn: details.nameEn,
  year: details.year || "",
  posterUrl: details.posterUrl,
  rating: details.ratingKinopoisk,
});