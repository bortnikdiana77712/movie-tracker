import { useContext } from "react";
import { AuthContext } from "../context/context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Error with using useAuth");
  }
  return context;
};
