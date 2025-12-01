import { OnboardingDataType } from "@/app/onboarding/page";
import prisma from "@/lib/prisma";
import { onboardingSchema } from "@/schema/user";
import { getUser } from "@/utils/get-user";
import { handleError } from "@/utils/handle-error";
import { validateBody } from "@/utils/validate-body";

export async function POST(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Forbidden", error: "Unauthorized" },
        {
          status: 403,
        }
      );
    }

    const body = await req.json();
    const validation = validateBody<OnboardingDataType>(onboardingSchema, body);

    if (!validation.success) {
      return Response.json(
        {
          message: "Validation error",
          success: false,
          error: "Validation error",
        },
        {
          status: 400,
        }
      );
    }

    // prisma transaction for flagging user Onboarding status
    await prisma.$transaction(async (tsx) => {
      await tsx.userProfile.create({
        data: {
          id: user.id,
          ...validation.data,
        },
      });

      await tsx.user.update({
        where: {
          id: user.id,
        },
        data: {
          isOnboarded: true,
        },
      });
    });

    return Response.json(
      { success: true, message: "User onboarded successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleError({
      error,
      message: "Failed to add user profile data",
      route: req.url,
    });
  }
}
