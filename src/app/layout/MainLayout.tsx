import { Outlet } from "react-router";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
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
