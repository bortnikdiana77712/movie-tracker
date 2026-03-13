import { MainLayout } from "./components";
import { Route, Routes } from "react-router";
import {
  Main,
  Catalog,
  Library,
  Collections,
  MoviePage,
  Profile,
} from "./pages/index.ts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Main />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="library" element={<Library />} />
        <Route path="collections" element={<Collections />} />
        <Route path="profile" element={<Profile />} />
        <Route path="movie/:id" element={<MoviePage />} />
      </Route>
    </Routes>
  );
}

export default App;
