import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLibrary } from "../../context/LibraryContext";
import { useFavorites } from "../../context/FavoritesContext";
import type { FilmStatus } from "../../config/status.config";
import { useCollections } from "../../context/CollectionContext";
import {
  BackButton,
  CreateCollectionModal,
  Error,
  Loading,
  StatusButtons,
  CollectionList,
  MovieMetadata,
  Slider,
} from "../../components";
import { getFilmDetails, getSimilarFilms } from "../../services/kinopoiskApi";
import type { Film, MovieDetails, SimilarFilm } from "../../types";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import styles from "./Movie.module.css";

export const MoviePage = () => {
  const { id } = useParams();
  const movieId = Number(id);
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { setStatus, getStatus } = useLibrary();
  const {
    collections,
    createCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
  } = useCollections();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarFilms, setSimilarFilms] = useState<Film[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const selectedStatus = getStatus(movieId);
  const isFav = isFavorite(movieId);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getFilmDetails(movieId);
        setMovie(data);
      } catch {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, movieId]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!id) return;
      setSimilarLoading(true);
      try {
        const data = await getSimilarFilms(movieId);

        const formattedFilms: Film[] = data.items.map((item: SimilarFilm) => ({
          id: item.filmId,
          nameRu: item.nameRu,
          nameEn: item.nameEn || "",
          year: "",
          posterUrl: item.posterUrl,
          rating: null,
        }));
        setSimilarFilms(formattedFilms);
      } catch (error) {
        console.error("Failed to load similar films:", error);
      } finally {
        setSimilarLoading(false);
      }
    };
    fetchSimilar();
  }, [id, movieId]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return;
    await toggleFavorite(movieId);
  };

  const handleStatusChange = async (status: FilmStatus | null) => {
    if (!isAuthenticated) return;
    await setStatus(movieId, status);
  };

  const toggleCollection = async (collectionId: string) => {
    if (!isAuthenticated) return;
    if (isInCollection(collectionId, movieId)) {
      await removeFromCollection(collectionId, movieId);
    } else {
      await addToCollection(collectionId, movieId);
    }
  };

  const handleCreateCollection = async (name: string) => {
    if (!isAuthenticated) return;
    if (user && name.trim()) {
      await createCollection(name.trim());
    }
    setShowCreateModal(false);
  };

  const rating = movie?.ratingKinopoisk?.toFixed(1);

  if (loading) return <Loading />;

  if (error || !movie) {
    return (
      <div className={styles.errorContainer}>
        <Error message={error || "Movie not found"} />
        <BackButton buttonText="Back to catalog" />
      </div>
    );
  }

  return (
    <div className={styles.moviePage}>
      <div className={styles.backButton}>
        <BackButton buttonText="Back" />
      </div>

      <div className={styles.backdrop}>
        <img
          src={movie.posterUrl}
          alt={movie.nameRu}
          className={styles.backdropImage}
        />
        <div className={styles.backdropOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.filmContent}>
          <div className={styles.posterWrapper}>
            <img
              src={movie.posterUrl}
              alt={movie.nameRu}
              className={styles.poster}
            />

            {isAuthenticated && (
              <button
                className={`${styles.favoriteBtn} ${isFav ? styles.active : ""}`}
                onClick={handleToggleFavorite}
              >
                {isFav ? <FaHeart /> : <FaRegHeart />}
                <span>{isFav ? "In Favorites" : "Add to Favorites"}</span>
              </button>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.nameRu}</h1>

            <MovieMetadata
              year={movie.year}
              filmLength={movie.filmLength}
              rating={rating}
            />

            <div className={styles.tags}>
              {movie.genres?.map((g, i) => (
                <span key={i} className={styles.tag}>
                  {g.genre}
                </span>
              ))}

              {movie.countries?.map((c, i) => (
                <span key={i} className={styles.tag}>
                  {c.country}
                </span>
              ))}
            </div>

            <p className={styles.description}>{movie.description}</p>

            {isAuthenticated && (
              <div className={styles.statusSection}>
                <h3 className={styles.sectionTitle}>Status</h3>

                <StatusButtons
                  selectedStatus={selectedStatus}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}

            {isAuthenticated && (
              <div className={styles.collectionsSection}>
                <h3 className={styles.sectionTitle}>Collections</h3>

                <CollectionList
                  collections={collections}
                  movieId={movieId}
                  isInCollection={isInCollection}
                  onToggleCollection={toggleCollection}
                  onCreateNew={() => setShowCreateModal(true)}
                />
              </div>
            )}

            {isAuthenticated && (
              <CreateCollectionModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateCollection}
                existingCollections={collections.map((c) => c.name)}
              />
            )}
          </div>
        </div>

        {similarFilms.length > 0 && (
          <Slider
            title="Similar Movies"
            films={similarFilms}
            loading={similarLoading}
          />
        )}
      </div>
    </div>
  );
};
