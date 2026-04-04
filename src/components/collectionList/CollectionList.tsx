import { FaFolder, FaCheck, FaPlus } from "react-icons/fa";

import type { UserCollection } from "../../services/collection.service";

import styles from "./CollectionList.module.css";

interface CollectionListProps {
  collections: UserCollection[];
  selectedCollections?: string[];
  movieId?: number;
  isInCollection?: (collectionId: string, movieId: number) => boolean;
  onToggleCollection?: (collectionId: string) => void;
  onCreateNew?: () => void;
}

export const CollectionList = ({
  collections,
  movieId,
  isInCollection,
  onToggleCollection,
  onCreateNew,
}: CollectionListProps) => {
  return (
    <div className={styles.collectionsList}>
      {collections.map((col) => (
        <button
          key={col.id}
          className={`${styles.collectionBtn} ${isInCollection && movieId && isInCollection(col.id, movieId) ? styles.active : ""}`}
          onClick={() => onToggleCollection?.(col.id)}
        >
          <FaFolder className={styles.collectionIcon} />
          <span>{col.name}</span>
          {isInCollection && movieId && isInCollection(col.id, movieId) && (
            <FaCheck className={styles.checkIcon} />
          )}
        </button>
      ))}

      <button className={styles.createCollectionBtn} onClick={onCreateNew}>
        <FaPlus />
        <span>Create new</span>
      </button>
    </div>
  );
};
