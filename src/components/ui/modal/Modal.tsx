import { FaTimes } from "react-icons/fa";

import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal}>
        <div className={styles.title}>
          <h3>{title}</h3>

          <button className={styles.closeBtn} onClick={onClose}>
            {<FaTimes />}
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
