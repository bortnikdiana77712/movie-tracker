import { useNavigate } from "react-router";

import styles from "./Movie.module.css";

export const MoviePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.movieRage}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Back
      </button>

      <h1>MoviePage</h1>
    </div>
  );
};
