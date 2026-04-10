/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  getUserCollections, 
  subscribeToCollections, 
  createCollection, 
  addMovieToCollection, 
  removeMovieFromCollection,
  type UserCollection 
} from "../services/collection.service";

interface CollectionContextType {
  collections: UserCollection[];
  loading: boolean;
  createCollection: (name: string) => Promise<string | null>;
  addToCollection: (collectionId: string, movieId: number) => Promise<void>;
  removeFromCollection: (collectionId: string, movieId: number) => Promise<void>;
  isInCollection: (collectionId: string, movieId: number) => boolean;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCollections = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const userCollections = await getUserCollections(user.uid);
      setCollections(userCollections);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  //изменения в реальном времени
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToCollections(user.uid, (updatedCollections) => {
      setCollections(updatedCollections);
    });

    return () => unsubscribe();
  }, [user]);

  const createCollectionHandler = async (name: string): Promise<string | null> => {
    if (!user) return null;
    return await createCollection(user.uid, name);
  };

  const addToCollectionHandler = async (collectionId: string, movieId: number) => {
    await addMovieToCollection(collectionId, movieId);
  };

  const removeFromCollectionHandler = async (collectionId: string, movieId: number) => {
    await removeMovieFromCollection(collectionId, movieId);
  };

  const isInCollection = (collectionId: string, movieId: number): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    return collection?.movies.includes(movieId) || false;
  };

  return (
    <CollectionContext.Provider value={{
      collections,
      loading,
      createCollection: createCollectionHandler,
      addToCollection: addToCollectionHandler,
      removeFromCollection: removeFromCollectionHandler,
      isInCollection,
    }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollections must be used within CollectionProvider");
  }
  return context;
};