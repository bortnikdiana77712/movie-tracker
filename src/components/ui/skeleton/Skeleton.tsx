import styles from "./Skeleton.module.css";

interface SkeletonProps {
  variant?: "card" | "text" | "circle" | "hero" | "moviePoster";
  count?: number;
}

export const Skeleton = ({ variant = "card", count = 1 }: SkeletonProps) => {
  const skeletons = Array(count).fill(null);

  if (variant === "card") {
    return (
      <div className={styles.skeletonGrid}>
        {skeletons.map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonPoster} />
            <div className={styles.skeletonInfo}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonYear} />
              <div className={styles.skeletonBadge} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "moviePoster") {
    return <div className={styles.skeletonMoviePoster}></div>;
  }

  if (variant === "hero") {
    return (
      <div className={styles.skeletonHero}>
        <div className={styles.skeletonHeroContent}>
          <div className={styles.skeletonHeroTitle} />
          <div className={styles.skeletonHeroMeta} />
          <div className={styles.skeletonHeroDesc} />
          <div className={styles.skeletonHeroButtons} />
        </div>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={styles.skeletonText}>
        {skeletons.map((_, i) => (
          <div key={i} className={styles.skeletonLine} />
        ))}
      </div>
    );
  }

  return null;
};
