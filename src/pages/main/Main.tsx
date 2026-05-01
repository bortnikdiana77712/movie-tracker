import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useFilms } from "../../hooks";
import { useFavorites } from "../../context/FavoritesContext";
import { useCollections } from "../../context/CollectionContext";
import { Loading, MovieCard } from "../../components";
import type { Film } from "../../types";
import { getFilmDetails } from "../../services/kinopoiskApi";
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import styles from "./Main.module.css";

const filmCache = new Map<number, Film>();

export const Main = () => {
  const { films, loading: filmsLoading } = useFilms({
    type: "popular",
    page: 1,
  });

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { collections } = useCollections();

  const [featuredFilm, setFeaturedFilm] = useState<Film | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [recentFavorites, setRecentFavorites] = useState<Film[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const lastLoadedIdsRef = useRef<string>("");

  const isFeaturedFavorite = featuredFilm ? isFavorite(featuredFilm.id) : false;

  const handleToggleFavorite = async () => {
    if (featuredFilm) {
      await toggleFavorite(featuredFilm.id);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(4);
      } else {
        setSlidesPerView(6);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadRecentFavorites = async () => {
      if (favorites.length === 0) {
        setRecentFavorites([]);
        return;
      }

      const recentIds = favorites.slice(0, 6);
      const idsKey = recentIds.join(",");

      if (lastLoadedIdsRef.current === idsKey) {
        return;
      }
      lastLoadedIdsRef.current = idsKey;

      setLoadingFavorites(true);

      const movies: Film[] = [];

      for (const id of recentIds) {
        if (filmCache.has(id)) {
          movies.push(filmCache.get(id)!);
        } else {
          try {
            const details = await getFilmDetails(id);
            const film = {
              id: details.kinopoiskId,
              nameRu: details.nameRu,
              nameEn: details.nameEn,
              year: details.year || "",
              posterUrl: details.posterUrl,
              rating: details.ratingKinopoisk,
            };
            filmCache.set(id, film);
            movies.push(film);
          } catch (error) {
            console.error(`Failed to fetch movie ${id}:`, error);
          }
        }
      }

      setRecentFavorites(movies);
      setLoadingFavorites(false);
    };

    loadRecentFavorites();
  }, [favorites]);

  const updateFeaturedFilm = useCallback(async () => {
    if (films.length > 0) {
      const randomIndex = Math.floor(Math.random() * films.length);
      const randomFilm = films[randomIndex];

      setLoadingDescription(true);
      try {
        const details = await getFilmDetails(randomFilm.id);
        setFeaturedFilm({
          ...randomFilm,
          description: details.description,
        });
      } catch (error) {
        console.error("Failed to load description:", error);
        setFeaturedFilm(randomFilm);
      } finally {
        setLoadingDescription(false);
      }
    }
  }, [films]);

  useEffect(() => {
    updateFeaturedFilm();
  }, [updateFeaturedFilm]);

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(films.length - slidesPerView, prev + 1));
  };

  const visibleFilms = films.slice(currentSlide, currentSlide + slidesPerView);

  if (filmsLoading) return <Loading />;

  return (
    <div className={styles.home}>
      {featuredFilm && (
        <div className={styles.hero}>
          <div
            className={styles.heroBackground}
            style={{ backgroundImage: `url(${featuredFilm.posterUrl})` }}
          />

          <div className={styles.heroOverlay} />

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{featuredFilm.nameRu}</h1>

            <div className={styles.heroMeta}>
              <span className={styles.heroYear}>{featuredFilm.year}</span>

              {featuredFilm.rating !== null && (
                <span className={styles.heroRating}>
                  <FaStar /> {featuredFilm.rating}
                </span>
              )}
            </div>

            <p className={styles.heroDescription}>
              {loadingDescription
                ? "Loading description..."
                : featuredFilm.description || "Description not available now"}
            </p>

            <div className={styles.heroButtons}>
              <Link
                to={`/movie/${featuredFilm.id}`}
                className={styles.watchBtn}
              >
                Learn more
              </Link>

              <button
                onClick={handleToggleFavorite}
                className={`${styles.favoriteBtn} ${isFeaturedFavorite ? styles.active : ""}`}
              >
                <FaHeart />{" "}
                {isFeaturedFavorite ? "In favorites" : "Add to favorites"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Popular movies</h2>

            {films.length > slidesPerView && (
              <div className={styles.sliderNav}>
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className={styles.prevBtn}
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide >= films.length - slidesPerView}
                  className={styles.nextBtn}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>

          <div className={styles.moviesSlider}>
            {visibleFilms.map((film) => (
              <div key={film.id} className={styles.sliderItem}>
                <MovieCard film={film} />
              </div>
            ))}
          </div>
        </div>

        {loadingFavorites ? (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Recent favorites</h2>
            </div>

            <div className={styles.favoritesLoader}>Loading favorites...</div>
          </div>
        ) : recentFavorites.length > 0 ? (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Recent favorites</h2>

              <Link to="/favorites" className={styles.viewAll}>
                View all
              </Link>
            </div>

            <div className={styles.moviesGrid}>
              {recentFavorites.map((film) => (
                <MovieCard key={film.id} film={film} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Recent favorites</h2>
            </div>

            <div className={styles.emptyFavorites}>
              <p>No favorite movies yet</p>

              <p>Add movies by clicking on the heart icon</p>
            </div>
          </div>
        )}

        {collections.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>My collections</h2>

              <Link to="/collections" className={styles.viewAll}>
                View all
              </Link>
            </div>

            <div className={styles.collectionsGrid}>
              {collections.slice(0, 4).map((collection) => (
                <Link
                  key={collection.id}
                  to="/collections"
                  className={styles.collectionCard}
                >
                  <div className={styles.collectionCover}>
                    <div className={styles.collectionPlaceholder}></div>
                  </div>

                  <h3>{collection.name}</h3>

                  <p>{collection.movies.length} movies</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
