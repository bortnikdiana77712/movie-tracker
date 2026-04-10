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

export const validationConfig = {
  login: {
    email: emailRules,
    password: passwordRules,
  },
  register: {
    email: emailRules,
    password: passwordRules,
  },
};
