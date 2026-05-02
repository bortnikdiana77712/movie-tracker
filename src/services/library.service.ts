import { db } from "./firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import type { MovieStatus } from "../types";

export interface UserMovie {
  movieId: number;
  status: MovieStatus;
  rating: number | null;
  notes: string;
  addedAt: Timestamp;
  updatedAt: Timestamp;
}

export const getUserLibrary = async (userId: string): Promise<UserMovie[]> => {
  const libraryRef = collection(db, "users", userId, "library");
  const snapshot = await getDocs(libraryRef);
  return snapshot.docs.map((doc) => doc.data() as UserMovie);
};

export const getMoviesByStatus = async (
  userId: string,
  status: MovieStatus,
): Promise<UserMovie[]> => {
  const libraryRef = collection(db, "users", userId, "library");
  const q = query(libraryRef, where("status", "==", status));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as UserMovie);
};

export const setMovieStatus = async (
  userId: string,
  movieId: number,
  status: MovieStatus | null,
): Promise<void> => {
  const ref = doc(db, "users", userId, "library", String(movieId));

  if (status === null) {
    await deleteDoc(ref);
  } else {
    const now = Timestamp.now();
    await setDoc(
      ref,
      {
        movieId,
        status,
        rating: null,
        notes: "",
        addedAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  }
};
