import styles from "./Error.module.css";

interface ErrorProps {
  message: string;
}

export const Error: React.FC<ErrorProps> = ({ message }) => {
  return <div className={styles.error}>{message}</div>;
};
