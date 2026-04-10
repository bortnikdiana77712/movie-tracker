import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CollectionProvider } from "./context/CollectionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <CollectionProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </CollectionProvider>
    </AuthProvider>
  </BrowserRouter>,
);
