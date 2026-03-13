import { Link, NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Header.module.css";

const navLinks = [
  { to: "/", text: "Main" },
  { to: "/catalog", text: "Catalog" },
  { to: "/library", text: "Library" },
  { to: "/collections", text: "Collections" },
];

export const Header = () => {
  const { user, logout } = useAuth();

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
          </NavLink>
        ))}
      </nav>

      <div className={styles.userActions}>
        <Link to="/profile" >Profile</Link>
        {user && <button onClick={handleLogout} className={styles.button}>Logout</button>}
      </div>
    </header>
  );
};
