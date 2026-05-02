import { useEffect } from "react";
import { auth, db } from "../services/firebase.ts";
import { MainLayout, ProtectedRoute } from "../components";
import { Route, Routes } from "react-router";
import {
  Main,
  Catalog,
  Library,
  Collections,
  NotFound,
  Favorites,
  MoviePage,
  Profile,
  Login,
  Register,
} from "../pages/index.ts";
import {  } from "../pages/notFound/NotFound.tsx";

export function App() {
  useEffect(() => {
    console.log("Firebase подключен:", auth, db);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route index element={<Main />} />

        <Route path="catalog" element={<Catalog />} />

        <Route
          path="library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />

        <Route
          path="collections"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />

        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="movie/:id" element={<MoviePage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

