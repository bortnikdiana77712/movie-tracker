import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { BackButton, CreateCollectionModal, Error, Loading } from "../../components";
import { getFilmDetails } from "../../services/kinopoiskApi";
import type { MovieDetails } from "../../types";
import {
  FaCalendar,
  FaCheck,
  FaClock,
  FaFolder,
  FaHeart,
  FaPlus,
  FaRegHeart,
  FaStar,
} from "react-icons/fa";
import { DEFAULT_COLLECTIONS, STATUS_CONFIG } from "../../config";
import type { FilmStatus } from "../../config/status.config";

import styles from "./Movie.module.css";

export const MoviePage = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<FilmStatus | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState<string[]>([
    ...DEFAULT_COLLECTIONS,
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getFilmDetails(Number(id));
        setMovie(data);
      } catch {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const toggleCollection = (name: string) => {
    setSelectedCollections((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const handleCreateCollection = () => {
    if (
      newCollectionName.trim() &&
      !collections.includes(newCollectionName.trim())
    ) {
      setCollections([...collections, newCollectionName.trim()]);
      setNewCollectionName("");
      setShowCreateModal(false);
    }
  };

  const rating = movie?.ratingKinopoisk?.toFixed(1);

  const statusButton = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value: value as FilmStatus,
    label: config.label,
    icon: config.icon,
  }));

  if (loading) {
    return <Loading />;
  }

  if (error || !movie)
    return (
      <>
        <Error message={error || "Movie not found"} />
        <BackButton buttonText="Back to catalog" />
      </>
    );

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

          <div className={styles.metadata}>
            {movie.year && (
              <span className={styles.metaItem}>
                <FaCalendar /> {movie.year}
              </span>
            )}

            {movie.filmLength && (
              <span className={styles.metaItem}>
                <FaClock /> {Math.floor(movie.filmLength / 60)}h{" "}
                {movie.filmLength % 60}min
              </span>
            )}

            {movie.ratingKinopoisk && (
              <span className={styles.metaItem}>
                <FaStar className={styles.starIcon} /> {rating} / 10
              </span>
            )}
          </div>

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

            <div className={styles.statusButtons}>
              {statusButton.map((btn) => (
                <button
                  key={btn.value}
                  data-status={btn.value}
                  className={`${styles.statusButton} ${selectedStatus === btn.value ? styles.active : ""}`}
                  onClick={() =>
                    setSelectedStatus(
                      selectedStatus === btn.value ? null : btn.value,
                    )
                  }
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.collectionsSection}>
            <h3 className={styles.sectionTitle}>Collections</h3>

            <div className={styles.collectionsList}>
              {collections.map((col) => (
                <button
                  key={col}
                  className={`${styles.collectionBtn} ${selectedCollections.includes(col) ? styles.active : ""}`}
                  onClick={() => toggleCollection(col)}
                >
                  <FaFolder className={styles.collectionIcon} />
                  <span>{col}</span>
                  {selectedCollections.includes(col) && (
                    <FaCheck className={styles.checkIcon} />
                  )}
                </button>
              ))}

              <button
                className={styles.createCollectionBtn}
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus />
                <span>Create new</span>
              </button>
            </div>

            <CreateCollectionModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateCollection}
              existingCollections={collections}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
