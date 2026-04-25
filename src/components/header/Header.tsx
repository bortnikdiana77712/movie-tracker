import { Link, NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useLibrary } from "../../context/LibraryContext";
import { useFavorites } from "../../context/FavoritesContext";
import styles from "./Header.module.css";
import { useCollections } from "../../context/CollectionContext";

const navLinks = [
  { to: "/", text: "Main" },
  { to: "/catalog", text: "Catalog" },
  { to: "/library", text: "Library" },
  { to: "/collections", text: "Collections" },
  { to: "/favorites", text: "Favorites" },
];

export const Header = () => {
  const { user, logout } = useAuth();
  const { library, loading: libraryLoading } = useLibrary();
  const { collections, loading: collectionsLoading } = useCollections();
  const { favorites, loading: favLoading } = useFavorites();

  const libraryCount = library.filter((m) => m.status !== null).length;
  const collectionsCount = collections.length;
  const favoritesCount = favorites.length;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/">MovieTracker</Link>

      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            {link.text}

            {link.to === "/library" && !libraryLoading && libraryCount > 0 && (
              <span className={styles.badge}> ({libraryCount})</span>
            )}

            {link.to === "/collections" &&
              !collectionsLoading &&
              collectionsCount > 0 && (
                <span className={styles.badge}> ({collectionsCount})</span>
              )}

            {link.to === "/favorites" && !favLoading && favoritesCount > 0 && (
              <span className={styles.badge}> ({favoritesCount})</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.userActions}>
        <Link to="/profile">Profile</Link>
        {user && (
          <button onClick={handleLogout} className={styles.button}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};
