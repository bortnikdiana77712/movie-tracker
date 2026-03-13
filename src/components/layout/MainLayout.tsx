import { Outlet } from "react-router";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import "./MainLayout.css";

export const MainLayout = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};
