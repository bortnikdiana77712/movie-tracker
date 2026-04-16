import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CollectionProvider } from "./context/CollectionContext.tsx";
import { LibraryProvider } from "./context/LibraryContext.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <CollectionProvider>
        <LibraryProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </LibraryProvider>
      </CollectionProvider>
    </AuthProvider>
  </BrowserRouter>,
);
