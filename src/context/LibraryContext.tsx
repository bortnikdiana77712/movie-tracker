/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { setMovieStatus, type UserMovie } from "../services/library.service";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import type { MovieStatus } from "../types";

interface LibraryContextType {
  library: UserMovie[];
  loading: boolean;
  setStatus: (movieId: number, status: MovieStatus | null) => Promise<void>;
  getStatus: (movieId: number) => MovieStatus | null;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [library, setLibrary] = useState<UserMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLibrary = () => {
      if (!user) {
        setLibrary([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const libraryRef = collection(db, "users", user.uid, "library");
      const q = query(libraryRef);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const movies: UserMovie[] = [];
          snapshot.forEach((doc) => {
            movies.push(doc.data() as UserMovie);
          });
          setLibrary(movies);
          setLoading(false);
        },
        (error) => {
          console.error("Error loading library:", error);
          setLoading(false);
        },
      );

      return unsubscribe;
    };

    const unsubscribe = loadLibrary();
    return () => unsubscribe?.();
  }, [user]);

  const setStatus = useCallback(
    async (movieId: number, status: MovieStatus | null) => {
      if (!user) return;
      await setMovieStatus(user.uid, movieId, status);
    },
    [user],
  );

  const getStatus = useCallback(
    (movieId: number): MovieStatus | null => {
      const movie = library.find((m) => m.movieId === movieId);
      return movie?.status || null;
    },
    [library],
  );

  return (
    <LibraryContext.Provider value={{ library, loading, setStatus, getStatus }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context)
    throw new Error("useLibrary must be used within LibraryProvider");
  return context;
};
