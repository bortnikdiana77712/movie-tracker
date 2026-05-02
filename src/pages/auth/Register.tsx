import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks";
import { validationConfig, getFirebaseErrorMessage } from "../../utils";
import { PasswordInput } from "../../components";

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
                ...validationConfig.register.email,
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

            <PasswordInput<RegisterFormValues>
              register={register}
              name="password"
              placeholder="******"
              error={errors.password?.message}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>

            <PasswordInput<RegisterFormValues>
              register={register}
              name="confirmPassword"
              placeholder="******"
              error={errors.confirmPassword?.message}
              disabled={isSubmitting}
              rules={{
                required: "Please confirm your password",
                validate: (value: string) => {
                  return value === password || "Passwords do not match";
                },
              }}
            />
          </div>

          {firebaseError && <div className={styles.error}>{firebaseError}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
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
