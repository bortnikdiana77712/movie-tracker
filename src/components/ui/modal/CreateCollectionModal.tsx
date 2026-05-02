import { useState } from "react";
import { Modal } from "./Modal";

import styles from "./CreateCollectionModal.module.css";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  existingCollections?: string[];
}

export const CreateCollectionModal = ({
  isOpen,
  onClose,
  onCreate,
  existingCollections = [],
}: CreateCollectionModalProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Collection name is required");
      return;
    }

    if (existingCollections.includes(name.trim())) {
      setError("Collection already exists");
      return;
    }

    onCreate(name.trim());
    setName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create new collection">
      <div className={styles.body}>
        <input
          type="text"
          placeholder="Collection name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          className={styles.input}
          autoFocus
        />
        
        {error && <p className={styles.error}>{error}</p>}
      </div>
      
      <div className={styles.buttons}>
        <button className={styles.cancelBtn} onClick={handleClose}>
          Cancel
        </button>

        <button className={styles.createBtn} onClick={handleSubmit}>
          Create
        </button>
      </div>
    </Modal>
  );
};