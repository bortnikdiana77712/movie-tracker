import { useState, useEffect, useRef } from "react";
import { getFilmDetails } from "../services/kinopoiskApi";
import { convertToFilm, type Film } from "../types";
import type { UserCollection } from "../services/collection.service";

export const useCollectionMovies = (collections: UserCollection[]) => {
  const [collectionMovies, setCollectionMovies] = useState<Map<string, Film[]>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  const loadedRef = useRef<Set<string>>(new Set());
  const cacheRef = useRef<Map<number, Film>>(new Map());

  useEffect(() => {
    const loadNewCollections = async () => {
      const newCollections = collections.filter(
        (c) => !loadedRef.current.has(c.id),
      );

      if (newCollections.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);

      for (const collection of newCollections) {
        const movies: Film[] = [];
        
        for (const movieId of collection.movies) {
          if (cacheRef.current.has(movieId)) {
            movies.push(cacheRef.current.get(movieId)!);
          } else {
            try {
              const details = await getFilmDetails(movieId);
              const film = convertToFilm(details);
              cacheRef.current.set(movieId, film);
              movies.push(film);
            } catch (error) {
              console.error(`Failed to fetch movie ${movieId}:`, error);
            }
          }
        }
        loadedRef.current.add(collection.id);
        setCollectionMovies((prev) => new Map(prev).set(collection.id, movies));
      }
      setLoading(false);
    };

    loadNewCollections();
  }, [collections]);

  const removeCollection = (collectionId: string) => {
    loadedRef.current.delete(collectionId);
    setCollectionMovies((prev) => {
      const newMap = new Map(prev);
      newMap.delete(collectionId);
      return newMap;
    });
  };

  return { collectionMovies, loading, removeCollection };
};
