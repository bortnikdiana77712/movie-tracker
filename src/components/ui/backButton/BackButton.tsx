import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

import styles from "./BackButton.module.css";

interface BackButtonProps {
  buttonText?: string;
}

export const BackButton = ({ buttonText = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className={styles.backButton}>
      <FaArrowLeft />
      <span>{buttonText}</span>
    </button>
  );
};
