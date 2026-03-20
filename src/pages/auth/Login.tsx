import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks";
import { getFirebaseErrorMessage, loginRules } from "../../utils";

import styles from "./Auth.module.css";

interface LoginFormValues {
  email: string;
  password: string;
}

interface FirebaseError {
  code: string;
  message: string;
}

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFirebaseError("");

    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      const error = err as FirebaseError;
      setFirebaseError(getFirebaseErrorMessage(error.code));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>

            <input
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="your@email.com"
              {...register("email", {
                ...loginRules.email,
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
                ...loginRules.password,
                onChange: () => setFirebaseError(""),
              })}
              disabled={isSubmitting}
            />
            
            {errors.password && (
              <span className={styles.errorText}>
                {errors.password.message}
              </span>
            )}
          </div>

          {firebaseError && <div className={styles.error}>{firebaseError}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Sign In"}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?
          <Link to="/register" className={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
