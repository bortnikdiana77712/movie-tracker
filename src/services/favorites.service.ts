import { db } from "./firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

export const addToFavorites = async (
  userId: string,
  movieId: number,
): Promise<void> => {
  try {
    const ref = doc(db, "users", userId, "favorites", String(movieId));
    await setDoc(ref, { movieId, addedAt: new Date() });
  } catch (error) {
    console.error(error);
  }
};

export const removeFromFavorites = async (
  userId: string,
  movieId: number,
): Promise<void> => {
  try {
    const ref = doc(db, "users", userId, "favorites", String(movieId));
    await deleteDoc(ref);
  } catch (error) {
    console.error(error);
  }
};

export const isFavorite = async (
  userId: string,
  movieId: number,
): Promise<boolean> => {
  try {
    const ref = doc(db, "users", userId, "favorites", String(movieId));
    const snapshot = await getDoc(ref);
    return snapshot.exists();
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getUserFavorites = async (userId: string): Promise<number[]> => {
  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(favoritesRef);
    return snapshot.docs.map((doc) => parseInt(doc.id));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const subscribeToFavorites = (
  userId: string,
  onUpdate: (favorites: number[]) => void,
) => {
  const favoritesRef = collection(db, "users", userId, "favorites");
  return onSnapshot(
    favoritesRef,
    (snapshot) => {
      const favorites = snapshot.docs.map((doc) => parseInt(doc.id));
      onUpdate(favorites);
    },
    (error) => {
      console.error(error);
    },
  );
};
