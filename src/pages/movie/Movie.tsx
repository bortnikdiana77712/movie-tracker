import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useCollections } from "../../context/CollectionContext";
import {
  BackButton,
  CreateCollectionModal,
  Error,
  Loading,
  StatusButtons,
  CollectionList,
  MovieMetadata,
} from "../../components";
import { getFilmDetails } from "../../services/kinopoiskApi";
import type { MovieDetails } from "../../types";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import styles from "./Movie.module.css";
import type { FilmStatus } from "../../config/status.config";

export const MoviePage = () => {
  const { id } = useParams();
  const movieId = Number(id);
  const { user } = useAuth();
  const {
    collections,
    createCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
  } = useCollections();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<FilmStatus | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const toggleCollection = async (collectionId: string) => {
    if (isInCollection(collectionId, movieId)) {
      await removeFromCollection(collectionId, movieId);
    } else {
      await addToCollection(collectionId, movieId);
    }
  };

  const handleCreateCollection = async (name: string) => {
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
        <div className={styles.posterWrapper}>
          <img
            src={movie.posterUrl}
            alt={movie.nameRu}
            className={styles.poster}
          />

          <button
            className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ""}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
            <span>{isFavorite ? "In Favorites" : "Add to Favorites"}</span>
          </button>
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

          <div className={styles.statusSection}>
            <h3 className={styles.sectionTitle}>Status</h3>

            <StatusButtons
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>

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

          <CreateCollectionModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateCollection}
            existingCollections={collections.map((c) => c.name)}
          />
        </div>
      </div>
    </div>
  );
};
