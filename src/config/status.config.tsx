/* eslint-disable react-refresh/only-export-components */
import { FaCheck, FaClock, FaEye, FaTimes } from "react-icons/fa";

export type FilmStatus = "watched" | "watching" | "want_to_watch" | "abandoned";

export interface StatusConfig {
  label: string;
  icon: React.ReactNode;
}

export const STATUS_CONFIG: Record<FilmStatus, StatusConfig> = {
  watched: { label: "Watched", icon: <FaCheck /> },
  watching: { label: "Watching", icon: <FaClock /> },
  want_to_watch: { label: "Want to watch", icon: <FaEye /> },
  abandoned: { label: "Abandoned", icon: <FaTimes /> },
};

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
  ([value, config]) => ({
    value: value as FilmStatus,
    label: config.label,
    icon: config.icon,
  }),
);
