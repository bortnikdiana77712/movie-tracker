import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  updateDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

export interface UserCollection {
  id: string;
  userId: string;
  name: string;
  createdAt: Timestamp;
  movies: number[];
}

const COLLECTIONS_COLLECTION = "userCollections";

export const getUserCollections = async (
  userId: string,
): Promise<UserCollection[]> => {
  if (!userId) return [];

  const q = query(
    collection(db, COLLECTIONS_COLLECTION),
    where("userId", "==", userId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as UserCollection,
  );
};

export const subscribeToCollections = (
  userId: string,
  onUpdate: (collections: UserCollection[]) => void,
) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, COLLECTIONS_COLLECTION),
    where("userId", "==", userId),
  );

  return onSnapshot(q, (snapshot) => {
    const collections = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as UserCollection,
    );
    onUpdate(collections);
  });
};

export const createCollection = async (
  userId: string,
  name: string,
): Promise<string | null> => {
  if (!userId || !name.trim()) return null;

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS_COLLECTION), {
      userId,
      name: name.trim(),
      createdAt: Timestamp.now(),
      movies: [],
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating collection:", error);
    return null;
  }
};

export const addMovieToCollection = async (
  collectionId: string,
  movieId: number,
): Promise<void> => {
  const ref = doc(db, COLLECTIONS_COLLECTION, collectionId);
  await updateDoc(ref, {
    movies: arrayUnion(movieId),
  });
};

export const removeMovieFromCollection = async (
  collectionId: string,
  movieId: number,
): Promise<void> => {
  const ref = doc(db, COLLECTIONS_COLLECTION, collectionId);
  await updateDoc(ref, {
    movies: arrayRemove(movieId),
  });
};

export const deleteCollection = async (collectionId: string): Promise<void> => {
  const ref = doc(db, COLLECTIONS_COLLECTION, collectionId);
  await deleteDoc(ref);
};
