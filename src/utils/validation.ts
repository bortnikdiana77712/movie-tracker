const emailRules = {
  required: "Email is required",
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: "Email is invalid",
  },
};

const passwordRules = {
  required: "Password is required",
  minLength: {
    value: 6,
    message: "Password must be at least 6 characters",
  },
};

export const loginRules = {
  email: emailRules,
  password: passwordRules,
};

export const registerRules = {
  email: emailRules,
  password: passwordRules,
  confirmPassword: {
    required: "Please confirm your password",
    validate: (value: string, formValues: { password: string }) =>
      value === formValues.password || "Passwords do not match",
  },
};
