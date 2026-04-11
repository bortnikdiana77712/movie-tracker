import { useCollections } from "../../context/CollectionContext";
import {
  Slider,
  CreateCollectionModal,
  Modal,
  Loading,
} from "../../components";
import { useCollectionMovies } from "../../hooks/useCollectionMovies";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";

import styles from "./Collections.module.css";

export const Collections = () => {
  const { collections, createCollection, deleteCollection } = useCollections();
  const { collectionMovies, loading, removeCollection } =
    useCollectionMovies(collections);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null,
  );

  const handleCreateCollection = async (name: string) => {
    if (name.trim()) {
      await createCollection(name.trim());
    }
    setShowCreateModal(false);
  };

  const handleDeleteCollection = async () => {
    if (collectionToDelete) {
      removeCollection(collectionToDelete);
      await deleteCollection(collectionToDelete);
      setCollectionToDelete(null);
    }
  };

  if (loading && collections.length > 0 && collectionMovies.size === 0) {
    return <Loading />;
  }

  if (collections.length === 0) {
    return (
      <div className={styles.collections}>
        <h1>My Collections</h1>

        <div className={styles.emptyContent}>
          <p>No collections yet</p>

          <button
            onClick={() => setShowCreateModal(true)}
            className={styles.createBtn}
          >
            <FaPlus /> Create your first collection
          </button>

          <Link to="/catalog" className={styles.catalogLink}>
            Catalog
          </Link>
        </div>

        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCollection}
          existingCollections={collections.map((c) => c.name)}
        />
      </div>
    );
  }

  return (
    <div className={styles.collections}>
      <div className={styles.header}>
        <h1>My Collections</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.addBtn}
        >
          <FaPlus /> New collection
        </button>
      </div>

      <div className={styles.collectionsList}>
        {collections.map((collection) => {
          const movies = collectionMovies.get(collection.id) || [];

          return (
            <div key={collection.id} className={styles.collectionSection}>
              <div className={styles.collectionHeader}>
                <div className={styles.collectionTitle}>
                  <h2>{collection.name}</h2>

                  <button
                    onClick={() => setCollectionToDelete(collection.id)}
                    className={styles.deleteBtn}
                    title="Delete collection"
                  >
                    <FaTrash />
                  </button>
                </div>

                <span className={styles.movieCount}>
                  {movies.length} {movies.length === 1 ? "movie" : "movies"}
                </span>
              </div>

              {movies.length === 0 ? (
                <div className={styles.emptyCollection}>
                  <p>No movies in this collection yet</p>

                  <Link to="/catalog" className={styles.addMoviesLink}>
                    Catalog
                  </Link>
                </div>
              ) : (
                <Slider title="" films={movies} />
              )}
            </div>
          );
        })}
      </div>

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCollection}
        existingCollections={collections.map((c) => c.name)}
      />

      <Modal
        isOpen={!!collectionToDelete}
        onClose={() => setCollectionToDelete(null)}
        title="Delete collection?"
      >
        <div className={styles.modalBody}>
          <p>Are you sure you want to delete this collection?</p>
          
          <div className={styles.modalButtons}>
            <button onClick={() => setCollectionToDelete(null)}>Cancel</button>

            <button
              onClick={handleDeleteCollection}
              className={styles.deleteConfirmBtn}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
