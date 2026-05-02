import { useState } from "react";
import type {
  UseFormRegister,
  Path,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import styles from "./PasswordInput.module.css";

interface PasswordInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
}

export const PasswordInput = <T extends FieldValues>({
  register,
  name,
  placeholder = "******",
  error,
  disabled,
  rules,
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.passwordWrapper}>
      <input
        type={showPassword ? "text" : "password"}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        placeholder={placeholder}
        {...register(name, rules)}
        disabled={disabled}
      />
      <button
        type="button"
        className={styles.eyeButton}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
};
