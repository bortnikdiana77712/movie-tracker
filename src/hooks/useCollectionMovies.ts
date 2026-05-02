import { useState, useEffect, useRef } from "react";
import { getFilmDetails } from "../services/kinopoiskApi";
import { convertToFilm, type Film } from "../types";
import type { UserCollection } from "../services/collection.service";

export const useCollectionMovies = (collections: UserCollection[]) => {
  const [collectionMovies, setCollectionMovies] = useState<Map<string, Film[]>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  const cacheRef = useRef<Map<number, Film>>(new Map());

  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true);
      const newMap = new Map<string, Film[]>();

      for (const collection of collections) {
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
        newMap.set(collection.id, movies);
      }

      setCollectionMovies(newMap);
      setLoading(false);
    };

    loadCollections();
  }, [collections]);

  const removeCollection = (collectionId: string) => {
    setCollectionMovies((prev) => {
      const newMap = new Map(prev);
      newMap.delete(collectionId);
      return newMap;
    });
  };

  return { collectionMovies, loading, removeCollection };
};
