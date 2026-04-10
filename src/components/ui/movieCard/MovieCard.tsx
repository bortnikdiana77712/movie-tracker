import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks";
import { useCollections } from "../../../context/CollectionContext";
import {
  STATUS_CONFIG,
  STATUS_OPTIONS,
  type FilmStatus,
} from "../../../config/status.config";
import { Dropdown, CreateCollectionModal } from "../..";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegBookmark,
  FaFolder,
  FaCheck,
  FaPlus,
} from "react-icons/fa";
import type { Film } from "../../../types";

import styles from "./MovieCard.module.css";

interface MovieCardProps {
  film: Film;
}

export const MovieCard = ({ film }: MovieCardProps) => {
  const { user } = useAuth();
  const {
    collections,
    createCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
  } = useCollections();

  const [isFavorite, toggleFavorite] = useState(false);
  const [status, setStatus] = useState<FilmStatus | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleCollection = async (collectionId: string) => {
    if (isInCollection(collectionId, film.id)) {
      await removeFromCollection(collectionId, film.id);
    } else {
      await addToCollection(collectionId, film.id);
    }
  };

  const handleCreateCollection = async (name: string) => {
    if (user && name.trim()) {
      await createCollection(name.trim());
    }
    setShowCreateModal(false);
  };

  const rating = film.rating ? Number(film.rating).toFixed(1) : null;
  const statusConfig = status ? STATUS_CONFIG[status] : null;

  return (
    <>
      <div
        className={`${styles.card} ${isHovered ? styles.cardHovered : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/movie/${film.id}`}>
          <div className={styles.posterWrapper}>
            <img
              src={film.posterUrl}
              alt={film.nameRu}
              className={styles.poster}
            />

            {rating && (
              <div className={styles.ratingBadge}>
                <FaStar /> {rating}
              </div>
            )}
          </div>
        </Link>

        <div
          className={`${styles.actions} ${isHovered ? styles.actionsVisible : ""}`}
        >
          <button
            className={`${styles.actionBtn} ${isFavorite ? styles.active : ""}`}
            onClick={() => toggleFavorite(!isFavorite)}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>

          {/*статус */}
          <Dropdown
            trigger={
              <button className={styles.actionBtn}>{<FaRegBookmark />}</button>
            }
          >
            <div className={styles.dropdownHeader}>Status</div>
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`${styles.dropdownItem} ${status === option.value ? styles.active : ""}`}
                onClick={() =>
                  setStatus(status === option.value ? null : option.value)
                }
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </Dropdown>

          {/*коллекции */}
          <Dropdown
            trigger={
              <button className={styles.actionBtn}>{<FaFolder />}</button>
            }
          >
            <div className={styles.dropdownHeader}>Collections</div>
            {collections.map((col) => (
              <button
                key={col.id}
                className={`${styles.dropdownItem} ${isInCollection(col.id, film.id) ? styles.active : ""}`}
                onClick={() => toggleCollection(col.id)}
              >
                {isInCollection(col.id, film.id) && <FaCheck />} {col.name}
              </button>
            ))}

            <div className={styles.divider} />

            <button
              className={styles.dropdownItem}
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> Create new
            </button>
          </Dropdown>
        </div>

        <Link to={`/movie/${film.id}`}>
          <div className={styles.info}>
            <h3>{film.nameRu || "Untitled"}</h3>

            <span className={styles.year}>{film.year || ""}</span>

            {statusConfig && (
              <div
                className={`${styles.statusBadge} ${styles[`status_${status}`]}`}
              >
                {statusConfig.icon} {statusConfig.label}
              </div>
            )}
          </div>
        </Link>
      </div>

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCollection}
        existingCollections={collections.map((c) => c.name)}
      />
    </>
  );
};
