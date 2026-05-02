import { useState, useEffect } from "react";
import { searchFilms, getPopularFilms } from "../services/kinopoiskApi";
import { formatPopularFilm, formatSearchFilm, type Film } from "../types";

interface UseFilmsProps {
  type: "popular" | "search";
  query?: string;
  page?: number;
  filters?: {
    countries?: number[];
    genres?: number[];
    yearFrom?: number;
    yearTo?: number;
    ratingFrom?: number;
    ratingTo?: number;
  };
  enabled?: boolean;
}

interface UseFilmsReturn {
  films: Film[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
}

export const useFilms = ({
  type,
  query = "",
  page = 1,
  enabled = true,
}: UseFilmsProps): UseFilmsReturn => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchFilms = async () => {
      setLoading(true);
      setError(null);

      try {
        let formattedFilms: Film[] = [];
        let newTotalPages = 1;
        let newTotalItems = 0;

        if (type === "search") {
          const response = await searchFilms(query, page);
          formattedFilms = response.items.map(formatSearchFilm);
          newTotalPages = response.totalPages;
          newTotalItems = response.total;
        } else {
          const response = await getPopularFilms(page);
          formattedFilms = response.films.map(formatPopularFilm);
          newTotalPages = response.pagesCount;
          newTotalItems =
            response.total || response.films.length * response.pagesCount;
        }

        setFilms(formattedFilms);
        setTotalPages(newTotalPages);
        setTotalItems(newTotalItems);

        console.log(
          `[${type}] Page ${page}: Loaded ${formattedFilms.length} films`,
        );
      } catch (err) {
        console.error("Fetch films error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch films");
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [type, query, page, enabled]);

  return { films, loading, error, totalPages, totalItems };
};
