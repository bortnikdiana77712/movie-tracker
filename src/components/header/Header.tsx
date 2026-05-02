import { Link, NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useLibrary } from "../../context/LibraryContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useCollections } from "../../context/CollectionContext";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import styles from "./Header.module.css";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!user;

  const libraryCount = library.filter((m) => m.status !== null).length;
  const collectionsCount = collections.length;
  const favoritesCount = favorites.length;

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        MovieTracker
      </Link>

      <button
        className={`${styles.burger} ${isMenuOpen ? styles.burgerHidden : ""}`}
        onClick={toggleMenu}
      >
        <FaBars />
      </button>

      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}

      <nav
        ref={menuRef}
        className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
      >
        <button className={styles.closeBtn} onClick={closeMenu}>
          <FaTimes />
        </button>

        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
            onClick={closeMenu}
          >
            {link.text}

            {isAuthenticated &&
              link.to === "/library" &&
              !libraryLoading &&
              libraryCount > 0 && (
                <span className={styles.badge}> ({libraryCount})</span>
              )}

            {isAuthenticated &&
              link.to === "/collections" &&
              !collectionsLoading &&
              collectionsCount > 0 && (
                <span className={styles.badge}> ({collectionsCount})</span>
              )}

            {isAuthenticated &&
              link.to === "/favorites" &&
              !favLoading &&
              favoritesCount > 0 && (
                <span className={styles.badge}> ({favoritesCount})</span>
              )}
          </NavLink>
        ))}

        <div className={styles.mobileUserActions}>
          <Link
            to="/profile"
            className={styles.mobileProfileLink}
            onClick={closeMenu}
          >
            Profile
          </Link>
          {user && (
            <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
              Logout
            </button>
          )}
        </div>
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
