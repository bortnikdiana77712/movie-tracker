export const getFirebaseErrorMessage = (errorCode?: string): string => {
  if (!errorCode) return "Authentication failed. Please try again";

  switch (errorCode) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password";
    case "auth/user-not-found":
      return "User with this email does not exist";
    case "auth/email-already-in-use":
      return "User with this email already exists";
    case "auth/invalid-email":
      return "Invalid email format";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    default:
      return `Authentication failed: ${errorCode}`;
  }
};
