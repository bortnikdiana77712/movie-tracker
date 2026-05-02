import { useFavorites } from "../../context/FavoritesContext";
import { getFilmDetails } from "../../services/kinopoiskApi";
import { MovieCard, Loading } from "../../components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Film } from "../../types";

import styles from "./Favorites.module.css";

const movieCache = new Map<number, Film>();

export const Favorites = () => {
  const { favorites, loading: favLoading } = useFavorites();
  const [movies, setMovies] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadMovies = async () => {
      if (isCancelled) return;

      if (favorites.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const promises = favorites.map(async (movieId) => {
        if (movieCache.has(movieId)) {
          return movieCache.get(movieId)!;
        }

        try {
          const details = await getFilmDetails(movieId);
          const film: Film = {
            id: details.kinopoiskId,
            nameRu: details.nameRu,
            nameEn: details.nameEn,
            year: details.year || "",
            posterUrl: details.posterUrl,
            rating: details.ratingKinopoisk,
          };
          movieCache.set(movieId, film);
          return film;
        } catch (error) {
          console.error(`Failed to fetch movie ${movieId}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const films = results.filter((film): film is Film => film !== null);

      if (!isCancelled) {
        setMovies(films);
        setLoading(false);
      }
    };

    if (!favLoading) {
      loadMovies();
    }

    return () => {
      isCancelled = true;
    };
  }, [favorites, favLoading]);

  if (favLoading || loading) {
    return <Loading />;
  }

  return (
    <div className={styles.favorites}>
      <div className={styles.header}>
        <h1>My Favorites</h1>

        <p className={styles.count}>{favorites.length} movies</p>
      </div>

      {movies.length === 0 ? (
        <div className={styles.empty}>
          <p>No favorite movies yet</p>

          <p>Add movies by clicking on the heart icon on any movie card</p>

          <Link to="/catalog" className={styles.catalogLink}>
            Catalog
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} film={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
