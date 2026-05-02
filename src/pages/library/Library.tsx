import { useLibrary } from "../../context/LibraryContext";
import { getFilmDetails } from "../../services/kinopoiskApi";
import { MovieCard, Loading } from "../../components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBookmark, FaCheck, FaClock, FaEye, FaTimes } from "react-icons/fa";
import type { Film } from "../../types";
import type { MovieStatus } from "../../types";

import styles from "./Library.module.css";

const statusFilters: {
  value: MovieStatus | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "All", icon: <FaBookmark /> },
  { value: "watched", label: "Watched", icon: <FaCheck /> },
  { value: "watching", label: "Watching", icon: <FaClock /> },
  { value: "want_to_watch", label: "Want to watch", icon: <FaEye /> },
  { value: "abandoned", label: "Abandoned", icon: <FaTimes /> },
];

export const Library = () => {
  const { library, loading: libraryLoading } = useLibrary();
  const [activeFilter, setActiveFilter] = useState<MovieStatus | "all">("all");
  const [movies, setMovies] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  const getCountByStatus = (status: MovieStatus | "all") => {
    if (status === "all") return library.length;
    return library.filter((m) => m.status === status).length;
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const filteredMovies =
        activeFilter === "all"
          ? library
          : library.filter((m) => m.status === activeFilter);

      const films: Film[] = [];
      for (const item of filteredMovies) {
        try {
          const details = await getFilmDetails(item.movieId);
          films.push({
            id: details.kinopoiskId,
            nameRu: details.nameRu,
            nameEn: details.nameEn,
            year: details.year || "",
            posterUrl: details.posterUrl,
            rating: details.ratingKinopoisk,
          });
        } catch (error) {
          console.error(`Failed to fetch movie ${item.movieId}:`, error);
        }
      }
      setMovies(films);
      setLoading(false);
    };

    if (!libraryLoading) {
      loadMovies();
    }
  }, [library, activeFilter, libraryLoading]);

  if (libraryLoading || loading) return <Loading />;

  return (
    <div className={styles.library}>
      <h1>My Library</h1>

      <div className={styles.filters}>
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            className={`${styles.filterBtn} ${activeFilter === filter.value ? styles.active : ""}`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.icon}
            <span>{filter.label}</span>

            <span className={styles.count}>
              {getCountByStatus(filter.value)}
            </span>
          </button>
        ))}
      </div>

      {movies.length === 0 ? (
        <div className={styles.empty}>
          <p>No movies in your library yet</p>
          <p>Add movies by clicking on the bookmark icon on any movie card</p>

          <Link to="/catalog" className={styles.catalogLink}>
            Catalog
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.resultsInfo}>
            Showing {movies.length} {movies.length === 1 ? "movie" : "movies"}
          </div>

          <div className={styles.grid}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} film={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
