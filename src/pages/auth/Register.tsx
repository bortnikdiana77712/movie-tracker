import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { registerRules } from "../../utils";
import { getFirebaseErrorMessage } from "../../utils";

import styles from "./Auth.module.css";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FirebaseError {
  code: string;
  message: string;
}

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setFirebaseError("");
    
    try {
      await registerUser(data.email, data.password);
      navigate("/");
    } catch (err) {
      const error = err as FirebaseError;
      setFirebaseError(getFirebaseErrorMessage(error.code));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>

            <input
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="your@email.com"
              {...register("email", {
                ...registerRules.email,
                onChange: () => setFirebaseError(""),
              })}
              disabled={isSubmitting}
            />

            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>

            <input
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="******"
              {...register("password", {
                ...registerRules.password,
                onChange: () => setFirebaseError(""),
              })}
              disabled={isSubmitting}
            />

            {errors.password && (
              <span className={styles.errorText}>{errors.password.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>

            <input
              type="password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              placeholder="******"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
                onChange: () => setFirebaseError(""),
              })}
              disabled={isSubmitting}
            />

            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword.message}</span>
            )}
          </div>

          {firebaseError && (
            <div className={styles.error}>{firebaseError}</div>
          )}

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?
          <Link to="/login" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};