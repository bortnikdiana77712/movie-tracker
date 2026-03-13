import { useEffect } from "react";
import { auth, db } from "./services/firebase.ts";
import { MainLayout } from "./components";
import { Route, Routes } from "react-router";
import {
  Main,
  Catalog,
  Library,
  Collections,
  MoviePage,
  Profile,
  Login,
} from "./pages/index.ts";
import { ProtectedRoute } from "./components/route/ProtectedRoute.tsx";

function App() {
  useEffect(() => {
    console.log("Firebase подключен:", auth, db);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
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
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="movie/:id" element={<MoviePage />} />
      </Route>
    </Routes>
  );
}

export default App;
