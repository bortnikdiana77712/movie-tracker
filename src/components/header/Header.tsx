import { Link, NavLink } from "react-router";
import "./Header.css";

export const Header = () => {
  return (
    <header>
      <Link to="/">MovieTracker</Link>

      <nav>
        <NavLink to="/">Main</NavLink>
        <NavLink to="/catalog">Catalog</NavLink>
        <NavLink to="/library">Library</NavLink>
        <NavLink to="/collections">Collections</NavLink>
      </nav>

      <Link to="/profile">Profile</Link>
    </header>
  );
};
