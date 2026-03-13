import { Outlet } from "react-router";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import styles from "./MainLayout.module.css";

export const MainLayout = () => {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};
