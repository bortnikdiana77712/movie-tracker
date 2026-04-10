import { BackButton } from "../../components";

import styles from "./NotFound.module.css";

export const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>

        <p className={styles.message}>
          Sorry, the page you are looking for doesn't exist or has been moved
        </p>

        <div className={styles.backButton}>
          <BackButton buttonText="Go Back" />
        </div>
      </div>
    </div>
  );
};
