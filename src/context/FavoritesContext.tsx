/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "../hooks/useAuth";
import {
  addToFavorites,
  removeFromFavorites,
  subscribeToFavorites,
  getUserFavorites,
} from "../services/favorites.service";

interface FavoritesContextType {
  favorites: number[];
  loading: boolean;
  toggleFavorite: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const favs = await getUserFavorites(user.uid);
        setFavorites(favs);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToFavorites(user.uid, (updatedFavorites) => {
      setFavorites(updatedFavorites);
    });

    return () => unsubscribe();
  }, [user]);


  const toggleFavorite = useCallback(
    async (movieId: number) => {
      if (!user) return;

      const isFav = favorites.includes(movieId);

      if (isFav) {
        await removeFromFavorites(user.uid, movieId);
      } else {
        await addToFavorites(user.uid, movieId);
      }
    },
    [user, favorites],
  );

  const isFavorite = useCallback(
    (movieId: number): boolean => {
      return favorites.includes(movieId);
    },
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};
