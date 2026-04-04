import { STATUS_CONFIG } from "../../config";
import type { FilmStatus } from "../../config/status.config";

import styles from "./StatusButtons.module.css";

interface StatusButtonsProps {
  selectedStatus: FilmStatus | null;
  onStatusChange: (status: FilmStatus | null) => void;
}

export const StatusButtons = ({
  selectedStatus,
  onStatusChange,
}: StatusButtonsProps) => {
  const statusButton = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value: value as FilmStatus,
    label: config.label,
    icon: config.icon,
  }));

  return (
    <div className={styles.statusButtons}>
      {statusButton.map((btn) => (
        <button
          key={btn.value}
          data-status={btn.value}
          className={`${styles.statusButton} ${selectedStatus === btn.value ? styles.active : ""}`}
          onClick={() =>
            onStatusChange(selectedStatus === btn.value ? null : btn.value)
          }
        >
          {btn.icon}
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
};
