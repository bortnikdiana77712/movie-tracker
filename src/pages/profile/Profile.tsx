import { useAuth } from "../../hooks/useAuth";
import { useLibrary } from "../../context/LibraryContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useCollections } from "../../context/CollectionContext";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaFilm,
  FaHeart,
  FaFolder,
  FaTimes,
  FaEye,
  FaClock,
  FaCheck,
} from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./Profile.module.css";

export const Profile = () => {
  const { user } = useAuth();
  const { library } = useLibrary();
  const { favorites } = useFavorites();
  const { collections } = useCollections();

  const totalMovies = library.length;
  const favoritesCount = favorites.length;
  const collectionsCount = collections.length;

  const watchedMovies = library.filter((m) => m.status === "watched").length;
  const watchingMovies = library.filter((m) => m.status === "watching").length;
  const wantToWatch = library.filter(
    (m) => m.status === "want_to_watch",
  ).length;
  const abandonedMovies = library.filter(
    (m) => m.status === "abandoned",
  ).length;

  const completionRate =
    totalMovies > 0 ? Math.round((watchedMovies / totalMovies) * 100) : 0;

  const registrationDate = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "Unknown";

  const chartData = [
    { name: "Watched", value: watchedMovies, color: "#4caf50" },
    { name: "Watching", value: watchingMovies, color: "#ff9800" },
    { name: "Want to Watch", value: wantToWatch, color: "#2196f3" },
    { name: "Abandoned", value: abandonedMovies, color: "#f44336" },
  ];

  const renderLabel = ({
    name,
    percent,
  }: {
    name?: string;
    percent?: number;
  }) => {
    if (!name || !percent) return null;
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className={styles.profile}>
      <h1>Profile</h1>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <FaEnvelope className={styles.icon} />
          <div>
            <strong>Email</strong>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className={styles.infoCard}>
          <FaCalendarAlt className={styles.icon} />
          <div>
            <strong>Registered</strong>
            <p>{registrationDate}</p>
          </div>
        </div>
      </div>

      <h2>Statistics</h2>

      <div className={styles.statsGrid}>
        <div className={styles.infoCard}>
          <FaFilm className={styles.icon} />
          <div>
            <h3>{totalMovies}</h3>
            <p>Total movies</p>
          </div>
        </div>

        <div className={styles.infoCard}>
          <FaHeart className={styles.icon} />
          <div>
            <h3>{favoritesCount}</h3>
            <p>Favorites</p>
          </div>
        </div>

        <div className={styles.infoCard}>
          <FaFolder className={styles.icon} />
          <div>
            <h3>{collectionsCount}</h3>
            <p>Collections</p>
          </div>
        </div>
      </div>

      {totalMovies > 0 && (
        <>
          <div className={styles.chartSection}>
            <h3>Movies by Status</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={100}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <span className={styles.green}>
                <FaCheck /> Watched
              </span>
              <strong>{watchedMovies}</strong>
            </div>

            <div className={styles.statusItem}>
              <span className={styles.orange}>
                <FaClock /> Watching
              </span>
              <strong>{watchingMovies}</strong>
            </div>

            <div className={styles.statusItem}>
              <span className={styles.blue}>
                {" "}
                <FaEye /> Want to watch
              </span>
              <strong>{wantToWatch}</strong>
            </div>

            <div className={styles.statusItem}>
              <span className={styles.red}>
                {" "}
                <FaTimes /> Abandoned
              </span>
              <strong>{abandonedMovies}</strong>
            </div>
          </div>

          <div className={styles.progressSection}>
            <h3>Watch Progress</h3>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <p className={styles.progressText}>
              {watchedMovies} of {totalMovies} movies watched ({completionRate}
              %)
            </p>
          </div>
        </>
      )}

      {totalMovies === 0 && (
        <div className={styles.emptyState}>
          <p>No movies in your library yet</p>
          <p>Start adding movies to see your statistics!</p>
        </div>
      )}
    </div>
  );
};
