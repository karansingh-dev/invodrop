import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/db";
import { sendEmail } from "@/utils/sendEmail";
import { renderTemplate } from "@/utils/renderTemplate";
import { logger } from "@repo/logger";
import { ApiError } from "@/utils/ApiError";
import config from "@/config/config";
import { customSession } from "better-auth/plugins";
import { UserService } from "@/services/UserServices";

const userService = new UserService(prisma);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    customSession(async ({ user, session }) => {
      const userProfile = await userService.getUserProfile(user.id);

      return {
        user: {
          ...user,
          role: userProfile.role,
          onboardingCompleted: userProfile.onboardingCompleted,
          timezone: userProfile.timezone,
        },
        session,
      };
    }),
  ],
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      redirectURI: config.OAUTH_REDIRECT_URI,
      prompt: "select_account",
      accessType: "offline",
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const name = user.name;
        const verificationUrl = url;

        const html = renderTemplate("verification-email-template", {
          name,
          verificationUrl,
        });
        const emailId = await sendEmail({
          to: user.email,
          subject: "Verification",
          html,
        });
        logger.info("Verification Email sent", { emailId, success: true });
      } catch (error: any) {
        logger.error("Failed to send verification email ", { success: false });
        throw new ApiError(400, "Failed to send Verification email", [
          "verfication email failed",
          "invalid email",
        ]);
      }
    },
  },
});
