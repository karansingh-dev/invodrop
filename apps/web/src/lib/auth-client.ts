import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_BASE_URL! || "http://localhost:5000/",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
} = authClient;
