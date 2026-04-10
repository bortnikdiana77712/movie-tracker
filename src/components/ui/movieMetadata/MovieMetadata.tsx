import { FaCalendar, FaClock, FaStar } from "react-icons/fa";

import styles from "./MovieMetadata.module.css";

interface MovieMetadataProps {
  year?: string;
  filmLength?: number;
  rating?: string | null;
}

export const MovieMetadata = ({
  year,
  filmLength,
  rating,
}: MovieMetadataProps) => {
  const ratingNumber = rating ? Number(rating) : null;

  return (
    <div className={styles.metadata}>
      {year && (
        <span className={styles.metaItem}>
          <FaCalendar /> {year}
        </span>
      )}

      {filmLength && (
        <span className={styles.metaItem}>
          <FaClock /> {Math.floor(filmLength / 60)}h {filmLength % 60}min
        </span>
      )}

      {ratingNumber && (
        <span className={styles.metaItem}>
          <FaStar className={styles.starIcon} /> {ratingNumber.toFixed(1)} / 10
        </span>
      )}
    </div>
  );
};
