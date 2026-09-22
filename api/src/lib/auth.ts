import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import sendMail from "../utils/send-email";
import envVar from "../config";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: envVar.FRONTEND_URL ? [envVar.FRONTEND_URL] : [],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    autoSignIn: false,


    sendResetPassword: async ({ user, url, token }, request) => {
      void sendMail({
        recipientEmail: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }, request) => {

      console.log(`Password for user ${user.email} has been reset.`);
      void sendMail({
        recipientEmail: user.email,
        subject: "Password chagned successfully",
        text: "Your password has been reset successfully"
      })
    },

  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        console.log("Sending verification mail")
        void sendMail({
          recipientEmail: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email: ${url}`,
        });
      } catch (error) {
        console.error("Failed to send verification email", error);
      }
    },
  }
});
