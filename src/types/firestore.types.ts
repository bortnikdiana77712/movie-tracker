import { Timestamp } from "firebase/firestore";

export interface UserCollection {
  id: string;
  userId: string;
  name: string;
  icon: string;
  createdAt: Timestamp;
  movies: number[];
}
