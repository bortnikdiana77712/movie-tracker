import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CollectionProvider } from "./context/CollectionContext.tsx";
import { LibraryProvider } from "./context/LibraryContext.tsx";
import { FavoritesProvider } from "./context/FavoritesContext";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <CollectionProvider>
        <LibraryProvider>
          <FavoritesProvider>
            <StrictMode>
              <App />
            </StrictMode>
          </FavoritesProvider>
        </LibraryProvider>
      </CollectionProvider>
    </AuthProvider>
  </BrowserRouter>,
);
