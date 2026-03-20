import type { Film } from "../../types/movie.types";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  film: Film;
}

export const MovieCard = ({ film }: MovieCardProps) => {
  return (
    <div className={styles.card}>
      <img src={film.posterUrl} alt={film.nameRu} className={styles.poster} />

      <div className={styles.info}>
        <h3>{film.nameRu}</h3>
        <p>{film.year}</p>
        <p>{film.rating || "-"}</p>
      </div>
    </div>
  );
};
