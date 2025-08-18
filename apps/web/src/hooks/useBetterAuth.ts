import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  signIn,
  signUp,
} from "@/lib/auth-client";
import toast from "react-hot-toast";

interface SignUpData {
  email: string;
  password: string;
  name: string;
  callbackURL?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ResetPasswordType {
  newPassword: string;
  token: string;
}

export const useBetterAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const resendVerificationEmail = async (
    email: string | null
  ): Promise<void> => {
    if (!email) {
      toast.error("Failed to resend email");
      return;
    }

    setLoading(true);
    try {
      await sendVerificationEmail(
        {
          email,
          callbackURL: `${window.location.origin}/auth/login`,
        },
        {
          onSuccess: () => {
            toast.success("Verification email sent successfully!");
          },
          onError: (ctx) => {
            console.error("Failed to resend verification email", ctx);
            toast.error("Failed to resend email");
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (user: SignUpData): Promise<void> => {
    const {
      email,
      password,
      name,
      callbackURL = `${window.location.origin}/auth/login`,
    } = user;

    setLoading(true);

    try {
      await signUp.email(
        {
          email,
          password,
          name,
          callbackURL,
        },
        {
          onSuccess: () => {
            toast.success("Successfully created account!");
            router.replace(`/auth/signup?email=${email}`);
          },
          onError: (ctx) => {
            toast.error(ctx.error?.message || "Error registering user");
            throw new Error("Failed to register user");
          },
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (user: LoginData): Promise<void> => {
    const { email, password } = user;

    setLoading(true);
    try {
      await signIn.email(
        {
          email,
          password,
        },

        {
          onSuccess: () => {
            toast.success("Successfully loged in!");

            router.push("/dashboard");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Error regsitering user");
          },
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestResetUserPassword = async (email: string) => {
    setLoading(true);
    try {
      await requestPasswordReset(
        {
          email: email,
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
        {
          onRequest: () => {},
          onSuccess: () => {
            toast.success("Reset password email sent");
          },
          onError: (ctx) => {
            console.error("failed to send reset password email", ctx.error);

            toast.error("Failed to send reset password email, try again");
          },
        }
      );
    } catch (error) {
      console.error("request user reset password error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (data: ResetPasswordType) => {
    const { newPassword, token } = data;
    setLoading(true);

    try {
      await resetPassword(
        {
          newPassword,
          token,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successfully");
            router.push("/auth/login");
          },
          onError: () => {
            toast.success("Failed to reset password");
            router.push("/auth/forgot-password");
          },
        }
      );
    } catch (error) {
      console.error("reset user password error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    resetUserPassword,
    requestResetUserPassword,
    resendVerificationEmail,
    registerUser,
    loginUser,
  };
};
