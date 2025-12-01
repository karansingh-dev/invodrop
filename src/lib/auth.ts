import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { renderTemplate } from "@/utils/render-ejs-template";
import { sendEmail } from "./node-mailer";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    customSession(async ({ user, session }) => {
      const userProfile = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      return {
        user: {
          ...user,
          role: userProfile?.role,
          isOnboarded: userProfile?.isOnboarded,
        },
        session,
      };
    }),
  ],
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      try {
        const name = user.name;
        const email = user.email;

        // Render the HTML email using the EJS template
        const html = renderTemplate("verification-email", {
          verificationUrl: url,
          name,
        });

        // Sending the mail using node mailer
        await sendEmail(email, "Verify your email address", html);
      } catch (error: unknown) {
        console.error("Failed to send verification email to:", user.email);
        console.error(error);
      }
    },
    expiresIn: 3600 * 24,
  },
});
